import { Composer } from "grammy";
import { createConversation } from "@grammyjs/conversations";
//
import type { MyContext } from "../types/MyContext.d.ts";
//
import { mnSettings } from "./menu.ts";
import { setCaption, setTemplate, editTemplate } from "./conversations.ts";

const composer = new Composer<MyContext>();

//conversation
composer.use(createConversation(setCaption));
composer.use(createConversation(setTemplate));
composer.use(createConversation(editTemplate));

//menu
composer.use(mnSettings);

export default composer;
