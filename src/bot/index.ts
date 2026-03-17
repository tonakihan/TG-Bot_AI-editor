import { Bot } from "grammy";
import listener from "./listener.ts";
import command from "./command.ts";
import error from "./error.ts";

export default function(token: string) {
  console.log("Bot setup...");
  const bot = new Bot(token);
  
  command(bot);
  listener(bot);
  error(bot);

  return bot
}
