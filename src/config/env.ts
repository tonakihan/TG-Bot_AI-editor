import { fileURLToPath } from "url";
import path from "node:path";
import { dirname } from "node:path";
import { loadEnvFile } from "node:process";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

loadEnvFile(path.join(__dirname, "..", "..", ".env"));

process.env.API_TOKEN ??= "";
