import { Composer } from "grammy";
//
import type { MyContext } from "../types/MyContext.d.ts";

const composer = new Composer<MyContext>();
const mComposer = composer.chatType(["channel" ,"group", "supergroup"]);

mComposer.command("start", async (ctx) => {
  console.log("/start group");

  const { username: botUsername } = await ctx.api.getMe();

  ctx.reply(
    `[Click here to setup bot]` +
      `(tg:\\/\\/resolve?domain=${botUsername}&start=${ctx.msg.chat.id})`,
    { parse_mode: "MarkdownV2" }
  );
});

//TODO: automate this function for take description from file
//TODO: add check of description command (JSDoc).
/*mComposer.command("help", async (ctx) =>
  ctx.reply(
    "It is bot-editor (AI by GigaChat). His purpose " +
      "is rewrite messages in your group, making them more readability. \n\n" +
      "[empty list]" //TODO
  )
);*/

export default composer;
