import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";

const ATTACHMENT_TYPE_MAP: Record<string, "TEXT" | "VOICE" | "DOCUMENT" | "IMAGE"> = {
  image: "IMAGE",
  audio: "VOICE",
  file: "DOCUMENT",
};

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const attachments = Array.isArray(body.attachments) ? body.attachments : [];

  if (!content && attachments.length === 0) {
    return new NextResponse("Nothing to save", { status: 400 });
  }

  const firstAttachment = attachments[0];
  const captureType = firstAttachment
    ? ATTACHMENT_TYPE_MAP[firstAttachment.type] ?? "DOCUMENT"
    : "TEXT";

  if (firstAttachment && typeof firstAttachment.fileSize !== "number") {
    return new NextResponse("Attachment file size is required", { status: 400 });
  }

  const capture = await prisma.capture.create({
    data: {
      userId: session.user.id,
      type: captureType,
      content: content
        ? {
            create: {
              text: content,
            },
          }
        : undefined,
      file: firstAttachment
        ? {
            create: {
              fileUrl: String(firstAttachment.fileUrl),
              fileType: String(firstAttachment.fileType ?? firstAttachment.name),
              fileSize: firstAttachment.fileSize,
              durationSeconds:
                typeof firstAttachment.durationSeconds === "number"
                  ? firstAttachment.durationSeconds
                  : undefined,
            },
          }
        : undefined,
    },
    include: { content: true, file: true },
  });

  return NextResponse.json({
    id: capture.id,
    type: capture.type,
    content: capture.content?.text ?? "",
    file: capture.file ? { fileUrl: capture.file.fileUrl, fileType: capture.file.fileType } : null,
  });
}
