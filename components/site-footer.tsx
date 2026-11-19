import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-[5%] py-8 text-[13px] sm:flex-row sm:items-center sm:justify-between">
        <span>{siteConfig.name} · Thoughtful surprises, hand delivered.</span>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={siteConfig.phoneHref} className="underline-offset-4 hover:underline">
            {siteConfig.phone}
          </a>
          <Link href="/app" className="underline-offset-4 hover:underline">
            Save to your phone
          </Link>
        </div>
      </div>
    </footer>
  );
}
