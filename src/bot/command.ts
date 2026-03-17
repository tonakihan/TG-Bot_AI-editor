import { Bot } from "grammy";

//TODO: made DB with groups and these owners
// + listener for remove/change

// SETTINGS:
//TODO: interface for set of templates

//TODO: Should be setup ONLY in private message (handling groups)
// OR take many for my token

//TODO: Automatic parser from etities to markdown

//TODO: Export settings in file (chat)

export default function (bot: Bot) {
  bot.command("start", async (ctx) => {
    ctx.reply(
      "Hi! For get information how to use me " +
        "to launch /help that have list of availible commands."
    );
    console.log("/start");
    console.debug(ctx.from);
  });

  //TODO: automate this function for take describe from file
  //TODO: add check of desctyprtion bot.command (JSDoc).
  bot.command("help", async (ctx) =>
    ctx.reply(
      "It is bot-editor (AI by GigaChat). His purpose " +
        "is rewrite messages in your group, making them more readability. \n\n" +
        "[empty list]" //TODO
    )
  );
}
