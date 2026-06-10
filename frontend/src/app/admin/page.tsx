import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-3xl items-center justify-center">
      <AdminLoginForm />
    </div>
  );
}
