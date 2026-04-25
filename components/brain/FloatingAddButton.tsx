"use client";

export default function FloatingAddButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Create a new capture"
      className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_18px_38px_rgba(15,23,42,0.18)] transition hover:scale-[1.03] hover:bg-slate-800 sm:bottom-8 sm:right-8"
    >
      <svg viewBox="0 0 13 13" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
        <path d="M6.5 1.5v10" strokeLinecap="round" />
        <path d="M1.5 6.5h10" strokeLinecap="round" />
      </svg>
    </button>
  );
}
