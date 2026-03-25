import type { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";
import range from "lodash-es/range.js";
//
import type { MyContext } from "../types/MyContext.d.ts";

//TODO: Make possible use username in caption
export async function captionSet(cvst: Conversation, ctx: Context) {
  const cloneOrigMenu = cvst.menu("menu-settings-caption").text("Click me");

  const menu = cvst.menu().text("Cancel", async (ctx) => {
    await ctx.menu.nav("menu-settings-caption", { immediate: true });
    await cvst.halt();
  });
  await ctx.editMessageReplyMarkup({
    reply_markup: menu,
  });

  await ctx.reply("What is your text?");
  const input = await cvst.form.text();
  // Try return menu
  await ctx.reply("Success!");

  await cvst.external(
    (ctx: MyContext) => (ctx.session.config = { caption: input })
  );

  await ctx.editMessageReplyMarkup({ reply_markup: cloneOrigMenu });
}
