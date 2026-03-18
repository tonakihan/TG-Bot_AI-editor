import { Bot, InputFile, InputMediaBuilder } from "grammy";
import {
  Message,
  InputMediaAudio,
  InputMediaDocument,
  InputMediaPhoto,
  InputMediaVideo,
} from "grammy/types";
import type { MediaType, MediaGroupMap } from "../types/grammyMedia.d.ts";

/** Key is msg.media_group_id */
const mediaGroupMap = new Map<string, MediaGroupMap>();

//TODO: Add save caption

/** Work with result from the fn processMediaGroup. Create InputMedia from fileIDs.
 * Return an array of InputMedia. */
async function prepareMediaGroup(
  files: MediaGroupMap["files"],
  bot: Bot
): Promise<
  Array<
    InputMediaAudio | InputMediaDocument | InputMediaPhoto | InputMediaVideo
  >
> {
  return Promise.all(
    files.map(async ({ id, type }) => {
      const file = await bot.api.getFile(id);
      const path = file.file_path;
      const url = `https://api.telegram.org/file/bot${process.env.BOT_API_TOKEN}/${path}`;
      const fileTg = await new InputFile(new URL(url));
      const media = await InputMediaBuilder[type](fileTg);
      return media;
    })
  );
}


/** Function for collect all files from mediaGroup message. Return an array objects:
 * {id, type}.
 * NOTICE: Call only in case msg.media_group_id is availivle! */
async function processMediaGroup(
  msg: Message,
  delay: number,
  cb: (files: MediaGroupMap["files"]) => void
) {
  const cbForTimeout = () => {
    cb(mediaGroup.files);
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
    } else {
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
