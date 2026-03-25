import { Composer } from "grammy";
//
import type { MyContext } from "../types/MyContext.d.ts";

const composer = new Composer<MyContext>();

//TODO: automate this function for take description from file
//TODO: add check of description bot.command (JSDoc).
composer.command("help", async (ctx) =>
  ctx.reply(
    "It is bot-editor (AI by GigaChat). His purpose " +
      "is rewrite messages in your group, making them more readability. \n\n" +
      "[empty list]" //TODO
  )
);

export default composer;
