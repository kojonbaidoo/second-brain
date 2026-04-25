import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucket = process.env.S3_BUCKET;
const region = process.env.AWS_REGION ?? "us-east-1";

function getObjectUrl(key: string) {
  const encodedKey = encodeURIComponent(key).replace(/%2F/g, "/");
  if (region === "us-east-1") {
    return `https://${bucket}.s3.amazonaws.com/${encodedKey}`;
  }
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!bucket) {
    return new NextResponse("S3_BUCKET is not configured", { status: 500 });
  }

  const { fileName, contentType } = await request.json();

  if (!fileName || typeof fileName !== "string") {
    return new NextResponse("Invalid fileName", { status: 400 });
  }

  const extension = fileName.split(".").pop();
  const key = `uploads/${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}${
    extension ? `.${extension}` : ""
  }`;

  const s3Client = new S3Client({ region });
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType || "application/octet-stream",
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  const fileUrl = getObjectUrl(key);

  return NextResponse.json({ uploadUrl, fileUrl, fileType: contentType || "application/octet-stream" });
}
