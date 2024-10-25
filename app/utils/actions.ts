"use server";

import {
  imageSchema,
  profileSchema,
  propertySchema,
  validateWithZodSchema,
} from "./schemas";
import db from "./db";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImage } from "@/app/utils/mongo"; // Updated to use the new file system-based image upload logic.

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) throw new Error("You must be logged in to access this route");
  if (!user.privateMetadata.hasProfile) redirect("/profile/create");
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
};

// **1. Profile Creation Logic**
export const createProfileAction = async (
  formData: FormData
): Promise<{ message: string }> => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Please login to create a profile");

    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    // Insert the new profile into MongoDB
    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? "", // Default to Clerk's user image if present
        ...validatedFields,
      },
    });

    // Update the Clerk metadata
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
  redirect("/");
};

export const updateProfileAction = async (
  fromData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(fromData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedFields,
    });

    revalidatePath("/profile");
    return { message: "Profile updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

// **2. Update Profile Image Logic**
export const updateProfileImageAction = async (
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const image = formData.get("image") as File;

    if (!image) throw new Error("No image provided");

    // Upload the image to the filesystem and get the file path
    const filePath = await uploadImage(image);

    // Update MongoDB with the new profile image path
    await db.profile.update({
      where: { clerkId: user.id },
      data: { profileImage: filePath },
    });

    // Revalidate the profile page
    revalidatePath("/profile");

    return { message: "Profile image updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

// **3. Property Creation Logic (with Image Upload)**
export const createPropertyAction = async (
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get("image") as File;

    const validatedFields = validateWithZodSchema(propertySchema, rawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });

    // Upload the image to the filesystem
    const fullPath = await uploadImage(validatedFile.image);

    // Save the property with the image file path in MongoDB
    await db.property.create({
      data: {
        ...validatedFields,
        image: fullPath, // Store the path of the image
        profileId: user.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect("/");
};

// **4. Fetch Profile Image Logic**
export const fetchProfileImage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    },
  });

  return profile?.profileImage;
};

// **5. Fetch Profile Logic**
export const fetchProfile = async () => {
  const user = await getAuthUser();
  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });
  if (!profile) redirect("/profile/create");
  return profile;
};

// **6. Fetch Properties Logic**
export const fetchProperties = async ({
  search = "",
  category,
}: {
  search?: string;
  category?: string;
}) => {
  const properties = await db.property.findMany({
    where: {
      category,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { tagline: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      country: true,
      price: true,
      image: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return properties;
};

// **7. Fetch Favorite ID Logic**
export const fetchFavoriteId = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  const user = await getAuthUser();
  const favorite = await db.favorite.findFirst({
    where: {
      propertyId,
      profileId: user.id,
    },
    select: {
      id: true,
    },
  });
  return favorite?.id || null;
};

// **8. Toggle Favorite Logic**
export const toggleFavoriteAction = async (prevState: {
  propertyId: string;
  favoriteId: string;
  pathname: string;
}) => {
  const user = await getAuthUser();
  const { propertyId, favoriteId, pathname } = prevState;

  try {
    if (favoriteId) {
      await db.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      await db.favorite.create({
        data: {
          propertyId,
          profileId: user.id,
        },
      });
    }
    revalidatePath(pathname);
    return { message: favoriteId ? "Removed from Faves" : "Added to Faves " };
  } catch (error) {
    return renderError(error);
  }
};

// **9. Fetch Favorites Logic**
export const fetchFavorites = async () => {
  const user = await getAuthUser();
  const favorites = await db.favorite.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      property: {
        select: {
          id: true,
          name: true,
          tagline: true,
          country: true,
          price: true,
          image: true,
        },
      },
    },
  });
  return favorites.map(favorite => favorite.property);
};

// **10. Fetch Property Details Logic**
export const fetchPropertyDetails = async (id: string) => {
  return await db.property.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
    },
  });
};
