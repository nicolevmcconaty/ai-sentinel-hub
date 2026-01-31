import { useState } from "react";
import { Shield, AlertTriangle, Eye, Download } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SeverityIndicator } from "@/components/dashboard/SeverityIndicator";
import { TaxonomyBadge } from "@/components/dashboard/TaxonomyBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useRisks, useDashboardSummary } from "@/hooks/use-risks-data";
import { TaxonomyLabel } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function Risks() {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [taxonomyFilter, setTaxonomyFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");

  const { data: risks, isLoading: isLoadingRisks } = useRisks();
  const { data: dashboardSummary, isLoading: isLoadingSummary } = useDashboardSummary();

  const filteredRisks = (risks || []).filter((risk) => {
    if (severityFilter !== "all" && risk.severity.toString() !== severityFilter) return false;
    if (taxonomyFilter !== "all" && risk.taxonomy_label !== taxonomyFilter) return false;
    if (sectorFilter !== "all" && risk.sector !== sectorFilter) return false;
    return true;
  });

  const criticalCount = (risks || []).filter(r => r.severity === 5).length;
  const highCount = (risks || []).filter(r => r.severity === 4).length;
  const sectors = [...new Set((risks || []).map(r => r.sector))];
  const taxonomies = [...new Set((risks || []).map(r => r.taxonomy_label))];

  if (isLoadingRisks || isLoadingSummary) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risks</h1>
          <p className="text-muted-foreground mt-1">AI risk extractions and analysis</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Risks"
          value={dashboardSummary?.totals.risks || 0}
          icon={<Shield className="w-6 h-6" />}
          variant="primary"
        />
        <StatCard
          title="Critical"
          value={criticalCount}
          icon={<AlertTriangle className="w-6 h-6" />}
          variant="critical"
        />
        <StatCard
          title="High"
          value={highCount}
          icon={<AlertTriangle className="w-6 h-6" />}
          variant="warning"
        />
        <StatCard
          title="Sectors"
          value={sectors.length}
          icon={<Eye className="w-6 h-6" />}
        />
      </div>

      {/* Risk Matrix */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Risk Matrix (Severity vs Likelihood)</h3>
        <div className="grid grid-cols-6 gap-1">
          {/* Y-axis label */}
          <div className="flex items-center justify-end pr-2">
            <span className="text-[10px] text-muted-foreground -rotate-90 whitespace-nowrap uppercase tracking-wider">Likelihood</span>
          </div>
          {/* X-axis headers */}
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="text-center text-[10px] text-muted-foreground pb-2 uppercase tracking-wider">
              S{s}
            </div>
          ))}
          
          {/* Matrix cells */}
          {[5, 4, 3, 2, 1].map((likelihood) => (
            <>
              <div key={`l-${likelihood}`} className="flex items-center justify-end pr-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">L{likelihood}</span>
              </div>
              {[1, 2, 3, 4, 5].map((severity) => {
                const count = (risks || []).filter(
                  r => r.severity === severity && r.likelihood === likelihood
                ).length;
                const riskScore = severity * likelihood;
                return (
                  <div
                    key={`${severity}-${likelihood}`}
                    className={cn(
                      "h-12 rounded flex items-center justify-center text-xs font-mono transition-all cursor-pointer hover:scale-105 border",
                      riskScore >= 20 && "bg-critical/20 text-critical border-critical/30",
                      riskScore >= 12 && riskScore < 20 && "bg-orange-500/20 text-orange-400 border-orange-500/30",
                      riskScore >= 6 && riskScore < 12 && "bg-warning/20 text-warning border-warning/30",
                      riskScore >= 3 && riskScore < 6 && "bg-primary/20 text-primary border-primary/30",
                      riskScore < 3 && "bg-success/20 text-success border-success/30"
                    )}
                  >
                    {count > 0 ? count : "-"}
                  </div>
                );
              })}
            </>
          ))}
          
          {/* X-axis label */}
          <div />
          <div className="col-span-5 text-center text-[10px] text-muted-foreground pt-2 uppercase tracking-wider">
            Severity
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Severity:</span>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32 bg-background/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="5">Critical</SelectItem>
                <SelectItem value="4">High</SelectItem>
                <SelectItem value="3">Medium</SelectItem>
                <SelectItem value="2">Low</SelectItem>
                <SelectItem value="1">Very Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Category:</span>
            <Select value={taxonomyFilter} onValueChange={setTaxonomyFilter}>
              <SelectTrigger className="w-48 bg-background/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {taxonomies.map((t) => (
                  <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Sector:</span>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-36 bg-background/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {sectors.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1" />

          <Button variant="outline" size="sm" className="border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30" onClick={() => {
            setSeverityFilter("all");
            setTaxonomyFilter("all");
            setSectorFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Risks Table */}
      <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Severity</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Likelihood</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Sector</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Harm</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRisks.map((risk) => (
                <tr key={risk.id} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-primary">AIR-{risk.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <TaxonomyBadge label={risk.taxonomy_label} />
                  </td>
                  <td className="py-3 px-4">
                    <SeverityIndicator level={risk.severity} />
                  </td>
                  <td className="py-3 px-4">
                    <SeverityIndicator level={risk.likelihood} showLabel={false} />
                  </td>
                  <td className="py-3 px-4 text-xs text-foreground">{risk.sector}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs truncate" title={risk.harm}>
                    {risk.harm}
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(risk.created_at), { addSuffix: true })}
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

        {filteredRisks.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">No risks match the selected filters</p>
          </div>
        )}
      </Card>
    </div>
  );
}
