import { NextRequest, NextResponse } from "next/server";
import { MongoClient, GridFSBucket } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_URL as string);

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
): Promise<NextResponse> {
  const { filename } = params;

  if (!filename) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  await mongoClient.connect();
  const db = mongoClient.db("home_away");
  const bucket = new GridFSBucket(db, { bucketName: "images" });

  const downloadStream = bucket.openDownloadStreamByName(filename);

  const chunks: any[] = [];

  return new Promise((resolve, reject) => {
    downloadStream.on("data", chunk => {
      chunks.push(chunk);
    });

    downloadStream.on("error", err => {
      reject(NextResponse.json({ error: "Image not found" }, { status: 404 }));
    });

    downloadStream.on("end", () => {
      const imageBuffer = Buffer.concat(chunks);
      resolve(
        new NextResponse(imageBuffer, {
          headers: {
            "Content-Type": "image/jpeg",
          },
        })
      );
    });
  });
}
