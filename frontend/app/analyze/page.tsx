"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Clock3, CornerDownLeft, FileSearch, Link2, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import { useComplaints } from "@/components/complaint-provider";
import { analyzeComplaint, ComplaintAnalysis, priorityClass } from "@/lib/complaints";

const example = "I cancelled my subscription last month after speaking with support, but I was charged again today. This is the third time I have contacted you and every case gets closed without fixing the problem. I need the charge refunded immediately.";

export default function AnalyzePage() {
  const { cases, addCase } = useComplaints();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [analysis, setAnalysis] = useState<ComplaintAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const words = useMemo(() => content.trim() ? content.trim().split(/\s+/).length : 0, [content]);

  function runAnalysis() {
    if (content.trim().length < 30) { setError("Add a little more detail so CaseMeld can identify the issue accurately."); return; }
    setError(""); setAnalyzing(true);
    window.setTimeout(() => { setAnalysis(analyzeComplaint(content, cases)); setAnalyzing(false); }, 450);
  }

  function saveCase() {
    if (!analysis) return;
    const saved = addCase(content, analysis);
    router.push(`/cases/${saved.id}`);
  }

  function reset() { setContent(""); setAnalysis(null); setError(""); }

  return (
    <main className="page-shell shell analyze-page">
      <section className="page-heading compact">
        <div><p className="eyebrow">New analysis</p><h1>Turn a complaint into a clear next step.</h1><p>Paste the customer’s message. CaseMeld will classify it, assess urgency, and surface related cases.</p></div>
        {analysis && <button type="button" className="button button-ghost" onClick={reset}><RotateCcw size={16} /> Start over</button>}
      </section>
      <div className="analyze-grid">
        <section className="panel composer-panel">
          <div className="composer-heading"><div className="step-number">01</div><div><h2>Customer complaint</h2><p>Use the original message for the strongest match.</p></div></div>
          <label className="sr-only" htmlFor="complaint">Customer complaint</label>
          <textarea id="complaint" value={content} onChange={(event) => { setContent(event.target.value); setError(""); }} placeholder="Paste or type the complaint here…" maxLength={2400} />
          <div className="composer-meta"><button type="button" className="example-button" onClick={() => setContent(example)}>Use an example</button><span>{words} words · {content.length}/2,400</span></div>
          {error && <p className="form-error">{error}</p>}
          <button type="button" className="button button-primary analyze-button" onClick={runAnalysis} disabled={analyzing}>{analyzing ? <><LoaderCircle className="spin" size={18} /> Analyzing complaint…</> : <><Sparkles size={18} /> Analyze complaint <CornerDownLeft size={16} /></>}</button>
          <p className="privacy-note"><Check size={14} /> Analysis runs in your browser. No complaint text is sent elsewhere.</p>
        </section>

        {!analysis ? (
          <aside className="analysis-empty"><div className="empty-orbit"><FileSearch size={30} /><span /><span /></div><h2>Your analysis will appear here</h2><p>CaseMeld looks for the issue, urgency, sentiment, key terms, and patterns across previous cases.</p><ol><li><span>1</span> Identify the underlying issue</li><li><span>2</span> Score priority and response time</li><li><span>3</span> Connect related complaints</li></ol></aside>
        ) : (
          <section className="analysis-results" aria-live="polite">
            <div className="result-header"><div><p className="eyebrow">Analysis complete</p><h2>{analysis.title}</h2></div><span className="confidence"><Sparkles size={14} /> {analysis.confidence}% confidence</span></div>
            <p className="result-summary">{analysis.summary}</p>
            <div className="result-facts"><div><span>Category</span><strong>{analysis.category}</strong><small>{analysis.subcategory}</small></div><div><span>Priority</span><strong className={priorityClass(analysis.priority)}>{analysis.priority}</strong><small><Clock3 size={13} /> Respond in {analysis.responseDue}</small></div><div><span>Sentiment</span><strong>{analysis.sentiment}</strong><small>Based on message language</small></div><div><span>Route to</span><strong>{analysis.owner}</strong><small>Suggested owner</small></div></div>
            <div className="result-section"><h3>Key signals</h3><div className="keyword-list">{analysis.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div></div>
            <div className="result-section"><h3>Recommended next actions</h3><ol className="action-list">{analysis.nextActions.map((action, index) => <li key={action}><span>{index + 1}</span>{action}</li>)}</ol></div>
            <div className="result-section"><h3><Link2 size={16} /> Related cases</h3>{analysis.similarCases.length ? analysis.similarCases.map((item) => <Link href={`/cases/${item.id}`} className="related-case" key={item.id}><span><small>{item.id}</small><strong>{item.title}</strong></span><b>{item.similarity}% match</b></Link>) : <p className="empty-copy">No close match yet. Saving this case will improve the working case library.</p>}</div>
            <button type="button" className="button button-primary save-button" onClick={saveCase}>Save as case <ArrowRight size={17} /></button>
          </section>
        )}
      </div>
    </main>
  );
}
