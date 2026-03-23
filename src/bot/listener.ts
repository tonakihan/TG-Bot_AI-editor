import type { Bot } from "../types/Bot.d.ts";
import { processMediaGroup, prepareMediaGroup } from "../utils/grammyMedia.ts";
import { AIChat } from "../gigaChat/index.ts";
import range from "lodash-es/range.js";

//TODO: made DB with groups and these owners
// + listener for remove/change

//TODO: Add processor (reader/upload) files for AIchat

//TODO: Automatic parser from etities to markdown/HTML

//TODO: Settings for field 'caption'

//TODO: Checking length of text (prompt)

export default function (bot: Bot) {
  //TODO: Add listeners for other types
  const botGroups = bot.chatType(["channel", "group", "supergroup"]);

  botGroups.on(":photo", async (ctx) => {
    console.log("Recive photo");

    // is MediaGroup
    if (ctx.msg.media_group_id) {
      //TODO: Separate by type of files
      //TODO: Export delay to a config
      processMediaGroup(ctx.msg, 1000, async (files, caption) => {
        if (!caption) return;
        ctx.api.sendChatAction(ctx.msg.chat.id, "upload_photo");
        caption = await AIChat(caption);

        prepareMediaGroup(files, bot, caption).then((media) => {
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
    ctx.reply(text + `\n\nAuthor @${ctx.from.username}`);
  });

  // chennel_post and message
  bot.on("msg:text", async (ctx) => {
    ctx.reply("Exception filter 'msg:text'");
  });

  bot.on("message", async (ctx) => {
    ctx.reply("Exception filter 'message'. Well but I am not very smart yet.");
  });
}
