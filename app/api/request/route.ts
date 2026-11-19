import { NextResponse } from "next/server";

import { sendGiftRequest, type GiftRequest } from "@/lib/email";
import { collectionNames, occasions, timeWindows } from "@/lib/site";

type Body = Partial<Record<keyof GiftRequest | "website", unknown>>;

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request body.");
  }

  // Honeypot: real users never fill this hidden field.
  if (str(body.website, 10)) {
    return NextResponse.json({ ok: true });
  }

  const data: GiftRequest = {
    occasion: str(body.occasion, 60),
    occasionDetails: str(body.occasionDetails, 200),
    bouquet: str(body.bouquet, 60),
    coffeeShop: str(body.coffeeShop, 150),
    coffeeOrder: str(body.coffeeOrder, 800),
    giftNote: str(body.giftNote, 500),
    recipient: str(body.recipient, 100),
    address: str(body.address, 250),
    deliveryDate: str(body.deliveryDate, 10),
    timeWindow: str(body.timeWindow, 20),
    instructions: str(body.instructions, 500),
    email: str(body.email, 254),
    senderName: str(body.senderName, 100),
    senderPhone: str(body.senderPhone, 30),
  };

  const required: (keyof GiftRequest)[] = [
    "bouquet",
    "coffeeShop",
    "coffeeOrder",
    "recipient",
    "address",
    "deliveryDate",
    "timeWindow",
    "email",
    "senderName",
    "senderPhone",
  ];
  for (const key of required) {
    if (!data[key]) return bad("Please fill in all required fields.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return bad("Please enter a valid email address.");
  }
  if (!(collectionNames as string[]).includes(data.bouquet)) {
    return bad("Please choose a bouquet collection.");
  }
  if (!(timeWindows as readonly string[]).includes(data.timeWindow)) {
    return bad("Please choose a delivery time window.");
  }
  if (
    data.occasion &&
    !(occasions as readonly string[]).includes(data.occasion)
  ) {
    return bad("Please choose a valid occasion.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.deliveryDate)) {
    return bad("Please choose a delivery date.");
  }
  const today = new Date();
  const todayIso = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  if (data.deliveryDate < todayIso) {
    return bad("Delivery date can't be in the past.");
  }

  const result = await sendGiftRequest(data);
  if (!result.ok) {
    return bad("Something went wrong sending your request.", 502);
  }

  return NextResponse.json({ ok: true });
}
