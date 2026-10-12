"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Layers3, ShieldAlert, Sparkles, TrendingDown } from "lucide-react";
import { useComplaints } from "@/components/complaint-provider";
import { formatDate, priorityClass } from "@/lib/complaints";

export default function DashboardPage() {
  const { cases } = useComplaints();
  const active = cases.filter((item) => item.status !== "Resolved").length;
  const urgent = cases.filter((item) => item.priority === "Critical" || item.priority === "High").length;
  const resolved = cases.filter((item) => item.status === "Resolved").length;
  const resolutionRate = cases.length ? Math.round((resolved / cases.length) * 100) : 0;
  const categories = Object.entries(cases.reduce<Record<string, number>>((totals, item) => {
    totals[item.category] = (totals[item.category] ?? 0) + 1;
    return totals;
  }, {})).sort((a, b) => b[1] - a[1]);

  return (
    <main className="page-shell shell">
      <section className="overview-heading">
        <div>
          <p className="eyebrow"><span className="live-dot" /> Live complaint intelligence</p>
          <h1>See what customers are <em>really</em> telling you.</h1>
          <p className="lede">CaseMeld turns messy complaint text into clear signals, related cases, and the next best action.</p>
        </div>
        <Link href="/analyze" className="button button-primary button-large">Analyze a complaint <ArrowRight size={18} /></Link>
      </section>

      <section className="metric-grid" aria-label="Case metrics">
        <article className="metric-card metric-featured"><div className="metric-icon"><Layers3 size={19} /></div><p>Active cases</p><strong>{active}</strong><span>Across {categories.length} categories</span></article>
        <article className="metric-card"><div className="metric-icon warm"><ShieldAlert size={19} /></div><p>Needs attention</p><strong>{urgent}</strong><span>High and critical priority</span></article>
        <article className="metric-card"><div className="metric-icon blue"><Clock3 size={19} /></div><p>Median first response</p><strong>1.8h</strong><span className="positive"><TrendingDown size={14} /> 22% faster this week</span></article>
        <article className="metric-card"><div className="metric-icon plum"><Sparkles size={19} /></div><p>Resolution rate</p><strong>{resolutionRate}%</strong><span>{resolved} case{resolved === 1 ? "" : "s"} resolved</span></article>
      </section>

      <section className="overview-grid">
        <article className="panel signal-panel">
          <div className="panel-heading"><div><p className="eyebrow">Signal map</p><h2>What is driving contact</h2></div><span className="muted-label">Current cases</span></div>
          <div className="category-list">
            {categories.map(([category, count], index) => {
              const percentage = Math.round((count / Math.max(1, cases.length)) * 100);
              return <div className="category-row" key={category}><span className={`category-swatch swatch-${index % 5}`} /><div className="category-copy"><div><strong>{category}</strong><span>{count} cases</span></div><div className="progress-track"><span style={{ width: `${Math.max(8, percentage)}%` }} /></div></div><b>{percentage}%</b></div>;
            })}
          </div>
        </article>

        <article className="panel insight-panel">
          <p className="eyebrow">Emerging insight</p><div className="insight-symbol" aria-hidden="true"><span /><span /><span /></div>
          <h2>Repeat contacts are clustering around unresolved billing issues.</h2>
          <p>Cases mentioning a previous support interaction are more likely to need escalation. Give one owner the full history before replying.</p>
          <Link href="/cases" className="text-link">Review priority cases <ArrowRight size={16} /></Link>
        </article>
      </section>

      <section className="panel recent-panel">
        <div className="panel-heading"><div><p className="eyebrow">Case stream</p><h2>Recent complaints</h2></div><Link href="/cases" className="text-link">View all cases <ArrowRight size={16} /></Link></div>
        <div className="case-table" aria-label="Recent complaints">
          <div className="case-table-head"><span>Case</span><span>Category</span><span>Priority</span><span>Status</span><span>Received</span></div>
          {cases.slice(0, 5).map((item) => <Link href={`/cases/${item.id}`} className="case-table-row" key={item.id}><span className="case-title-cell"><small>{item.id}</small><strong>{item.title}</strong></span><span>{item.category}</span><span><b className={priorityClass(item.priority)}>{item.priority}</b></span><span><b className="status-badge">{item.status}</b></span><span>{formatDate(item.createdAt)}</span></Link>)}
        </div>
      </section>
    </main>
  );
}
