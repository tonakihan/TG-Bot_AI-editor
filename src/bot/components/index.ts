import { Composer } from "grammy";
import { createConversation } from "@grammyjs/conversations";
//
import type { MyContext } from "../types/MyContext.d.ts";
//
import { settings } from "./menu.ts";
import { captionSet } from "./conversations.ts";

const composer = new Composer<MyContext>();

//conversation
composer.use(createConversation(captionSet));

//menu
composer.use(settings);

export default composer;
