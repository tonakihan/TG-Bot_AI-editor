import { session } from "grammy";
import type { Context, Middleware } from "grammy";
//
import type { SessionData } from "../types/SessionData.d.ts";
import type { MyContext } from "../types/MyContext.d.ts";

//TODO: Storage + split config - to seave and other
//TODO: Add error handler: Timeout session with reply

/** Key is userId, value is groupId */
const tmpSessionKey = new Map<string, string>();
/** Used in initSession() */
const defaultData: Readonly<SessionData> = {
  config: {
    access: "admin",
    caption: "By $username",
    // NOTICE: Need use deep clone!
    templates: [
      {
        source:
          "Уважаемые студенты! В целях повышения оперативности " +
          "информирования обучающихся в университете запущен " +
          "официальный канал БГПУ в мессенджере MAX: " +
          "https://max.ru/hernya_gos До 6 марта необходимо " +
          "студентам академических групп подключиться к данному каналу. " +
          "В нем будет публиковаться актуальная и полезная информация об " +
          "образовательном процессе, организационных вопросах, а также " +
          "важные объявления университета. Просим старост академических " +
          "групп проинформировать студентов и по возможности помочь " +
          "одногруппникам подключиться к каналу. Подписка позволит " +
          "своевременно получать важную информацию и быть в курсе " +
          "университетских новостей!",
        target:
          "ℹ️Infoℹ️\n\nДо 6 марта всем студентам академических групп " +
          'необходимо подключиться к <a href="https://max.ru/' +
          'hernya_gos">официальному каналу БГПУ в мессенджере ' +
          "MAX</a> \n\n Что вас ждет в канале: \n- актуальная информация " +
          "об образовательном процессе;\n- полезные сведения по " +
          "организационным вопросам; \n- важные объявления университета. " +
          "\n\nПодписка поможет вам оперативно получать необходимую " +
          "информацию и всегда оставаться в курсе событий университета!",
      },
      {
        source:
          "Доброе утро всем. Старосты, передайте, " +
          "пожалуйста, студентам, чтобы социальные справки " +
          "несли до 9 числа включительно, так как 10 числа " +
          "с утра уже подаётся представление.",
        target:
          "ℹ️Infoℹ️\n\nСтудентам, которым необходимо " +
          "предоставить социальные справки. Социальные " +
          "справки принимаются до 9 числа включительно.",
      },
      {
        source:
          "Уважаемые старосты, добрый день. 😊 Напоминаю, " +
          "что сегодня в 14.40 в актовом зале состоятся " +
          "Разговоры о важном для студентов 1 курса. Эта пара " +
          "стоит у ваших групп в расписании. Просьба обеспечить " +
          "явку на это мероприятие в полном составе. 👆🏻",
        target:
          '🗓️ Расписание🗓️\n\nСегодня "Разговоры о важном" в 14:40 - Актовый зал.',
      },
    ],
  },

  parsedCaption: "",
};

function getSessionKey(ctx: MyContext): string | undefined {
  const isGroup = ctx.msg.chat.type !== "private";
  const userId = isGroup ? ctx.msg.from.id : ctx.msg.chat.id;

  //console.debug("MSG:");
  //console.debug(ctx.msg);

  let groupId: string | undefined;
  if (isGroup) {
    groupId = ctx.msg?.chat.id;
  } else if (!tmpSessionKey.has(userId)) {
    const text = ctx.msg.text;
    groupId = text.match(/^\/start (-\d+)/)?.[1];
  } else {
    // Cause - menu update. In setting mode.
    groupId = tmpSessionKey.get(userId);
  }

  // WARNING: Possible memory leak here.
  // Save temporary data
  if (groupId && !tmpSessionKey.has(userId) && !isGroup) {
    tmpSessionKey.set(userId, groupId);

    // Delete data after 15 min
    ctx.reply("You have access to the settings for 15 minutes.");
    setTimeout(() => {
      tmpSessionKey.delete(userId);
    }, 900000);
  }

  //console.debug("initSession ID: ", groupId);
  return groupId;
}

function initSession(): SessionData {
  return structuredClone(defaultData);
}

const mSession = session({
  initial: initSession,
  getSessionKey,
  prefix: "group_",
  //storage:  //TODO
});

export default mSession;
export { defaultData };
