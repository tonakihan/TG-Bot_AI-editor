import { Bot } from "grammy";
//
import type { MyContext } from "./types/MyContext.d.ts";
//
import middlewares from "./middlewares/index.ts";
import components from "./components/index.ts";
import composers from "./composers/index.ts";
import errorHandler from "./error.ts";

export default function (token: string) {
  console.log("Bot setup...");
  const bot = new Bot<MyContext>(token);

  bot.use(middlewares);
  bot.use(components);
  bot.use(composers);

  errorHandler(bot);

  return bot;
}
