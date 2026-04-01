import "./config/env.ts";
import process from "node:process";

import Bot from "./bot/index.ts";

console.log("Server starting...")
const bot = Bot(process.env.BOT_API_TOKEN ?? "");
bot.start();

console.log("Server is ready")
