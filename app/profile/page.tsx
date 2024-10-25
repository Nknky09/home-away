"use client";

import FormContainer from "@/components/form/FormContainer";
import {
  updateProfileAction,
  fetchProfile,
  updateProfileImageAction,
} from "../utils/actions";
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import ImageInputContainer from "@/components/form/ImageInputContainer";
import React from "react";
import { useState, useEffect } from "react";

type Profile = {
  id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profileImage: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

function ProfilePage() {
  // Use a Profile type for the state, which can either be Profile or null
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data when the component mounts
  useEffect(() => {
    const getProfile = async () => {
      try {
        const fetchedProfile: Profile = await fetchProfile(); // Ensure proper type matching
        setProfile(fetchedProfile); // Correctly set the profile state
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false); // Stop loading after the fetch completes
      }
    };
    getProfile();
  }, []);

  // If loading, show a loading message
  if (loading) {
    return <p>Loading profile...</p>;
  }

  // If no profile is found, handle the case
  if (!profile) {
    return <p>No profile found. Please create one.</p>;
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">user profile</h1>
      <div className="border p-8 rounded-md ">
        <ImageInputContainer
          image={profile.profileImage ?? ""} // Handle null case for profileImage
          name={profile.username ?? ""} // Handle null case for username
          action={updateProfileImageAction}
          text="Update Profile Image"
        />
        <FormContainer action={updateProfileAction}>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <FormInput
              type="text"
              name="firstName"
              label="First Name"
              defaultValue={profile.firstName ?? ""} // Handle null case for firstName
            />
            <FormInput
              type="text"
              name="lastName"
              label="Last Name"
              defaultValue={profile.lastName ?? ""} // Handle null case for lastName
            />
            <FormInput
              type="text"
              name="username"
              label="Username"
              defaultValue={profile.username ?? ""} // Handle null case for username
            />
          </div>
          <SubmitButton text="Update Profile" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  );
}

export default ProfilePage;
