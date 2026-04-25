export type BrainAttachment = {
  type: "image" | "audio" | "file";
  name: string;
};

export type BrainFeedItem = {
  id: string;
  type: "text" | "image" | "audio" | "file" | "capture";
  content: string;
  createdAt: string;
  attachments?: BrainAttachment[];
};

function resolveDisplayType(item: BrainFeedItem) {
  if (item.type !== "capture") {
    return item.type;
  }

  if (item.attachments?.some((attachment) => attachment.type === "audio")) {
    return "audio";
  }

  if (item.attachments?.some((attachment) => attachment.type === "file")) {
    return "file";
  }

  if (item.attachments?.some((attachment) => attachment.type === "image")) {
    return "image";
  }

  return "text";
}

function resolvePreview(item: BrainFeedItem) {
  if (item.content.trim()) {
    return item.content;
  }

  const audioAttachment = item.attachments?.find((attachment) => attachment.type === "audio");
  if (audioAttachment) {
    return `Voice memo - ${audioAttachment.name}`;
  }

  const fileAttachment = item.attachments?.find((attachment) => attachment.type === "file");
  if (fileAttachment) {
    return fileAttachment.name;
  }

  const imageAttachments = item.attachments?.filter((attachment) => attachment.type === "image") ?? [];
  if (imageAttachments.length > 1) {
    return `${imageAttachments.length} images attached`;
  }
  if (imageAttachments.length === 1) {
    return imageAttachments[0].name;
  }

  return "Untitled capture";
}

function TypeIcon({ type }: { type: ReturnType<typeof resolveDisplayType> }) {
  if (type === "audio") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.3">
        <rect x="6" y="2" width="4" height="7" rx="2" />
        <path d="M3 9a5 5 0 0 0 10 0" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "file") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.2">
        <path d="M4 2h7l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
        <path d="M11 2v3h3" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "image") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.2">
        <rect x="2" y="3" width="12" height="10" rx="1.5" />
        <circle cx="5.5" cy="7" r="1.1" />
        <path d="M2 11l3.5-3 3 3 2-2 3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.3">
      <path d="M3 4h10M3 8h7M3 12h5" strokeLinecap="round" />
    </svg>
  );
}

export default function BrainItemCard({
  item,
  onDelete,
}: {
  item: BrainFeedItem;
  onDelete?: (item: BrainFeedItem) => void;
}) {
  const displayType = resolveDisplayType(item);
  const preview = resolvePreview(item);

  return (
    <article className="group flex items-baseline justify-between gap-4 border-b border-slate-200 px-6 py-4 last:border-b-0 sm:px-8">
      <p className="min-w-0 flex-1 truncate text-[13px] leading-6 text-slate-950">
        {preview}
      </p>

      <div className="flex shrink-0 items-center gap-2 text-slate-400">
        <TypeIcon type={displayType} />
        <span className="text-[11px] text-slate-400">{item.createdAt}</span>
        {onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-slate-300 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Delete capture"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5 fill-none stroke-current"
              strokeWidth="1.3"
            >
              <path d="M3.5 5h9" strokeLinecap="round" />
              <path d="M6 2.75h4" strokeLinecap="round" />
              <path d="M5 5v7.25a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V5" />
            </svg>
          </button>
        ) : null}
      </div>
    </article>
  );
}
