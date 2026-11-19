import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { navLinks, siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-[5%] py-3.5">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt={`${siteConfig.name} logo`}
            width={62}
            height={62}
            priority
            className="size-12 rounded-full sm:size-[62px]"
          />
          <span className="whitespace-nowrap font-serif text-[23px] font-semibold sm:text-[26px]">
            {siteConfig.name}
          </span>
        </Link>
        <nav className="flex items-center gap-7 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden hover:underline md:inline"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="lg" className="text-xs sm:text-sm">
            <Link href="/#book">Send a little joy &#8599;</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
