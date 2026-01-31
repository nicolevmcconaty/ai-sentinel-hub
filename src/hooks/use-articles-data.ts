import { useQuery } from "@tanstack/react-query";
import { api, Article, DashboardSummary } from "@/lib/api";

export function useArticles() {
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/articles');
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
