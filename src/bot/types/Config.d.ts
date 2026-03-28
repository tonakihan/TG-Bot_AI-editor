export type Config = {
  /** Access to settings the bot */
  access: "admin" | "owner";
  caption: string;
  templates: Array<{
    source: string;
    target: string;
  }>;
};
