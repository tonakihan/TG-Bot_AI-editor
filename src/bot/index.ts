import { Bot, session } from "grammy";
import listener from "./listener.ts";
import command from "./command.ts";
import error from "./error.ts";
import middleware from "./middleware/index.ts";
import type { MyContext } from "../types/MyContext.d.ts";
import type { SessionData } from "../types/SessionData.d.ts";

//TODO: Refactoring code to example/scaling
//TODO: Connect DB for store configurations

export default function (token: string) {
  console.log("Bot setup...");
  const bot = new Bot<MyContext>(token);

  bot.use(
    session({
      initial: (): SessionData => ({}),
    })
  );

  middleware(bot);
  command(bot);
  listener(bot);
  error(bot);

  return bot;
}
