import { Bot, InlineKeyboard } from "grammy";

//TODO: Make listener for massage and change these with gigachat

export default function (bot: Bot) {
  bot.command("help", (ctx) =>
    ctx.reply(
      "It is bot-editor (AI by GigaChat). His purpose \
      is rewrite messages in your group, making them more readability."
    )
  );
  
  /** Registration your account by GigaChat */
  bot.command("start", (ctx) => 
    ctx.reply(
      "Write to me a token from your gigachat accaunt."
  ));

  bot.on("message", (ctx) => ctx.reply("Well but I am not very smart yet."));
}
