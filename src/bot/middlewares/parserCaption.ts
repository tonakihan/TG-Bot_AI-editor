import type { MiddlewareFn } from "grammy";
//
import type { MyContext } from "../types/MyContext.d.ts";

const parserCaption: MiddlewareFn<MyContext> = async (ctx, next) => {
  const config = ctx.session.config;
  if (
    !config.caption ||
    ctx.msg.chat.type === "private"
  ) {
    next();
    return;
  }

  const username = ctx.from.username;
  let caption = config.caption;
  caption = caption.replaceAll(/\$username/g, "@" + username);

  ctx.session.parsedCaption = caption;
  next();
}

export default parserCaption;
