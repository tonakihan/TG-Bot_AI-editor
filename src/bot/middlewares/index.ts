import { Composer } from "grammy";
import { conversations } from "@grammyjs/conversations";
//
import type { MyContext } from "../types/MyContext.d.ts";
//
import session from "./session.ts";

const composer = new Composer<MyContext>();

composer.use(session);
composer.use(conversations());

export default composer;
