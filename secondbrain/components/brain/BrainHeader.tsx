export default function BrainHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 sm:px-8">
        <h1 className="text-[15px] font-semibold tracking-[-0.02em] text-slate-950">
          SecondBrain
        </h1>

        <button
          type="button"
          aria-label="Search captures"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <svg
            viewBox="0 0 16 16"
            className="h-4 w-4 fill-none stroke-current"
            strokeWidth="1.4"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L13.5 13.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
