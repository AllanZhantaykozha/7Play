export interface Business {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  title: string;
  parentId: number | null;
}

export interface Service {
  id: number;
  title: string;
  price: number;
  durationMin: number;
  categoryId: number;
}

export interface BusinessData {
  business: Business;
  categories: Category[];
  services: Service[];
}

interface BotStepOption {
  id: number;
  name: string;
  price?: number;
  durationMin?: number;
  relatedTo?: number[];
  parentId?: number | null;
}

interface BotStep {
  type: "category" | "subcategory" | "service";
  title: string;
  options: BotStepOption[];
}

interface BotResponse {
  business: { id: number; name: string };
  steps: BotStep[];
}

export const data: BusinessData[] = [
  {
    business: {
      id: 1,
      name: "BeautyLine",
    },
    categories: [
      { id: 1, title: "Женские услуги", parentId: null },
      { id: 2, title: "Мужские услуги", parentId: null },
      { id: 3, title: "Ногтевой сервис", parentId: 1 },
      { id: 4, title: "Окрашивание", parentId: 1 },
      { id: 5, title: "Барбер-зона", parentId: 2 },
    ],
    services: [
      {
        id: 10,
        title: "Стрижка женская",
        price: 5000,
        durationMin: 40,
        categoryId: 1,
      },
      {
        id: 11,
        title: "Укладка волос",
        price: 6000,
        durationMin: 50,
        categoryId: 1,
      },
      {
        id: 12,
        title: "Окрашивание (корни)",
        price: 8000,
        durationMin: 60,
        categoryId: 4,
      },
      {
        id: 13,
        title: "Окрашивание в один тон",
        price: 12000,
        durationMin: 90,
        categoryId: 4,
      },
      {
        id: 14,
        title: "Маникюр классический",
        price: 4000,
        durationMin: 45,
        categoryId: 3,
      },
      {
        id: 15,
        title: "Педикюр SPA",
        price: 7000,
        durationMin: 70,
        categoryId: 3,
      },
      {
        id: 16,
        title: "Мужская стрижка",
        price: 4500,
        durationMin: 35,
        categoryId: 2,
      },
      {
        id: 17,
        title: "Бритьё опасной бритвой",
        price: 4000,
        durationMin: 30,
        categoryId: 5,
      },
      {
        id: 18,
        title: "Коррекция бороды",
        price: 3500,
        durationMin: 25,
        categoryId: 5,
      },
      {
        id: 19,
        title: "Комплекс: стрижка + борода",
        price: 7500,
        durationMin: 60,
        categoryId: 5,
      },
    ],
  },
  {
    business: {
      id: 2,
      name: "CyberZone",
    },
    categories: [
      { id: 20, title: "Вип зал", parentId: null },
      { id: 21, title: "Общий зал", parentId: null },
      { id: 22, title: "Соло", parentId: 20 },
      { id: 23, title: "Дуо", parentId: 20 },
      { id: 24, title: "Трио", parentId: 20 },
    ],
    services: [
      { id: 30, title: "ПК-01", price: 1000, durationMin: 60, categoryId: 22 },
      { id: 31, title: "ПК-02", price: 1000, durationMin: 60, categoryId: 22 },
      { id: 32, title: "ПК-03", price: 1200, durationMin: 60, categoryId: 23 },
      { id: 33, title: "ПК-04", price: 1200, durationMin: 60, categoryId: 23 },
      { id: 34, title: "ПК-05", price: 1500, durationMin: 60, categoryId: 24 },
      { id: 35, title: "ПК-06", price: 1500, durationMin: 60, categoryId: 24 },
      { id: 36, title: "ПК-07", price: 800, durationMin: 60, categoryId: 21 },
      { id: 37, title: "ПК-08", price: 800, durationMin: 60, categoryId: 21 },
    ],
  },
  {
    business: {
      id: 3,
      name: "Arman Sauna",
    },
    categories: [
      { id: 40, title: "Малый зал", parentId: null },
      { id: 41, title: "Большой зал", parentId: null },
      { id: 42, title: "Сауна", parentId: 41 },
      { id: 43, title: "Комната отдыха", parentId: 41 },
      { id: 44, title: "Бассейн", parentId: 41 },
      { id: 45, title: "VIP зона", parentId: null },
    ],
    services: [
      {
        id: 50,
        title: "Комната №1",
        price: 7000,
        durationMin: 120,
        categoryId: 40,
      },
      {
        id: 51,
        title: "Комната №2",
        price: 9000,
        durationMin: 120,
        categoryId: 41,
      },
      {
        id: 52,
        title: "Сауна-VIP",
        price: 12000,
        durationMin: 180,
        categoryId: 42,
      },
      {
        id: 53,
        title: "Комната отдыха Deluxe",
        price: 10000,
        durationMin: 150,
        categoryId: 43,
      },
      {
        id: 54,
        title: "Большой бассейн",
        price: 15000,
        durationMin: 180,
        categoryId: 44,
      },
      {
        id: 55,
        title: "Малый бассейн",
        price: 8000,
        durationMin: 120,
        categoryId: 44,
      },
      {
        id: 56,
        title: "VIP-комплекс (всё включено)",
        price: 25000,
        durationMin: 240,
        categoryId: 45,
      },
    ],
  },
  {
    business: {
      id: 4,
      name: "FitZone Gym",
    },
    categories: [
      { id: 60, title: "Персональные тренировки", parentId: null },
      { id: 61, title: "Групповые занятия", parentId: null },
      { id: 62, title: "Зал силовых тренировок", parentId: 60 },
      { id: 63, title: "Кардио-зона", parentId: 60 },
      { id: 64, title: "Йога и растяжка", parentId: 61 },
    ],
    services: [
      {
        id: 70,
        title: "Тренировка с тренером",
        price: 5000,
        durationMin: 60,
        categoryId: 62,
      },
      {
        id: 71,
        title: "Тренировка по питанию",
        price: 4000,
        durationMin: 45,
        categoryId: 62,
      },
      {
        id: 72,
        title: "Занятие по йоге",
        price: 3000,
        durationMin: 60,
        categoryId: 64,
      },
      {
        id: 73,
        title: "Растяжка",
        price: 2500,
        durationMin: 45,
        categoryId: 64,
      },
      {
        id: 74,
        title: "Кардио 30 мин",
        price: 2000,
        durationMin: 30,
        categoryId: 63,
      },
      {
        id: 75,
        title: "Кардио 60 мин",
        price: 3500,
        durationMin: 60,
        categoryId: 63,
      },
    ],
  },
];

export function transformBusinessDataToBot(biz: BusinessData): BotResponse {
  const categories = biz.categories ?? [];
  const services = biz.services ?? [];

  const steps: BotStep[] = [];

  // Корневые категории (parentId === null)
  const rootCategories = categories.filter((c) => c.parentId === null);
  if (rootCategories.length > 0) {
    steps.push({
      type: "category",
      title: "Выберите категорию",
      options: rootCategories.map((c) => ({
        id: c.id,
        name: c.title,
        parentId: c.parentId ?? null,
      })),
    });
  }

  // Подкатегории (parentId !== null) — если есть, добавляем отдельным шагом
  const subcategories = categories.filter((c) => c.parentId !== null);
  if (subcategories.length > 0) {
    steps.push({
      type: "subcategory",
      title: "Выберите подкатегорию",
      options: subcategories.map((c) => ({
        id: c.id,
        name: c.title,
        parentId: c.parentId ?? null,
      })),
    });
  }

  // Сервисы — всегда делаем шаг (если есть)
  if (services.length > 0) {
    steps.push({
      type: "service",
      title: "Выберите услугу / ресурс",
      options: services.map((s) => ({
        id: s.id,
        name: s.title,
        price: s.price,
        durationMin: s.durationMin,
        parentId: s.categoryId ?? null,
      })),
    });
  }

  return {
    business: { id: biz.business.id, name: biz.business.name },
    steps,
  };
}
