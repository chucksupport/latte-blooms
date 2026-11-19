// Drink menu and price rules.
//
// Latte Blooms buys the drink at the coffee shop, so the customer pays about
// what the shop charges. Prices below are an estimate based on Starbucks' U.S.
// menu (late 2025: Tall / Grande / Venti), rounded up to the nearest quarter so
// sales tax and small regional differences are covered. The owner confirms the
// final total by email before payment, so these only need to be close.
//
// To change a price: edit the numbers here. [small, medium, large].

export type DrinkSize = "small" | "medium" | "large";
export type DrinkTemp = "hot" | "iced";

export const drinkSizes = [
  { id: "small", label: "Small", oz: 12 },
  { id: "medium", label: "Medium", oz: 16 },
  { id: "large", label: "Large", oz: 20 },
] as const satisfies readonly { id: DrinkSize; label: string; oz: number }[];

export type MenuItem = {
  id: string;
  name: string;
  /** Price by size: [small, medium, large]. */
  prices: readonly [number, number, number];
  /** Which temperatures the drink comes in. */
  temps: readonly DrinkTemp[];
  /** Whether a milk choice makes sense for this drink. */
  milk: boolean;
};

export const menu: readonly { category: string; items: readonly MenuItem[] }[] = [
  {
    category: "Hot coffee & espresso",
    items: [
      { id: "brewed", name: "Brewed Coffee", prices: [3.25, 3.75, 4.0], temps: ["hot"], milk: true },
      { id: "americano", name: "Caffe Americano", prices: [4.0, 4.5, 5.0], temps: ["hot", "iced"], milk: true },
      { id: "latte", name: "Caffe Latte", prices: [4.5, 5.25, 5.75], temps: ["hot", "iced"], milk: true },
      { id: "cappuccino", name: "Cappuccino", prices: [4.5, 5.25, 5.75], temps: ["hot"], milk: true },
      { id: "flat-white", name: "Flat White", prices: [5.25, 5.75, 6.25], temps: ["hot", "iced"], milk: true },
      { id: "mocha", name: "Caffe Mocha", prices: [5.0, 5.75, 6.25], temps: ["hot", "iced"], milk: true },
      { id: "white-mocha", name: "White Chocolate Mocha", prices: [5.25, 6.0, 6.5], temps: ["hot", "iced"], milk: true },
      { id: "caramel-macchiato", name: "Caramel Macchiato", prices: [5.25, 5.75, 6.25], temps: ["hot", "iced"], milk: true },
      { id: "pumpkin-spice-latte", name: "Pumpkin Spice Latte (seasonal)", prices: [5.75, 6.25, 6.75], temps: ["hot", "iced"], milk: true },
    ],
  },
  {
    category: "Cold brew & iced",
    items: [
      { id: "iced-coffee", name: "Iced Coffee", prices: [4.0, 4.5, 5.0], temps: ["iced"], milk: true },
      { id: "cold-brew", name: "Cold Brew", prices: [4.5, 5.0, 5.5], temps: ["iced"], milk: true },
      { id: "sweet-cream-cold-brew", name: "Vanilla Sweet Cream Cold Brew", prices: [5.0, 5.5, 6.0], temps: ["iced"], milk: false },
      { id: "shaken-espresso", name: "Brown Sugar Oatmilk Shaken Espresso", prices: [5.5, 6.0, 6.5], temps: ["iced"], milk: false },
    ],
  },
  {
    category: "Frappuccino & blended",
    items: [
      { id: "caramel-frappuccino", name: "Caramel Frappuccino", prices: [5.5, 6.0, 6.5], temps: ["iced"], milk: true },
      { id: "mocha-frappuccino", name: "Mocha Frappuccino", prices: [5.5, 6.0, 6.5], temps: ["iced"], milk: true },
      { id: "vanilla-bean-frappuccino", name: "Vanilla Bean Creme Frappuccino", prices: [5.0, 5.5, 6.0], temps: ["iced"], milk: true },
      { id: "strawberry-frappuccino", name: "Strawberry Creme Frappuccino", prices: [5.25, 5.75, 6.25], temps: ["iced"], milk: true },
    ],
  },
  {
    category: "Tea, cocoa & refreshers",
    items: [
      { id: "chai-latte", name: "Chai Latte", prices: [4.75, 5.5, 6.0], temps: ["hot", "iced"], milk: true },
      { id: "matcha-latte", name: "Matcha Latte", prices: [5.0, 5.5, 6.0], temps: ["hot", "iced"], milk: true },
      { id: "hot-tea", name: "Hot Tea", prices: [3.25, 3.75, 4.0], temps: ["hot"], milk: false },
      { id: "iced-tea", name: "Iced Tea or Tea Lemonade", prices: [3.75, 4.25, 4.75], temps: ["iced"], milk: false },
      { id: "hot-chocolate", name: "Hot Chocolate", prices: [4.0, 4.5, 5.0], temps: ["hot"], milk: true },
      { id: "strawberry-acai", name: "Strawberry Acai Refresher", prices: [5.0, 5.5, 6.0], temps: ["iced"], milk: false },
      { id: "mango-dragonfruit", name: "Mango Dragonfruit Refresher", prices: [5.0, 5.5, 6.0], temps: ["iced"], milk: false },
      { id: "pink-drink", name: "Pink Drink", prices: [5.5, 6.0, 6.5], temps: ["iced"], milk: false },
    ],
  },
];

export const menuItems: readonly MenuItem[] = menu.flatMap((g) => g.items);
const menuById = new Map(menuItems.map((m) => [m.id, m]));

// Starbucks dropped its non-dairy milk surcharge in late 2024, so milk is free.
export const milks = [
  "Shop standard (2%)",
  "Whole milk",
  "Nonfat milk",
  "Oat milk",
  "Almond milk",
  "Soy milk",
  "Coconut milk",
  "No milk",
] as const;

export const syrups = [
  { id: "none", name: "No flavor syrup", price: 0 },
  { id: "vanilla", name: "Vanilla", price: 0.8 },
  { id: "caramel", name: "Caramel", price: 0.8 },
  { id: "hazelnut", name: "Hazelnut", price: 0.8 },
  { id: "toffee-nut", name: "Toffee Nut", price: 0.8 },
  { id: "brown-sugar", name: "Brown Sugar", price: 0.8 },
  { id: "sf-vanilla", name: "Sugar-free Vanilla", price: 0.8 },
  { id: "pumpkin", name: "Pumpkin Spice (seasonal)", price: 0.8 },
] as const;

export const extras = [
  { id: "extra-shot", name: "Extra espresso shot", price: 1.25 },
  { id: "cold-foam", name: "Cold foam", price: 1.25 },
  { id: "whip", name: "Whipped cream", price: 0 },
  { id: "decaf", name: "Decaf", price: 0 },
] as const;

export const coffeeShops = [
  "Starbucks",
  "Dunkin'",
  "A local coffee shop",
] as const;

export type DrinkSelection = {
  item: string;
  size: DrinkSize;
  temp: DrinkTemp;
  milk: string;
  syrup: string;
  extras: string[];
  notes: string;
};

export function defaultDrink(): DrinkSelection {
  return {
    item: "latte",
    size: "medium",
    temp: "hot",
    milk: milks[0],
    syrup: "none",
    extras: [],
    notes: "",
  };
}

export function getMenuItem(id: string): MenuItem | undefined {
  return menuById.get(id);
}

const sizeIndex: Record<DrinkSize, 0 | 1 | 2> = { small: 0, medium: 1, large: 2 };

export function priceDrink(d: DrinkSelection): number {
  const item = menuById.get(d.item);
  if (!item) return 0;
  let total = item.prices[sizeIndex[d.size]];
  total += syrups.find((s) => s.id === d.syrup)?.price ?? 0;
  for (const e of d.extras) total += extras.find((x) => x.id === e)?.price ?? 0;
  return round2(total);
}

export function describeDrink(d: DrinkSelection): string {
  const item = menuById.get(d.item);
  if (!item) return "Unknown drink";
  const size = drinkSizes.find((s) => s.id === d.size)?.label ?? d.size;
  const temp = item.temps.length > 1 ? ` ${d.temp}` : "";
  const parts = [`${size}${temp} ${item.name}`];
  if (item.milk && d.milk !== milks[0]) parts.push(d.milk.toLowerCase());
  const syrup = syrups.find((s) => s.id === d.syrup);
  if (syrup && syrup.id !== "none") parts.push(`${syrup.name.toLowerCase()} syrup`);
  for (const e of d.extras) {
    const extra = extras.find((x) => x.id === e);
    if (extra) parts.push(extra.name.toLowerCase());
  }
  if (d.notes) parts.push(`"${d.notes}"`);
  return parts.join(", ");
}

export type OrderTotals = {
  flowers: number;
  drinks: number;
  delivery: number;
  total: number;
};

export function priceOrder(
  drinks: readonly DrinkSelection[],
  base: { flowers: number; delivery: number }
): OrderTotals {
  const drinkTotal = round2(drinks.reduce((sum, d) => sum + priceDrink(d), 0));
  return {
    flowers: base.flowers,
    drinks: drinkTotal,
    delivery: base.delivery,
    total: round2(base.flowers + drinkTotal + base.delivery),
  };
}

export function formatMoney(n: number): string {
  return `$${n.toFixed(2)}`;
}

/**
 * Validates untrusted input (from the API) into a DrinkSelection, or returns
 * null if anything is off. Anything the menu doesn't know is rejected rather
 * than guessed, so the server-side price always matches the menu.
 */
export function normalizeDrink(input: unknown): DrinkSelection | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const item = menuById.get(str(raw.item));
  if (!item) return null;

  const size = str(raw.size) as DrinkSize;
  if (!(size in sizeIndex)) return null;

  const temp = str(raw.temp) as DrinkTemp;
  if (!item.temps.includes(temp)) return null;

  const milk = item.milk ? str(raw.milk) : milks[0];
  if (!(milks as readonly string[]).includes(milk)) return null;

  const syrup = str(raw.syrup) || "none";
  if (!syrups.some((s) => s.id === syrup)) return null;

  const extraIds = Array.isArray(raw.extras) ? raw.extras.map(str) : [];
  const seen = new Set<string>();
  for (const e of extraIds) {
    if (!extras.some((x) => x.id === e) || seen.has(e)) return null;
    seen.add(e);
  }

  return {
    item: item.id,
    size,
    temp,
    milk,
    syrup,
    extras: extraIds,
    notes: str(raw.notes).slice(0, 200),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
