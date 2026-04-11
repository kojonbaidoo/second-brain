"use client";

import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/brain" })}
      className="px-6 py-3 rounded-xl bg-black text-white hover:opacity-80 transition"
    >
      Continue with Google
    </button>
  );
}
