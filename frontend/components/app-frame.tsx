"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpenText,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  Menu,
  Plus,
  ScanSearch,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";
import { AppHeader, Brand } from "@/components/app-header";
import { BrandGlyph } from "@/components/brand-glyph";
import { useComplaints } from "@/components/complaint-provider";
import { cn } from "@/lib/utils";

const workspaceNavigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analyze", href: "/analyze", icon: ScanSearch },
  { label: "Cases", href: "/cases", icon: BookOpenText },
];

function pageTitle(pathname: string) {
  if (pathname.startsWith("/analyze")) return "Analyze complaint";
  if (pathname.startsWith("/cases/")) return "Case details";
  if (pathname.startsWith("/cases")) return "Case library";
  return "Overview";
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cases, error, ready } = useComplaints();

  if (pathname === "/") {
    return <><AppHeader />{children}</>;
  }

  return (
    <div className="product-layout">
      <aside className={cn("product-sidebar", menuOpen && "is-open")}>
        <div className="product-sidebar-head">
          <Brand />
          <button type="button" className="sidebar-close" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={18} /></button>
        </div>

        <button className="workspace-switcher" type="button">
          <span className="workspace-avatar">CM</span>
          <span><strong>CaseMeld</strong><small>Complaint intelligence</small></span>
          <ChevronDown size={14} />
        </button>

        <nav className="product-nav" aria-label="Workspace navigation">
          <span className="product-nav-label">Workspace</span>
          {workspaceNavigation.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={cn("product-nav-link", active && "active")} onClick={() => setMenuOpen(false)}>
                <Icon size={17} />
                <span>{item.label}</span>
                {item.href === "/cases" && ready && !error && <small>{cases.length}</small>}
              </Link>
            );
          })}

          <span className="product-nav-label product-nav-label-spaced">Intelligence</span>
          <Link href="/dashboard#signals" className="product-nav-link" onClick={() => setMenuOpen(false)}><Activity size={17} /><span>Signals</span></Link>
          <Link href="/dashboard#brief" className="product-nav-link" onClick={() => setMenuOpen(false)}><BrandGlyph size={17} /><span>CaseMeld brief</span></Link>
        </nav>

        <div className="sidebar-system-card">
          <div><span className={cn("system-pulse", error && "offline")} /><strong>{error ? "Case API unavailable" : ready ? "Analysis online" : "Connecting…"}</strong></div>
          <p>{error ? "Live case data could not be loaded." : "Pinecone retrieval and persistent case storage are available."}</p>
          <span>{error ? "Check service status" : "Production workspace"}</span>
        </div>

        <div className="product-sidebar-foot">
          <button type="button"><CircleHelp size={16} /> Help & documentation</button>
          <button type="button"><Settings size={16} /> Workspace settings</button>
          <div className="sidebar-user"><span>FS</span><div><strong>Favour Sunday</strong><small>Workspace owner</small></div><ChevronDown size={14} /></div>
        </div>
      </aside>

      {menuOpen && <button className="product-sidebar-backdrop" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

      <section className="product-surface">
        <header className="product-topbar">
          <div className="product-topbar-context">
            <button type="button" className="sidebar-open" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={19} /></button>
            <span>CaseMeld</span><i>/</i><strong>{pageTitle(pathname)}</strong>
          </div>
          <div className="product-topbar-actions">
            <span className="topbar-status"><span className={error ? "offline" : ""} /> {error ? "Case API unavailable" : ready ? "Intelligence online" : "Connecting"}</span>
            <Link href="/analyze" className="button button-primary"><Plus size={16} /> New analysis</Link>
          </div>
        </header>
        <div className="product-content">{children}</div>
      </section>
    </div>
  );
}
