"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const navbarRoutes = ["/admin/quadro", "/admin/historico"];
  const shouldHideNavbar = !navbarRoutes.includes(pathname);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-on-surface)]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(109,145,151,0.18),_transparent_58%)]" />
        <div className="absolute right-[-8rem] top-24 h-72 w-72 rounded-full bg-[rgba(87,122,128,0.12)] blur-3xl" />
      </div>

      {shouldHideNavbar ? null : <Navbar />}

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-28 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-12">
        {children}
      </main>
    </div>
  );
}
