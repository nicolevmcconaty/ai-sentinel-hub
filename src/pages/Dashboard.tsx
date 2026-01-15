import { FileText, Shield, AlertTriangle, CheckCircle, Clock, Zap, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/card";
import { mockDashboardSummary, mockJobsSummary, mockRisks, TaxonomyLabel } from "@/lib/api";
import { TaxonomyBadge } from "@/components/dashboard/TaxonomyBadge";
import { SeverityIndicator } from "@/components/dashboard/SeverityIndicator";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { formatDistanceToNow } from "date-fns";

const severityData = [
  { name: "Very Low", value: mockJobsSummary.severity_distribution["1"], color: "hsl(160 84% 39%)" },
  { name: "Low", value: mockJobsSummary.severity_distribution["2"], color: "hsl(217 91% 60%)" },
  { name: "Medium", value: mockJobsSummary.severity_distribution["3"], color: "hsl(38 92% 50%)" },
  { name: "High", value: mockJobsSummary.severity_distribution["4"], color: "hsl(25 95% 53%)" },
  { name: "Critical", value: mockJobsSummary.severity_distribution["5"], color: "hsl(0 84% 60%)" },
];

const taxonomyData = mockDashboardSummary.top_taxonomy_labels.slice(0, 6).map(([label, count]) => ({
  name: label.replace(/_/g, " "),
  label: label as TaxonomyLabel,
  count,
}));

export default function Dashboard() {
  const criticalRisks = mockRisks.filter(r => r.severity === 5).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">AI Risk Intelligence Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Articles"
          value={mockDashboardSummary.totals.articles}
          icon={<FileText className="w-6 h-6" />}
          change={12}
          trend="up"
          variant="primary"
        />
        <StatCard
          title="Risks Identified"
          value={mockDashboardSummary.totals.risks}
          icon={<Shield className="w-6 h-6" />}
          change={8}
          trend="up"
          variant="warning"
        />
        <StatCard
          title="Critical Risks"
          value={criticalRisks}
          icon={<AlertTriangle className="w-6 h-6" />}
          variant="critical"
        />
        <StatCard
          title="Success Rate"
          value={`${mockJobsSummary.success_rate}%`}
          icon={<CheckCircle className="w-6 h-6" />}
          variant="success"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="24h Activity"
          value={mockJobsSummary.recent_activity.last_24h}
          icon={<Activity className="w-6 h-6" />}
        />
        <StatCard
          title="Avg Processing Time"
          value={`${mockJobsSummary.avg_processing_time_seconds}s`}
          icon={<Clock className="w-6 h-6" />}
        />
        <StatCard
          title="Pending Queue"
          value={mockJobsSummary.totals.pending}
          icon={<Zap className="w-6 h-6" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Risk Severity Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} layout="vertical">
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={70} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Risk Categories */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Top Risk Categories</h3>
          <div className="space-y-3">
            {taxonomyData.map(({ label, count }) => (
              <div key={label} className="flex items-center justify-between">
                <TaxonomyBadge label={label} />
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(count / taxonomyData[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Risks */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Recent Risks</h3>
          <a href="/risks" className="text-sm text-primary hover:underline">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Severity</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Sector</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Harm</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody>
              {mockRisks.slice(0, 5).map((risk) => (
                <tr key={risk.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm text-primary">AIR-{risk.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <TaxonomyBadge label={risk.taxonomy_label} />
                  </td>
                  <td className="py-3 px-4">
                    <SeverityIndicator level={risk.severity} />
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">{risk.sector}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs truncate">{risk.harm}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(risk.created_at), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
