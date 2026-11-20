"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  defaultDrink,
  formatMoney,
  getMenuItem,
  getShopMenu,
  priceDrink,
  priceForSize,
  type CoffeeShop,
  type DrinkSelection,
  type DrinkSize,
  type DrinkTemp,
  type ShopSize,
} from "@/lib/menu";
import { pricing } from "@/lib/site";

export const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

type Props = {
  shop: CoffeeShop;
  drinks: DrinkSelection[];
  onChange: (drinks: DrinkSelection[]) => void;
};

/** "Medium (Grande, 16 oz)" or "Medium (14 oz)". */
function sizeLabel(s: ShopSize, temp: DrinkTemp) {
  const detail = [s.alias, `${s.oz[temp]} oz`].filter(Boolean).join(", ");
  return `${s.label} (${detail})`;
}

export function DrinkBuilder({ shop, drinks, onChange }: Props) {
  const menu = getShopMenu(shop);

  function update(index: number, patch: Partial<DrinkSelection>) {
    const next = drinks.map((d, i) => {
      if (i !== index) return d;
      const merged = { ...d, ...patch };
      // Keep the drink consistent with what the menu allows for it.
      const item = getMenuItem(shop, merged.item);
      if (item) {
        if (!item.temps.includes(merged.temp)) merged.temp = item.temps[0];
        if (!item.milk) merged.milk = menu.milks[0];
      }
      return merged;
    });
    onChange(next);
  }

  function toggleExtra(index: number, id: string, on: boolean) {
    const current = drinks[index].extras;
    update(index, {
      extras: on ? [...current, id] : current.filter((e) => e !== id),
    });
  }

  return (
    <div className="grid gap-4">
      {drinks.map((drink, index) => {
        const item = getMenuItem(shop, drink.item);
        const n = `drink-${index}`;
        return (
          <div
            key={index}
            className="grid gap-3 rounded-lg border border-border bg-white/60 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-serif text-lg font-medium">
                Drink {index + 1}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {formatMoney(priceDrink(drink))}
                </span>
              </p>
              {drinks.length > 1 ? (
                <button
                  type="button"
                  onClick={() => onChange(drinks.filter((_, i) => i !== index))}
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-sand hover:bg-accent hover:text-foreground"
                >
                  <Trash2 className="size-3.5" /> Remove
                </button>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`${n}-item`}>Drink *</Label>
              <select
                id={`${n}-item`}
                value={drink.item}
                onChange={(e) => update(index, { item: e.target.value })}
                className={selectClass}
              >
                {menu.categories.map((group) => (
                  <optgroup key={group.category} label={group.category}>
                    {group.items.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor={`${n}-size`}>Size *</Label>
                <select
                  id={`${n}-size`}
                  value={drink.size}
                  onChange={(e) =>
                    update(index, { size: e.target.value as DrinkSize })
                  }
                  className={selectClass}
                >
                  {menu.sizes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {sizeLabel(s, drink.temp)}
                      {item
                        ? ` - ${formatMoney(priceForSize(item, s.id, drink.temp))}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {item && item.temps.length > 1 ? (
                <div className="grid gap-2">
                  <Label htmlFor={`${n}-temp`}>Hot or iced? *</Label>
                  <select
                    id={`${n}-temp`}
                    value={drink.temp}
                    onChange={(e) =>
                      update(index, { temp: e.target.value as DrinkTemp })
                    }
                    className={selectClass}
                  >
                    <option value="hot">Hot</option>
                    <option value="iced">Iced</option>
                  </select>
                </div>
              ) : null}

              {item?.milk ? (
                <div className="grid gap-2">
                  <Label htmlFor={`${n}-milk`}>Milk</Label>
                  <select
                    id={`${n}-milk`}
                    value={drink.milk}
                    onChange={(e) => update(index, { milk: e.target.value })}
                    className={selectClass}
                  >
                    {menu.milks.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="grid gap-2">
                <Label htmlFor={`${n}-flavor`}>{menu.flavorLabel}</Label>
                <select
                  id={`${n}-flavor`}
                  value={drink.flavor}
                  onChange={(e) => update(index, { flavor: e.target.value })}
                  className={selectClass}
                >
                  {menu.flavors.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                      {f.price ? ` (+${formatMoney(f.price)})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <fieldset className="grid gap-2">
              <legend className="text-sm font-medium">Extras</legend>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {menu.extras.map((x) => (
                  <label
                    key={x.id}
                    className="inline-flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={drink.extras.includes(x.id)}
                      onChange={(e) => toggleExtra(index, x.id, e.target.checked)}
                      className="size-4 accent-primary"
                    />
                    {x.name}
                    {x.price ? (
                      <span className="text-muted-foreground">
                        (+{formatMoney(x.price)})
                      </span>
                    ) : null}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-2">
              <Label htmlFor={`${n}-notes`}>
                Anything else about this drink?{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id={`${n}-notes`}
                value={drink.notes}
                maxLength={200}
                onChange={(e) => update(index, { notes: e.target.value })}
                placeholder="Light ice, extra hot, two pumps instead of four..."
              />
            </div>
          </div>
        );
      })}

      {drinks.length < pricing.maxDrinks ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange([...drinks, defaultDrink(shop)])}
          className="justify-self-start"
        >
          <Plus /> Add another drink
        </Button>
      ) : (
        <p className="text-xs text-sand">
          Online orders are limited to {pricing.maxDrinks} drinks. Sending
          coffee to a whole team? Call or text us for a group quote.
        </p>
      )}
    </div>
  );
}
