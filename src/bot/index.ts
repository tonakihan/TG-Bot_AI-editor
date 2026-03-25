import { Bot, session } from "grammy";
import { conversations } from "@grammyjs/conversations";
//
import type { MyContext } from "./types/MyContext.d.ts";
import type { SessionData } from "./types/SessionData.d.ts";
//
import components from "./components/index.ts";
import composers from "./composers/index.ts";
import errorHandler from "./error.ts";
//TODO: Connect DB for store configurations

export default function (token: string) {
  console.log("Bot setup...");
  const bot = new Bot<MyContext>(token);

  bot.use(
    session({
      initial: (): SessionData => ({}),
    })
  );
  bot.use(conversations());

  bot.use(components);
  bot.use(composers);

  errorHandler(bot);

  return bot;
}
