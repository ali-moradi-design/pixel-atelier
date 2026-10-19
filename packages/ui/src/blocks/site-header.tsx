"use client";

import { cx } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "../components/button.tsx";
import { FullScreenMenu, type MenuLink } from "../components/full-screen-menu.tsx";

export interface SiteHeaderProps extends HTMLAttributes<HTMLElement> {
  /** The logo or site name, linked to the home page by you. */
  brand: ReactNode;
  /** Main navigation. On phones it moves into a full-screen menu. */
  links: MenuLink[];
  /** Content at the end: a call to action, a theme switch, a search button. */
  actions?: ReactNode;
  /**
   * Stick to the top while scrolling, with a translucent background.
   * @default true
   */
  sticky?: boolean;
  /** Content under the links in the phone menu (contact, social). */
  menuFooter?: ReactNode;
}

/**
 * A site header: brand, navigation and actions. On phones the links move into
 * the kit's full-screen menu (cells dissolve, labels roll).
 *
 * @example
 * ```tsx
 * <SiteHeader brand={<a href="/"><Logo /></a>} links={[{ label: "Work", href: "/work" }]} actions={<Button size="sm">Contact</Button>} />
 * ```
 */
export function SiteHeader({
  brand,
  links,
  actions,
  sticky = true,
  menuFooter,
  className,
  ...props
}: SiteHeaderProps) {
  return (
    <header
      className={cx(
        "z-40 border-b border-pa-border",
        sticky && "sticky top-0 bg-pa-bg/85 backdrop-blur",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
        {brand}
        <nav
          aria-label="Main"
          className="hidden items-center gap-6 text-[0.8125rem] md:flex"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={l.current ? "page" : undefined}
              className="pa-link-px text-pa-muted outline-none hover:text-pa-text focus-visible:text-pa-text aria-[current=page]:text-pa-text"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          {actions}
          <div className="md:hidden">
            <FullScreenMenu
              trigger={<Button size="sm">Menu</Button>}
              brand={brand}
              links={links}
              footer={menuFooter}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
