import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import type { BrainFeedItem, BrainAttachment } from "@/components/brain/BrainItemCard";
import BrainPageClient from "./BrainPageClient";

function formatCreatedAt(date: Date): string {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffInDays = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffInDays <= 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

const ATTACHMENT_TYPE: Record<string, BrainAttachment["type"] | undefined> = {
  VOICE: "audio",
  DOCUMENT: "file",
  IMAGE: "image",
};

const FEED_TYPE: Record<string, BrainFeedItem["type"]> = {
  TEXT: "text",
  VOICE: "audio",
  DOCUMENT: "file",
  IMAGE: "image",
};

export default async function BrainPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const captures = await prisma.capture.findMany({
    where: { userId: session.user.id, deletedAt: null },
    include: { content: true, file: true },
    orderBy: { createdAt: "desc" },
  });

  const initialItems: BrainFeedItem[] = captures.map((capture: {
    id: string;
    type: string;
    createdAt: Date;
    content: { text: string } | null;
    file: { fileUrl: string; fileType: string } | null;
  }) => {
    const attachmentType = ATTACHMENT_TYPE[capture.type];
    const attachments: BrainAttachment[] =
      capture.file && attachmentType
        ? [{ type: attachmentType, name: capture.file.fileUrl.split("/").pop() ?? capture.file.fileType }]
        : [];

    return {
      id: capture.id,
      type: FEED_TYPE[capture.type] ?? "text",
      content: capture.content?.text ?? "",
      createdAt: formatCreatedAt(capture.createdAt),
      attachments,
    };
  });

  return <BrainPageClient initialItems={initialItems} userName={session.user.name} />;
}
