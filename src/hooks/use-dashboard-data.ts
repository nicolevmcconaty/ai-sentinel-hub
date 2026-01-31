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

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboardSummary"],
    queryFn: fetchDashboardSummary,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useJobsSummary() {
  return useQuery<JobsSummary>({
    queryKey: ["jobsSummary"],
    queryFn: fetchJobsSummary,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useRiskCategoryDistribution() {
  return useQuery<RiskCategoryDistribution>({
    queryKey: ["riskCategoryDistribution"],
    queryFn: fetchRiskCategoryDistribution,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useIndustryDistribution() {
  return useQuery<IndustryDistribution>({
    queryKey: ["industryDistribution"],
    queryFn: fetchIndustryDistribution,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useConfidenceMetrics() {
  return useQuery<ConfidenceMetrics>({
    queryKey: ["confidenceMetrics"],
    queryFn: fetchConfidenceMetrics,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useTimePeriodComparison(period: "week" | "month" = "week") {
  return useQuery<TimePeriodComparison>({
    queryKey: ["timePeriodComparison", period],
    queryFn: () => fetchTimePeriodComparison(period),
    staleTime: 60000, // 1 minute
    refetchInterval: 120000, // Refresh every 2 minutes
  });
}

// Combined hook for all dashboard data
export function useDashboardData() {
  const dashboardSummary = useDashboardSummary();
  const jobsSummary = useJobsSummary();
  const riskCategories = useRiskCategoryDistribution();
  const industries = useIndustryDistribution();
  const confidence = useConfidenceMetrics();

  const isLoading = 
    dashboardSummary.isLoading || 
    jobsSummary.isLoading || 
    riskCategories.isLoading || 
    industries.isLoading ||
    confidence.isLoading;

  const isError = 
    dashboardSummary.isError || 
    jobsSummary.isError || 
    riskCategories.isError || 
    industries.isError ||
    confidence.isError;

  return {
    dashboardSummary: dashboardSummary.data,
    jobsSummary: jobsSummary.data,
    riskCategories: riskCategories.data,
    industries: industries.data,
    confidence: confidence.data,
    isLoading,
    isError,
    refetch: () => {
      dashboardSummary.refetch();
      jobsSummary.refetch();
      riskCategories.refetch();
      industries.refetch();
      confidence.refetch();
    },
  };
}
