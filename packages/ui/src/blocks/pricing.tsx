"use client";

import { cx } from "class-variance-authority";
import { type HTMLAttributes, type ReactNode, useState } from "react";
import { Badge } from "../components/badge.tsx";
import { Button } from "../components/button.tsx";
import { Tab, TabList, Tabs } from "../components/tabs.tsx";
import { CheckIcon } from "../lib/icons.tsx";

/** One plan of a `Pricing` table. */
export interface Plan {
  /** Plan name. */
  name: string;
  /** Price per billing period, already formatted (e.g. `"€19"`), or one per period. */
  price: string | { monthly: string; yearly: string };
  /** Text after the price, e.g. `"/ month"`. Defaults to the period. */
  unit?: string;
  /** One line under the name. */
  description?: string;
  /** What is included. */
  features: string[];
  /** The plan's button. */
  cta: { label: string; href?: string; onClick?: () => void };
  /** Highlight this plan (accent border, primary button, badge). */
  featured?: boolean;
  /**
   * Text of the featured badge.
   * @default "Popular"
   */
  badge?: string;
}

export interface PricingProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Section heading (an `<h2>`). */
  title?: ReactNode;
  /** Text under the heading. */
  description?: ReactNode;
  /** The plans, left to right. */
  plans: Plan[];
  /**
   * Show a monthly/yearly switch (plans then give `price` per period).
   * @default false
   */
  billingToggle?: boolean;
  /**
   * Label of the yearly option, e.g. `"Yearly −20%"`.
   * @default "Yearly"
   */
  yearlyLabel?: string;
}

/**
 * A pricing table: plan cards with price, features and a call to action,
 * optionally with a monthly/yearly switch. The featured plan gets the accent.
 *
 * @example
 * ```tsx
 * <Pricing
 *   title="Simple pricing"
 *   billingToggle
 *   plans={[
 *     { name: "Studio", price: { monthly: "€19", yearly: "€15" }, features: ["All components"], cta: { label: "Start", href: "/start" } },
 *     { name: "Team", price: { monthly: "€49", yearly: "€39" }, features: ["Everything in Studio"], cta: { label: "Start" }, featured: true },
 *   ]}
 * />
 * ```
 */
export function Pricing({
  title,
  description,
  plans,
  billingToggle = false,
  yearlyLabel = "Yearly",
  className,
  ...props
}: PricingProps) {
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  return (
    <section
      className={cx("mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6", className)}
      {...props}
    >
      <header className="grid justify-items-center gap-4 text-center">
        {title && <h2 className="text-pb-h2">{title}</h2>}
        {description && (
          <p className="max-w-xl text-pb-body text-pb-muted">{description}</p>
        )}
        {billingToggle && (
          <Tabs
            value={period}
            onValueChange={(v) => setPeriod(v as "monthly" | "yearly")}
            variant="segmented"
          >
            <TabList aria-label="Billing period">
              <Tab value="monthly">Monthly</Tab>
              <Tab value="yearly">{yearlyLabel}</Tab>
            </TabList>
          </Tabs>
        )}
      </header>
      <ul
        className={cx("grid gap-4 md:grid-cols-2", plans.length >= 3 && "lg:grid-cols-3")}
      >
        {plans.map((p) => {
          const price = typeof p.price === "string" ? p.price : p.price[period];
          return (
            <li
              key={p.name}
              className={cx(
                "relative grid content-start gap-5 rounded-pb-lg border bg-pb-surface p-6",
                p.featured ? "border-pb-accent shadow-pb-2" : "border-pb-border",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-medium">{p.name}</h3>
                {p.featured && (
                  <Badge variant="accent" dot>
                    {p.badge ?? "Popular"}
                  </Badge>
                )}
              </div>
              {p.description && (
                <p className="-mt-3 text-[0.8125rem] text-pb-muted">{p.description}</p>
              )}
              <p className="flex items-baseline gap-1.5">
                <span className="text-[2.75rem] leading-none font-light tracking-[-0.03em] tabular-nums">
                  {price}
                </span>
                <span className="text-[0.8125rem] text-pb-muted">
                  {p.unit ??
                    (period === "monthly" ? "/ month" : "/ month, billed yearly")}
                </span>
              </p>
              <Button
                variant={p.featured ? "primary" : "secondary"}
                className="w-full"
                onClick={p.cta.onClick}
                asChild={Boolean(p.cta.href)}
              >
                {p.cta.href ? <a href={p.cta.href}>{p.cta.label}</a> : p.cta.label}
              </Button>
              <ul className="grid gap-2.5 border-t border-pb-border pt-5 text-[0.8125rem]">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-pb-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
