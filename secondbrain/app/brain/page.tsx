"use client";

import { useState } from "react";
import BrainHeader from "@/components/brain/BrainHeader";
import BrainFeed from "@/components/brain/BrainFeed";
import FloatingAddButton from "@/components/brain/FloatingAddButton";
import UploadModal from "@/components/upload/UploadModal";

export default function BrainPage() {
  const [open, setOpen] = useState(false);

  // temporary mock data
  const [items] = useState([
    { id: 1, type: "text", content: "My first idea about productivity" },
    { id: 2, type: "link", url: "https://example.com" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BrainHeader />

      <BrainFeed items={items} />

      <FloatingAddButton onClick={() => setOpen(true)} />

      {open && <UploadModal onClose={() => setOpen(false)} />}
    </div>
  );
}
