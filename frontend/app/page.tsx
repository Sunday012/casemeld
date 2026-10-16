import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  GitMerge,
  Layers3,
  MessageSquareText,
  ScanSearch,
  ShieldCheck,
  Target,
} from "lucide-react";
import { BrandGlyph } from "@/components/brand-glyph";

const paths = [
  {
    kicker: "The queue feels chaotic",
    title: "I need to know what matters first",
    copy: "Separate urgent signals from routine contact and give every complaint a clear response target.",
    action: "See the live overview",
    href: "/dashboard",
    visual: "triage",
  },
  {
    kicker: "The same issue keeps returning",
    title: "I need to see the pattern",
    copy: "Connect similar cases and recurring themes before an isolated problem becomes systemic.",
    action: "Explore connected cases",
    href: "/cases",
    visual: "connect",
  },
  {
    kicker: "A complaint needs action now",
    title: "I need the next best move",
    copy: "Turn raw customer language into ownership, priority, response timing, and practical next steps.",
    action: "Analyze a complaint",
    href: "/analyze",
    visual: "route",
  },
];

const steps = [
  { number: "1", title: "Read the signal", copy: "Identify the issue, sentiment, urgency, and language that matters.", icon: ScanSearch },
  { number: "2", title: "Connect the context", copy: "Match related cases and reveal the pattern behind repeat contact.", icon: GitMerge },
  { number: "3", title: "Set the response", copy: "Recommend an owner, response target, and practical next actions.", icon: Target },
  { number: "4", title: "Learn from resolution", copy: "Keep the outcome attached so future cases begin with context.", icon: BrandGlyph },
];

export default function LandingPage() {
  return (
    <main className="folio-page">
      <section className="folio-hero">
        <div className="folio-grid" aria-hidden="true" />
        <div className="folio-hero-inner shell">
          <div className="folio-kicker"><span className="folio-mini-mark" aria-hidden="true" /><span>Built for the moment a complaint becomes a signal</span></div>
          <h1>Know what customers need. <em>See what your team should do next.</em></h1>
          <p>CaseMeld turns messy complaint text into clear priorities, connected cases, and an actionable response plan in seconds.</p>
          <div className="folio-actions">
            <Link href="/analyze" className="folio-primary-cta">Try a complaint <span><ArrowRight size={18} /></span></Link>
            <Link href="/dashboard" className="folio-secondary-cta">Explore the workspace</Link>
          </div>
          <div className="folio-proof"><div className="proof-orbit"><span>CM</span><span><ShieldCheck size={15} /></span><span><BrandGlyph size={15} /></span></div><div><b>Designed for focused support work</b><small>No account, integration, or setup required</small></div></div>

          <div className="folio-capability-rail" aria-label="CaseMeld capabilities">
            <span><Check size={13} /> Complaint classification</span><span><Check size={13} /> Priority and sentiment</span><span><Check size={13} /> Similar-case matching</span><span><Check size={13} /> Ownership recommendations</span>
          </div>

          <div className="folio-benefits">
            <article><Check size={15} /><div><strong>See the signal before the backlog grows</strong><span>Urgency and sentiment surfaced immediately</span></div></article>
            <article><Check size={15} /><div><strong>Give every complaint its full context</strong><span>Related cases and repeat themes stay connected</span></div></article>
            <article><Check size={15} /><div><strong>Move from reading to resolution</strong><span>Clear owner, timing, and next actions</span></div></article>
          </div>
        </div>
      </section>

      <section className="folio-paths shell" id="product">
        <div className="folio-section-title">
          <p>Start where the work is breaking down</p>
          <h2>Choose the outcome your team needs right now.</h2>
        </div>
        <div className="folio-path-grid">
          {paths.map((path) => (
            <article className="folio-path-card" key={path.title}>
              <span className="folio-card-kicker">{path.kicker}</span>
              <h3>{path.title}</h3>
              <p>{path.copy}</p>
              <Link href={path.href}>{path.action} <ArrowRight size={15} /></Link>
              <div className={`folio-card-visual ${path.visual}`} aria-hidden="true">
                {path.visual === "triage" && <><span>Critical</span><span>High priority</span><span>Needs review</span><span>Routine</span></>}
                {path.visual === "connect" && <><div><i>1</i><b>Complaint received</b></div><div><i>2</i><b>3 cases matched</b></div><div><i>3</i><b>Pattern detected</b></div></>}
                {path.visual === "route" && <><div className="route-case"><small>Case CM-1048</small><strong>Billing reversal</strong></div><div className="route-arrow"><ArrowRight size={18} /></div><div className="route-team"><small>Recommended owner</small><strong>Billing team</strong></div></>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="folio-process shell" id="how-it-works">
        <div className="folio-section-title centered">
          <p>A clear path from message to resolution</p>
          <h2>Four steps. One connected complaint story.</h2>
        </div>
        <div className="folio-process-grid">
          <div className="folio-orbit-visual" aria-label="Complaint signals connecting to one case">
            <span className="orbit-ring ring-one" /><span className="orbit-ring ring-two" /><span className="orbit-ring ring-three" />
            <div className="orbit-center"><span className="brand-mark" aria-hidden="true"><span className="brand-signal" /></span><strong>One clear case</strong></div>
            <div className="orbit-note note-one"><MessageSquareText size={15} /><span>“Charged again after cancellation”</span></div>
            <div className="orbit-note note-two"><Layers3 size={15} /><span>3 similar cases found</span></div>
            <div className="orbit-note note-three"><Clock3 size={15} /><span>2-hour response target</span></div>
          </div>
          <div className="folio-step-list">
            {steps.map(({ number, title, copy, icon: Icon }, index) => <article className={index === 2 ? "active" : ""} key={number}><span>{number}</span><div><h3><Icon size={18} />{title}</h3><p>{copy}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="folio-dark-wrap" id="use-cases">
        <div className="folio-dark-panel shell">
          <div className="dark-panel-heading"><span>Complaint intelligence, not another ticket queue</span><h2>Give every team the same view of what customers are telling you.</h2><p>Support can triage the work. Operations can see the pattern. Risk and quality can spot issues before they spread.</p></div>
          <div className="dark-team-grid">
            <article><MessageSquareText size={21} /><h3>Support teams</h3><p>Prioritize the queue and respond with context.</p></article>
            <article><Layers3 size={21} /><h3>Operations leaders</h3><p>Find the recurring breakdown behind contact volume.</p></article>
            <article><ShieldCheck size={21} /><h3>Risk & quality</h3><p>Surface urgent and sensitive cases early.</p></article>
          </div>
          <Link href="/dashboard" className="folio-light-cta">Open the workspace <span><ArrowRight size={18} /></span></Link>
        </div>
      </section>

      <section className="folio-final shell">
        <div className="final-grid" aria-hidden="true" />
        <p>Start with one complaint</p>
        <h2>Your customers already told you what is wrong. CaseMeld helps you hear it.</h2>
        <span>No account. No integration. Use the live demo.</span>
        <div><Link href="/analyze" className="folio-primary-cta">Analyze a complaint <span><ArrowRight size={18} /></span></Link><Link href="/cases" className="folio-secondary-cta">Browse example cases</Link></div>
      </section>

      <footer className="folio-footer shell">
        <div className="folio-footer-brand"><span className="brand-mark" aria-hidden="true"><span className="brand-signal" /></span><div><strong>CaseMeld</strong><span>Connect complaints. Uncover patterns.</span></div></div>
        <div><strong>Product</strong><Link href="/dashboard">Workspace</Link><Link href="/analyze">Analyze</Link><Link href="/cases">Cases</Link></div>
        <div><strong>Explore</strong><Link href="#product">Outcomes</Link><Link href="#how-it-works">How it works</Link><Link href="#use-cases">Teams</Link></div>
        <p>Built for teams that want to fix the cause, not just close the ticket.</p>
      </footer>
    </main>
  );
}
