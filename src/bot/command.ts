import { settings } from "./middleware/menu.ts";
import type { MyContext } from "../types/MyContext.d.ts";
import type { Bot } from "../types/Bot.d.ts";

//TODO: May be turn this into cash?

//TODO: Try using botGroup for separate

export default function (bot: Bot) {
  bot.command("start", async (ctx) => {
    console.log("/start");

    const chatId = ctx.match;
    const { username: botUsername } = await bot.api.getMe();
    const isGroup = ctx.msg.chat.type !== "private";

    if (!chatId && !isGroup) {
      ctx.reply(
        `Hi\\! To begining, I need the group ID\\. Add me to ` +
          `the group, then either forward the next message, or ` +
          `manually send \`\\/start@${botUsername}\` into the group\\.`,
        {
          parse_mode: "MarkdownV2",
        }
      );
      ctx.reply(`/start@${botUsername}`);
    } else if (isGroup) {
      ctx.reply(
        `[Click here to setup bot]` +
          `(tg:\\/\\/resolve?domain=${botUsername}&start=${ctx.msg.chat.id})`,
        { parse_mode: "MarkdownV2" }
      );
      //TODO: Try making 'menu'
    } else {
      //const userId = ctx.from!.id;
      //console.log(await bot.api.getChatMember(chatId, userId));
      ctx.reply("Settings: ", {
        //TODO: use session for passing the ID.
        reply_markup: settings,
      });
    }
  });

  //TODO: automate this function for take description from file
  //TODO: add check of desctyprtion bot.command (JSDoc).
  bot.command("help", async (ctx) =>
    ctx.reply(
      "It is bot-editor (AI by GigaChat). His purpose " +
        "is rewrite messages in your group, making them more readability. \n\n" +
        "[empty list]" //TODO
    )
  );
}
