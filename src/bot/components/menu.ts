import { Menu } from "@grammyjs/menu";
//
import type { MyContext } from "../types/MyContext.d.ts";

// SETTINGS:
//TODO: interface for set of templates

// Main
const settings = new Menu<MyContext>("menu-settings-root")
  .text(
    (ctx) => {
      const admStatus = ctx.session.config.access === "admin" ? "✅" : "❌";
      return `Admin access to settings ${admStatus}`;
    }, 
    (ctx) => {
      const config = ctx.session.config;
      const admAccess = config.access === "admin";
      config.access = admAccess ? "owner" : "admin";
      ctx.menu.update();
    }).row()
  //
  .submenu("Caption", "menu-settings-caption", (ctx) => {
      const crrCap = ctx.session.config.caption;
      ctx.editMessageText(
        `Caption: \n\nCurrent: ${crrCap ? crrCap : "disabled"}`
      );
    }).row()
  //
  .text("Templates for AI", (ctx) => {}).row();
  /*.text("Import config", (ctx) => {})
  .text("Export config", (ctx) => {});*/

const caption = new Menu<MyContext>("menu-settings-caption")
  .text("Set text", (ctx) => 
    ctx.conversation.enter("captionSet")).row()
  //
  .text("Disable caption", async (ctx) => {
      ctx.session.config.caption = "";
      ctx.editMessageText("Caption: \n\nSuccess caption disabled!");
    }).row()
  //
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
