import { MongoClient, GridFSBucket } from "mongodb";
import { Readable } from "stream";
import { v4 as uuid } from "uuid";

const mongoClient = new MongoClient(process.env.MONGO_URL as string);
await mongoClient.connect();
const db = mongoClient.db("home_away");

const bucket = new GridFSBucket(db, { bucketName: "images" });

export const uploadImage = async (image: File): Promise<string> => {
  const newName = `${uuid()}-${image.name}`;

  // Create a buffer from the file
  const buffer = await image.arrayBuffer();
  const readableStream = Readable.from(Buffer.from(buffer));

  const uploadStream = bucket.openUploadStream(newName);

  readableStream.pipe(uploadStream);

  return new Promise<string>((resolve, reject) => {
    uploadStream.on("finish", () => resolve(newName));
    uploadStream.on("error", err => reject(err));
  });
};

export const getImageUrl = (filename: string): string => {
  return `/api/images/${filename}`;
};
