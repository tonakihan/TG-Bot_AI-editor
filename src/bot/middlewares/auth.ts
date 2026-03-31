import type { MiddlewareFn } from "grammy";
//
import type { MyContext } from "../types/MyContext.d.ts";

//NOTICE: Make sure that entry point to the settings - it is only /start!
const auth: MiddlewareFn<MyContext> = async (ctx, next) => {
  const isTryGetAccessToSettings = /^\/start .\d/.test(ctx.msg.text);

  if (
    isTryGetAccessToSettings && 
    ctx.msg.chat.type === "private"
  ) {
    console.log("Auth: Detect try access to the settings");
    const config = ctx.session.config;
    const userId = ctx.from?.id;
    const groupId = ctx.msg.text.split(" ")[1];

    const infoGroupMember = await ctx.api.getChatMember(groupId, userId);
    const userStatus = infoGroupMember.status;
    
    if (
      (userStatus === "administrator" && config.access === "admin") || 
      userStatus === "creator"
    ) {
      next(); 
      return;
    }

    await ctx.reply(
      "Access denied: You no longer have permission to settings. " +
      "If you sure that you have then send to me /start."
    );
    return;
  }

  next();
}

export default auth;
