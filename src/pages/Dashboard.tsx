import { FileText, Shield, CheckCircle, Clock, Zap, Activity, Building2, Briefcase, Heart, TrendingUp, Target } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/card";
import { 
  mockDashboardSummary, 
  mockJobsSummary, 
  mockRiskCategoryDistribution,
  mockIndustryDistribution,
  mockConfidenceScore,
  secondaryTagLabels,
  SecondaryRiskTag
} from "@/lib/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Progress } from "@/components/ui/progress";

// Severity distribution data with 4 levels (Low, Medium, High, Critical)
const severityData = [
  { name: "Low", value: mockJobsSummary.severity_distribution["1"] + mockJobsSummary.severity_distribution["2"], color: "hsl(var(--success))" },
  { name: "Medium", value: mockJobsSummary.severity_distribution["3"], color: "hsl(var(--warning))" },
  { name: "High", value: mockJobsSummary.severity_distribution["4"], color: "hsl(25, 95%, 53%)" },
  { name: "Critical", value: mockJobsSummary.severity_distribution["5"], color: "hsl(var(--critical))" },
];

const totalSeverity = severityData.reduce((acc, item) => acc + item.value, 0);

// Primary categories data
const primaryCategoryData = [
  { name: "Technical Risks", value: mockRiskCategoryDistribution.primary.technical, color: "hsl(var(--primary))", description: "Infrastructure, systems, technology reliability" },
  { name: "Operational Risks", value: mockRiskCategoryDistribution.primary.operational, color: "hsl(var(--warning))", description: "Day-to-day operations, processes, workflows" },
  { name: "Business Risks", value: mockRiskCategoryDistribution.primary.business, color: "hsl(280, 70%, 50%)", description: "Strategic decisions, financial impact, positioning" },
];

// Get top secondary tags for each primary category
const technicalTags: SecondaryRiskTag[] = ["security_risk", "privacy_risk", "technical_performance_risk", "data_risk"];
const operationalTags: SecondaryRiskTag[] = ["compliance_regulatory_risk", "legal_liability_risk", "third_party_vendor_risk"];
const businessTags: SecondaryRiskTag[] = ["business_financial_risk", "reputational_risk", "ethical_risk", "strategic_risk"];

// Top industries by sector
const topIndustries = [
  ...Object.entries(mockIndustryDistribution.private).slice(0, 3).map(([name, count]) => ({ name, count, sector: "Private" })),
  ...Object.entries(mockIndustryDistribution.public).slice(0, 2).map(([name, count]) => ({ name, count, sector: "Public" })),
].sort((a, b) => b.count - a.count).slice(0, 5);

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">AI Risk Intelligence Platform Overview</p>
      </div>

      {/* Platform Metrics Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Platform Metrics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Articles Ingested"
            value={mockDashboardSummary.totals.articles.toLocaleString()}
            icon={<FileText className="w-5 h-5" />}
            variant="primary"
          />
          <StatCard
            title="Risks Mapped"
            value={mockDashboardSummary.totals.risks.toLocaleString()}
            icon={<Shield className="w-5 h-5" />}
            variant="warning"
          />
          <StatCard
            title="Success Rate"
            value={`${mockJobsSummary.success_rate}%`}
            icon={<CheckCircle className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            title="24h Activity"
            value={mockJobsSummary.recent_activity.last_24h}
            icon={<Activity className="w-5 h-5" />}
          />
          <StatCard
            title="Avg Processing"
            value={`${mockJobsSummary.avg_processing_time_seconds}s`}
            icon={<Clock className="w-5 h-5" />}
          />
          <StatCard
            title="Pending Queue"
            value={mockJobsSummary.totals.pending}
            icon={<Zap className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Risk Distribution & Categories Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Severity Distribution */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
          <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Risk Severity Distribution</h3>
          <div className="flex items-center gap-6">
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number) => [`${value} (${((value / totalSeverity) * 100).toFixed(1)}%)`, "Count"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {severityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{((item.value / totalSeverity) * 100).toFixed(0)}%</span>
                    <span className="text-sm font-mono font-semibold text-foreground w-12 text-right">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 border-t border-border pt-4">
            Severity is determined by potential impact magnitude, exploitability, and affected scope
          </p>
        </Card>

        {/* Primary Risk Categories */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
          <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Top Risk Categories</h3>
          <div className="space-y-4">
            {primaryCategoryData.map((category) => {
              const total = primaryCategoryData.reduce((acc, c) => acc + c.value, 0);
              const percentage = ((category.value / total) * 100).toFixed(0);
              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-foreground">{category.name}</span>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                    <span className="text-sm font-mono font-semibold text-foreground">{category.value}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%`, backgroundColor: category.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Secondary Tags Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Technical Risks */}
        <Card className="p-5 bg-card/50 backdrop-blur-sm border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Technical Risks</h4>
          </div>
          <div className="space-y-3">
            {technicalTags.map((tag) => (
              <div key={tag} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{secondaryTagLabels[tag]}</span>
                <span className="text-sm font-mono font-semibold text-foreground">{mockRiskCategoryDistribution.secondary[tag]}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Operational Risks */}
        <Card className="p-5 bg-card/50 backdrop-blur-sm border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Operational Risks</h4>
          </div>
          <div className="space-y-3">
            {operationalTags.map((tag) => (
              <div key={tag} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{secondaryTagLabels[tag]}</span>
                <span className="text-sm font-mono font-semibold text-foreground">{mockRiskCategoryDistribution.secondary[tag]}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Business Risks */}
        <Card className="p-5 bg-card/50 backdrop-blur-sm border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(280, 70%, 50%)" }} />
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Business Risks</h4>
          </div>
          <div className="space-y-3">
            {businessTags.map((tag) => (
              <div key={tag} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{secondaryTagLabels[tag]}</span>
                <span className="text-sm font-mono font-semibold text-foreground">{mockRiskCategoryDistribution.secondary[tag]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Industry & Confidence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Affected Industries */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Most Affected Industries</h3>
          </div>
          <div className="space-y-3">
            {topIndustries.map((industry, index) => (
              <div key={industry.name} className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">{industry.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        industry.sector === "Private" 
                          ? "bg-primary/20 text-primary" 
                          : "bg-warning/20 text-warning"
                      }`}>
                        {industry.sector}
                      </span>
                    </div>
                    <span className="text-sm font-mono font-semibold text-foreground">{industry.count} articles</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                      style={{ width: `${(industry.count / topIndustries[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Industry Sector Summary */}
          <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Private Sector</p>
                <p className="text-sm font-semibold text-foreground">
                  {Object.values(mockIndustryDistribution.private).reduce((a, b) => a + b, 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-warning" />
              <div>
                <p className="text-xs text-muted-foreground">Public Sector</p>
                <p className="text-sm font-semibold text-foreground">
                  {Object.values(mockIndustryDistribution.public).reduce((a, b) => a + b, 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-success" />
              <div>
                <p className="text-xs text-muted-foreground">Non-Profit</p>
                <p className="text-sm font-semibold text-foreground">
                  {Object.values(mockIndustryDistribution.nonprofit).reduce((a, b) => a + b, 0)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Confidence Score */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Analysis Confidence</h3>
          </div>
          
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(mockConfidenceScore / 100) * 352} 352`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-foreground">{mockConfidenceScore}%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Average confidence in risk classification and mapping accuracy
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">High Confidence (&gt;90%)</span>
              <span className="font-mono text-success">2,847</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Medium (70-90%)</span>
              <span className="font-mono text-warning">892</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Low (&lt;70%)</span>
              <span className="font-mono text-critical">153</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}