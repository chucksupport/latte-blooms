"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { useBouquet } from "@/components/bouquet-context";
import { DrinkBuilder, selectClass } from "@/components/drink-builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { GiftRequest } from "@/lib/email";
import {
  coffeeShops,
  defaultDrink,
  describeDrink,
  formatMoney,
  priceDrink,
  priceOrder,
  tipForPercent,
  type DrinkSelection,
} from "@/lib/menu";
import {
  collections,
  occasions,
  pricing,
  siteConfig,
  timeWindows,
  type CollectionName,
} from "@/lib/site";

type Status = "idle" | "review" | "submitting" | "success" | "error";

type TextKey = Exclude<keyof GiftRequest, "drinks">;

const FIELDS: { key: TextKey; label: string }[] = [
  { key: "occasion", label: "Occasion" },
  { key: "occasionDetails", label: "Occasion details" },
  { key: "bouquet", label: "Bouquet collection" },
  { key: "coffeeShop", label: "Coffee shop" },
  { key: "coffeeShopDetails", label: "Shop location or name" },
  { key: "giftNote", label: "Gift note" },
  { key: "recipient", label: "Recipient" },
  { key: "address", label: "Delivery address" },
  { key: "deliveryDate", label: "Preferred delivery date" },
  { key: "timeWindow", label: "Preferred time window" },
  { key: "instructions", label: "Delivery instructions" },
  { key: "senderName", label: "Your name" },
  { key: "email", label: "Your email" },
  { key: "senderPhone", label: "Your phone" },
];

function todayIso() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

type TipChoice = "none" | `${number}` | "custom";

function PriceSummary({
  drinks,
  tip,
}: {
  drinks: DrinkSelection[];
  tip: number;
}) {
  const totals = priceOrder(drinks, tip);
  const drinkLabel = `${drinks.length} ${drinks.length === 1 ? "drink" : "drinks"}`;
  return (
    <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 rounded-lg border border-border bg-white/60 p-4 text-sm">
      <dt>Signature bouquet</dt>
      <dd className="text-right">{formatMoney(totals.flowers)}</dd>
      <dt>Coffee ({drinkLabel})</dt>
      <dd className="text-right">{formatMoney(totals.drinks)}</dd>
      <dt>{`Delivery (within ${pricing.deliveryRadiusMiles} miles of ${pricing.deliveryBase})`}</dt>
      <dd className="text-right">{formatMoney(totals.delivery)}</dd>
      {totals.tip > 0 ? (
        <>
          <dt>Tip</dt>
          <dd className="text-right">{formatMoney(totals.tip)}</dd>
        </>
      ) : null}
      <dt className="mt-2 border-t border-border pt-2 font-semibold">
        Estimated total
      </dt>
      <dd className="mt-2 border-t border-border pt-2 text-right font-semibold">
        {formatMoney(totals.total)}
      </dd>
    </dl>
  );
}

function TipPicker({
  drinks,
  choice,
  custom,
  onChoice,
  onCustom,
}: {
  drinks: DrinkSelection[];
  choice: TipChoice;
  custom: string;
  onChoice: (c: TipChoice) => void;
  onCustom: (v: string) => void;
}) {
  const options: { value: TipChoice; label: string; hint?: string }[] = [
    { value: "none", label: "No tip" },
    ...pricing.tipPercents.map((p) => ({
      value: `${p}` as TipChoice,
      label: `${p}%`,
      hint: formatMoney(tipForPercent(drinks, p)),
    })),
    { value: "custom", label: "Other" },
  ];
  const pill =
    "cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground";
  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-medium">
        Add a tip?{" "}
        <span className="font-normal text-muted-foreground">(optional)</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className={`${pill} border-input bg-white`}>
            <input
              type="radio"
              name="tipChoice"
              value={o.value}
              checked={choice === o.value}
              onChange={() => onChoice(o.value)}
              className="sr-only"
            />
            {o.label}
            {o.hint ? <span className="ml-1 opacity-75">{o.hint}</span> : null}
          </label>
        ))}
      </div>
      {choice === "custom" ? (
        <div className="flex items-center gap-2">
          <Label htmlFor="customTip" className="sr-only">
            Custom tip amount
          </Label>
          <span className="text-sm">$</span>
          <Input
            id="customTip"
            type="number"
            inputMode="decimal"
            min={0}
            max={pricing.maxTip}
            step="0.01"
            value={custom}
            onChange={(e) => onCustom(e.target.value)}
            placeholder="0.00"
            className="w-32"
          />
        </div>
      ) : null}
      <p className="text-xs text-sand">
        Tips go straight to the person picking up and delivering your gift.
      </p>
    </fieldset>
  );
}

export function GiftRequestForm() {
  const { bouquet, setBouquet } = useBouquet();
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<GiftRequest | null>(null);
  const [drinks, setDrinks] = React.useState<DrinkSelection[]>(() => [
    defaultDrink(),
  ]);
  const [coffeeShop, setCoffeeShop] = React.useState<string>(coffeeShops[0]);
  const [tipChoice, setTipChoice] = React.useState<TipChoice>("none");
  const [customTip, setCustomTip] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);

  const tip =
    tipChoice === "none"
      ? 0
      : tipChoice === "custom"
        ? Math.max(0, Math.min(Number(customTip) || 0, pricing.maxTip))
        : tipForPercent(drinks, Number(tipChoice));
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (status === "review" || status === "submitting") {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [status]);

  function handleReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    setDraft({
      occasion: get("occasion"),
      occasionDetails: get("occasionDetails"),
      bouquet: get("bouquet"),
      coffeeShop: get("coffeeShop"),
      coffeeShopDetails: get("coffeeShopDetails"),
      drinks,
      tip,
      giftNote: get("giftNote"),
      recipient: get("recipient"),
      address: get("address"),
      deliveryDate: get("deliveryDate"),
      timeWindow: get("timeWindow"),
      instructions: get("instructions"),
      email: get("email"),
      senderName: get("senderName"),
      senderPhone: get("senderPhone"),
    });
    setError(null);
    setStatus("review");
  }

  async function handleSubmit() {
    if (!draft) return;
    setStatus("submitting");
    setError(null);
    const website = formRef.current
      ? String(new FormData(formRef.current).get("website") ?? "")
      : "";

    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, website }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      formRef.current?.reset();
      setBouquet("");
      setDrinks([defaultDrink()]);
      setCoffeeShop(coffeeShops[0]);
      setTipChoice("none");
      setCustomTip("");
      setStatus("success");
    } catch (err) {
      setStatus("review");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="size-12 text-olive" />
        <h3 className="text-[27px]">Your little surprise is on its way!</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          We received your gift request. We&apos;ll email you shortly to confirm
          availability and your final total. Questions? Call or
          text{" "}
          <a href={siteConfig.phoneHref} className="underline">
            {siteConfig.phone}
          </a>
          .
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          Send another gift
        </Button>
      </div>
    );
  }

  const draftTotals = draft ? priceOrder(draft.drinks, draft.tip) : null;

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleReview}
        className="relative rounded-xl border border-border bg-card p-5 sm:p-8"
      >
        <p className="mb-4 text-xs text-sand">
          Submit your gift request to receive a confirmation email. We confirm
          the total before payment.
        </p>

        <fieldset className="mb-6 grid gap-4">
          <legend className="mb-3 font-serif text-[27px] font-medium">
            Your gift
          </legend>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">
              ${pricing.flowers} signature bouquet
            </strong>{" "}
            + their coffee +{" "}
            <strong className="text-foreground">
              ${pricing.delivery} delivery
            </strong>{" "}
            {`within ${pricing.deliveryRadiusMiles} miles of ${pricing.deliveryBase}. Farther out? We'll quote delivery before you pay.`}
          </p>

          <div className="grid gap-2">
            <Label htmlFor="occasion">
              What&apos;s the occasion?{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <select
              id="occasion"
              name="occasion"
              defaultValue=""
              className={selectClass}
            >
              <option value="">Choose an occasion</option>
              {occasions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="occasionDetails">
              Occasion details{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              id="occasionDetails"
              name="occasionDetails"
              maxLength={200}
              placeholder="Tell us more, or describe another occasion"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bouquet">Bouquet collection *</Label>
            <select
              id="bouquet"
              name="bouquet"
              required
              value={bouquet}
              onChange={(e) => setBouquet(e.target.value as CollectionName | "")}
              className={selectClass}
            >
              <option value="">Choose a collection</option>
              {collections.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="giftNote">
              Gift note{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id="giftNote"
              name="giftNote"
              maxLength={500}
              rows={3}
              placeholder="What would you like the card to say? Include who it's from."
            />
          </div>
        </fieldset>

        <fieldset className="mb-6 grid gap-4">
          <legend className="mb-3 font-serif text-[27px] font-medium">
            Their coffee
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="coffeeShop">Coffee shop *</Label>
              <select
                id="coffeeShop"
                name="coffeeShop"
                required
                value={coffeeShop}
                onChange={(e) => setCoffeeShop(e.target.value)}
                className={selectClass}
              >
                {coffeeShops.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="coffeeShopDetails">
                Which location?{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="coffeeShopDetails"
                name="coffeeShopDetails"
                maxLength={150}
                placeholder={
                  coffeeShop === coffeeShops[0]
                    ? "Their usual Starbucks, if they have one"
                    : "Shop name and town"
                }
              />
            </div>
          </div>
          {coffeeShop !== coffeeShops[0] ? (
            <p className="text-xs text-sand">
              Prices below are based on Starbucks&apos; menu. We&apos;ll match
              the drink as closely as we can at {coffeeShop === coffeeShops[1] ? coffeeShop : "your shop"} and
              confirm the actual price before you pay.
            </p>
          ) : null}

          <DrinkBuilder drinks={drinks} onChange={setDrinks} />

          <TipPicker
            drinks={drinks}
            choice={tipChoice}
            custom={customTip}
            onChoice={setTipChoice}
            onCustom={setCustomTip}
          />

          <PriceSummary drinks={drinks} tip={tip} />
          <p className="text-xs text-sand">
            Drink prices include our coffee-run fee and are based on the
            shop&apos;s menu, so they may change with the season. Your final
            total is confirmed by email before payment.
          </p>
        </fieldset>

        <fieldset className="mb-6 grid gap-4">
          <legend className="mb-3 font-serif text-[27px] font-medium">
            Where&apos;s the surprise going?
          </legend>

          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient&apos;s name *</Label>
            <Input
              id="recipient"
              name="recipient"
              required
              maxLength={100}
              autoComplete="off"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Delivery address *</Label>
            <Input
              id="address"
              name="address"
              required
              maxLength={250}
              placeholder="Street, apartment/suite, city, ZIP"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="deliveryDate">Preferred delivery date *</Label>
              <Input
                id="deliveryDate"
                name="deliveryDate"
                type="date"
                required
                onFocus={(e) => {
                  e.currentTarget.min = todayIso();
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timeWindow">Preferred time window *</Label>
              <select
                id="timeWindow"
                name="timeWindow"
                required
                defaultValue=""
                className={selectClass}
              >
                <option value="">Select a preference</option>
                {timeWindows.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="instructions">Delivery instructions</Label>
            <Textarea
              id="instructions"
              name="instructions"
              maxLength={500}
              rows={3}
              placeholder="Workplace, reception desk, recipient contact, or anything helpful..."
            />
          </div>
        </fieldset>

        <fieldset className="mb-6 grid gap-4">
          <legend className="mb-3 font-serif text-[27px] font-medium">
            Your details
          </legend>

          <div className="grid gap-2">
            <Label htmlFor="email">Your email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="Your confirmation and delivery updates go here"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="senderName">Your name *</Label>
              <Input
                id="senderName"
                name="senderName"
                required
                maxLength={100}
                autoComplete="name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="senderPhone">Your phone number *</Label>
              <Input
                id="senderPhone"
                name="senderPhone"
                type="tel"
                required
                maxLength={30}
                autoComplete="tel"
              />
            </div>
          </div>
        </fieldset>

        {/* Honeypot: hidden from real users, bots tend to fill it. */}
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label>
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <Button type="submit" size="xl" className="w-full">
          Review my gift request &#8599;
        </Button>
        <p className="mt-3 text-xs text-sand">
          Review your details, then submit your request. We confirm the full
          total before payment. Your delivery is booked after availability is
          confirmed and payment is received.
        </p>
      </form>

      <dialog
        ref={dialogRef}
        onClose={() => {
          if (status === "review") setStatus("idle");
        }}
        className="m-auto w-[calc(100%-32px)] max-w-[580px] rounded-xl border border-border bg-background p-6 text-foreground backdrop:bg-[#271b13aa] sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[27px]">Your little surprise</h3>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            aria-label="Close review"
            className="rounded px-3 py-1 text-xl leading-none hover:bg-accent"
          >
            &times;
          </button>
        </div>
        {draftTotals ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Review your request, then submit it. Estimated total{" "}
            <strong className="text-foreground">
              {formatMoney(draftTotals.total)}
            </strong>{" "}
            ({formatMoney(draftTotals.flowers)} flowers +{" "}
            {formatMoney(draftTotals.drinks)} coffee +{" "}
            {formatMoney(draftTotals.delivery)} delivery
            {draftTotals.tip > 0 ? ` + ${formatMoney(draftTotals.tip)} tip` : ""}
            ). We confirm availability and your final total before payment.
          </p>
        ) : null}
        {draft ? (
          <dl className="mt-4 max-h-[45vh] overflow-auto rounded-md border border-border bg-white p-4 text-sm">
            {FIELDS.map(({ key, label }) => {
              const value = draft[key];
              if (!value) return null;
              return (
                <div key={key} className="mb-2 grid gap-0.5 last:mb-0">
                  <dt className="text-xs font-semibold text-sand">{label}</dt>
                  <dd className="whitespace-pre-wrap">{value}</dd>
                  {key === "coffeeShopDetails" || (key === "coffeeShop" && !draft.coffeeShopDetails) ? (
                    <>
                      <dt className="mt-2 text-xs font-semibold text-sand">
                        Drinks
                      </dt>
                      <dd>
                        <ol className="list-decimal pl-5">
                          {draft.drinks.map((d, i) => (
                            <li key={i}>
                              {describeDrink(d)}{" "}
                              <span className="text-muted-foreground">
                                ({formatMoney(priceDrink(d))})
                              </span>
                            </li>
                          ))}
                        </ol>
                      </dd>
                    </>
                  ) : null}
                </div>
              );
            })}
          </dl>
        ) : null}
        {error ? (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Button
            type="button"
            size="lg"
            onClick={handleSubmit}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="animate-spin" />
                Sending...
              </>
            ) : (
              "Submit gift request"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setStatus("idle")}
            disabled={status === "submitting"}
          >
            Edit details
          </Button>
        </div>
        <p className="mt-4 text-xs text-sand">
          After submitting, you&apos;ll get an email copy of your request. We
          reply to confirm the total and arrange payment.
        </p>
      </dialog>
    </>
  );
}
