export type ShortLink = {
  id: string;
  shortCode: string;
  targetUrl: string;
  createdAt: string;
  updatedAt: string | null;
};

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text) as any;
  } catch {
    return { error: text } as any;
  }
}

export async function apiShortenUrl(params: {
  apiBaseUrl: string;
  token: string | null;
  url: string;
  code?: string;
}) {
  const res = await fetch(`${params.apiBaseUrl}/api/shorten`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(params.token ? { Authorization: `Bearer ${params.token}` } : {}),
    },
    body: JSON.stringify({ url: params.url, code: params.code }),
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error((json?.error as string) || `Shorten failed (HTTP ${res.status})`);
  return (json.data as any).result as ShortLink;
}

export async function apiGetCodes(params: { apiBaseUrl: string; token: string | null }) {
  const res = await fetch(`${params.apiBaseUrl}/api/codes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(params.token ? { Authorization: `Bearer ${params.token}` } : {}),
    },
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error((json?.error as string) || `Fetch failed (HTTP ${res.status})`);
  return (json.data as any).result as ShortLink[];
}

export async function apiDeleteUrl(params: { apiBaseUrl: string; token: string | null; id: string }) {
  const res = await fetch(`${params.apiBaseUrl}/api/${params.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(params.token ? { Authorization: `Bearer ${params.token}` } : {}),
    },
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error((json?.error as string) || `Delete failed (HTTP ${res.status})`);
  return (json.data as any).result as { shortCode: string; targetUrl: string };
}

