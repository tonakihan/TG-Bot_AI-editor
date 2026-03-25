import { Composer } from "grammy";
import range from "lodash-es/range.js";
//
import type { MyContext } from "../types/MyContext.d.ts";
//
import { processMediaGroup, prepareMediaGroup } from "../utils/media.ts";
import { AIChat } from "../../gigaChat/index.ts";

//TODO: Add processor (reader/upload) files for AIchat

//TODO: Automatic parser from etities to markdown/HTML

//TODO: Checking length of text (prompt)

const composer = new Composer<MyContext>();
const mComposer = composer.chatType(["channel", "group", "supergroup"]);

mComposer.on(":photo", async (ctx) => {
  console.log("Recive photo");

  // is MediaGroup
  if (ctx.msg.media_group_id) {
    //TODO: Separate by type of files
    //TODO: Export delay to a config
    processMediaGroup(ctx.msg, 1000, async (files, caption) => {
      if (!caption) return;
      ctx.api.sendChatAction(ctx.msg.chat.id, "upload_photo");
      caption = await AIChat(caption);

      prepareMediaGroup(files, ctx, caption).then((media) => {
        ctx.replyWithMediaGroup(media);
      });
      ctx.deleteMessages(
        range(ctx.msg.message_id - files.length + 1, ctx.msg.message_id + 1)
      );
    });
  } else {
    let caption = ctx.msg.caption;

    if (!caption) return;
    caption = await AIChat(caption);

    ctx.replyWithPhoto(ctx.msg.photo[0].file_id, { caption });
    ctx.deleteMessage();
  }
});

// The bot was delited from chat
mComposer.on("message:left_chat_member:me", async (ctx) => {
  console.log(`DELITED FROM GROUP!\n${ctx.msg.chat}\n`);
});

mComposer.on("message:text", async (ctx) => {
  const text = ctx.msg.text;

  ctx.deleteMessage();
  ctx.reply(text + `\n\nAuthor @${ctx.from.username}`);
});

// chennel_post and message
mComposer.on("msg:text", async (ctx) => {
  ctx.reply("Exception filter 'msg:text'");
});

mComposer.on("message", async (ctx) => {
  ctx.reply("Exception filter 'message'. Well but I am not very smart yet.");
});

export default composer
