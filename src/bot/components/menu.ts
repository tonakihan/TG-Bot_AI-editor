import { Menu } from "@grammyjs/menu";
//
import type { MyContext } from "../types/MyContext.d.ts";

// SETTINGS:
//TODO: interface for set of templates

// Main
const settings = new Menu<MyContext>("menu-settings-root")
  .text("Admin access to settings", (ctx) => {}).row()
  .submenu("Caption", "menu-settings-caption", async (ctx) => {
      const crrCap = ctx.session.config.caption;
      await ctx.editMessageText(`Caption: \n\nCurrent: ${crrCap}`) // TODO: Print current
    }).row()
  .text("Templates for AI", (ctx) => {}).row()
  .text("Import config", (ctx) => {})
  .text("Export config", (ctx) => {});

const caption = new Menu<MyContext>("menu-settings-caption")
  .text("Set text", (ctx) => 
    ctx.conversation.enter("captionSet")).row()
  .text("Disable caption").row()
  .back("<= Back", (ctx) => 
    ctx.editMessageText("Settings:"));
//
settings.register(caption);

// I want that it was like tg BotFather (e.g. edit name).
const returnMenu = new Menu<MyContext>("menu-return")
  .text("<= Back to settings", async (ctx) => {
      await ctx.editMessageText("Settings:");
      await ctx.menu.nav("menu-settings-root");
    });
//
settings.register(returnMenu);

export { settings, caption, returnMenu };
