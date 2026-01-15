import { useState } from "react";
import { ListTodo, CheckCircle, Clock, AlertTriangle, XCircle, SkipForward, Zap, Timer, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockJobsSummary, mockJobs, JobStatus, JobKind, JobSource } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function Jobs() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const filteredJobs = mockJobs.filter((job) => {
    if (statusFilter !== "all" && job.status !== statusFilter) return false;
    if (kindFilter !== "all" && job.kind !== kindFilter) return false;
    if (sourceFilter !== "all" && job.source !== sourceFilter) return false;
    return true;
  });

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
          value={mockJobsSummary.totals.total}
          icon={<ListTodo className="w-6 h-6" />}
          variant="primary"
        />
        <StatCard
          title="Success Rate"
          value={`${mockJobsSummary.success_rate}%`}
          icon={<CheckCircle className="w-6 h-6" />}
          variant="success"
        />
        <StatCard
          title="Pending Queue"
          value={mockJobsSummary.totals.pending}
          icon={<Clock className="w-6 h-6" />}
          variant="warning"
        />
        <StatCard
          title="Failed Jobs"
          value={mockJobsSummary.totals.error}
          icon={<XCircle className="w-6 h-6" />}
          variant="critical"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Running Now"
          value={mockJobsSummary.totals.running}
          icon={<Zap className="w-6 h-6" />}
        />
        <StatCard
          title="24h Activity"
          value={mockJobsSummary.recent_activity.last_24h}
          icon={<Activity className="w-6 h-6" />}
        />
        <StatCard
          title="Avg Processing"
          value={`${mockJobsSummary.avg_processing_time_seconds}s`}
          icon={<Timer className="w-6 h-6" />}
        />
        <StatCard
          title="Skipped"
          value={mockJobsSummary.totals.skipped}
          icon={<SkipForward className="w-6 h-6" />}
        />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
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
            <span className="text-sm text-muted-foreground">Type:</span>
            <Select value={kindFilter} onValueChange={setKindFilter}>
              <SelectTrigger className="w-32">
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
            <span className="text-sm text-muted-foreground">Source:</span>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-36">
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

          <Button variant="outline" size="sm" onClick={() => {
            setStatusFilter("all");
            setKindFilter("all");
            setSourceFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Jobs Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">URL</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Source</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Tries</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm text-primary">#{job.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-foreground truncate block max-w-xs" title={job.url}>
                      {job.url}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                      job.kind === "ingest" && "bg-blue-500/10 text-blue-500",
                      job.kind === "aiid" && "bg-purple-500/10 text-purple-500",
                      job.kind === "reextract" && "bg-cyan-500/10 text-cyan-500"
                    )}>
                      {job.kind.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground capitalize">{job.source}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm text-muted-foreground">{job.tries}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" className="text-primary">
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
            <p className="text-muted-foreground">No jobs match the selected filters</p>
          </div>
        )}
      </Card>
    </div>
  );
}
