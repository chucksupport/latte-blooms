// Drink menus and price rules.
//
// Latte Blooms buys the drink at the coffee shop, so each shop gets its own
// menu with that shop's prices: estimated from the U.S. menus (late 2025) and
// rounded up to the nearest quarter to cover sales tax. The customer price is
// that plus `pricing.coffeeMarkup` (see lib/site.ts), rounded up to the quarter
// again. The owner confirms the final total by email before payment, so these
// only need to be close.
//
// To change a price: edit the numbers in that shop's menu. [small, medium, large].
// `icedPrices` is only needed where the shop charges more for the iced version.

import { pricing } from "@/lib/site";

export type DrinkSize = "small" | "medium" | "large";
export type DrinkTemp = "hot" | "iced";

export const coffeeShops = ["Starbucks", "Dunkin'", "A local coffee shop"] as const;
export type CoffeeShop = (typeof coffeeShops)[number];

export type MenuItem = {
  id: string;
  name: string;
  /** Shop price by size: [small, medium, large]. */
  prices: readonly [number, number, number];
  /** Iced price by size, when the shop charges differently for iced. */
  icedPrices?: readonly [number, number, number];
  /** Which temperatures the drink comes in. */
  temps: readonly DrinkTemp[];
  /** Whether a milk choice makes sense for this drink. */
  milk: boolean;
};

export type MenuOption = { id: string; name: string; price: number };

export type ShopSize = {
  id: DrinkSize;
  label: string;
  /** The shop's own name for the size, if it has one (Tall, Grande...). */
  alias?: string;
  /** Cup size in ounces, which differs for hot and iced at most shops. */
  oz: Record<DrinkTemp, number>;
};

export type ShopMenu = {
  shop: CoffeeShop;
  /** One line shown above the drink builder explaining where prices come from. */
  note: string;
  sizes: readonly ShopSize[];
  categories: readonly { category: string; items: readonly MenuItem[] }[];
  /** First entry is the shop's default and is left out of drink descriptions. */
  milks: readonly string[];
  /** Label for the flavor dropdown ("Flavor syrup" vs Dunkin's swirls and shots). */
  flavorLabel: string;
  /** First entry must be the "none" option. */
  flavors: readonly MenuOption[];
  extras: readonly MenuOption[];
  /** Item id a new drink starts on. */
  defaultItem: string;
};

const starbucks: ShopMenu = {
  shop: "Starbucks",
  note: "Prices are estimated from Starbucks' menu and may change with the season.",
  sizes: [
    { id: "small", label: "Small", alias: "Tall", oz: { hot: 12, iced: 12 } },
    { id: "medium", label: "Medium", alias: "Grande", oz: { hot: 16, iced: 16 } },
    { id: "large", label: "Large", alias: "Venti", oz: { hot: 20, iced: 24 } },
  ],
  categories: [
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
  ],
  // Starbucks dropped its non-dairy milk surcharge in late 2024, so milk is free.
  milks: [
    "Shop standard (2%)",
    "Whole milk",
    "Nonfat milk",
    "Oat milk",
    "Almond milk",
    "Soy milk",
    "Coconut milk",
    "No milk",
  ],
  flavorLabel: "Flavor syrup",
  flavors: [
    { id: "none", name: "No flavor syrup", price: 0 },
    { id: "vanilla", name: "Vanilla", price: 0.8 },
    { id: "caramel", name: "Caramel", price: 0.8 },
    { id: "hazelnut", name: "Hazelnut", price: 0.8 },
    { id: "toffee-nut", name: "Toffee Nut", price: 0.8 },
    { id: "brown-sugar", name: "Brown Sugar", price: 0.8 },
    { id: "sf-vanilla", name: "Sugar-free Vanilla", price: 0.8 },
    { id: "pumpkin", name: "Pumpkin Spice (seasonal)", price: 0.8 },
  ],
  extras: [
    { id: "extra-shot", name: "Extra espresso shot", price: 1.25 },
    { id: "cold-foam", name: "Cold foam", price: 1.25 },
    { id: "whip", name: "Whipped cream", price: 0 },
    { id: "decaf", name: "Decaf", price: 0 },
  ],
  defaultItem: "latte",
};

// Dunkin' prices vary more by location than Starbucks'; these are typical
// Ohio prices. Iced drinks come in bigger cups and cost a bit more.
const dunkin: ShopMenu = {
  shop: "Dunkin'",
  note: "Prices are estimated from Dunkin's menu and vary a little by location.",
  sizes: [
    { id: "small", label: "Small", oz: { hot: 10, iced: 16 } },
    { id: "medium", label: "Medium", oz: { hot: 14, iced: 24 } },
    { id: "large", label: "Large", oz: { hot: 20, iced: 32 } },
  ],
  categories: [
    {
      category: "Hot coffee & espresso",
      items: [
        { id: "brewed", name: "Original Blend Coffee", prices: [2.5, 3.0, 3.25], temps: ["hot"], milk: true },
        { id: "dark-roast", name: "Dark Roast Coffee", prices: [2.5, 3.0, 3.25], temps: ["hot"], milk: true },
        { id: "americano", name: "Americano", prices: [3.5, 4.0, 4.5], icedPrices: [3.75, 4.25, 4.75], temps: ["hot", "iced"], milk: true },
        { id: "latte", name: "Latte", prices: [4.25, 4.75, 5.25], icedPrices: [4.5, 5.25, 5.5], temps: ["hot", "iced"], milk: true },
        { id: "cappuccino", name: "Cappuccino", prices: [4.25, 4.75, 5.25], icedPrices: [4.5, 5.25, 5.5], temps: ["hot", "iced"], milk: true },
        { id: "macchiato", name: "Macchiato", prices: [4.5, 5.25, 5.5], temps: ["hot", "iced"], milk: true },
        { id: "dunkalatte", name: "Dunkalatte", prices: [4.75, 5.25, 5.75], temps: ["hot", "iced"], milk: false },
        { id: "caramel-craze-latte", name: "Caramel Craze Signature Latte", prices: [5.0, 5.5, 6.0], temps: ["hot", "iced"], milk: true },
        { id: "blueberry-cobbler-latte", name: "Blueberry Cobbler Signature Latte", prices: [5.0, 5.5, 6.0], temps: ["hot", "iced"], milk: true },
        { id: "pumpkin-spice-latte", name: "Pumpkin Spice Signature Latte (seasonal)", prices: [5.0, 5.5, 6.0], temps: ["hot", "iced"], milk: true },
      ],
    },
    {
      category: "Iced coffee & cold brew",
      items: [
        { id: "iced-coffee", name: "Iced Coffee", prices: [3.5, 4.0, 4.25], temps: ["iced"], milk: true },
        { id: "cold-brew", name: "Cold Brew", prices: [4.25, 4.75, 5.25], temps: ["iced"], milk: true },
        { id: "sweet-cold-foam-cold-brew", name: "Cold Brew with Sweet Cold Foam", prices: [5.0, 5.5, 6.0], temps: ["iced"], milk: false },
      ],
    },
    {
      category: "Frozen",
      items: [
        { id: "frozen-coffee", name: "Frozen Coffee", prices: [4.75, 5.25, 5.75], temps: ["iced"], milk: true },
        { id: "frozen-chocolate", name: "Frozen Chocolate", prices: [4.5, 5.0, 5.5], temps: ["iced"], milk: true },
        { id: "frozen-matcha", name: "Frozen Matcha Latte", prices: [5.0, 5.5, 6.0], temps: ["iced"], milk: true },
      ],
    },
    {
      category: "Tea, cocoa & refreshers",
      items: [
        { id: "chai-latte", name: "Chai Latte", prices: [4.0, 4.75, 5.0], temps: ["hot", "iced"], milk: true },
        { id: "matcha-latte", name: "Matcha Latte", prices: [4.5, 5.0, 5.5], temps: ["hot", "iced"], milk: true },
        { id: "hot-tea", name: "Hot Tea", prices: [2.25, 2.75, 3.0], temps: ["hot"], milk: false },
        { id: "iced-tea", name: "Iced Tea", prices: [2.75, 3.25, 3.5], temps: ["iced"], milk: false },
        { id: "hot-chocolate", name: "Hot Chocolate", prices: [3.0, 3.5, 4.0], temps: ["hot"], milk: true },
        { id: "strawberry-dragonfruit", name: "Strawberry Dragonfruit Refresher", prices: [4.0, 4.5, 5.0], temps: ["iced"], milk: false },
        { id: "peach-passion-fruit", name: "Peach Passion Fruit Refresher", prices: [4.0, 4.5, 5.0], temps: ["iced"], milk: false },
        { id: "mango-pineapple", name: "Mango Pineapple Refresher", prices: [4.0, 4.5, 5.0], temps: ["iced"], milk: false },
      ],
    },
  ],
  // Dunkin' defaults coffee to cream and lattes to whole milk; some locations
  // still charge a little for oat and almond, which the owner confirms.
  milks: [
    "Shop standard",
    "Cream",
    "Whole milk",
    "Skim milk",
    "Oat milk",
    "Almond milk",
    "No milk",
  ],
  flavorLabel: "Flavor swirl or shot",
  flavors: [
    { id: "none", name: "No flavor", price: 0 },
    // Swirls are sweet and creamy; shots are unsweetened and free.
    { id: "caramel-swirl", name: "Caramel Swirl (sweet)", price: 0.6 },
    { id: "french-vanilla-swirl", name: "French Vanilla Swirl (sweet)", price: 0.6 },
    { id: "mocha-swirl", name: "Mocha Swirl (sweet)", price: 0.6 },
    { id: "hazelnut-swirl", name: "Hazelnut Swirl (sweet)", price: 0.6 },
    { id: "butter-pecan-swirl", name: "Butter Pecan Swirl (sweet)", price: 0.6 },
    { id: "pumpkin-swirl", name: "Pumpkin Swirl (sweet, seasonal)", price: 0.6 },
    { id: "french-vanilla-shot", name: "French Vanilla Shot (unsweetened)", price: 0 },
    { id: "hazelnut-shot", name: "Hazelnut Shot (unsweetened)", price: 0 },
    { id: "toasted-almond-shot", name: "Toasted Almond Shot (unsweetened)", price: 0 },
    { id: "blueberry-shot", name: "Blueberry Shot (unsweetened)", price: 0 },
    { id: "raspberry-shot", name: "Raspberry Shot (unsweetened)", price: 0 },
    { id: "coconut-shot", name: "Coconut Shot (unsweetened)", price: 0 },
  ],
  extras: [
    { id: "extra-shot", name: "Extra espresso shot", price: 1.0 },
    { id: "cold-foam", name: "Sweet cold foam", price: 0.75 },
    { id: "whip", name: "Whipped cream", price: 0 },
    { id: "decaf", name: "Decaf", price: 0 },
  ],
  defaultItem: "latte",
};

// We can't know a local shop's menu, so borrow Starbucks' as the estimate.
const local: ShopMenu = {
  ...starbucks,
  shop: "A local coffee shop",
  note:
    "We don't know your shop's menu, so prices below are based on Starbucks'. We'll match the drink as closely as we can and confirm the real price before you pay.",
};

export const shopMenus: Record<CoffeeShop, ShopMenu> = {
  Starbucks: starbucks,
  "Dunkin'": dunkin,
  "A local coffee shop": local,
};

export function isCoffeeShop(v: unknown): v is CoffeeShop {
  return typeof v === "string" && (coffeeShops as readonly string[]).includes(v);
}

export function getShopMenu(shop: CoffeeShop): ShopMenu {
  return shopMenus[shop];
}

export function getMenuItem(shop: CoffeeShop, id: string): MenuItem | undefined {
  for (const group of shopMenus[shop].categories) {
    const item = group.items.find((m) => m.id === id);
    if (item) return item;
  }
  return undefined;
}

export type DrinkSelection = {
  shop: CoffeeShop;
  item: string;
  size: DrinkSize;
  temp: DrinkTemp;
  milk: string;
  flavor: string;
  extras: string[];
  notes: string;
};

export function defaultDrink(shop: CoffeeShop = coffeeShops[0]): DrinkSelection {
  const menu = shopMenus[shop];
  const item = getMenuItem(shop, menu.defaultItem);
  return {
    shop,
    item: menu.defaultItem,
    size: "medium",
    temp: item?.temps[0] ?? "hot",
    milk: menu.milks[0],
    flavor: menu.flavors[0].id,
    extras: [],
    notes: "",
  };
}

/**
 * Carries a drink over to another shop's menu: keeps whatever that menu also
 * offers (same item id, size, temp, milk, flavor, extras) and falls back to
 * the shop's default drink when the item doesn't exist there.
 */
export function convertDrink(d: DrinkSelection, shop: CoffeeShop): DrinkSelection {
  if (d.shop === shop) return d;
  const converted = normalizeDrink(d, shop, { lenient: true });
  return converted ?? { ...defaultDrink(shop), notes: d.notes };
}

const sizeIndex: Record<DrinkSize, 0 | 1 | 2> = { small: 0, medium: 1, large: 2 };

/** The shop's base price for an item at a size and temperature. */
export function basePrice(item: MenuItem, size: DrinkSize, temp: DrinkTemp): number {
  const list = temp === "iced" && item.icedPrices ? item.icedPrices : item.prices;
  return list[sizeIndex[size]];
}

/** What the shop charges for this drink, before our markup. */
export function shopPrice(d: DrinkSelection): number {
  const menu = shopMenus[d.shop];
  const item = getMenuItem(d.shop, d.item);
  if (!item) return 0;
  let total = basePrice(item, d.size, d.temp);
  total += menu.flavors.find((f) => f.id === d.flavor)?.price ?? 0;
  for (const e of d.extras) total += menu.extras.find((x) => x.id === e)?.price ?? 0;
  return round2(total);
}

/** What the customer pays: shop price plus the coffee-run markup. */
export function priceDrink(d: DrinkSelection): number {
  const base = shopPrice(d);
  if (!base) return 0;
  return ceilQuarter(base * (1 + pricing.coffeeMarkup));
}

/** Customer price for one size of a menu item (for the size dropdown). */
export function priceForSize(item: MenuItem, size: DrinkSize, temp: DrinkTemp): number {
  return ceilQuarter(basePrice(item, size, temp) * (1 + pricing.coffeeMarkup));
}

export function describeDrink(d: DrinkSelection): string {
  const menu = shopMenus[d.shop];
  const item = getMenuItem(d.shop, d.item);
  if (!item) return "Unknown drink";
  const size = menu.sizes.find((s) => s.id === d.size)?.label ?? d.size;
  const temp = item.temps.length > 1 ? ` ${d.temp}` : "";
  const parts = [`${size}${temp} ${item.name}`];
  if (item.milk && d.milk !== menu.milks[0]) parts.push(d.milk.toLowerCase());
  const flavor = menu.flavors.find((f) => f.id === d.flavor);
  if (flavor && flavor.id !== "none") {
    // "Vanilla" reads better as "vanilla syrup"; Dunkin' names already say swirl/shot.
    const name = flavor.name.replace(/\s*\(.*\)$/, "").toLowerCase();
    parts.push(menu.flavorLabel === "Flavor syrup" ? `${name} syrup` : name);
  }
  for (const e of d.extras) {
    const extra = menu.extras.find((x) => x.id === e);
    if (extra) parts.push(extra.name.toLowerCase());
  }
  if (d.notes) parts.push(`"${d.notes}"`);
  return parts.join(", ");
}

export type OrderTotals = {
  flowers: number;
  drinks: number;
  delivery: number;
  tip: number;
  total: number;
};

export function priceOrder(
  drinks: readonly DrinkSelection[],
  tip = 0
): OrderTotals {
  const drinkTotal = round2(drinks.reduce((sum, d) => sum + priceDrink(d), 0));
  const safeTip = normalizeTip(tip);
  return {
    flowers: pricing.flowers,
    drinks: drinkTotal,
    delivery: pricing.delivery,
    tip: safeTip,
    total: round2(pricing.flowers + drinkTotal + pricing.delivery + safeTip),
  };
}

/** Tip as a percentage of flowers + coffee (not delivery), in dollars. */
export function tipForPercent(drinks: readonly DrinkSelection[], percent: number): number {
  const subtotal = pricing.flowers + drinks.reduce((s, d) => s + priceDrink(d), 0);
  return round2((subtotal * percent) / 100);
}

/** Clamps untrusted tip input to a sane dollar amount. */
export function normalizeTip(input: unknown): number {
  const n = typeof input === "string" ? Number(input) : input;
  if (typeof n !== "number" || !Number.isFinite(n) || n <= 0) return 0;
  return round2(Math.min(n, pricing.maxTip));
}

export function formatMoney(n: number): string {
  return `$${n.toFixed(2)}`;
}

/**
 * Validates untrusted input (from the API) into a DrinkSelection for the given
 * shop, or returns null if anything is off. Anything the shop's menu doesn't
 * know is rejected rather than guessed, so the server-side price always matches
 * the menu. With `lenient`, unknown options fall back to the menu's defaults
 * instead (used when a customer switches shops mid-order).
 */
export function normalizeDrink(
  input: unknown,
  shop: CoffeeShop,
  opts: { lenient?: boolean } = {}
): DrinkSelection | null {
  if (!input || typeof input !== "object") return null;
  const menu = shopMenus[shop];
  const raw = input as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const lenient = opts.lenient === true;

  const item = getMenuItem(shop, str(raw.item));
  if (!item) return null;

  const size = str(raw.size) as DrinkSize;
  if (!(size in sizeIndex)) return null;

  let temp = str(raw.temp) as DrinkTemp;
  if (!item.temps.includes(temp)) {
    if (!lenient) return null;
    temp = item.temps[0];
  }

  let milk = item.milk ? str(raw.milk) : menu.milks[0];
  if (!menu.milks.includes(milk)) {
    if (!lenient) return null;
    milk = menu.milks[0];
  }

  let flavor = str(raw.flavor) || "none";
  if (!menu.flavors.some((f) => f.id === flavor)) {
    if (!lenient) return null;
    flavor = "none";
  }

  const extraIds = Array.isArray(raw.extras) ? raw.extras.map(str) : [];
  const seen = new Set<string>();
  const extras: string[] = [];
  for (const e of extraIds) {
    if (!menu.extras.some((x) => x.id === e) || seen.has(e)) {
      if (!lenient) return null;
      continue;
    }
    seen.add(e);
    extras.push(e);
  }

  return {
    shop,
    item: item.id,
    size,
    temp,
    milk,
    flavor,
    extras,
    notes: str(raw.notes).slice(0, 200),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function ceilQuarter(n: number): number {
  return Math.ceil(n * 4 - 1e-9) / 4;
}
