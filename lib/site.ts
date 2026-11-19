// Central site configuration. Update contact details and pricing here.
export const siteConfig = {
  name: "Latte Blooms",
  tagline: "A little joy, delivered",
  description:
    "Send a little joy with Latte Blooms. Choose flowers, add their favorite coffee, and personalize a thoughtful delivery.",
  url: "https://latteblooms.com",
  phone: "(330) 201-8614",
  phoneHref: "tel:+13302018614",
  // TODO: replace with the owner's real inbox address
  email: "hello@latteblooms.com",
} as const;

// Pricing. Flowers are a flat price; each drink is priced from the menu in
// lib/menu.ts; delivery is flat inside the delivery radius and quoted beyond it.
// TODO: confirm the delivery radius (and where it's measured from) with the owner.
export const pricing = {
  flowers: 25,
  delivery: 8,
  deliveryRadiusMiles: 15,
  maxDrinks: 4,
} as const;

export const collections = [
  {
    id: "blush-sweet",
    name: "Blush & Sweet",
    description: "Soft pinks and a sweet, gentle feel.",
    petal: "#dca8a0",
    bg: "#f0e2dc",
  },
  {
    id: "simply-classic",
    name: "Simply Classic",
    description: "Simple neutrals with timeless charm.",
    petal: "#faf5e6",
    bg: "#eeeade",
  },
  {
    id: "sunshine-bunch",
    name: "Sunshine Bunch",
    description: "A cheerful little burst of brightness.",
    petal: "#dfb34e",
    bg: "#f4e6c4",
  },
  {
    id: "seasonal-surprise",
    name: "Seasonal Surprise",
    description: "A fresh mix inspired by the season.",
    petal: "#c89982",
    bg: "#e4e7dc",
  },
] as const;

export type CollectionName = (typeof collections)[number]["name"];
export const collectionNames = collections.map((c) => c.name) as CollectionName[];

export const occasions = [
  "Birthday",
  "Anniversary",
  "Just Because",
  "Thinking of You",
  "Thank You",
  "A Little Pick-Me-Up",
  "Congratulations",
  "New Job or Promotion",
  "Graduation",
  "Housewarming",
  "New Baby",
  "Engagement",
  "Get Well Soon",
  "Sympathy & Comfort",
  "Teacher Appreciation",
  "Nurse Appreciation",
  "Employee Appreciation",
  "Mother’s Day",
  "Valentine’s Day",
  "Galentine’s Day",
  "Other",
] as const;

export const timeWindows = ["Morning", "Afternoon", "Flexible"] as const;

export const navLinks = [
  { href: "/#flowers", label: "The collections" },
  { href: "/#how", label: "How it works" },
] as const;
