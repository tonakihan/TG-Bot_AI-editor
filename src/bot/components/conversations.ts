import type { Conversation } from "@grammyjs/conversations";
import type { Context } from "grammy";
import range from "lodash-es/range.js";
//
import type { MyContext } from "../types/MyContext.d.ts";
import type { ArgsEditTemplate } from "../types/Conversations.d.ts";

async function setCaption(cvst: Conversation, ctx: Context) {
  const cloneMenuOrig = cvst.menu("menu-settings-caption")
    .text("✍🏻 Set text").row()
    .text("🔧 Disable caption").row()
    .text("🔄 Reset to default").row()
    .text("🔙 Back");
  const cloneMenuReturn = cvst.menu("menu-return")
    .text("🔙 Back to settings");

  const menu = cvst.menu().text("Cancel", async (ctx) => {
    await ctx.editMessageText("Caption:");
    await ctx.menu.nav("menu-settings-caption", { immediate: true });
    await cvst.halt();
  });

  await ctx.editMessageText("Edit caption:");
  await ctx.editMessageReplyMarkup({
    reply_markup: menu,
  });

  await ctx.reply("Write your caption to me");
  const input = await cvst.form.text();
  await cvst.external(
    (ctx: MyContext) => (ctx.session.config.caption = input)
  );

  // Delete the menu
  await ctx.editMessageReplyMarkup();

  await ctx.reply("Success! Caption changed.", { reply_markup: cloneMenuReturn });
}

async function setTemplate(cvst: Conversation, ctx: Context) {
  const cloneMenuOrig = cvst.menu("menu-settings-templates")
    .text("ℹ️ Edit exist chain").row()
    .text("➕ Set new chain").row()
    .text("🔄 Reset to default").row()
    .text("🔙 Back");
  const cloneMenuReturn = cvst.menu("menu-return")
    .text("🔙 Back to settings");

  const menu = cvst.menu().text("Cancel", async (ctx) => {
    await ctx.editMessageText("Templates:");
    await ctx.menu.nav("menu-settings-templates", { immediate: true });
    await cvst.halt();
  });

  await ctx.editMessageText("Set template:");
  await ctx.editMessageReplyMarkup({
    reply_markup: menu,
  });

  await ctx.reply(
    "I'll take 2 params: source and target.\n" +
    "sourse - it's the input text to the bot;\n" +
    "target - it's the output text from the bot. \n\n" +
    "To begin write <b>source</b> text to me.", {
      parse_mode: "HTML"
    });
  const source = await cvst.form.text();
  await ctx.reply("Now send the <b>target</b> to me", {
    parse_mode: "HTML"
  });
  const target = await cvst.form.text();

  await cvst.external(
    (ctx: MyContext) => 
      (ctx.session.config.templates.push({source, target}))
  );

  // Delete the menu
  await ctx.editMessageReplyMarkup();

  await ctx.reply("Success! Templates changed.", { reply_markup: cloneMenuReturn });
}

async function editTemplate(
  cvst: Conversation, 
  ctx: Context, 
  args: ArgsEditTemplate
) {
  const cloneMenuOrig = cvst.menu("menu-settings-templates")
    .text("ℹ️ Edit exist chain").row()
    .text("➕ Set new chain").row()
    .text("🔄 Reset to default").row()
    .text("🔙 Back");
  const cloneMenuReturn = cvst.menu("menu-return")
    .text("🔙 Back to settings");

  const menu = cvst.menu().text("Cancel", async (ctx) => {
    await ctx.editMessageText("Templates:");
    await ctx.menu.nav("menu-settings-templates", { immediate: true });
    await cvst.halt();
  });

  await ctx.editMessageText("Edit template:");
  await ctx.editMessageReplyMarkup({
    reply_markup: menu,
  });

  await ctx.reply(`Send to me the edited <b>${args.targetEdit}</b> text`, {
      parse_mode: "HTML"
    });
  const input = await cvst.form.text();

  await cvst.external(async (ctx: MyContext) => {
    const config = ctx.session.config;
    config.templates[args.templateId][args.targetEdit] = input;
  });

  await ctx.reply("Success updated template!", {
    reply_markup: cloneMenuReturn,
  });
}

export { setCaption, setTemplate, editTemplate }
