import { Menu } from "@grammyjs/menu";
import type { MyContext } from "../../types/MyContext.d.ts";

// SETTINGS:
//TODO: interface for set of templates

export const settings = new Menu<MyContext>("menu-settings-root")
  .text("Admin access to settings", (ctx) => {}).row()
  .submenu("Caption", "menu-settings-caption").row()
  .text("Templates for AI", (ctx) => {}).row()
  .text("Import config", (ctx) => {})
  .text("Export config", (ctx) => {});

export const caption = new Menu<MyContext>("menu-settings-caption")
  .text("Set text", (ctx) => ctx.conversation.enter("captionSet")).row()
  .text("Disable caption").row()
  .back("<= back");

settings.register(caption);
