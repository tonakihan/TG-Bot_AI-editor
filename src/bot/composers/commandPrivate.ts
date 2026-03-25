import { Composer } from "grammy";
//
import { settings } from "../components/menu.ts";
import type { MyContext } from "../types/MyContext.d.ts";

const composer = new Composer<MyContext>();
const mComposer = composer.chatType("private");

mComposer.command("start", async (ctx) => {
  console.log("/start private");

  const chatId = ctx.match;
  const { username: botUsername } = await ctx.api.getMe();

  if (!chatId) {
    await ctx.reply(
      `Hi\\! To begining, I need the group ID\\. Add me to ` +
        `the group, then either forward the next message, or ` +
        `manually send \`\\/start@${botUsername}\` into the group\\.`,
      {
        parse_mode: "MarkdownV2",
      }
    );
    ctx.reply(`/start@${botUsername}`);
  } else {
    //TODO: Load config
    //const userId = ctx.from!.id;
    //console.log(await bot.api.getChatMember(chatId, userId));
    await ctx.reply("Settings: ", {
      //TODO: use session for passing the ID.
      reply_markup: settings,
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
