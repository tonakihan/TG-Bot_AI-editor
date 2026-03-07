import "./config/env.ts";
import process from "node:process";

import Bot from "./bot/index.ts";

/*console.log("  Environment variables:\n");
Object.keys(process.env).forEach((key) => 
    console.log(`${key}=${process.env[key]}`);
});*/

console.log("Server starting...")
const bot = Bot(process.env.API_TOKEN!);
bot.start();

console.log("Server is ready")
