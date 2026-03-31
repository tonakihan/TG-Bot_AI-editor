import { Composer } from "grammy";
import { conversations } from "@grammyjs/conversations";
//
import type { MyContext } from "../types/MyContext.d.ts";
//
import session from "./session.ts";
import auth from "./auth.ts";

const composer = new Composer<MyContext>();

composer.use(session);
composer.use(auth);
composer.use(conversations());

export default composer;
