import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-5xl flex-col items-center justify-center gap-8">
      <Image
        src="/page-not-found.webp"
        alt="Ilustração de erro 404 com uma pessoa segurando uma placa escrito not found"
        width={780}
        height={620}
        priority
        className="h-auto w-full max-w-[420px] drop-shadow-[0_18px_40px_rgba(25,28,28,0.12)] sm:max-w-[520px]"
      />

      <Button href="/registrar">Ir para o formulário</Button>
    </section>
  );
}
