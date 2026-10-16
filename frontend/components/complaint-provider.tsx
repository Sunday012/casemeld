"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CaseStatus, ComplaintAnalysis, ComplaintCase } from "@/lib/complaints";

type ComplaintContextValue = {
  cases: ComplaintCase[];
  ready: boolean;
  error: string;
  addCase: (content: string, analysis: ComplaintAnalysis) => Promise<ComplaintCase>;
  deleteCase: (id: string) => Promise<void>;
  updateStatus: (id: string, status: CaseStatus) => Promise<void>;
  refresh: () => Promise<void>;
};

const ComplaintContext = createContext<ComplaintContextValue | null>(null);
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

type ComplaintResponse = { complaint: ComplaintCase; error?: string };
type ComplaintListResponse = { complaints: ComplaintCase[]; error?: string };

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBaseUrl) throw new Error("The CaseMeld API URL is not configured.");
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (response.status === 204) return undefined as T;
  const payload = await response.json().catch(() => ({})) as T & { error?: string };
  if (!response.ok) throw new Error(payload.error || "The CaseMeld API request failed.");
  return payload;
}

export function ComplaintProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<ComplaintCase[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setError("");
    try {
      const payload = await apiRequest<ComplaintListResponse>("/api/v1/complaints");
      setCases(payload.complaints);
    } catch (requestError) {
      setCases([]);
      setError(requestError instanceof Error ? requestError.message : "Case data is unavailable.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const addCase = useCallback(async (content: string, analysis: ComplaintAnalysis) => {
    const payload = await apiRequest<ComplaintResponse>("/api/v1/complaints", {
      method: "POST",
      body: JSON.stringify({ complaint: { ...analysis, content, customer: "New customer", channel: "Web", status: analysis.priority === "Critical" ? "Escalated" : "New" } }),
    });
    setCases((current) => [payload.complaint, ...current.filter((item) => item.id !== payload.complaint.id)]);
    return payload.complaint;
  }, []);

  const deleteCase = useCallback(async (id: string) => {
    await apiRequest<void>(`/api/v1/complaints/${encodeURIComponent(id)}`, { method: "DELETE" });
    setCases((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateStatus = useCallback(async (id: string, status: CaseStatus) => {
    const payload = await apiRequest<ComplaintResponse>(`/api/v1/complaints/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ complaint: { status } }),
    });
    setCases((current) => current.map((item) => item.id === id ? payload.complaint : item));
  }, []);

  const value = useMemo(() => ({ cases, ready, error, addCase, deleteCase, updateStatus, refresh }), [cases, ready, error, addCase, deleteCase, updateStatus, refresh]);

  return <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>;
}

export function useComplaints() {
  const value = useContext(ComplaintContext);
  if (!value) throw new Error("useComplaints must be used inside ComplaintProvider");
  return value;
}
