import { useState } from "react";
import { ListTodo, CheckCircle, Clock, AlertTriangle, XCircle, SkipForward, Zap, Timer, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobsSummary, useJobs } from "@/hooks/use-jobs-data";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function Jobs() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const { data: jobsSummary, isLoading: isLoadingSummary } = useJobsSummary();
  const { data: jobs, isLoading: isLoadingJobs } = useJobs();

  const filteredJobs = (jobs || []).filter((job) => {
    if (statusFilter !== "all" && job.status !== statusFilter) return false;
    if (kindFilter !== "all" && job.kind !== kindFilter) return false;
    if (sourceFilter !== "all" && job.source !== sourceFilter) return false;
    return true;
  });

  if (isLoadingSummary || isLoadingJobs) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Jobs</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage crawler jobs</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Jobs"
          value={jobsSummary?.totals.total || 0}
          icon={<ListTodo className="w-6 h-6" />}
          variant="primary"
        />
        <StatCard
          title="Success Rate"
          value={`${jobsSummary?.success_rate || 0}%`}
          icon={<CheckCircle className="w-6 h-6" />}
          variant="success"
        />
        <StatCard
          title="Pending Queue"
          value={jobsSummary?.totals.pending || 0}
          icon={<Clock className="w-6 h-6" />}
          variant="warning"
        />
        <StatCard
          title="Failed Jobs"
          value={jobsSummary?.totals.error || 0}
          icon={<XCircle className="w-6 h-6" />}
          variant="critical"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Running Now"
          value={jobsSummary?.totals.running || 0}
          icon={<Zap className="w-6 h-6" />}
        />
        <StatCard
          title="24h Activity"
          value={jobsSummary?.recent_activity.last_24h || 0}
          icon={<Activity className="w-6 h-6" />}
        />
        <StatCard
          title="Avg Processing"
          value={`${jobsSummary?.avg_processing_time_seconds || 0}s`}
          icon={<Timer className="w-6 h-6" />}
        />
        <StatCard
          title="Skipped"
          value={jobsSummary?.totals.skipped || 0}
          icon={<SkipForward className="w-6 h-6" />}
        />
      </div>

      {/* Filters */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-background/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="skipped">Skipped</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Type:</span>
            <Select value={kindFilter} onValueChange={setKindFilter}>
              <SelectTrigger className="w-32 bg-background/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ingest">Ingest</SelectItem>
                <SelectItem value="aiid">AIID</SelectItem>
                <SelectItem value="reextract">Reextract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Source:</span>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-36 bg-background/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="discovery">Discovery</SelectItem>
                <SelectItem value="auto-ingest">Auto-Ingest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1" />

          <Button variant="outline" size="sm" className="border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30" onClick={() => {
            setStatusFilter("all");
            setKindFilter("all");
            setSourceFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Jobs Table */}
      <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">URL</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Source</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Tries</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-primary">#{job.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-foreground truncate block max-w-xs" title={job.url}>
                      {job.url}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border",
                      job.kind === "ingest" && "bg-blue-500/15 text-blue-400 border-blue-500/30",
                      job.kind === "aiid" && "bg-purple-500/15 text-purple-400 border-purple-500/30",
                      job.kind === "reextract" && "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                    )}>
                      {job.kind.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground capitalize">{job.source}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-muted-foreground">{job.tries}</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" className="text-primary text-xs hover:bg-primary/10">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <ListTodo className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">No jobs match the selected filters</p>
          </div>
        )}
      </Card>
    </div>
  );
}
