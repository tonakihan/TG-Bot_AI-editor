import { Composer } from "grammy";
import range from "lodash-es/range.js";
//
import type { MyContext } from "../types/MyContext.d.ts";
//
import { processMediaGroup, prepareMediaGroup } from "../utils/media.ts";
import AI from "../../gigaChat/index.ts";

//TODO: Add processor (reader/upload) files for AIchat

//TODO: Automatic parser from etities to markdown/HTML

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
      caption = await AI.chat(caption, ctx.session.config.templates);

      prepareMediaGroup(files, ctx, caption).then((media) => {
        ctx.replyWithMediaGroup(media);
      });
      ctx.deleteMessages(
        range(ctx.msg.message_id - files.length + 1, ctx.msg.message_id + 1),
      );
    });
  } else {
    let caption = ctx.msg.caption;

    if (!caption) return;
    caption = await AI.chat(caption, ctx.session.config.templates);

    ctx.replyWithPhoto(ctx.msg.photo[0].file_id, {
      caption,
      parse_mode: "HTML",
    });
    ctx.deleteMessage();
  }
});

// The bot was delited from chat
mComposer.on("message:left_chat_member:me", async (ctx) => {
  console.log(`DELITED FROM GROUP!\n${ctx.msg.chat}\n`);
});

mComposer.on("message:text", async (ctx) => {
  let text = ctx.msg.text;
  text = await AI.chat(text, ctx.session.config.templates);

  if (ctx.session.config.caption) {
    text += `\n\n` + ctx.session.parsedCaption;
  }

  ctx.reply(text, { parse_mode: "HTML" });
  ctx.deleteMessage();
});

// chennel_post and message
mComposer.on("msg:text", async (ctx) => {
  ctx.reply("Exception filter 'msg:text'");
});

/*mComposer.on("message", async (ctx) => {
  ctx.reply("Exception filter 'message'. Well but I am not very smart yet.");
});*/

export default composer;
