"use client";

import { BouquetArt } from "@/components/bouquet-art";
import { useBouquet } from "@/components/bouquet-context";
import { collections } from "@/lib/site";
import { cn } from "@/lib/utils";

export function CollectionGrid() {
  const { bouquet, setBouquet } = useBouquet();

  return (
    <div className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
      {collections.map((c) => {
        const selected = bouquet === c.name;
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={selected}
            onClick={() => {
              setBouquet(c.name);
              document
                .getElementById("book")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={cn(
              "overflow-hidden rounded-lg border border-border bg-card pb-5 text-left transition-shadow hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/50",
              selected && "border-2 border-primary shadow-[0_0_0_3px_#ecd2c7]"
            )}
          >
            <div
              className="grid h-[150px] place-items-center sm:h-[190px]"
              style={{ backgroundColor: c.bg }}
            >
              <BouquetArt petal={c.petal} />
            </div>
            <h3 className="mx-4 mt-4 text-[23px] sm:text-[26px]">{c.name}</h3>
            <p className="mx-4 mt-2 min-h-[42px] text-[13px] text-muted-foreground">
              {c.description}
            </p>
            <small className="mx-4 mt-3 block text-[11px] font-semibold uppercase tracking-wider">
              {selected ? "Selected" : "Choose this bunch"} &#8599;
            </small>
          </button>
        );
      })}
    </div>
  );
}
