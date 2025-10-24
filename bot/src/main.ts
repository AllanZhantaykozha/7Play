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
  { id: 8, name: "PC-08", status: "free", ownersId: [] },
  { id: 8, name: "PC-08", status: "free", ownersId: [] },
  { id: 8, name: "PC-08", status: "free", ownersId: [] },
  { id: 9, name: "PC-09", status: "booked", ownersId: [] },
];

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
  ctx.reply(
    `Вы выбрали - ${ctx.match[1]}\n\nВы уверены, что хотите забронировать этот компьютер?`,
    Markup.inlineKeyboard(
      [
        Markup.button.callback("Забронировать", `accept`),
        Markup.button.callback("Отмена", `cancel`),
      ],
      {
        columns: 2,
      }
    )
  );
  ctx.deleteMessage();
});

bot.action(`cancel`, (ctx) => {
  ctx.answerCbQuery();
  ctx.reply("cancel");
  ctx.deleteMessage();
});

bot.action(`accept`, (ctx) => {
  ctx.answerCbQuery();
  ctx.reply("accept");
  ctx.deleteMessage();
});

bot.help((ctx) => ctx.reply("Я пока умею немного, но скоро стану умнее 🤖"));

bot.launch();
console.log("✅ Бот запущен...");
