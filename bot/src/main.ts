import { Telegraf, Markup } from "telegraf";
import * as dotenv from "dotenv";
import { data, transformBusinessDataToBot } from "./mock";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

const botJson = transformBusinessDataToBot(data[1]);

type UserSession = {
  stepIndex: number;
  selections: Record<string, number>;
  lastMessageId?: number;
};
const sessions = new Map<number, UserSession>();

function buildInlineButtons(
  options: { id: number; name: string }[],
  cols = 1,
  includeBack = false,
  includeCancel = true
) {
  const rows = options.map((opt) => [
    Markup.button.callback(opt.name, `select:${opt.id}`),
  ]);

  if (includeBack) {
    rows.push([Markup.button.callback("⬅️ Назад", "back")]);
  }

  if (includeCancel) {
    rows.push([Markup.button.callback("❌ Отмена", "cancel")]);
  }

  return Markup.inlineKeyboard(rows, { columns: cols });
}

async function sendStep(ctx: any, session: UserSession) {
  const steps = botJson.steps;
  if (session.stepIndex >= steps.length) {
    return sendConfirmation(ctx, session);
  }

  const step = steps[session.stepIndex];

  let options = step.options as any[];

  const selectedSub = session.selections["subcategory"];
  const selectedCat = session.selections["category"];

  if (step.type === "subcategory") {
    if (selectedCat !== undefined) {
      options = options.filter((o) => o.parentId === selectedCat);
    }
  } else if (step.type === "service") {
    if (selectedSub !== undefined) {
      options = options.filter((o) => o.parentId === selectedSub);
    } else if (selectedCat !== undefined) {
      options = options.filter((o) => o.parentId === selectedCat);
    }
  }

  if (options.length === 0) {
    session.stepIndex++;
    return sendStep(ctx, session);
  }

  const cols = options.length <= 4 ? 1 : 3;
  const optionsForButtons = options.map((o) => ({
    id: o.id,
    name:
      step.type === "service" && o.price !== undefined
        ? `${o.name || o.title} — ${o.price}₸`
        : o.name || o.title,
  }));

  const includeBack = session.stepIndex > 0;
  const inline = buildInlineButtons(optionsForButtons, cols, includeBack, true);

  const text = step.title;
  try {
    if (session.lastMessageId) {
      await ctx.telegram.editMessageText(
        ctx.from.id,
        session.lastMessageId,
        undefined,
        text,
        inline
      );
    } else {
      const msg = await ctx.reply(text, inline);
      session.lastMessageId = msg.message_id;
    }
  } catch (err) {
    const msg = await ctx.reply(text, inline);
    session.lastMessageId = msg.message_id;
  }
}

async function sendConfirmation(ctx: any, session: UserSession) {
  const steps = botJson.steps;
  const lines: string[] = [];
  lines.push("✅ Подтвердите бронь:");
  for (const step of steps) {
    if (step.type === "category" && session.selections["category"]) {
      const opt = step.options.find(
        (o) => o.id === session.selections["category"]
      );
      if (opt) lines.push(`Категория: ${opt.name}`);
    }
    if (step.type === "subcategory" && session.selections["subcategory"]) {
      const opt = step.options.find(
        (o) => o.id === session.selections["subcategory"]
      );
      if (opt) lines.push(`Подкатегория: ${opt.name}`);
    }
    if (step.type === "service" && session.selections["service"]) {
      const found = step.options.find(
        (o) => o.id === session.selections["service"]
      );
      if (found)
        lines.push(
          `Услуга / Ресурс: ${found.name}${
            found.price ? ` — ${found.price}₸` : ""
          }`
        );
    }
  }

  const text = lines.join("\n");
  const inline = Markup.inlineKeyboard(
    [
      Markup.button.callback("✅ Подтвердить", "confirm"),
      Markup.button.callback("❌ Отменить", "cancel"),
    ],
    { columns: 2 }
  );

  try {
    if (session.lastMessageId) {
      await ctx.telegram.editMessageText(
        ctx.from.id,
        session.lastMessageId,
        undefined,
        text,
        inline
      );
    } else {
      const msg = await ctx.reply(text, inline);
      session.lastMessageId = msg.message_id;
    }
  } catch {
    const msg = await ctx.reply(text, inline);
    session.lastMessageId = msg.message_id;
  }
}

/* --------- Бот handlers --------- */

bot.start((ctx) =>
  ctx.reply(
    `Добро пожаловать в ${botJson.business.name}`,
    Markup.keyboard([["🏠 Главное", "ℹ️ Помощь"], ["Забронировать"]]).resize()
  )
);

bot.hears("Забронировать", async (ctx) => {
  const uid = ctx.from.id;
  const session: UserSession = { stepIndex: 0, selections: {} };
  sessions.set(uid, session);
  try {
    await ctx.deleteMessage();
  } catch {}
  await sendStep(ctx, session);
});

bot.action(/^select:(\d+)$/, async (ctx) => {
  await ctx.answerCbQuery();
  const uid = ctx.from.id;
  const session = sessions.get(uid);
  if (!session) {
    await ctx.reply("Сессия не найдена. Нажмите «Забронировать» заново.");
    return;
  }

  const selectedId = Number(ctx.match[1]);
  const step = botJson.steps[session.stepIndex];

  if (step.type === "category") session.selections["category"] = selectedId;
  else if (step.type === "subcategory")
    session.selections["subcategory"] = selectedId;
  else if (step.type === "service") session.selections["service"] = selectedId;

  session.stepIndex++;
  if (session.stepIndex >= botJson.steps.length) {
    await sendConfirmation(ctx, session);
    return;
  }
  await sendStep(ctx, session);
});

bot.action("back", async (ctx) => {
  await ctx.answerCbQuery();
  const uid = ctx.from.id;
  const session = sessions.get(uid);
  if (!session) {
    await ctx.reply("Сессия не найдена. Нажмите «Забронировать» заново.");
    return;
  }

  const currentIndex = session.stepIndex;
  if (currentIndex >= botJson.steps.length) {
    session.stepIndex = botJson.steps.length - 1;
    await sendStep(ctx, session);
    return;
  }

  const currStep = botJson.steps[currentIndex];
  if (currStep) {
    if (currStep.type === "category") delete session.selections["category"];
    else if (currStep.type === "subcategory")
      delete session.selections["subcategory"];
    else if (currStep.type === "service") delete session.selections["service"];
  }

  session.stepIndex = Math.max(0, currentIndex - 1);
  await sendStep(ctx, session);
});

bot.action("cancel", async (ctx) => {
  await ctx.answerCbQuery("Отменено");
  const uid = ctx.from.id;
  sessions.delete(uid);
  try {
    await ctx.reply("Бронирование отменено ❌");
  } catch {}
  try {
    await ctx.deleteMessage();
  } catch {}
});

bot.action("confirm", async (ctx) => {
  await ctx.answerCbQuery();
  const uid = ctx.from.id;
  const session = sessions.get(uid);
  if (!session) {
    await ctx.reply("Сессия не найдена. Нажмите «Забронировать» заново.");
    return;
  }

  const categoryOpt = botJson.steps
    .find((s) => s.type === "category")
    ?.options.find((o: any) => o.id === session.selections["category"]);
  const subOpt = botJson.steps
    .find((s) => s.type === "subcategory")
    ?.options.find((o: any) => o.id === session.selections["subcategory"]);
  const serviceOpt = botJson.steps
    .filter((s) => s.type === "service")
    .flatMap((s) => s.options)
    .find((o: any) => o.id === session.selections["service"]);

  const summary = [
    categoryOpt ? `Категория: ${categoryOpt.name}` : null,
    subOpt ? `Подкатегория: ${subOpt.name}` : null,
    serviceOpt
      ? `Услуга: ${serviceOpt.name}${
          serviceOpt.price ? ` — ${serviceOpt.price}₸` : ""
        }`
      : null,
    `Клиент: ${ctx.from.first_name} ${ctx.from.last_name || ""}`,
    `Время: ${new Date().toLocaleString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  await ctx.reply(summary);

  sessions.delete(uid);
  try {
    await ctx.deleteMessage();
  } catch {}
});

bot.help((ctx) => ctx.reply("Я пока умею немного, но скоро стану умнее 🤖"));

bot.launch();
console.log("✅ Бот запущен...");
