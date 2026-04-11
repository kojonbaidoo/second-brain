"use client";

import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/brain" })}
      className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
    >
      Continue with Google
    </button>
  );
}
