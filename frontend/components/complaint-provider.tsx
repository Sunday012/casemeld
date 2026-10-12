"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ComplaintCase, ComplaintAnalysis, CaseStatus, seedCases } from "@/lib/complaints";

type ComplaintContextValue = {
  cases: ComplaintCase[];
  ready: boolean;
  addCase: (content: string, analysis: ComplaintAnalysis) => ComplaintCase;
  deleteCase: (id: string) => void;
  updateStatus: (id: string, status: CaseStatus) => void;
  resetDemo: () => void;
};

const ComplaintContext = createContext<ComplaintContextValue | null>(null);
const storageKey = "casemeld-cases-v1";

export function ComplaintProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<ComplaintCase[]>(seedCases);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        try {
          setCases(JSON.parse(saved) as ComplaintCase[]);
        } catch {
          window.localStorage.removeItem(storageKey);
        }
      }
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(storageKey, JSON.stringify(cases));
  }, [cases, ready]);

  const addCase = useCallback((content: string, analysis: ComplaintAnalysis) => {
    const newCase: ComplaintCase = {
      ...analysis,
      id: `CM-${Math.floor(1050 + Math.random() * 8950)}`,
      content,
      customer: "New customer",
      channel: "Web",
      status: analysis.priority === "Critical" ? "Escalated" : "New",
      createdAt: new Date().toISOString(),
    };
    setCases((current) => [newCase, ...current]);
    return newCase;
  }, []);

  const deleteCase = useCallback((id: string) => {
    setCases((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateStatus = useCallback((id: string, status: CaseStatus) => {
    setCases((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  }, []);

  const resetDemo = useCallback(() => setCases(seedCases), []);
  const value = useMemo(() => ({ cases, ready, addCase, deleteCase, updateStatus, resetDemo }), [cases, ready, addCase, deleteCase, updateStatus, resetDemo]);

  return <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>;
}

export function useComplaints() {
  const value = useContext(ComplaintContext);
  if (!value) throw new Error("useComplaints must be used inside ComplaintProvider");
  return value;
}
