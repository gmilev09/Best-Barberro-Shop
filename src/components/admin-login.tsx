"use client";

import { Loader2, Lock, Scissors } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogin({ showHint }: { showHint: boolean }) {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Неуспешен вход.");
        return;
      }
      router.refresh();
    } catch {
      setError("Проблем с връзката — опитай отново.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md border border-line bg-coal/50 p-8 md:p-10">
      <div className="pole-stripes mb-8 h-1.5 w-full" />
      <span className="flex h-12 w-12 items-center justify-center border border-brass/60 text-brass">
        <Scissors className="h-6 w-6" strokeWidth={1.5} />
      </span>
      <h1 className="mt-6 font-display text-5xl uppercase tracking-wide text-bone">
        Контролен <span className="text-brass">панел</span>
      </h1>
      <p className="mt-2 text-sm text-smoke">
        Само за екипа — въведи кода на салона, за да управляваш дневните столове.
      </p>

      <form onSubmit={submit} className="mt-8">
        <label className="block">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-smoke">
            Код за достъп
          </span>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-smoke" />
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="w-full border border-line bg-ink py-3.5 pl-11 pr-4 text-bone placeholder:text-smoke/50 focus:border-brass focus:outline-none"
            />
          </div>
        </label>
        {error && (
          <p className="mt-4 border border-ember/50 bg-ember/10 px-4 py-3 text-sm text-bone">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || !passcode}
          className={`mt-6 flex w-full items-center justify-center gap-3 py-4 font-display text-xl tracking-[0.1em] transition-colors ${
            passcode && !loading
              ? "bg-brass text-ink hover:bg-bone"
              : "cursor-not-allowed bg-carbon text-smoke"
          }`}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "ВЛЕЗ В САЛОНА"}
        </button>
      </form>

      {showHint && (
        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.18em] text-smoke">
          Демо код: <span className="text-brass">legends</span> — смени с
          ADMIN_PASSCODE
        </p>
      )}
      <Link
        href="/"
        className="mt-4 block text-center text-[11px] uppercase tracking-[0.18em] text-smoke transition-colors hover:text-brass"
      >
        ← Обратно към сайта
      </Link>
    </div>
  );
}
