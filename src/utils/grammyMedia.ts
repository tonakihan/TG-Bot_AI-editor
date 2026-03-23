import { Bot, InputFile, InputMediaBuilder } from "grammy";
import {
  Message,
  InputMediaAudio,
  InputMediaDocument,
  InputMediaPhoto,
  InputMediaVideo,
} from "grammy/types";
import type { MediaType, MediaGroupMap } from "../types/grammyMedia.d.ts";
import type { MyContext } from "../types/MyContext.d.ts";

/** Key is msg.media_group_id */
const mediaGroupMap = new Map<string, MediaGroupMap>();

async function convertToMedia(
  { id, type }: MediaGroupMap["files"][number],
  bot: Bot<MyContext>,
  caption?: MediaGroupMap["caption"]
) {
  const file = await bot.api.getFile(id);
  const path = file.file_path;
  const url = `https://api.telegram.org/file/bot${process.env.BOT_API_TOKEN}/${path}`;
  const fileTg = await new InputFile(new URL(url));
  const media = await InputMediaBuilder[type](fileTg, { caption });
  return media;
}

/** Work with result from the fn processMediaGroup. Create InputMedia from fileIDs.
 * Return an array of InputMedia. */
async function prepareMediaGroup(
  files: MediaGroupMap["files"],
  bot: Bot<MyContext>,
  caption?: string
): Promise<
  Array<
    InputMediaAudio | InputMediaDocument | InputMediaPhoto | InputMediaVideo
  >
> {
  const first = await convertToMedia(files[0], bot, caption);
  files = files.slice(1);

  const media = await Promise.all(files.map((file) => convertToMedia(file, bot)));
  media.unshift(first);
  return media;
}

/** Function for collect all files from mediaGroup message.
 * In callback:
 * Arg1: Return an array objects: {id, type}. Arg2: Return caption.
 * NOTICE: Call only in case msg.media_group_id is availivle! */
async function processMediaGroup(
  msg: Message,
  delay: number,
  cb: (
    files: MediaGroupMap["files"],
    caption?: MediaGroupMap["caption"]
  ) => void
) {
  const cbForTimeout = () => {
    cb(mediaGroup.files, mediaGroup.caption);
    // Clear the store
    mediaGroupMap.delete(msg.media_group_id!);
  };

  let mediaGroup: MediaGroupMap;

  try {
    if (!msg.media_group_id) {
      throw new Error(
        "The fn processMediaGroup was executed without a msg.media_group_id"
      );
    }

    const fileType = getFileType(msg);

    // Part: Add data
    // Check timeout and if exist delete it.
    if (mediaGroupMap.has(msg.media_group_id)) {
      mediaGroup = mediaGroupMap.get(msg.media_group_id)!;
      clearInterval(mediaGroup.timeout);

      // Set new timeout
      mediaGroup.timeout = setTimeout(cbForTimeout, delay);
      mediaGroup.files.push({
        id:
          fileType === "photo"
            ? msg.photo!.at(-1)!.file_id
            : msg[fileType]!.file_id,
        type: fileType,
      });
      mediaGroup.caption ??= msg.caption;
    } else {
      // Part: New data
      // Save data and execute cb if within timeout nothing happend.
      const timeout = setTimeout(cbForTimeout, delay);
      mediaGroupMap.set(msg.media_group_id, {
        files: [
          {
            id:
              fileType === "photo"
                ? msg.photo!.at(-1)!.file_id
                : msg[fileType]!.file_id,
            type: fileType,
          },
        ],
        timeout,
        caption: msg.caption,
      });
    }
  } catch (e) {
    console.error("ERR in fn processMediaGroup");
    console.error("ERR: throw msg object:");
    console.error(msg);
    throw e;
  }
}

function getFileType(msg: Message): MediaType {
  const mediaTypes = ["photo", "video", "document", "audio"];
  for (const key of Object.keys(msg)) {
    if (mediaTypes.includes(key)) return key as MediaType;
  }

  throw new Error("ERR fn getFileType: not found fileType");
}

export { getFileType, prepareMediaGroup, processMediaGroup };
