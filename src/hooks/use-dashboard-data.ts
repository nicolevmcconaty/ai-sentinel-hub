import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardSummary,
  fetchJobsSummary,
  fetchRiskCategoryDistribution,
  fetchIndustryDistribution,
  fetchConfidenceMetrics,
  fetchTimePeriodComparison,
  DashboardSummary,
  JobsSummary,
  RiskCategoryDistribution,
  IndustryDistribution,
  ConfidenceMetrics,
  TimePeriodComparison,
} from "@/lib/api";

// Mock data for preview when API is unavailable
const mockDashboardSummary: DashboardSummary = {
  totals: { articles: 10247, risks: 3892 },
  top_taxonomy_labels: [
    ["cybersecurity_vulnerability", 892],
    ["privacy_violation", 654],
    ["fairness_bias", 521],
    ["safety_constraint_failure", 489],
    ["model_misuse", 412],
  ],
  top_tags: [
    ["security_risk", 1247],
    ["compliance_regulatory_risk", 892],
    ["privacy_risk", 756],
    ["data_risk", 632],
    ["reputational_risk", 489],
  ],
};

const mockJobsSummary: JobsSummary = {
  totals: { total: 12458, pending: 18, running: 3, done: 11892, error: 342, skipped: 203 },
  success_rate: 94,
  recent_activity: { last_24h: 342, completed_24h: 298 },
  job_types: { ingest: 8924, aiid: 3534 },
  sources: { manual: 1247, discovery: 11211 },
  avg_processing_time_seconds: 2.3,
  severity_distribution: { "1": 1247, "2": 892, "3": 1756, "4": 632, "5": 189 },
};

const mockRiskCategories: RiskCategoryDistribution = {
  primary: { technical: 2147, operational: 1089, business: 656 },
  secondary: {
    security_risk: 892,
    privacy_risk: 654,
    technical_performance_risk: 312,
    data_risk: 289,
    compliance_regulatory_risk: 456,
    legal_liability_risk: 342,
    third_party_vendor_risk: 291,
    business_financial_risk: 234,
    reputational_risk: 189,
    ethical_risk: 134,
    strategic_risk: 99,
  },
  domains: {
    safety_harm: 892,
    security_threats: 756,
    privacy_data: 654,
    fairness_bias: 521,
    transparency_accountability: 412,
    reliability_robustness: 367,
    societal_environmental: 290,
  },
};

const mockIndustries: IndustryDistribution = {
  public: {
    "Federal Government (US)": 289,
    "State Government (US)": 178,
    "Defense & Military": 134,
    "Educational Institutions (Public)": 98,
    "Law Enforcement & Emergency Services": 67,
  },
  private: {
    Healthcare: 456,
    "Finance & Banking": 398,
    "Technology & Software": 367,
    Insurance: 234,
    Manufacturing: 189,
  },
  nonprofit: {
    "Educational Institutions (Non-Profit)": 89,
    "Healthcare (Non-Profit)": 67,
    "Research & Think Tanks": 45,
    "Social Services": 34,
    "Arts & Culture": 23,
  },
};

const mockConfidence: ConfidenceMetrics = {
  average: 87.4,
  high: 2847,
  medium: 892,
  low: 153,
};

const mockTrendData: TimePeriodComparison = {
  period: "week",
  severity: {
    low: { current: 2139, previous: 1892, change: 247, changePercent: 13.1, trend: "up" },
    medium: { current: 1756, previous: 1834, change: -78, changePercent: -4.3, trend: "down" },
    high: { current: 632, previous: 589, change: 43, changePercent: 7.3, trend: "up" },
    critical: { current: 189, previous: 212, change: -23, changePercent: -10.8, trend: "down" },
  },
  categories: [
    { category: "security_risk", label: "Security Risk", current: 892, previous: 834, change: 58, changePercent: 7.0, trend: "up" },
    { category: "privacy_risk", label: "Privacy Risk", current: 654, previous: 701, change: -47, changePercent: -6.7, trend: "down" },
    { category: "compliance_regulatory_risk", label: "Compliance/Regulatory Risk", current: 456, previous: 412, change: 44, changePercent: 10.7, trend: "up" },
    { category: "data_risk", label: "Data Risk", current: 289, previous: 267, change: 22, changePercent: 8.2, trend: "up" },
    { category: "technical_performance_risk", label: "Technical/Performance Risk", current: 312, previous: 298, change: 14, changePercent: 4.7, trend: "up" },
    { category: "legal_liability_risk", label: "Legal/Liability Risk", current: 342, previous: 356, change: -14, changePercent: -3.9, trend: "down" },
    { category: "third_party_vendor_risk", label: "Third-Party/Vendor Risk", current: 291, previous: 278, change: 13, changePercent: 4.7, trend: "up" },
    { category: "business_financial_risk", label: "Business/Financial Risk", current: 234, previous: 245, change: -11, changePercent: -4.5, trend: "down" },
    { category: "reputational_risk", label: "Reputational Risk", current: 189, previous: 178, change: 11, changePercent: 6.2, trend: "up" },
    { category: "ethical_risk", label: "Ethical Risk", current: 134, previous: 142, change: -8, changePercent: -5.6, trend: "down" },
    { category: "strategic_risk", label: "Strategic Risk", current: 99, previous: 91, change: 8, changePercent: 8.8, trend: "up" },
  ],
  primaryCategories: {
    technical: { current: 2147, previous: 2100, change: 47, changePercent: 2.2, trend: "up" },
    operational: { current: 1089, previous: 1046, change: 43, changePercent: 4.1, trend: "up" },
    business: { current: 656, previous: 656, change: 0, changePercent: 0, trend: "stable" },
  },
  overall: { current: 3892, previous: 3802, change: 90, changePercent: 2.4, trend: "up" },
};

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboardSummary"],
    queryFn: fetchDashboardSummary,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1,
    // Use initialData so we still render even if the API is down.
    // (placeholderData only shows during loading and can disappear on error)
    initialData: mockDashboardSummary,
  });
}

export function useJobsSummary() {
  return useQuery<JobsSummary>({
    queryKey: ["jobsSummary"],
    queryFn: fetchJobsSummary,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1,
    initialData: mockJobsSummary,
  });
}

export function useRiskCategoryDistribution() {
  return useQuery<RiskCategoryDistribution>({
    queryKey: ["riskCategoryDistribution"],
    queryFn: fetchRiskCategoryDistribution,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1,
    initialData: mockRiskCategories,
  });
}

export function useIndustryDistribution() {
  return useQuery<IndustryDistribution>({
    queryKey: ["industryDistribution"],
    queryFn: fetchIndustryDistribution,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1,
    initialData: mockIndustries,
  });
}

export function useConfidenceMetrics() {
  return useQuery<ConfidenceMetrics>({
    queryKey: ["confidenceMetrics"],
    queryFn: fetchConfidenceMetrics,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1,
    initialData: mockConfidence,
  });
}

export function useTimePeriodComparison(period: "week" | "month" = "week") {
  return useQuery<TimePeriodComparison>({
    queryKey: ["timePeriodComparison", period],
    queryFn: () => fetchTimePeriodComparison(period),
    staleTime: 60000,
    refetchInterval: 120000,
    retry: 1,
    initialData: { ...mockTrendData, period },
  });
}

// Combined hook for all dashboard data
export function useDashboardData() {
  const dashboardSummary = useDashboardSummary();
  const jobsSummary = useJobsSummary();
  const riskCategories = useRiskCategoryDistribution();
  const industries = useIndustryDistribution();
  const confidence = useConfidenceMetrics();

  // We always have initialData, so never block the UI behind a loading or error screen.
  const isLoading = false;
  const isError = false;

  return {
    dashboardSummary: dashboardSummary.data,
    jobsSummary: jobsSummary.data,
    riskCategories: riskCategories.data,
    industries: industries.data,
    confidence: confidence.data,
    isLoading,
    isError,
    // If any query errors, we assume we're showing the initial (sample) dataset.
    isUsingMockData:
      dashboardSummary.isError ||
      jobsSummary.isError ||
      riskCategories.isError ||
      industries.isError ||
      confidence.isError,
    refetch: () => {
      dashboardSummary.refetch();
      jobsSummary.refetch();
      riskCategories.refetch();
      industries.refetch();
      confidence.refetch();
    },
  };
}
