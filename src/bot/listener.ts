import { Bot } from "grammy";
import { processMediaGroup, prepareMediaGroup } from "../utils/grammyMedia.ts";

//TODO: MAIN: Make listener for massage and change these with gigachat

//TODO: made DB with groups and these owners
// + listener for remove/change

//TODO: Add processor (reader/upload) files for AIchat

//TODO: Automatic parser from etities to markdown/HTML

//NOTICE: Remove message -> EDIT -> POST


export default function (bot: Bot) {
  const botGroups = bot.chatType(["channel", "group", "supergroup"]);

  //TODO: caption is undefined
  botGroups.on(":photo", async (ctx) => {
    // If empty message
    if (!ctx.msg.caption && !ctx.msg.media_group_id) return;

    const text = ctx.msg.caption + " &caption";

    //ctx.deleteMessage();

    console.log("Recive photo");
    ctx.reply("Caption: " + text);

    if (ctx.msg.media_group_id) {
      //TODO: Separate by type of files
      //TODO: Export delay to a config
      processMediaGroup(ctx.msg, 1000, (files, caption) => {
        caption = caption + " UUUUX TI";

        prepareMediaGroup(files, bot, caption).then((media) => {
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


