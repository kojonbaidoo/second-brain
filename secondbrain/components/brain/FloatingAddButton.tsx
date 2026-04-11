"use client";

export default function FloatingAddButton({ onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black text-white text-3xl flex items-center justify-center shadow-lg hover:scale-105 transition"
    >
      +
    </button>
  );
}
