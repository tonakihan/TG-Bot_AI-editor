import { Composer } from "grammy";
import { conversations } from "@grammyjs/conversations";
//
import type { MyContext } from "../types/MyContext.d.ts";
//
import session from "./session.ts";
import auth from "./auth.ts";
import parserCaption from "./parserCaption.ts";

const composer = new Composer<MyContext>();

composer.use(session);
composer.use(auth);
composer.use(parserCaption);
composer.use(conversations());

export default composer;
