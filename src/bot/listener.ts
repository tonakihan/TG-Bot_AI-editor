import { Bot, Context, InputFile, InputMediaBuilder } from "grammy";
import {
  Message,
  InputMediaAudio,
  InputMediaDocument,
  InputMediaPhoto,
  InputMediaVideo,
} from "grammy/types";
import { MediaType, MediaGroupMap } from "../types/grammyMedia.type.ts";

//TODO: MAIN: Make listener for massage and change these with gigachat

//TODO: made DB with groups and these owners
// + listener for remove/change

//TODO: Add processor (reader/upload) files for AIchat

//TODO: Automatic parser from etities to markdown/HTML

//NOTICE: Remove message -> EDIT -> POST

/** Key is msg.media_group_id */
const mediaGroupMap = new Map<string, MediaGroupMap>();

export default function (bot: Bot) {
  const botGroups = bot.chatType(["channel", "group", "supergroup"]);

  //TODO: caption is undefined
  botGroups.on(":photo", async (ctx) => {
    //if (!ctx.msg.caption) return;

    const text = ctx.msg.caption + " &caption";

    //ctx.deleteMessage();

    console.log("Recive photo");
    ctx.reply("Caption: " + text);

    if (ctx.msg.media_group_id) {
      //TODO: Separate by type of files
      //TODO: Export delay to a config
      processMediaGroup(ctx.msg, 1000, (files) => {
        prepareMediaGroup(files, bot).then((media) => {
          ctx.replyWithMediaGroup(media);
        });
      });
    } else {
      ctx.replyWithPhoto(ctx.msg.photo[0].file_id, {
        caption: text,
      });
    }
  });

  botGroups.on(":file", async (ctx) => {
    ctx.reply("Exception file");

    console.log("\nException ':file':");
    console.log(ctx.msg);
  });

  /*bot.on("message:entities", async (ctx) => {
    ctx.reply("entities");
    console.log("on message:entities");
    console.log(await ctx.entities());
  });*/

  bot.on("message:is_automatic_forward", async (ctx) => {
    ctx.reply("forward form somewere");
    ctx.react("👍");
  });

  // The bot was delited from chat
  bot.on("message:left_chat_member:me", async (ctx) => {
    console.log(`DELITED FROM GROUP!\n${ctx.msg.chat}\n`);
  });

  botGroups.on("message:text", async (ctx) => {
    const text = ctx.msg.text;

    ctx.deleteMessage();
    //TODO: Settings for field 'caption'
    //TODO: Checking length
    ctx.reply(text + `\n\nAuthor @${ctx.from.username}`);
  });

  // chennel_post and message
  bot.on("msg:text", async (ctx) => {
    ctx.reply("Exception filter 'msg:text'");
  });

  bot.on("message", async (ctx) => {
    ctx.reply("Exception filter 'message'. Well but I am not very smart yet.");
    //console.log(ctx.msg);
  });
}

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
      console.debug("File"); console.debug(file);
      const path = file.file_path;
      const url = `https://api.telegram.org/file/bot${process.env.BOT_API_TOKEN}/${path}`;
      console.debug("URL " + url);
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
          fileType === "photo" ? msg.photo!.at(-1)!.file_id : msg[fileType]!.file_id,
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
