"use client";

import * as React from "react";

import type { CollectionName } from "@/lib/site";

type BouquetContextValue = {
  bouquet: CollectionName | "";
  setBouquet: (name: CollectionName | "") => void;
};

const BouquetContext = React.createContext<BouquetContextValue | null>(null);

/**
 * Shares the chosen bouquet between the collection cards (top of the page)
 * and the gift request form (bottom of the page).
 */
export function BouquetProvider({ children }: { children: React.ReactNode }) {
  const [bouquet, setBouquet] = React.useState<CollectionName | "">("");
  const value = React.useMemo(() => ({ bouquet, setBouquet }), [bouquet]);
  return (
    <BouquetContext.Provider value={value}>{children}</BouquetContext.Provider>
  );
}

export function useBouquet() {
  const ctx = React.useContext(BouquetContext);
  if (!ctx) {
    throw new Error("useBouquet must be used inside <BouquetProvider>");
  }
  return ctx;
}
