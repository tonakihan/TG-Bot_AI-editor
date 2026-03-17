import { Bot, Context } from "grammy";
import { Message } from "grammy/types";
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

    //console.log("msg photo:");
    //console.log(ctx.msg);
    console.log("Recive photo");
    //console.log("From: " + ctx.from!.id);

    const file = await ctx.getFile();

    if (ctx.msg.media_group_id) {
      //TODO: Export delay to a config
      /*processMediaGroup(ctx.msg, 1000, (files) => {
        ctx.replyWithMediaGroup([
          files.map(({id, type}) => {
            return {
              media: id,
              type
            };
          }),
        ]);
      });*/
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

/** Function for collect all files from mediaGroup message.
 * NOTICE: Call only in case msg.media_group_id is availivle! */
//TODO: Rewrite - need download files. + Take caption
//TODO: Create MediaGroupMessage
/* Was take id in array and return it.
 *  Would take id -> make MediaMessage (may be stream) -> return prepared files */

function processMediaGroup(
  msg: Message,
  delay: number,
  cb: (files: MediaGroupMap["files"]) => void
) {
  let mediaGroup: MediaGroupMap;

  const typeOfFile: MediaType | undefined = (function () {
    for (let key in Object.keys(msg)) {
      if (["photo", "video", "document", "audio"].includes(key))
        return key as MediaType;
    }
  })();

  if (!typeOfFile) {
    console.error("ERR msg object:");
    console.error(msg);
    throw new Error("ERR: Undefined type of file.");
  }

  const cbForTimeout = () => {
    cb(mediaGroup.files);
    // Clear the store
    mediaGroupMap.delete(msg.media_group_id!);
  };

  // Check timeout and if exist delete it.
  if (mediaGroupMap.has(msg.media_group_id!)) {
    mediaGroup = mediaGroupMap.get(msg.media_group_id!)!;
    clearInterval(mediaGroup.timeout);

    // Set new timeout
    mediaGroup.timeout = setTimeout(cbForTimeout, delay);
    mediaGroup.files.push({
      id:
        typeOfFile === "photo"
          ? msg.photo![0].file_id
          : msg[typeOfFile]!.file_id,
      type: typeOfFile,
    });
  } else {
    // Save data and execute cb if within timeout nothing happend.
    const timeout = setTimeout(cbForTimeout, delay);
    mediaGroupMap.set(msg.media_group_id!, {
      files: [
        {
          id:
            typeOfFile === "photo"
              ? msg.photo![0].file_id
              : msg[typeOfFile]!.file_id,
          type: typeOfFile,
        },
      ],
      timeout,
    });
  }
}
