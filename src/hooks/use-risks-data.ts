import { useQuery } from "@tanstack/react-query";
import { api, Extraction, DashboardSummary } from "@/lib/api";

// Mock data for when API is unavailable
const mockRisks: Extraction[] = [
  { id: 1, article_id: 1, taxonomy_label: "model_misuse", taxonomy_subcategory: "Unauthorized Use", actor: "External", asset: "AI Model", capability: "Generation", harm: "Misinformation", preconditions: "Public access", sector: "public", industries: ["Technology"], severity: 4, severity_rationale: "High impact", likelihood: 3, likelihood_rationale: "Moderate", created_at: new Date().toISOString() },
  { id: 2, article_id: 2, taxonomy_label: "privacy_violation", taxonomy_subcategory: "Data Leak", actor: "Internal", asset: "User Data", capability: "Access", harm: "Privacy breach", preconditions: "Weak controls", sector: "private", industries: ["Healthcare"], severity: 5, severity_rationale: "Critical", likelihood: 4, likelihood_rationale: "Likely", created_at: new Date().toISOString() },
  { id: 3, article_id: 3, taxonomy_label: "fairness_bias", taxonomy_subcategory: "Algorithmic Bias", actor: "System", asset: "Decision Model", capability: "Prediction", harm: "Discrimination", preconditions: "Biased training", sector: "public", industries: ["Finance"], severity: 3, severity_rationale: "Medium", likelihood: 4, likelihood_rationale: "Likely", created_at: new Date().toISOString() },
  { id: 4, article_id: 4, taxonomy_label: "cybersecurity_vulnerability", taxonomy_subcategory: "Injection", actor: "External", asset: "API", capability: "Exploit", harm: "System compromise", preconditions: "Unpatched", sector: "private", industries: ["Technology"], severity: 5, severity_rationale: "Critical", likelihood: 3, likelihood_rationale: "Moderate", created_at: new Date().toISOString() },
  { id: 5, article_id: 5, taxonomy_label: "robustness_failure", taxonomy_subcategory: "Edge Case", actor: "System", asset: "ML Model", capability: "Inference", harm: "Wrong output", preconditions: "Unusual input", sector: "nonprofit", industries: ["Research"], severity: 2, severity_rationale: "Low", likelihood: 2, likelihood_rationale: "Unlikely", created_at: new Date().toISOString() },
];

const mockDashboardSummary: DashboardSummary = {
  totals: { articles: 247, risks: 892 },
  top_taxonomy_labels: [["model_misuse", 156], ["privacy_violation", 134], ["fairness_bias", 98]],
  top_tags: [["security", 234], ["privacy", 189], ["compliance", 145]],
};

export function useRisks() {
  return useQuery<Extraction[]>({
    queryKey: ["risks"],
    queryFn: async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const { data } = await api.get('/dashboard/risks', { signal: controller.signal });
        clearTimeout(timeoutId);
        return data;
      } catch {
        return mockRisks;
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
