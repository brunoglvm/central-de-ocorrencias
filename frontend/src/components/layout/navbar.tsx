"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconArrowUpRight,
  IconHistory,
  IconLayoutKanban,
  IconLogout2,
  IconPlus,
} from "@tabler/icons-react";
import { EditableAvatar } from "@/components/ui/editable-avatar";
import { Modal } from "@/components/ui/modal";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    href: "/admin/quadro",
    label: "Quadro",
    icon: IconLayoutKanban,
  },
  {
    href: "/admin/historico",
    label: "Histórico",
    icon: IconHistory,
  },
  {
    href: "/registrar",
    label: "Registrar",
    icon: IconPlus,
    isPublic: true,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-[100] hidden w-full lg:block">
        <div className="w-full border-b border-[rgba(25,28,28,0.08)] bg-[rgba(243,244,243,0.82)] px-4 py-3 shadow-[var(--shadow-ambient)] backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center">
            <div>
              <Link
                href="/admin/quadro"
                className="inline-flex items-center gap-3"
              >
                <Image
                  src="/logo.png"
                  alt="Central de Ocorrências"
                  width={34}
                  height={36}
                  className="h-7 w-auto"
                  priority
                />
                <span
                  className="flex flex-col leading-none text-[var(--color-on-surface-variant)]"
                  style={{
                    fontFamily: "var(--font-brand), serif",
                    fontWeight: 500,
                  }}
                >
                  <span className="w-fit border-b border-[var(--color-on-surface-variant)] text-sm uppercase">
                    Concept Garden
                  </span>
                  <span className="mt-1 text-[10px] uppercase">
                    Central de Ocorrências
                  </span>
                </span>
              </Link>
            </div>

            <nav className="flex items-center justify-center gap-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.isPublic ? "_blank" : undefined}
                    rel={item.isPublic ? "noopener noreferrer" : undefined}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-[var(--color-primary-container)]"
                        : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-highest)] hover:text-[var(--color-primary-strong)]",
                    )}
                    style={isActive ? { color: "#fff" } : undefined}
                  >
                    {item.label}
                    {item.isPublic ? (
                      <IconArrowUpRight className="h-4 w-4" stroke={1.8} />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center justify-end gap-3">
              <EditableAvatar alt="Perfil" initialSrc="/pfp.webp" size={36} />

              <Tooltip content="Sair">
                <button
                  type="button"
                  aria-label="Sair"
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-danger-strong)]"
                  onClick={() => setIsLogoutModalOpen(true)}
                >
                  <IconLogout2
                    className="h-5 w-5 transition-colors"
                    stroke={1.8}
                  />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-4 bottom-4 z-[100] rounded-[28px] bg-[rgba(249,249,248,0.85)] p-2 shadow-[var(--shadow-ambient)] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-3 gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.isPublic ? "_blank" : undefined}
                rel={item.isPublic ? "noopener noreferrer" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-[22px] px-3 py-3 text-xs transition-colors",
                  isActive
                    ? "bg-[var(--color-primary-container)]"
                    : "text-[var(--color-on-surface-variant)]",
                )}
                style={isActive ? { color: "#fff" } : undefined}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" stroke={1.8} />
                  {item.isPublic ? (
                    <IconArrowUpRight
                      className="absolute -right-2 -top-1 h-3.5 w-3.5"
                      stroke={2}
                    />
                  ) : null}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <Modal
        isOpen={isLogoutModalOpen}
        title="Sair do sistema?"
        description="Você realmente deseja encerrar a sessão atual e voltar para a tela de login?"
        confirmLabel="Sair"
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          router.push("/admin");
        }}
      />
    </>
  );
}
