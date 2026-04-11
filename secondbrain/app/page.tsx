"use client";

import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import NeuralGraphVisualizer from "@/components/landing/NeuralGraphVisualizer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef4ff_52%,#f7f3ea_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
      {/* Left */}
      <div className="flex flex-1 flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
        <div className="mb-4 inline-flex w-fit rounded-full border border-slate-300/70 bg-white/75 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-slate-600 shadow-sm backdrop-blur-md">
          Connected capture
        </div>

        <h1 className="mb-6 max-w-xl text-5xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl">
          SecondBrain
        </h1>

        <p className="mb-10 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
          Turn your notes, audio, images, and links into connected ideas.
        </p>

        <GoogleSignInButton />
      </div>

      {/* Right */}
      <div className="flex flex-1 items-center justify-center px-6 pb-16 sm:px-10 lg:px-12 lg:pb-0">
        <NeuralGraphVisualizer />
      </div>
      </div>
    </div>
  );
}
