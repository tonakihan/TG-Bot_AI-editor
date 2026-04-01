import type {
  InputMediaOptions,
  InputMediaPhoto,
  InputMediaVideo,
  InputMediaAudio,
  InputMediaDocument,
  InputMediaAnimation,
} from "@types/grammyjs";

export type MediaType = "photo" | "video" | "document" | "audio";

export type MediaGroupMap = {
  files: {
    id: string;
    type: MediaType;
  }[];
  timeout: NodeJS.Timeout;
  options?: InputMediaOptions<
    | InputMediaPhoto
    | InputMediaVideo
    | InputMediaAudio
    | InputMediaDocument
    | InputMediaAnimation
  >;
};
