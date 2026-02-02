import { useQuery } from "@tanstack/react-query";
import { api, Job, JobsSummary } from "@/lib/api";

// Mock data for when API is unavailable
const mockJobsSummary: JobsSummary = {
  totals: { total: 156, pending: 8, running: 3, done: 132, error: 9, skipped: 4 },
  success_rate: 84.6,
  recent_activity: { last_24h: 24, completed_24h: 21 },
  job_types: { ingest: 98, aiid: 58 },
  sources: { manual: 45, discovery: 111 },
  avg_processing_time_seconds: 12.4,
  severity_distribution: { "1": 12, "2": 34, "3": 45, "4": 28, "5": 13 },
};

const mockJobs: Job[] = [
  { id: 1, url: "https://example.com/article-1", status: "done", kind: "ingest", source: "discovery", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tries: 1, last_error: null },
  { id: 2, url: "https://example.com/article-2", status: "running", kind: "aiid", source: "manual", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tries: 1, last_error: null },
  { id: 3, url: "https://example.com/article-3", status: "pending", kind: "ingest", source: "discovery", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tries: 0, last_error: null },
  { id: 4, url: "https://example.com/article-4", status: "error", kind: "reextract", source: "auto-ingest", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tries: 3, last_error: "Connection timeout" },
  { id: 5, url: "https://example.com/article-5", status: "done", kind: "ingest", source: "discovery", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), tries: 1, last_error: null },
];

export function useJobsSummary() {
  return useQuery<JobsSummary>({
    queryKey: ["jobsSummary"],
    queryFn: async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const { data } = await api.get('/dashboard/jobs/summary', { signal: controller.signal });
        clearTimeout(timeoutId);
        return data;
      } catch {
        return mockJobsSummary;
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: false,
  });
}

export function useJobs() {
  return useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const { data } = await api.get('/dashboard/jobs', { signal: controller.signal });
        clearTimeout(timeoutId);
        return data;
      } catch {
        return mockJobs;
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: false,
  });
}
