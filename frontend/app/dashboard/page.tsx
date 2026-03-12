"use client";

import { useMemo, useState } from "react";
import { Show, useAuth, useUser } from "@clerk/nextjs";
import { apiDeleteUrl, apiGetCodes, apiShortenUrl, type ShortLink } from "@/lib/api";

export default function DashboardPage() {
  const { isLoaded } = useUser();
  const { getToken } = useAuth();

  const apiBaseUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL || "", []);

  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [items, setItems] = useState<ShortLink[]>([]);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [lastCreatedLink, setLastCreatedLink] = useState<string>("");

  async function refresh() {
    setError("");
    setStatus("Loading...");
    const token = await getToken();
    const list = await apiGetCodes({ apiBaseUrl, token });
    setItems(list);
    setStatus("");
  }

  async function create() {
    setError("");
    setLastCreatedLink("");
    setStatus("Creating...");
    try {
      const token = await getToken();
      const created = await apiShortenUrl({ apiBaseUrl, token, url, code: code || undefined });
      setLastCreatedLink(`${apiBaseUrl}/api/${created.shortCode}`);
      setUrl("");
      setCode("");
      await refresh();
    } catch (e) {
      setStatus("");
      setError(e instanceof Error ? e.message : "Failed to shorten URL");
    }
  }

  async function remove(id: string) {
    setError("");
    setStatus("Deleting...");
    try {
      const token = await getToken();
      await apiDeleteUrl({ apiBaseUrl, token, id });
      await refresh();
    } catch (e) {
      setStatus("");
      setError(e instanceof Error ? e.message : "Failed to delete URL");
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

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-sm text-black/60">Create, view, and delete your short links.</p>
        </div>
        <button
          onClick={refresh}
          className="inline-flex w-fit items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:bg-black/5"
        >
          Refresh
        </button>
      </div>

      <Show when="signed-out">
        <div className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm">
          <div className="text-sm font-semibold">Sign in required</div>
          <div className="mt-1 text-sm text-black/70">Use the buttons in the top-right to sign in, then come back here.</div>
        </div>
      </Show>

      <Show when="signed-in">
        <div className="grid gap-4 rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm">
          <div className="grid gap-1">
            <div className="text-sm font-semibold">Create short link</div>
            <div className="text-sm text-black/60">Paste a URL, optionally set a custom code, then click Shorten.</div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-xs font-medium text-black/70">Target URL</span>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none ring-black/10 placeholder:text-black/40 focus:ring-4"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-medium text-black/70">Custom code (optional)</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="mycode"
                className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none ring-black/10 placeholder:text-black/40 focus:ring-4"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={create}
                disabled={!url || status !== ""}
                className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status ? status : "Shorten"}
              </button>
            </div>
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
          </div>

          {lastCreatedLink ? (
            <div className="flex flex-col gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="text-xs font-medium text-emerald-900/80">Your short link</div>
                <div className="truncate text-sm font-semibold text-emerald-950">{lastCreatedLink}</div>
              </div>
              <div className="flex gap-2">
                <a
                  href={lastCreatedLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:bg-black/5"
                >
                  Open
                </a>
                <button
                  onClick={() => copy(lastCreatedLink)}
                  className="inline-flex items-center justify-center rounded-xl bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90"
                >
                  Copy
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Your links</div>
            <div className="text-xs text-black/60">{items.length} total</div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/70 shadow-sm">
            <div className="hidden grid-cols-12 gap-3 border-b border-black/5 px-5 py-3 text-xs font-medium text-black/60 sm:grid">
              <div className="col-span-4">Short link</div>
              <div className="col-span-7">Target</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            <div className="divide-y divide-black/5">
              {items.map((x) => (
                <div key={x.id} className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-12 sm:items-center">
                  <div className="sm:col-span-4">
                    <div className="grid gap-2">
                      <div className="w-fit rounded-xl border border-black/10 bg-white px-2 py-1 text-sm font-semibold">
                        {x.shortCode}
                      </div>
                      <div className="truncate text-sm text-black/70">
                        {apiBaseUrl}/api/{x.shortCode}
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`${apiBaseUrl}/api/${x.shortCode}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:bg-black/5"
                        >
                          Open
                        </a>
                        <button
                          onClick={() => copy(`${apiBaseUrl}/api/${x.shortCode}`)}
                          className="inline-flex items-center justify-center rounded-xl bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-7">
                    <div className="break-all text-sm text-black/80">{x.targetUrl}</div>
                  </div>
                  <div className="flex gap-2 sm:col-span-1 sm:justify-end">
                    <button
                      onClick={() => remove(x.id)}
                      className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:bg-black/5"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {items.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-black/60">
                  No links yet. Create one above, then hit Refresh.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}

