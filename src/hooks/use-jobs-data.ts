import { useQuery } from "@tanstack/react-query";
import { api, Job, JobsSummary } from "@/lib/api";

export function useJobsSummary() {
  return useQuery<JobsSummary>({
    queryKey: ["jobsSummary"],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/jobs/summary');
      return data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useJobs() {
  return useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/jobs');
      return data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
}
