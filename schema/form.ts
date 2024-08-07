import { z } from "zod";

export const generateFormSchema = z.object({
  url: z.string().min(1),
  prompt: z.string().min(3).max(160),
});

export type GenerateFormValues = z.infer<typeof generateFormSchema>;
