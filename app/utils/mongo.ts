import fs from "fs";
import path from "path";
import { promisify } from "util";
import { v4 as uuid } from "uuid";

const writeFileAsync = promisify(fs.writeFile);

export const uploadImage = async (image: File): Promise<string> => {
  const uploadDirectory = path.join(process.cwd(), "public", "images");

  // Create the images directory if it doesn't exist
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }

  const newName = `${uuid()}-${image.name}`;
  const filePath = path.join(uploadDirectory, newName);

  // Convert the image to buffer and write it to the filesystem
  const buffer = Buffer.from(await image.arrayBuffer());
  await writeFileAsync(filePath, buffer);

  // Return the relative path for storing in the database
  return `/images/${newName}`;
};

export const getImageUrl = (filename: string): string => {
  return `/api/images/${filename}`;
};
