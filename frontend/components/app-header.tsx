"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Plus, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Overview", href: "/dashboard" },
  { label: "Analyze", href: "/analyze" },
  { label: "Cases", href: "/cases" },
];

const marketingNavigation = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Who it helps", href: "#use-cases" },
];

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="CaseMeld home">
      <span className="brand-mark" aria-hidden="true">
        <span className="brand-signal" />
      </span>
      <span className="brand-wordmark"><span>Case</span><strong>Meld</strong></span>
    </Link>
  );
}

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isMarketingPage = pathname === "/";
  const links = isMarketingPage ? marketingNavigation : navigation;

  return (
    <header className={cn("app-header", isMarketingPage && "marketing-header")}>
      <div className="shell header-inner">
        <Brand />
        <nav className={isMarketingPage ? "marketing-nav" : "desktop-nav"} aria-label="Primary navigation">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("nav-link", !isMarketingPage && pathname === item.href && "active")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href={isMarketingPage ? "/dashboard" : "/analyze"} className="button button-primary header-action">
          {isMarketingPage ? <>Open workspace <ArrowRight size={16} aria-hidden="true" /></> : <><Plus size={17} aria-hidden="true" /> New analysis</>}
        </Link>
        <button
          className="mobile-menu-button"
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav shell" aria-label="Mobile navigation">
          {links.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          {isMarketingPage && <Link href="/dashboard" onClick={() => setOpen(false)}>Open workspace</Link>}
        </nav>
      )}
    </header>
  );
}
