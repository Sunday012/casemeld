"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, Link2, Trash2, UserRound } from "lucide-react";
import { useComplaints } from "@/components/complaint-provider";
import { CaseStatus, formatDate, priorityClass } from "@/lib/complaints";

const statuses: CaseStatus[] = ["New", "In review", "Escalated", "Resolved"];

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { cases, deleteCase, updateStatus } = useComplaints();
  const item = cases.find((entry) => entry.id === id);
  if (!item) return <main className="page-shell shell"><div className="empty-state panel"><h1>Case not found</h1><p>This case may have been removed from the local library.</p><Link href="/cases" className="button button-primary">Back to cases</Link></div></main>;

  return (
    <main className="page-shell shell detail-page">
      <Link href="/cases" className="back-link"><ArrowLeft size={16} /> Back to all cases</Link>
      <section className="detail-heading"><div><div className="detail-kicker"><span>{item.id}</span><b className={priorityClass(item.priority)}>{item.priority}</b></div><h1>{item.title}</h1><p>{item.summary}</p></div><div className="detail-actions"><select aria-label="Case status" value={item.status} onChange={(event) => updateStatus(item.id, event.target.value as CaseStatus)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select><button className="icon-button danger" type="button" aria-label="Delete case" onClick={() => { deleteCase(item.id); router.push("/cases"); }}><Trash2 size={17} /></button></div></section>
      <div className="detail-grid">
        <div className="detail-main">
          <section className="panel detail-section"><p className="eyebrow">Original complaint</p><blockquote>{item.content}</blockquote><div className="source-line"><span><UserRound size={14} /> {item.customer}</span><span>{item.channel}</span><span>{formatDate(item.createdAt)}</span></div></section>
          <section className="panel detail-section"><p className="eyebrow">Recommended response plan</p><ol className="response-plan">{item.nextActions.map((action, index) => <li key={action}><span>{index + 1}</span><div><strong>{action}</strong><small>{index === 0 ? "Start here" : "Follow after verification"}</small></div></li>)}</ol></section>
          {!!item.similarCases.length && <section className="panel detail-section"><p className="eyebrow"><Link2 size={14} /> Connected cases</p>{item.similarCases.map((related) => <Link href={`/cases/${related.id}`} className="related-case" key={related.id}><span><small>{related.id}</small><strong>{related.title}</strong></span><b>{related.similarity}% match</b></Link>)}</section>}
        </div>
        <aside className="detail-sidebar"><section className="panel facts-panel"><p className="eyebrow">Case intelligence</p><dl><div><dt>Category</dt><dd>{item.category}</dd></div><div><dt>Issue</dt><dd>{item.subcategory}</dd></div><div><dt>Sentiment</dt><dd>{item.sentiment}</dd></div><div><dt>Confidence</dt><dd>{item.confidence}%</dd></div><div><dt>Suggested owner</dt><dd>{item.owner}</dd></div><div><dt>Response target</dt><dd><Clock3 size={14} /> {item.responseDue}</dd></div></dl></section><section className="panel detail-section"><p className="eyebrow">Key signals</p><div className="keyword-list">{item.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div></section><section className="resolution-card"><CheckCircle2 size={20} /><div><strong>{item.status === "Resolved" ? "Resolution recorded" : "Resolution workspace"}</strong><p>{item.resolution ?? "Update the status as the case moves forward. The final outcome will become reusable context for future matches."}</p></div></section></aside>
      </div>
    </main>
  );
}
