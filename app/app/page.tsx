import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Save to your phone",
  description: `Add ${siteConfig.name} to your home screen to open it like an app.`,
};

export default function SaveToPhonePage() {
  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 md:py-12">
      <h1 className="text-[38px]">{siteConfig.name}, on your phone</h1>
      <p className="mt-3 text-muted-foreground">
        Keep thoughtful gifting a tap away. Save this website to your home
        screen to open it like an app.
      </p>

      <section className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="text-[28px]">On iPhone or iPad</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Open this website in <strong className="text-foreground">Safari</strong>.
          </li>
          <li>
            Tap <strong className="text-foreground">Share</strong> (the square
            with an upward arrow). Depending on your Safari layout, it may be
            inside the menu.
          </li>
          <li>
            Choose <strong className="text-foreground">Add to Home Screen</strong>,
            then tap <strong className="text-foreground">Add</strong>.
          </li>
        </ol>
      </section>

      <section className="mt-5 rounded-xl border border-border bg-card p-6">
        <h2 className="text-[28px]">On Android</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Open this website in Chrome. Tap the three-dot menu, then{" "}
          <strong className="text-foreground">Add to home screen</strong> or{" "}
          <strong className="text-foreground">Install app</strong>, if offered.
        </p>
      </section>

      <section className="mt-5 rounded-xl border border-border bg-card p-6">
        <h2 className="text-[28px]">Ready to send a little joy?</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Choose a bouquet, add their coffee order, and tell us where it&apos;s
          going. We confirm the total before payment.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/#book">Choose a gift</Link>
        </Button>
      </section>
    </div>
  );
}
