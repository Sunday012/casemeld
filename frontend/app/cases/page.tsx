"use client";

import Link from "next/link";
import { LoaderCircle, RefreshCw, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useComplaints } from "@/components/complaint-provider";
import { formatDate, priorityClass } from "@/lib/complaints";

export default function CasesPage() {
  const { cases, deleteCase, error, ready, refresh } = useComplaints();
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("All");
  const filtered = useMemo(() => cases.filter((item) => {
    const haystack = `${item.id} ${item.title} ${item.summary} ${item.category} ${item.customer}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (priority === "All" || item.priority === priority);
  }), [cases, priority, query]);

  return (
    <main className="page-shell shell">
      <section className="page-heading"><div><p className="eyebrow">Case library</p><h1>Every complaint, connected.</h1><p>Search the complete case history and follow each issue from first signal to resolution.</p></div><Link href="/analyze" className="button button-primary">Analyze new complaint</Link></section>
      <section className="case-toolbar panel"><label className="search-field"><Search size={18} /><span className="sr-only">Search cases</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by case, customer, issue, or category…" /></label><label className="filter-field"><SlidersHorizontal size={17} /><span className="sr-only">Filter by priority</span><select value={priority} onChange={(event) => setPriority(event.target.value)}><option>All</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></label><span className="result-count">{filtered.length} case{filtered.length === 1 ? "" : "s"}</span></section>
      <section className="case-card-list">
        {!ready && <div className="empty-state panel"><LoaderCircle className="spin" size={28} /><h2>Loading live cases</h2><p>Connecting to the CaseMeld API.</p></div>}
        {ready && error && <div className="empty-state panel"><RefreshCw size={28} /><h2>Case data is unavailable</h2><p>{error}</p><button type="button" className="button button-ghost" onClick={() => void refresh()}>Try again</button></div>}
        {ready && !error && filtered.map((item) => <article className="case-card" key={item.id}><Link href={`/cases/${item.id}`} className="case-card-main"><div className="case-card-top"><span>{item.id}</span><time>{formatDate(item.createdAt)}</time></div><h2>{item.title}</h2><p>{item.summary}</p><div className="case-card-meta"><span>{item.category}</span><b className={priorityClass(item.priority)}>{item.priority}</b><b className="status-badge">{item.status}</b></div></Link><div className="case-card-side"><span>Owner</span><strong>{item.owner}</strong><span>Customer</span><strong>{item.customer}</strong><button type="button" className="icon-button" aria-label={`Delete ${item.id}`} onClick={() => void deleteCase(item.id)}><Trash2 size={16} /></button></div></article>)}
        {ready && !error && !filtered.length && <div className="empty-state panel"><Search size={28} /><h2>{cases.length ? "No cases match that search" : "No cases yet"}</h2><p>{cases.length ? "Try another phrase or clear the priority filter." : "Analyze and save the first complaint to start your live case library."}</p>{!cases.length && <Link href="/analyze" className="button button-primary">Analyze a complaint</Link>}</div>}
      </section>
    </main>
  );
}
