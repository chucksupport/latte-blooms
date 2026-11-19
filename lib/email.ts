import { Resend } from "resend";

import {
  describeDrink,
  formatMoney,
  priceDrink,
  priceOrder,
  type DrinkSelection,
} from "@/lib/menu";
import { pricing, siteConfig } from "@/lib/site";

/**
 * Thin wrapper around the Resend SDK that gracefully no-ops when no API key is
 * configured. In local dev (or any env without RESEND_API_KEY) the message is
 * logged instead of sent, so the request form keeps working end-to-end.
 */
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Where gift requests are delivered. Falls back to the placeholder inbox.
const toAddress = process.env.REQUEST_FORM_TO || siteConfig.email;

// Resend requires a verified sender. `onboarding@resend.dev` works out of the
// box for testing (owner inbox only); swap to a verified domain address once
// DNS is set up so customers can receive their confirmation copy too.
const fromAddress =
  process.env.REQUEST_FORM_FROM || `${siteConfig.name} <onboarding@resend.dev>`;
const canEmailCustomers = !fromAddress.includes("resend.dev");

export type GiftRequest = {
  occasion?: string;
  occasionDetails?: string;
  bouquet: string;
  coffeeShop: string;
  coffeeShopDetails?: string;
  drinks: DrinkSelection[];
  /** Optional tip in dollars, collected with payment. */
  tip: number;
  giftNote?: string;
  recipient: string;
  address: string;
  deliveryDate: string;
  timeWindow: string;
  instructions?: string;
  email: string;
  senderName: string;
  senderPhone: string;
};

type SendResult = { ok: true; skipped: boolean } | { ok: false; error: string };

export function formatGiftRequest(data: GiftRequest): string {
  const dash = (v?: string) => (v && v.trim() ? v.trim() : "-");
  const totals = priceOrder(data.drinks, data.tip);
  const shop = data.coffeeShopDetails
    ? `${data.coffeeShop} (${data.coffeeShopDetails})`
    : data.coffeeShop;
  const drinkLines = data.drinks.map(
    (d, i) => `  ${i + 1}. ${describeDrink(d)} - ${formatMoney(priceDrink(d))}`
  );
  return [
    "YOUR GIFT",
    `Occasion: ${dash(data.occasion)}`,
    `Occasion details: ${dash(data.occasionDetails)}`,
    `Bouquet collection: ${data.bouquet}`,
    `Coffee shop: ${shop}`,
    `Drinks (${data.drinks.length}):`,
    ...drinkLines,
    `Gift note: ${dash(data.giftNote)}`,
    "",
    "DELIVERY",
    `Recipient: ${data.recipient}`,
    `Delivery address: ${data.address}`,
    `Preferred date: ${data.deliveryDate}`,
    `Preferred time: ${data.timeWindow}`,
    `Instructions: ${dash(data.instructions)}`,
    "",
    "SENDER",
    `Name: ${data.senderName}`,
    `Email: ${data.email}`,
    `Phone: ${data.senderPhone}`,
    "",
    "ESTIMATED TOTAL",
    `Flowers: ${formatMoney(totals.flowers)}`,
    `Coffee: ${formatMoney(totals.drinks)}`,
    `Delivery (within ${pricing.deliveryRadiusMiles} miles of ${pricing.deliveryBase}): ${formatMoney(totals.delivery)}`,
    `Tip: ${totals.tip ? formatMoney(totals.tip) : "none"}`,
    `Total: ${formatMoney(totals.total)}`,
    "Drink prices include our coffee-run fee and are based on the shop's menu. The final total is confirmed before payment.",
  ].join("\n");
}

export async function sendGiftRequest(data: GiftRequest): Promise<SendResult> {
  const summary = formatGiftRequest(data);
  const ownerSubject = `New gift request from ${data.senderName} for ${data.recipient}`;
  const ownerText = [
    "A new flower & coffee gift request just came in.",
    "",
    summary,
    "",
    `Reply to this email to confirm availability and the total with ${data.senderName}.`,
  ].join("\n");

  const customerSubject = `We got your gift request for ${data.recipient}`;
  const customerText = [
    `Hi ${data.senderName},`,
    "",
    `Thanks for sending a little joy with ${siteConfig.name}! Here's what you requested:`,
    "",
    summary,
    "",
    "We'll confirm availability and your final total shortly. Your delivery is booked once it's confirmed and payment is received.",
    "",
    `Questions? Call or text ${siteConfig.phone}.`,
    "",
    `- ${siteConfig.name}`,
  ].join("\n");

  if (!resend) {
    // No API key configured - log instead of sending so dev still works.
    console.info(
      `[email] RESEND_API_KEY not set - gift request logged instead of sent.\nTo: ${toAddress}\nSubject: ${ownerSubject}\n${ownerText}`
    );
    return { ok: true, skipped: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo: data.email,
      subject: ownerSubject,
      text: ownerText,
    });

    if (error) {
      console.error("[email] Resend returned an error:", error);
      return { ok: false, error: error.message };
    }

    if (canEmailCustomers) {
      // Best-effort confirmation copy to the sender; a failure here shouldn't
      // fail the request since the owner already has it.
      const customer = await resend.emails.send({
        from: fromAddress,
        to: data.email,
        replyTo: toAddress,
        subject: customerSubject,
        text: customerText,
      });
      if (customer.error) {
        console.error("[email] Customer confirmation failed:", customer.error);
      }
    }

    return { ok: true, skipped: false };
  } catch (err) {
    console.error("[email] Failed to send gift request:", err);
    return { ok: false, error: "Failed to send email." };
  }
}
