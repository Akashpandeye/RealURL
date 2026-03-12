import type { Metadata } from "next";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "RealURL",
  description: "Shorten links with Clerk auth + Neon Postgres.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <ClerkProvider>
          <div className="sticky top-0 z-20 border-b border-black/5 bg-white/70 backdrop-blur">
            <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-black text-white shadow-sm">
                  <span className="text-sm font-semibold">R</span>
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold tracking-tight">RealURL</div>
                  <div className="text-xs text-black/60">Shorten and manage links</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Show when="signed-out">
                  <SignInButton>
                    <button className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:bg-black/5">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="rounded-xl bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90">
                      Sign up
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <div className="rounded-xl border border-black/10 bg-white px-2 py-1">
                    <UserButton />
                  </div>
                </Show>
              </div>
            </header>
          </div>

          <main className="mx-auto w-full max-w-6xl px-4 py-10">{children}</main>

          <footer className="mx-auto w-full max-w-6xl px-4 pb-10 text-xs text-black/60">
            <div className="flex flex-col gap-2 border-t border-black/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <span>© {new Date().getFullYear()} RealURL</span>
            </div>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}

