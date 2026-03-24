import { settings } from "./menu.ts";
import type { Bot } from "../../types/Bot.d.ts";
import {
  conversations,
  createConversation
} from "@grammyjs/conversations";
import { captionSet } from "./conversations.ts";

export default function (bot: Bot) {
  bot.use(conversations());
  bot.use(createConversation(captionSet));

  bot.use(settings);
}
