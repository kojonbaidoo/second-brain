"use client";

import { useEffect, useRef, useState } from "react";

type UploadAttachmentType = "image" | "audio" | "file";

type UploadAttachment = {
  type: UploadAttachmentType;
  file: File;
  name: string;
};

export type UploadModalItem = {
  id: string;
  type: "capture";
  content: string;
  attachments: UploadAttachment[];
};

type UploadModalProps = {
  onClose: () => void;
  onSave?: (item: UploadModalItem) => void;
};

export default function UploadModal({ onClose, onSave }: UploadModalProps) {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<UploadAttachment[]>([]);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const upsertAttachment = (type: UploadAttachmentType, file: File) => {
    setAttachments((current) => {
      const next = current.filter((attachment) => attachment.type !== type);

      return [...next, { type, file, name: file.name }];
    });
    setError("");
  };

  const handleFileSelection = (
    type: Extract<UploadAttachmentType, "image" | "file">,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    upsertAttachment(type, selectedFile);
    event.target.value = "";
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const startRecording = async () => {
    if (!("mediaDevices" in navigator) || typeof MediaRecorder === "undefined") {
      setError("Audio recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      audioChunksRef.current = [];
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      recorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
          type: audioBlob.type || "audio/webm",
        });

        upsertAttachment("audio", audioFile);
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
        setIsRecording(false);
      });

      recorder.start();
      setIsRecording(true);
      setError("");
    } catch {
      setError("Microphone access was denied.");
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (isRecording) {
      setError("Stop recording before saving.");
      return;
    }

    if (!content.trim() && attachments.length === 0) {
      setError("Add text or attach something before saving.");
      return;
    }

    setError("");
    onSave?.({
      id: `capture-${Date.now()}`,
      type: "capture",
      content: content.trim(),
      attachments,
    });
    onClose();
  };

  const handleCancel = () => {
    if (isRecording) {
      stopRecording();
    }

    onClose();
  };

  const removeAttachment = (type: UploadAttachmentType) => {
    setAttachments((current) =>
      current.filter((attachment) => attachment.type !== type),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8f7f2] text-slate-950">
      <header className="grid grid-cols-3 items-center border-b border-slate-200/80 px-5 py-4 sm:px-8">
        <div className="justify-self-start">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-200/60 hover:text-slate-900"
          >
            Cancel
          </button>
        </div>

        <div className="justify-self-center text-center">
          <p className="text-base font-semibold tracking-[-0.02em] text-slate-900">
            New Capture
          </p>
        </div>

        <div className="justify-self-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isRecording}
          >
            Save
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 md:px-14">
        <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
          <textarea
            autoFocus
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder=""
            className="min-h-[55vh] w-full flex-1 resize-none border-0 bg-transparent text-lg leading-8 text-slate-900 outline-none placeholder:text-slate-300"
          />

          {attachments.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {attachments.map((attachment) => (
                <button
                  key={attachment.type}
                  type="button"
                  onClick={() => removeAttachment(attachment.type)}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                >
                  {attachment.type}: {attachment.name}
                </button>
              ))}
            </div>
          ) : null}

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </div>
      </main>

      <footer className="border-t border-slate-200/80 bg-white/70 px-6 py-4 backdrop-blur-sm sm:px-10 md:px-14">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FooterIconButton
              label="Add image"
              onClick={() => imageInputRef.current?.click()}
            >
              <ImageIcon />
            </FooterIconButton>

            <FooterIconButton
              label="Add file"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileIcon />
            </FooterIconButton>

            <FooterIconButton
              label={isRecording ? "Stop recording" : "Record audio"}
              onClick={isRecording ? stopRecording : startRecording}
              isActive={isRecording}
            >
              <AudioIcon recording={isRecording} />
            </FooterIconButton>
          </div>

          <div className="text-sm text-slate-500">
            {isRecording ? "Recording audio... tap again to stop" : ""}
          </div>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFileSelection("image", event)}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(event) => handleFileSelection("file", event)}
        />
      </footer>
    </div>
  );
}

function FooterIconButton({
  label,
  onClick,
  children,
  isActive = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
        isActive
          ? "border-red-300 bg-red-50 text-red-600"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M5.5 16l4.5-4.5 3.5 3.5 2.5-2.5 2.5 3.5" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <path d="M8 3.5h6l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 7 19V5A1.5 1.5 0 0 1 8.5 3.5Z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 12.5h6" />
      <path d="M9 16h6" />
    </svg>
  );
}

function AudioIcon({ recording }: { recording: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <rect x="9" y="4" width="6" height="10" rx="3" />
      <path d="M6.5 10.5a5.5 5.5 0 0 0 11 0" />
      <path d="M12 16v4" />
      <path d="M9 20h6" />
      {recording ? <circle cx="18.5" cy="5.5" r="2" fill="currentColor" stroke="none" /> : null}
    </svg>
  );
}
