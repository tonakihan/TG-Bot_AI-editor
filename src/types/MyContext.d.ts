import type { SessionData } from "./SessionData.d.ts";
import type { Context, SessionFlavor } from "grammy";
import type { ConversationFlavor } from "@grammyjs/conversation";

type MyContext = ConversationFlavor<Context & SessionFlavor<SessionData>>;

export type { MyContext };
