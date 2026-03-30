import type { Config } from "./Config.d.ts";

export type ArgsEditTemplate = {
  templateId: number;
  targetEdit: keyof Config["templates"][number];
}
