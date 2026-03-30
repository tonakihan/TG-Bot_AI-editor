import { Menu } from "@grammyjs/menu";
//
import type { MyContext } from "../types/MyContext.d.ts";
import type { Config } from "../types/Config.d.ts";
import type { ArgsEditTemplate } from "../types/Conversations.d.ts";
//
import { defaultData } from "../middlewares/session.ts";

// Main
const mnSettings = new Menu<MyContext>("menu-settings-root")
  .text(
    (ctx) => {
      const admStatus = ctx.session.config.access === "admin" ? "✅" : "❌";
      return `Admin access to settings ${admStatus}`;
    }, 
    (ctx) => {
      const config = ctx.session.config;
      const admAccess = config.access === "admin";
      config.access = admAccess ? "owner" : "admin";
      ctx.menu.update();
    }).row()
  //
  .submenu("Caption", "menu-settings-caption", (ctx) => {
      const crrCap = ctx.session.config.caption;
      ctx.editMessageText(
        `Caption: \n\nCurrent: ${crrCap ? crrCap : "disabled"}`
      );
    }).row()
  //
  .text("Templates for AI", async (ctx) => {
      ctx.deleteMessage();
      await ctx.reply("List configured templates:");
     
      // Print the exist rules
      const config = ctx.session.config;
      const templates = config.templates;
      for (const tmpl of templates) {
        // NOTICE: If changed here then check __mnTemplateEdit
        await ctx.reply("🟡 Source: \n" + tmpl.source, {
          reply_markup: __mnTemplateEdit,
        });
        await ctx.reply("🟢 Target: \n" + tmpl.target, {
          reply_markup: __mnTemplateEdit,
        });
      }

      ctx.reply("Templates: ", {
        reply_markup: mnTemplates
      });
    }).row();
  /*.text("Import config", (ctx) => {})
  .text("Export config", (ctx) => {});*/


const mnCaption = new Menu<MyContext>("menu-settings-caption")
  .text("✍🏻 Set text", (ctx) => 
    ctx.conversation.enter("setCaption")).row()
  //
  .text("🔧 Disable caption", async (ctx) => {
      ctx.session.config.caption = "";
      ctx.editMessageText("Caption: \n\nSuccess caption disabled!");
    }).row()
  //
  .text("🔄 Reset to default", (ctx) => {
      const config = ctx.session.config;
      config.caption = defaultData.config.caption;
      ctx.editMessageText("Caption: \n\nSuccess caption reset!");
    }).row()
  //
  .back("🔙 Back", (ctx) => 
    ctx.editMessageText("Settings:"));
//
mnSettings.register(mnCaption);


const mnTemplates = new Menu<MyContext>("menu-settings-templates")
  .text("ℹ️ Edit exist chain", (ctx) => {
      ctx.reply(
        "If there are chains in the configuration, " +
        "these was sent above. Click the button below " +
        "the messages to <b>Edit</b>.", {
          parse_mode: "HTML",
        }
      );
    }).row()
  .text("➕ Set new chain", async (ctx) => {
      await ctx.conversation.enter("setTemplate");
    }).row()
  .text("🔄 Reset to default", (ctx) => {
      const config = ctx.session.config;
      config.templates = structuredClone(defaultData.config.templates);
      ctx.editMessageText("Templates: \n\nSuccess reset templates");
    }).row()
  .back("🔙 Back", (ctx) => {
      ctx.editMessageText("Settings:");
    });
//
mnSettings.register(mnTemplates);


// I want that it was like tg BotFather (e.g. edit name).
const mnReturn = new Menu<MyContext>("menu-return")
  .text("🔙 Back to settings", async (ctx) => {
      await ctx.editMessageText("Settings:");
      await ctx.menu.nav("menu-settings-root");
    });
//
mnSettings.register(mnReturn);


const __mnTemplateEdit = new Menu<MyContext>("menu-hide-templates-edit")
  .text("✍🏻 Edit", async (ctx) => {
    const isSource = /^🟡 Source:/.test(ctx.msg.text);
    const text = ctx.msg.text.slice(12);

    // Searching element
    const config = ctx.session.config;
    const templateId = config.templates.findIndex(
      (tmpl: Config["templates"][number]) => 
        (tmpl[isSource ? "source" : "target"] === text));
    
    await ctx.conversation.enter("editTemplate", {
        templateId,
        targetEdit: isSource ? "source" : "target"
      } satisfies ArgsEditTemplate);
  })
  //
  .text("🚮 Remove", (ctx) => {
    const msgId = ctx.msg.message_id;
    const isSource = /^🟡 Source:/.test(ctx.msg.text);
    const text = ctx.msg.text.slice(12);
    //console.debug("DBG: Cut text=" + text);

    // Searching element and remove it
    const config = ctx.session.config;
    config.templates = config.templates.filter(
      (tmpl: Config["templates"][number]) => 
        (tmpl[isSource ? "source" : "target"] !== text));
    
    // Remove the messages
    if (isSource) {
      ctx.deleteMessages([msgId, msgId+1]);
    } else {
      ctx.deleteMessages([msgId-1, msgId]);
    }
  })
//
mnSettings.register(__mnTemplateEdit);


export { mnSettings, mnCaption, mnReturn };
