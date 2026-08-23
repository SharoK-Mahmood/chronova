"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" aria-label="Chronova home">
            <Image
              src="/chronova-logo.png"
              alt="Chronova"
              width={220}
              height={60}
              priority
              className="h-10 w-auto sm:h-11"
            />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
