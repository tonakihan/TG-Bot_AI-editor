export type MediaType = "photo" | "video" | "document" | "audio";

export type MediaGroupMap = {
  files: {
    id: string;
    type: MediaType;
  }[];
  timeout: NodeJS.Timeout;
  caption?: string;
};
