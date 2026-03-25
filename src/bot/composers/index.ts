import { Composer } from "grammy";
//
import type { MyContext } from "../types/MyContext.d.ts";
//
import commandGroup from "./commandGroup.ts";
import commandPrivate from "./commandPrivate.ts";
import commandGeneral from "./commandGeneral.ts";
import listenerGroup from "./listenerGroup.ts";

const composer = new Composer<MyContext>();

composer.use(commandGroup);
composer.use(commandPrivate);
composer.use(commandGeneral);
composer.use(listenerGroup);

export default composer;
