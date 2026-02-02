import { useQuery } from "@tanstack/react-query";
import { api, Article, DashboardSummary } from "@/lib/api";

// Mock data for when API is unavailable
const mockArticles: Article[] = [
  { id: 1, url: "https://techcrunch.com/ai-risks-2024", title: "AI Risk Assessment in Enterprise Applications", created_at: new Date().toISOString(), risks_count: 4 },
  { id: 2, url: "https://wired.com/privacy-ai", title: "Privacy Concerns in Machine Learning Systems", created_at: new Date().toISOString(), risks_count: 3 },
  { id: 3, url: "https://arxiv.org/bias-study", title: "Algorithmic Bias in Hiring Systems", created_at: new Date().toISOString(), risks_count: 5 },
  { id: 4, url: "https://security.io/ml-vuln", title: "Security Vulnerabilities in ML Pipelines", created_at: new Date().toISOString(), risks_count: 6 },
  { id: 5, url: "https://research.org/ai-safety", title: "AI Safety Research Updates", created_at: new Date().toISOString(), risks_count: 2 },
];

const mockDashboardSummary: DashboardSummary = {
  totals: { articles: 247, risks: 892 },
  top_taxonomy_labels: [["model_misuse", 156], ["privacy_violation", 134], ["fairness_bias", 98]],
  top_tags: [["security", 234], ["privacy", 189], ["compliance", 145]],
};

export function useArticles() {
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const { data } = await api.get('/dashboard/articles', { signal: controller.signal });
        clearTimeout(timeoutId);
        return data;
      } catch {
        return mockArticles;
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: false,
  });
}

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboardSummary"],
    queryFn: async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const { data } = await api.get('/dashboard/summary', { signal: controller.signal });
        clearTimeout(timeoutId);
        return data;
      } catch {
        return mockDashboardSummary;
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: false,
  });
}
