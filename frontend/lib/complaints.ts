export type Priority = "Critical" | "High" | "Medium" | "Low";
export type CaseStatus = "New" | "In review" | "Escalated" | "Resolved";

export type SimilarCase = {
  id: string;
  title: string;
  category: string;
  similarity: number;
  resolution: string;
};

export type ComplaintAnalysis = {
  title: string;
  summary: string;
  category: string;
  subcategory: string;
  priority: Priority;
  confidence: number;
  sentiment: "Very negative" | "Negative" | "Neutral";
  keywords: string[];
  owner: string;
  responseDue: string;
  nextActions: string[];
  similarCases: SimilarCase[];
};

export type ComplaintCase = ComplaintAnalysis & {
  id: string;
  content: string;
  customer: string;
  channel: "Email" | "Web" | "Phone" | "Social";
  status: CaseStatus;
  createdAt: string;
  resolution?: string;
};

type CategoryRule = {
  category: string;
  subcategory: string;
  owner: string;
  terms: string[];
};

const categoryRules: CategoryRule[] = [
  {
    category: "Billing & payments",
    subcategory: "Incorrect charge or payment",
    owner: "Billing operations",
    terms: ["charge", "charged", "billing", "bill", "payment", "refund", "fee", "interest", "price", "overcharged", "invoice"],
  },
  {
    category: "Fraud & security",
    subcategory: "Unrecognized activity",
    owner: "Trust & safety",
    terms: ["fraud", "fraudulent", "stolen", "unauthorized", "unrecognized", "scam", "hacked", "identity", "suspicious"],
  },
  {
    category: "Account access",
    subcategory: "Login or account restriction",
    owner: "Account services",
    terms: ["login", "password", "locked", "access", "account", "closed", "suspended", "verification", "sign in"],
  },
  {
    category: "Credit reporting",
    subcategory: "Incorrect credit information",
    owner: "Credit reporting desk",
    terms: ["credit", "report", "score", "delinquent", "late payment", "bureau", "rating", "history"],
  },
  {
    category: "Product & service",
    subcategory: "Service did not meet expectations",
    owner: "Customer experience",
    terms: ["broken", "delivery", "delivered", "quality", "service", "product", "order", "cancelled", "canceled", "missing", "damaged"],
  },
  {
    category: "Customer support",
    subcategory: "Poor support experience",
    owner: "Support quality",
    terms: ["support", "agent", "representative", "called", "email", "response", "waiting", "ignored", "rude", "help"],
  },
];

const stopWords = new Set([
  "about", "after", "again", "been", "being", "could", "from", "have", "into", "just", "more", "that", "their", "there", "they", "this", "through", "very", "what", "when", "where", "which", "with", "would", "your", "were", "said", "them", "then", "than", "also", "because", "still", "only", "over", "under", "customer", "company", "please",
]);

const dateFormatter = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" });

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function scoreCategory(text: string, rule: CategoryRule) {
  return rule.terms.reduce((score, term) => score + (text.includes(term) ? (term.includes(" ") ? 3 : 1) : 0), 0);
}

function sentenceSummary(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const firstSentence = cleaned.split(/(?<=[.!?])\s/)[0];
  const selected = firstSentence.length >= 45 ? firstSentence : cleaned;
  return selected.length > 170 ? `${selected.slice(0, 167).trim()}…` : selected;
}

function makeTitle(category: string, keywords: string[]) {
  const subject = keywords.slice(0, 2).join(" and ");
  return subject ? `${subject.charAt(0).toUpperCase()}${subject.slice(1)} issue` : `${category} complaint`;
}

function extractKeywords(text: string) {
  const counts = new Map<string, number>();
  tokenize(text).forEach((word) => counts.set(word, (counts.get(word) ?? 0) + 1));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, 5)
    .map(([word]) => word);
}

function similarity(source: string, target: string, categoryMatch: boolean) {
  const a = new Set(tokenize(source));
  const b = new Set(tokenize(target));
  const overlap = [...a].filter((word) => b.has(word)).length;
  const union = new Set([...a, ...b]).size || 1;
  return Math.min(96, Math.round((overlap / union) * 120 + (categoryMatch ? 34 : 0)));
}

function choosePriority(text: string): Priority {
  const critical = ["fraud", "stolen", "hacked", "identity", "unsafe", "emergency", "immediately", "unauthorized"];
  const high = ["credit report", "legal", "twice", "multiple", "overdue", "cannot access", "closed account"];
  if (critical.some((term) => text.includes(term))) return "Critical";
  if (high.some((term) => text.includes(term))) return "High";
  return text.length > 420 ? "Medium" : "Low";
}

function nextActionsFor(category: string) {
  const actions: Record<string, string[]> = {
    "Billing & payments": ["Verify the transaction history", "Confirm the expected amount", "Issue or trace any applicable refund"],
    "Fraud & security": ["Secure the affected account", "Verify the customer’s identity", "Open a fraud investigation"],
    "Account access": ["Validate account ownership", "Review restriction history", "Restore access or explain the next requirement"],
    "Credit reporting": ["Compare payment and reporting dates", "Review the bureau submission", "Correct inaccurate reporting and notify the customer"],
    "Product & service": ["Confirm order and fulfilment history", "Identify the service failure", "Offer a replacement, refund, or recovery plan"],
    "Customer support": ["Review previous contacts", "Assign a single case owner", "Respond with a concrete resolution and timeline"],
  };
  return actions[category] ?? actions["Customer support"];
}

export function analyzeComplaint(content: string, cases: ComplaintCase[]): ComplaintAnalysis {
  const normalized = content.toLowerCase();
  const ranked = categoryRules
    .map((rule) => ({ rule, score: scoreCategory(normalized, rule) }))
    .sort((a, b) => b.score - a.score);
  const winner = ranked[0].score > 0 ? ranked[0] : { rule: categoryRules[5], score: 1 };
  const priority = choosePriority(normalized);
  const keywords = extractKeywords(content);
  const negativeSignals = ["angry", "frustrated", "terrible", "never", "ignored", "fraud", "again", "immediately"];
  const negativeCount = negativeSignals.filter((term) => normalized.includes(term)).length;
  const sentiment = negativeCount >= 2 || priority === "Critical" ? "Very negative" : negativeCount === 1 ? "Negative" : "Neutral";
  const confidence = Math.min(97, 66 + winner.score * 4 + Math.min(9, Math.round(content.length / 90)));
  const due: Record<Priority, string> = { Critical: "30m", High: "2h", Medium: "8h", Low: "24h" };
  const related = cases
    .map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      similarity: similarity(content, item.content, item.category === winner.rule.category),
      resolution: item.resolution ?? item.nextActions[0],
    }))
    .filter((item) => item.similarity >= 24)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

  return {
    title: makeTitle(winner.rule.category, keywords),
    summary: sentenceSummary(content),
    category: winner.rule.category,
    subcategory: winner.rule.subcategory,
    priority,
    confidence,
    sentiment,
    keywords,
    owner: winner.rule.owner,
    responseDue: due[priority],
    nextActions: nextActionsFor(winner.rule.category),
    similarCases: related,
  };
}

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function priorityClass(priority: Priority) {
  return `priority priority-${priority.toLowerCase()}`;
}
