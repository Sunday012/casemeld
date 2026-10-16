"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Layers3,
  RefreshCw,
} from "lucide-react";
import { BrandGlyph } from "@/components/brand-glyph";
import { useComplaints } from "@/components/complaint-provider";
import { formatDate, priorityClass } from "@/lib/complaints";

export default function DashboardPage() {
  const { cases, error, ready, refresh } = useComplaints();
  const active = cases.filter((item) => item.status !== "Resolved").length;
  const urgentCases = cases
    .filter((item) => item.status !== "Resolved" && (item.priority === "Critical" || item.priority === "High"))
    .sort((a, b) => (a.priority === b.priority ? 0 : a.priority === "Critical" ? -1 : 1));
  const resolved = cases.filter((item) => item.status === "Resolved").length;
  const resolutionRate = cases.length ? Math.round((resolved / cases.length) * 100) : 0;
  const categories = Object.entries(
    cases.reduce<Record<string, number>>((totals, item) => {
      totals[item.category] = (totals[item.category] ?? 0) + 1;
      return totals;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const leadingCategory = categories[0]?.[0] ?? "No signal yet";
  const leadingCount = categories[0]?.[1] ?? 0;
  const recentActivity = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - offset));
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return cases.filter((item) => {
      const createdAt = new Date(item.createdAt);
      return createdAt >= date && createdAt < nextDate;
    }).length;
  });
  const maxRecentActivity = Math.max(...recentActivity, 0);

  return (
    <main className="workspace-shell">
      <section className="workspace-heading">
        <div>
          <div className="workspace-kicker">
            <span className="live-dot" /> Live workspace <span /> Updated from current cases
          </div>
          <h1>Complaint operations</h1>
          <p>Priorities, patterns, and the work that needs attention now.</p>
        </div>
        <div className="workspace-actions">
          <Link href="/cases" className="button button-ghost">Review cases</Link>
        </div>
      </section>

      {error && <section className="workspace-data-alert"><span><RefreshCw size={15} /> Live case data is unavailable: {error}</span><button type="button" onClick={() => void refresh()}>Try again</button></section>}

      <section className="workspace-metrics" aria-label="Case metrics">
        <article className="workspace-metric metric-dark">
          <div className="workspace-metric-head"><span>Active cases</span><span className="workspace-metric-icon"><Layers3 size={16} /></span></div>
          <strong>{ready && !error ? active : "—"}</strong>
          <div className="workspace-metric-foot"><span>Across {categories.length} categories</span><small>Live</small></div>
        </article>
        <article className="workspace-metric">
          <div className="workspace-metric-head"><span>Needs attention</span><span className="workspace-metric-icon warm"><AlertTriangle size={16} /></span></div>
          <strong>{ready && !error ? urgentCases.length : "—"}</strong>
          <div className="workspace-metric-foot"><span>High and critical</span><small className="metric-warn">Action</small></div>
        </article>
        <article className="workspace-metric">
          <div className="workspace-metric-head"><span>Resolved cases</span><span className="workspace-metric-icon blue"><CheckCircle2 size={16} /></span></div>
          <strong>{ready && !error ? resolved : "—"}</strong>
          <div className="workspace-metric-foot positive"><span>From the shared library</span><small>Live</small></div>
        </article>
        <article className="workspace-metric metric-chart">
          <div className="workspace-metric-head"><span>Resolution rate</span><span className="workspace-metric-icon plum"><CheckCircle2 size={16} /></span></div>
          <div className="workspace-metric-chartline">
            <strong>{ready && !error ? resolutionRate : "—"}{ready && !error && <small>%</small>}</strong>
            {maxRecentActivity > 0 && <div aria-hidden="true">{recentActivity.map((count, index) => <i key={index} style={{ height: `${Math.max(12, Math.round((count / maxRecentActivity) * 100))}%` }} />)}</div>}
          </div>
          <div className="workspace-metric-foot"><span>{resolved} resolved</span><small>7d</small></div>
        </article>
      </section>

      <section className="workspace-grid">
        <div className="workspace-main-column">
          <article className="workspace-panel priority-queue">
            <div className="workspace-panel-heading">
              <div><span className="section-label">Priority queue</span><h2>Cases that need a decision</h2></div>
              <Link href="/cases">Open case library <ArrowUpRight size={14} /></Link>
            </div>
            <div className="priority-list">
              {urgentCases.slice(0, 3).map((item) => (
                <Link href={`/cases/${item.id}`} className="priority-row" key={item.id}>
                  <span className={`priority-indicator ${item.priority === "Critical" ? "critical" : "high"}`} />
                  <span className="priority-case"><small>{item.id} · {item.channel}</small><strong>{item.title}</strong></span>
                  <span className="priority-owner"><small>Owner</small><strong>{item.owner}</strong></span>
                  <span className="priority-due"><Clock3 size={13} /><strong>{item.responseDue}</strong></span>
                  <ArrowRight className="priority-arrow" size={17} />
                </Link>
              ))}
              {urgentCases.length === 0 && (
                <div className="workspace-empty"><CheckCircle2 size={19} /><span><strong>Queue clear</strong><small>No high-priority cases need attention.</small></span></div>
              )}
            </div>
          </article>

          <article className="workspace-panel recent-work">
            <div className="workspace-panel-heading">
              <div><span className="section-label">Recent work</span><h2>Latest complaint activity</h2></div>
              <Link href="/cases">View all <ArrowRight size={14} /></Link>
            </div>
            <div className="workspace-table" aria-label="Recent complaints">
              <div className="workspace-table-head"><span>Case</span><span>Category</span><span>Priority</span><span>Status</span><span>Received</span></div>
              {cases.slice(0, 5).map((item) => (
                <Link href={`/cases/${item.id}`} className="workspace-table-row" key={item.id}>
                  <span className="case-title-cell"><small>{item.id}</small><strong>{item.title}</strong></span>
                  <span>{item.category}</span>
                  <span><b className={priorityClass(item.priority)}>{item.priority}</b></span>
                  <span><b className="status-badge">{item.status}</b></span>
                  <span>{formatDate(item.createdAt)}</span>
                </Link>
              ))}
            </div>
          </article>
        </div>

        <aside className="workspace-side-column">
          <article className="workspace-panel signal-mix" id="signals">
            <div className="workspace-panel-heading compact">
              <div><span className="section-label">Signal mix</span><h2>What is driving contact</h2></div>
              <span className="panel-count">{cases.length} total</span>
            </div>
            <div className="signal-leader"><span>Leading signal</span><strong>{leadingCategory}</strong></div>
            <div className="workspace-category-list">
              {categories.map(([category, count], index) => {
                const percentage = Math.round((count / Math.max(1, cases.length)) * 100);
                return (
                  <div className="workspace-category" key={category}>
                    <div><span className={`signal-dot signal-${index % 5}`} /><strong>{category}</strong><small>{count}</small></div>
                    <div className="workspace-progress"><span className={`signal-bg-${index % 5}`} style={{ width: `${Math.max(8, percentage)}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="workspace-brief" id="brief">
            <div className="brief-topline"><span><BrandGlyph size={14} /> CaseMeld brief</span><small>Live</small></div>
            <div className="brief-mark" aria-hidden="true"><i /><i /><i /></div>
            <h2>{cases.length ? `${leadingCategory} is the leading contact driver.` : "No complaint signal yet."}</h2>
            <p>{cases.length ? `${leadingCount} of ${cases.length} saved cases are in this category. ${urgentCases.length} active case${urgentCases.length === 1 ? "" : "s"} currently need high-priority attention.` : "Analyze and save complaints to build a live summary of the issues driving customer contact."}</p>
            <Link href={cases.length ? "/cases" : "/analyze"}>{cases.length ? "Review the cases" : "Analyze the first complaint"} <span><ArrowRight size={15} /></span></Link>
          </article>
        </aside>
      </section>
    </main>
  );
}
