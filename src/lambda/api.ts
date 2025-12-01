import { z } from "zod";
import { RenderRequest, ProgressRequest } from "../types/schema";

export const renderVideo = async ({
  id,
  inputProps,
}: z.infer<typeof RenderRequest>) => {
  const response = await fetch("/api/lambda/render", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, inputProps }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to start render");
  }

  const data = await response.json();
  return {
    renderId: data.renderId as string,
    bucketName: data.bucketName as string,
  };
};

export const getProgress = async ({
  id,
  bucketName,
}: z.infer<typeof ProgressRequest>) => {
  const response = await fetch("/api/lambda/progress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, bucketName }),
  });

  if (!response.ok) {
    throw new Error("Failed to get progress");
  }

  const data = await response.json();
  return data as
    | { type: "error"; message: string }
    | { type: "done"; url: string; size: number }
    | { type: "progress"; progress: number };
};
