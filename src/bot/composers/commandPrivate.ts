import { Composer } from "grammy";
//
import { mnSettings } from "../components/menu.ts";
import type { MyContext } from "../types/MyContext.d.ts";

const composer = new Composer<MyContext>();
const mComposer = composer.chatType("private");

mComposer.command("start", async (ctx) => {
  console.log("/start private");

  const chatId = ctx.match;
  const { username: botUsername } = await ctx.api.getMe();

  if (!chatId) {
    await ctx.reply(
      `Hi! To begining, I need the group ID. Add me to ` +
        `the group, then forward the next message into the group.\n` +
        `And give to me admin rights in the group.`,
      {
        parse_mode: "HTML",
      },
    );
    ctx.reply(`/start@${botUsername}`);
  } else {
    await ctx.reply("Settings: ", {
      reply_markup: mnSettings,
    });
  }
});

//TODO: automate this function for take description from file
//TODO: add check of description bot.command (JSDoc).
/*mComposer.command("help", async (ctx) =>
  ctx.reply(
    "It is bot-editor (AI by GigaChat). His purpose " +
      "is rewrite messages in your group, making them more readability. \n\n" +
      "[empty list]" //TODO
  )
);*/

export default composer;
