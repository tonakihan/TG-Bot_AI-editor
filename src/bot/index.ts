import { Bot } from "grammy";
import setup from "./setup.ts";

export default function(token: string) {
  console.log("Bot setup...");
  const bot = new Bot(token);
  setup(bot);
  return bot
}
