import { Telegraf, Markup } from "telegraf";
import * as dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

interface IComputer {
  id: number;
  name: string;
  status: "free" | "busy" | "booked";
  ownersId: number[];
}

const computers: IComputer[] = [
  { id: 1, name: "PC-01", status: "free", ownersId: [] },
  { id: 2, name: "PC-02", status: "busy", ownersId: [] },
  { id: 3, name: "PC-03", status: "free", ownersId: [] },
  { id: 4, name: "PC-04", status: "booked", ownersId: [] },
  { id: 5, name: "PC-05", status: "busy", ownersId: [] },
  { id: 6, name: "PC-06", status: "free", ownersId: [] },
  { id: 7, name: "PC-07", status: "busy", ownersId: [] },
  { id: 8, name: "PC-08", status: "free", ownersId: [] },
  { id: 9, name: "PC-09", status: "booked", ownersId: [] },
  { id: 10, name: "PC-10", status: "free", ownersId: [] },
];

const userSelections = new Map<number, number>();

const buttonsComputers = computers
  .filter((obj) => obj.status === "free")
  .map((obj) => Markup.button.callback(obj.name, `booking_${obj.id}`));

bot.start((ctx) =>
  ctx.reply(
    "Добро пожаловать в 7Play",
    Markup.keyboard([["🏠 Главное", "ℹ️ Помощь"], ["Забронировать"]]).resize()
  )
);

bot.hears("Забронировать", async (ctx) => {
  ctx.reply(
    `Привет, ${ctx.from.first_name}!\n\nВыбери компьютер:`,
    Markup.inlineKeyboard(buttonsComputers, {
      columns: buttonsComputers.length <= 4 ? 1 : 3,
    })
  );
  ctx.deleteMessage();
});

bot.action(/booking_(.+)/, (ctx) => {
  ctx.answerCbQuery();

  const computerId = Number(ctx.match[1]);
  userSelections.set(ctx.from.id, computerId);

  const selected = computers.find((c) => c.id === computerId);

  ctx.reply(
    `Вы выбрали — ${selected?.name}\n\nВы уверены, что хотите забронировать этот компьютер?`,
    Markup.inlineKeyboard(
      [
        Markup.button.callback("✅ Забронировать", "accept"),
        Markup.button.callback("❌ Отмена", "cancel"),
      ],
      { columns: 2 }
    )
  );

  ctx.deleteMessage();
});

bot.action("cancel", (ctx) => {
  ctx.answerCbQuery("Отменено");
  ctx.reply("Бронирование отменено ❌");
  ctx.deleteMessage();
});

bot.action("accept", (ctx) => {
  ctx.answerCbQuery();

  const userId = ctx.from.id;
  const selectedId = userSelections.get(userId);
  const selectedPC = computers.find((c) => c.id === selectedId);

  if (!selectedPC) {
    ctx.reply("Ошибка: компьютер не найден 😢");
    return;
  }

  selectedPC.status = "booked";
  selectedPC.ownersId.push(userId);

  ctx.reply(
    `✅ Ты забронировал компьютер ${
      selectedPC.name
    }\n📅 Время: ${new Date().toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`
  );

  ctx.deleteMessage();
});

bot.help((ctx) => ctx.reply("Я пока умею немного, но скоро стану умнее 🤖"));

bot.launch();
console.log("✅ Бот запущен...");
