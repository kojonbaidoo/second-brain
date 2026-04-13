"use client";

import { useState } from "react";
import BrainHeader from "@/components/brain/BrainHeader";
import BrainFeed from "@/components/brain/BrainFeed";
import type { BrainFeedItem } from "@/components/brain/BrainItemCard";
import FloatingAddButton from "@/components/brain/FloatingAddButton";
import UploadModal, { type UploadModalItem } from "@/components/upload/UploadModal";

function formatCreatedAt(date: Date) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffInDays = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays <= 0) {
    return "Today";
  }

  if (diffInDays === 1) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function mapCaptureToFeedItem(capture: UploadModalItem): BrainFeedItem {
  const now = new Date();
  const primaryType =
    capture.attachments.find((attachment) => attachment.type === "audio")?.type ??
    capture.attachments.find((attachment) => attachment.type === "file")?.type ??
    capture.attachments.find((attachment) => attachment.type === "image")?.type ??
    (capture.content ? "text" : "capture");

  return {
    id: capture.id,
    type: primaryType,
    content: capture.content,
    createdAt: formatCreatedAt(now),
    attachments: capture.attachments,
  };
}

interface BrainPageClientProps {
  initialItems: BrainFeedItem[];
  userName?: string | null;
}

export default function BrainPageClient({ initialItems, userName }: BrainPageClientProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<BrainFeedItem[]>(initialItems);

  const handleSaveCapture = (capture: UploadModalItem) => {
    setItems((current) => [mapCaptureToFeedItem(capture), ...current]);
  };

  const handleDeleteCapture = (item: BrainFeedItem) => {
    const confirmed = window.confirm("Delete this capture?");

    if (!confirmed) {
      return;
    }

    setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <BrainHeader userName={userName} />

      <BrainFeed items={items} onDelete={handleDeleteCapture} />

      <FloatingAddButton onClick={() => setOpen(true)} />

      {open && (
        <UploadModal
          onClose={() => setOpen(false)}
          onSave={handleSaveCapture}
        />
      )}
    </div>
  );
}
