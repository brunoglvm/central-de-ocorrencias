import type { Metadata } from "next";
import Image from "next/image";
import { RegisterForm } from "@/components/register/register-form";

export const metadata: Metadata = {
  title: "Registrar",
};

export default function RegisterPublicPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="Aisha Garden"
          width={34}
          height={36}
          className="h-8 w-auto"
          priority
        />

        <span
          className="mt-3 flex flex-col leading-none text-[var(--color-on-surface-variant)]"
          style={{ fontFamily: "var(--font-brand), serif", fontWeight: 500 }}
        >
          <span className="w-fit border-b border-[var(--color-on-surface-variant)] text-base uppercase">
            Aisha Garden
          </span>
          <span className="mt-1 text-[10px] uppercase">
            Central de Ocorrências
          </span>
        </span>
      </div>

      <RegisterForm />
    </div>
  );
}
