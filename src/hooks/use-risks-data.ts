import { useQuery } from "@tanstack/react-query";
import { api, Extraction, DashboardSummary } from "@/lib/api";

export function useRisks() {
  return useQuery<Extraction[]>({
    queryKey: ["risks"],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/risks');
      return data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboardSummary"],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/summary');
      return data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
}
