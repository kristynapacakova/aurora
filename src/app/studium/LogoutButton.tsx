"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/studium-logout", { method: "POST" });
    router.push("/studium/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-line px-4 py-1.5 text-xs uppercase tracking-widest text-foreground/60 transition-colors hover:border-accent-dark hover:text-accent-dark"
    >
      Odhlásit se
    </button>
  );
}
