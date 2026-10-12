"use client";

import Link from "next/link";
import { Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useComplaints } from "@/components/complaint-provider";
import { formatDate, priorityClass } from "@/lib/complaints";

export default function CasesPage() {
  const { cases, deleteCase } = useComplaints();
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
        {filtered.map((item) => <article className="case-card" key={item.id}><Link href={`/cases/${item.id}`} className="case-card-main"><div className="case-card-top"><span>{item.id}</span><time>{formatDate(item.createdAt)}</time></div><h2>{item.title}</h2><p>{item.summary}</p><div className="case-card-meta"><span>{item.category}</span><b className={priorityClass(item.priority)}>{item.priority}</b><b className="status-badge">{item.status}</b></div></Link><div className="case-card-side"><span>Owner</span><strong>{item.owner}</strong><span>Customer</span><strong>{item.customer}</strong><button type="button" className="icon-button" aria-label={`Delete ${item.id}`} onClick={() => deleteCase(item.id)}><Trash2 size={16} /></button></div></article>)}
        {!filtered.length && <div className="empty-state panel"><Search size={28} /><h2>No cases match that search</h2><p>Try another phrase or clear the priority filter.</p></div>}
      </section>
    </main>
  );
}
