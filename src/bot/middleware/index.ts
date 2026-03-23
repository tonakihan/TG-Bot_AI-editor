import { settings } from "./menu.ts";
import type { Bot } from "../../types/Bot.d.ts";

export default function (bot: Bot) {
  bot.use(settings);
}
