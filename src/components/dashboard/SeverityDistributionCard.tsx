import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AlertTriangle, Info } from "lucide-react";

interface SeverityData {
  name: string;
  value: number;
  previousValue: number;
  color: string;
}

interface SeverityDistributionCardProps {
  data: SeverityData[];
  overallConfidence?: number;
  showComparison?: boolean;
}

export function SeverityDistributionCard({ 
  data, 
  overallConfidence = 87.4,
  showComparison = true 
}: SeverityDistributionCardProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const previousTotal = data.reduce((acc, item) => acc + item.previousValue, 0);

  const getChangeIndicator = (current: number, previous: number) => {
    if (current === previous) return { text: "—", color: "text-muted-foreground" };
    const change = current - previous;
    const percent = previous > 0 ? ((change / previous) * 100).toFixed(1) : "N/A";
    return {
      text: `${change > 0 ? "+" : ""}${change} (${percent}%)`,
      color: change > 0 ? "text-critical" : "text-success"
    };
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
            Risk Severity Distribution
          </h3>
        </div>
        {overallConfidence && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Confidence:</span>
            <span className={`font-semibold ${overallConfidence >= 80 ? "text-success" : overallConfidence >= 60 ? "text-warning" : "text-critical"}`}>
              {overallConfidence.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Pie Chart */}
        <div className="h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
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
                formatter={(value: number, _name: string, props: { payload: SeverityData }) => {
                  const item = props.payload;
                  return [
                    <div key="tooltip" className="space-y-1">
                      <div>Current: {value} ({total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)</div>
                      {showComparison && (
                        <div className="text-muted-foreground text-xs">
                          Previous: {item.previousValue}
                        </div>
                      )}
                    </div>,
                    item.name
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with comparison */}
        <div className="flex-1 space-y-3">
          {data.map((item) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : "0";
            const changeInfo = getChangeIndicator(item.value, item.previousValue);
            
            return (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{percentage}%</span>
                  <span className="text-sm font-mono font-semibold text-foreground w-12 text-right">
                    {item.value}
                  </span>
                  {showComparison && (
                    <span className={`text-[10px] w-20 text-right ${changeInfo.color}`}>
                      {changeInfo.text}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Totals row */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm font-semibold text-foreground">Total</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">100%</span>
              <span className="text-sm font-mono font-bold text-foreground w-12 text-right">
                {total}
              </span>
              {showComparison && (
                <span className={`text-[10px] w-20 text-right ${getChangeIndicator(total, previousTotal).color}`}>
                  {getChangeIndicator(total, previousTotal).text}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Explanation note */}
      <div className="flex items-start gap-2 mt-4 pt-4 border-t border-border">
        <Info className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Severity is determined by AI analysis of impact scale, financial implications, regulatory factors, affected entities, and urgency indicators.
        </p>
      </div>
    </Card>
  );
}