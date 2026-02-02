import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { RiskDomain } from "@/lib/api";
import { Network, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RiskEntry {
  id: string;
  documentId: string;
  categoryLevel: "Risk Category" | "Risk Sub-Category";
  riskCategory: string;
  riskSubcategory?: string;
  description: string;
  entity?: "AI" | "Human" | "Other";
}

interface DomainData {
  domain: RiskDomain;
  title: string;
  count: number;
  subcategories: {
    name: string;
    count: number;
    entries: RiskEntry[];
  }[];
}

interface RiskDomainTableCardProps {
  domains: Record<RiskDomain, number>;
  isLoading?: boolean;
  onDomainClick?: (domain: RiskDomain) => void;
}

// Domain configuration with full titles
const domainConfig: Record<RiskDomain, { title: string; prefix: string }> = {
  safety_harm: { 
    title: "1 Model Development & Technical", 
    prefix: "01"
  },
  security_threats: { 
    title: "2 Deployment & Integration", 
    prefix: "02"
  },
  privacy_data: { 
    title: "3 Data & Privacy", 
    prefix: "03"
  },
  fairness_bias: { 
    title: "4 Governance & Compliance", 
    prefix: "04"
  },
  transparency_accountability: { 
    title: "5 Operational & Performance", 
    prefix: "05"
  },
  reliability_robustness: { 
    title: "6 Societal & Ethical", 
    prefix: "06"
  },
  societal_environmental: { 
    title: "7 Security & Adversarial", 
    prefix: "07"
  },
};

// Generate sample entries for demo
const generateSampleEntries = (domain: RiskDomain, count: number): DomainData => {
  const config = domainConfig[domain];
  const subcategoryNames: Record<RiskDomain, string[]> = {
    safety_harm: ["Training Data Issues", "Model Architecture Flaws", "Alignment Failures"],
    security_threats: ["System Integration Risks", "API Vulnerabilities", "Deployment Errors"],
    privacy_data: ["Data Breach/Privacy & Liberty", "PII Exposure", "Consent Violations"],
    fairness_bias: ["Bias and discrimination", "Representational Harms", "Regulatory Non-compliance"],
    transparency_accountability: ["Risk of Injury", "Performance Degradation", "Monitoring Failures"],
    reliability_robustness: ["Toxicity and Bias Tendencies", "Unfair discrimination", "Social Impact"],
    societal_environmental: ["Adversarial Attacks", "Broken systems", "Malicious Use"],
  };

  const subcategories = subcategoryNames[domain].map((name, subIdx) => {
    const subCount = Math.floor(count / 3) + (subIdx === 0 ? count % 3 : 0);
    const entries: RiskEntry[] = Array.from({ length: Math.min(subCount, 5) }, (_, i) => ({
      id: `${config.prefix}.${String(subIdx + 1).padStart(2, '0')}.${String(i).padStart(2, '0')}`,
      documentId: `Doc${2023 + Math.floor(Math.random() * 2)}`,
      categoryLevel: i % 3 === 0 ? "Risk Sub-Category" : "Risk Category",
      riskCategory: name,
      riskSubcategory: i % 3 === 0 ? `${name} - Detail ${i + 1}` : undefined,
      description: `Risk analysis for ${name.toLowerCase()} covering potential impacts and mitigation strategies...`,
      entity: ["AI", "Human", "Other"][Math.floor(Math.random() * 3)] as "AI" | "Human" | "Other",
    }));
    return { name: `${subIdx + 1}.${subIdx + 1} ${name}`, count: subCount, entries };
  });

  return {
    domain,
    title: config.title,
    count,
    subcategories,
  };
};

function CategoryLevelBadge({ level }: { level: "Risk Category" | "Risk Sub-Category" }) {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "text-[10px] font-medium border",
        level === "Risk Category" 
          ? "bg-amber-500/15 text-amber-400 border-amber-500/30" 
          : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      )}
    >
      {level}
    </Badge>
  );
}

function EntityBadge({ entity }: { entity: "AI" | "Human" | "Other" }) {
  const colors = {
    AI: "bg-primary/15 text-primary border-primary/30",
    Human: "bg-warning/15 text-warning border-warning/30",
    Other: "bg-muted text-muted-foreground border-border",
  };
  
  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium", colors[entity])}>
      {entity}
    </Badge>
  );
}

function DomainSection({ data, onDomainClick }: { data: DomainData; onDomainClick?: (domain: RiskDomain) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubcategories, setOpenSubcategories] = useState<Record<string, boolean>>({});

  const toggleSubcategory = (name: string) => {
    setOpenSubcategories(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div 
          className={cn(
            "flex items-center gap-2 p-2 hover:bg-muted/50 transition-colors border-b border-border/50",
            isOpen && "bg-muted/30"
          )}
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Domain Category
          </span>
          <span className="text-sm font-semibold text-foreground flex-1 text-left">
            {data.title}
          </span>
          <Badge variant="secondary" className="text-[10px]">
            {data.count}
          </Badge>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        {data.subcategories.map((sub) => (
          <Collapsible 
            key={sub.name} 
            open={openSubcategories[sub.name]} 
            onOpenChange={() => toggleSubcategory(sub.name)}
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center gap-2 p-2 pl-8 hover:bg-muted/30 transition-colors border-b border-border/30">
                {openSubcategories[sub.name] ? (
                  <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                )}
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                  Subdomain Category
                </span>
                <span className="text-xs font-medium text-foreground flex-1 text-left">
                  {sub.name}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {sub.count}
                </Badge>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="border-b border-border/30">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border/30">
                      <TableHead className="w-20 text-[10px] h-8 pl-12">Ev_ID</TableHead>
                      <TableHead className="w-24 text-[10px] h-8">Risk_ID</TableHead>
                      <TableHead className="w-28 text-[10px] h-8">Category Level</TableHead>
                      <TableHead className="text-[10px] h-8">Risk Category</TableHead>
                      <TableHead className="text-[10px] h-8">Risk Subcategory</TableHead>
                      <TableHead className="text-[10px] h-8 max-w-[200px]">Description</TableHead>
                      <TableHead className="w-16 text-[10px] h-8">Entity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sub.entries.map((entry, idx) => (
                      <TableRow 
                        key={entry.id} 
                        className="hover:bg-muted/20 border-b border-border/20 cursor-pointer"
                        onClick={() => onDomainClick?.(data.domain)}
                      >
                        <TableCell className="text-[11px] font-mono py-2 pl-12">{entry.id}</TableCell>
                        <TableCell className="text-[11px] py-2">{entry.documentId}</TableCell>
                        <TableCell className="py-2">
                          <CategoryLevelBadge level={entry.categoryLevel} />
                        </TableCell>
                        <TableCell className="text-[11px] py-2">{entry.riskCategory}</TableCell>
                        <TableCell className="text-[11px] text-muted-foreground py-2">
                          {entry.riskSubcategory || "—"}
                        </TableCell>
                        <TableCell className="text-[11px] text-muted-foreground py-2 max-w-[200px] truncate">
                          {entry.description}
                        </TableCell>
                        <TableCell className="py-2">
                          {entry.entity && <EntityBadge entity={entry.entity} />}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function RiskDomainTableCard({ 
  domains, 
  isLoading,
  onDomainClick 
}: RiskDomainTableCardProps) {
  const total = Object.values(domains).reduce((a, b) => a + b, 0);
  
  // Generate domain data
  const domainData: DomainData[] = (Object.keys(domains) as RiskDomain[])
    .map(domain => generateSampleEntries(domain, domains[domain]))
    .sort((a, b) => b.count - a.count);

  if (isLoading) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
            Map to Risk Database Taxonomy (7 Domains)
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">
          Total: <span className="font-semibold text-foreground">{total.toLocaleString()}</span> records
        </span>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        {domainData.map((data) => (
          <DomainSection 
            key={data.domain} 
            data={data} 
            onDomainClick={onDomainClick}
          />
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground mt-3">
        Click any domain or entry to filter articles by taxonomy classification
      </p>
    </Card>
  );
}
