"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";

type SignOutButtonProps = {
  userName?: string | null;
};

export default function SignOutButton({ userName }: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(() => {
          void signOut({ callbackUrl: "/" });
        });
      }}
      disabled={isPending}
      className="inline-flex h-9 items-center rounded-full border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "Signing out..." : `Sign out${userName ? ` ${userName}` : ""}`}
    </button>
  );
}
