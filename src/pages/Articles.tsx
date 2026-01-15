import { FileText, ExternalLink, Shield, Copy, Check } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockArticles, mockDashboardSummary } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Articles() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Articles</h1>
        <p className="text-muted-foreground mt-1">Source articles and documents</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Articles"
          value={mockDashboardSummary.totals.articles}
          icon={<FileText className="w-6 h-6" />}
          variant="primary"
        />
        <StatCard
          title="Risks Extracted"
          value={mockDashboardSummary.totals.risks}
          icon={<Shield className="w-6 h-6" />}
          variant="warning"
        />
        <StatCard
          title="Avg Risks/Article"
          value={(mockDashboardSummary.totals.risks / mockDashboardSummary.totals.articles).toFixed(1)}
          icon={<FileText className="w-6 h-6" />}
        />
      </div>

      {/* Articles Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">URL</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Risks</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockArticles.map((article) => (
                <tr key={article.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm text-primary">#{article.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-foreground font-medium line-clamp-2 max-w-md">
                      {article.title}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 max-w-xs">
                      <span className="text-sm text-muted-foreground truncate">
                        {new URL(article.url).hostname}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => copyUrl(article.id, article.url)}
                      >
                        {copiedId === article.id ? (
                          <Check className="w-3 h-3 text-success" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                      >
                        <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-xs font-mono",
                      article.risks_count && article.risks_count >= 4 && "bg-critical/10 text-critical",
                      article.risks_count && article.risks_count >= 2 && article.risks_count < 4 && "bg-warning/10 text-warning",
                      (!article.risks_count || article.risks_count < 2) && "bg-muted text-muted-foreground"
                    )}>
                      {article.risks_count || 0}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-primary">
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        Risks
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mockArticles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No articles found</p>
          </div>
        )}
      </Card>
    </div>
  );
}
