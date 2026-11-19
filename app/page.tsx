import Image from "next/image";
import Link from "next/link";

import { BouquetProvider } from "@/components/bouquet-context";
import { CollectionGrid } from "@/components/collection-grid";
import { GiftRequestForm } from "@/components/gift-request-form";
import { Button } from "@/components/ui/button";
import { pricing, siteConfig } from "@/lib/site";

const steps = [
  {
    n: "01",
    title: "Choose their flowers",
    body: "Find the collection that suits their day.",
  },
  {
    n: "02",
    title: "Make it personal",
    body: "Add their coffee order, your message, and where to deliver.",
  },
  {
    n: "03",
    title: "Send your request",
    body: "Submit your request. We confirm availability and the total, then arrange payment and delivery with you directly.",
  },
];

export default function HomePage() {
  return (
    <BouquetProvider>
      {/* Hero */}
      <section className="mx-auto grid max-w-[1240px] items-center gap-7 px-[5%] pb-14 pt-9 md:grid-cols-2 md:gap-16 md:pt-16">
        <div>
          <p className="eyebrow">Flowers &bull; Coffee &bull; Thoughtful delivery</p>
          <h1 className="mt-4 text-[57px] tracking-[-2px] md:text-[clamp(48px,5.6vw,77px)]">
            A little bloom.
            <br />
            A little brew.
            <br />
            <em className="text-mocha">A whole lot of love.</em>
          </h1>
          <p className="mb-7 mt-6 max-w-[430px] text-muted-foreground">
            Fresh flowers and their favorite coffee, tucked into one sweet little
            carrier. A thoughtful surprise for someone who deserves it.
          </p>
          <Button asChild size="xl">
            <Link href="#flowers">Create your surprise &#8599;</Link>
          </Button>
          <small className="mt-4 block text-xs text-[#8b7c6b]">
            Birthdays &middot; Thank-yous &middot; Just because
          </small>
        </div>
        <div>
          <Image
            src="/gift.jpg"
            alt="Example flower and coffee gift in a kraft carrier with a Latte Blooms label"
            width={1100}
            height={1005}
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="h-[350px] w-full rounded-t-[160px] rounded-b-[10px] object-cover md:h-[500px]"
          />
          <small className="mt-4 block text-xs text-sand">
            Illustrative gift mockup. Final flowers and coffee may vary.
          </small>
        </div>
      </section>

      {/* Ribbon */}
      <div className="bg-ribbon px-4 py-4 text-center text-[11px] tracking-wider sm:text-[13px]">
        A favorite drink. A beautiful bunch. A reason to smile.
      </div>

      {/* Collections */}
      <section id="flowers" className="mx-auto max-w-[1240px] scroll-mt-4 px-[5%] py-10 md:py-16">
        <div className="md:flex md:items-end md:justify-between md:gap-8">
          <div>
            <p className="eyebrow">01 / Pick the petals</p>
            <h2 className="mt-4 text-[39px] md:text-[48px]">
              Which bunch feels like them?
            </h2>
          </div>
          <p className="mt-4 max-w-[390px] text-sm text-muted-foreground md:mt-0">
            Every gift starts with a ${pricing.flowers} signature bouquet and a
            personal note. Add their favorite coffee, plus ${pricing.delivery}{" "}
            delivery around {pricing.deliveryBase.split(",")[0]}. Choose your
            flower style below.
          </p>
        </div>
        <CollectionGrid />
        <p className="mt-4 text-xs text-sand">
          Collections shown are samples. Flowers vary with availability.
        </p>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-[1240px] scroll-mt-4 px-[5%] pb-10 pt-1 md:pb-16">
        <p className="eyebrow">The sweetest things are simple</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3 md:gap-9">
          {steps.map((s) => (
            <div key={s.n}>
              <span className="font-serif text-[32px] italic text-caramel">
                {s.n}
              </span>
              <h3 className="mt-2 text-[27px]">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="scroll-mt-4 border-t border-border bg-muted">
        <div className="mx-auto grid max-w-[1240px] gap-6 px-[5%] py-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-16">
          <aside>
            <p className="eyebrow">02 / Add a personal touch</p>
            <h2 className="mt-4 text-[39px] md:text-[48px]">
              Let&apos;s make
              <br />
              their day.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              A little encouragement, a big celebration, or a simple
              &ldquo;thinking of you.&rdquo; Tell us what you have in mind.
            </p>
            <Image
              src="/logo.png"
              alt={siteConfig.name}
              width={140}
              height={140}
              className="mt-5 hidden rounded-full md:block"
            />
            <p className="mt-5 text-sm text-muted-foreground">
              Questions?{" "}
              <a href={siteConfig.phoneHref} className="underline">
                {siteConfig.phone}
              </a>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Requests are subject to confirmation. Delivery area, time, and
              pricing will be confirmed directly.
            </p>
          </aside>
          <GiftRequestForm />
        </div>
      </section>
    </BouquetProvider>
  );
}
