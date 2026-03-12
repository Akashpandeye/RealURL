import { z } from "zod";

export const shortenBodySchema = z.object({
  url: z.string().url(),
  code: z.string().min(3).max(64).optional(),
});

