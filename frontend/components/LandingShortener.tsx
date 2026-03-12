"use client";

import { useMemo, useState } from "react";
import { Show, SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { apiShortenUrl } from "@/lib/api";

export default function LandingShortener() {
  const { getToken } = useAuth();
  const apiBaseUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL || "", []);

  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"" | "Shortening…" | "Copied">("");
  const [error, setError] = useState("");
  const [shortLink, setShortLink] = useState("");

  async function shorten() {
    setError("");
    setShortLink("");
    setStatus("Shortening…");
    try {
      const token = await getToken();
      const created = await apiShortenUrl({ apiBaseUrl, token, url });
      const link = `${apiBaseUrl}/api/${created.shortCode}`;
      setShortLink(link);
      setUrl("");
      setStatus("");
    } catch (e) {
      setStatus("");
      setError(e instanceof Error ? e.message : "Failed to shorten URL");
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied");
      window.setTimeout(() => setStatus(""), 900);
    } catch {
      setError("Copy failed. Please copy manually.");
    }
  }

  return (
    <div className="grid gap-4">
      <Show when="signed-out">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SignInButton>
            <button className="inline-flex w-fit items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium hover:bg-black/5">
              Log in
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="inline-flex w-fit items-center justify-center rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-black/90">
              Sign up
            </button>
          </SignUpButton>
        </div>
      </Show>

      <Show when="signed-in">
        <div className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full flex-1">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a long URL…"
                className="h-12 w-full rounded-2xl border border-black/10 bg-white pl-4 pr-28 text-sm outline-none ring-black/10 placeholder:text-black/40 focus:ring-4"
              />
              <button
                onClick={shorten}
                disabled={!url || status === "Shortening…"}
                className="absolute right-1.5 top-1.5 h-9 rounded-xl bg-black px-4 text-sm font-medium text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "Shortening…" ? "Working…" : "Shorten"}
              </button>
            </div>
          </div>

          {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}

          {shortLink ? (
            <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="text-xs font-medium text-emerald-900/80">Your short link</div>
                <div className="truncate text-sm font-semibold text-emerald-950">{shortLink}</div>
              </div>
              <div className="flex gap-2">
                <a
                  href={shortLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:bg-black/5"
                >
                  Open
                </a>
                <button
                  onClick={() => copy(shortLink)}
                  className="inline-flex items-center justify-center rounded-xl bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90"
                >
                  {status === "Copied" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </Show>
    </div>
  );
}

