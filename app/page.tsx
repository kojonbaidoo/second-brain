"use client";

import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] px-6 py-10 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
          <div className="mb-10">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              SecondBrain
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">
              Create an account
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your captures are private and belong to you.
            </p>
          </div>

          <GoogleSignInButton />

          <p className="mt-4 text-center text-xs text-slate-400">
            Web MVP focused on fast, private capture.
          </p>
        </section>
      </div>
    </main>
  );
}
