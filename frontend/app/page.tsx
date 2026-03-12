import LandingShortener from "@/components/LandingShortener";

export default function Page() {
  return (
    <div className="grid gap-12 py-2 sm:py-6">
      <section className="grid gap-8">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/70">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Production-ready starter
        </div>

        <div className="grid gap-5">
          <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
            Short links that look good, work fast, and stay secure.
          </h1>
          <p className="max-w-3xl text-pretty text-lg text-black/70 sm:text-xl">
            RealURL is a clean URL shortener built with Next.js App Router + Clerk auth, backed by Neon Postgres through Drizzle.
          </p>
        </div>

        <LandingShortener />
      </section>
    </div>
  );
}

