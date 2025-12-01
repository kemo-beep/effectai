import { z } from "zod";
import { CompositionProps } from "./constants";

export const RenderRequest = z.object({
  id: z.string(),
  inputProps: CompositionProps,
});

export const ProgressRequest = z.object({
  bucketName: z.string(),
  id: z.string(),
});

// Progress response types
export const ProgressResponse = z.union([
  z.object({ type: z.literal("error"), message: z.string() }),
  z.object({ type: z.literal("done"), url: z.string(), size: z.number() }),
  z.object({ type: z.literal("progress"), progress: z.number() }),
]);

export type ProgressResponseType = z.infer<typeof ProgressResponse>;

// AI Generation request
export const GenerateRequest = z.object({
  prompt: z.string(),
  style: z.string().optional(),
  duration: z.number().optional(), // in seconds
  aspectRatio: z.enum(["16:9", "9:16", "1:1", "4:5"]).optional(),
});

export const GenerateResponse = z.object({
  scenes: z.array(z.any()),
  title: z.string(),
  style: z.string(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    background: z.string(),
    text: z.string(),
  }),
  aspectRatio: z.enum(["16:9", "9:16", "1:1", "4:5"]).optional(),
});

export type GenerateRequestType = z.infer<typeof GenerateRequest>;
export type GenerateResponseType = z.infer<typeof GenerateResponse>;
