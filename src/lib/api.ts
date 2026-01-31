import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface DashboardSummary {
  totals: {
    articles: number;
    risks: number;
  };
  top_taxonomy_labels: [string, number][];
  top_tags: [string, number][];
}

export interface JobsSummary {
  totals: {
    total: number;
    pending: number;
    running: number;
    done: number;
    error: number;
    skipped: number;
  };
  success_rate: number;
  recent_activity: {
    last_24h: number;
    completed_24h: number;
  };
  job_types: { ingest: number; aiid: number };
  sources: { manual: number; discovery: number };
  avg_processing_time_seconds: number;
  severity_distribution: { "1": number; "2": number; "3": number; "4": number; "5": number };
}

export type JobStatus = "pending" | "running" | "done" | "error" | "skipped";
export type JobKind = "ingest" | "aiid" | "reextract";
export type JobSource = "manual" | "discovery" | "auto-ingest";

export interface Job {
  id: number;
  url: string;
  status: JobStatus;
  kind: JobKind;
  source: JobSource;
  created_at: string;
  updated_at: string;
  tries: number;
  last_error: string | null;
}

// Primary Risk Categories
export type PrimaryRiskCategory = "technical" | "operational" | "business";

// Secondary Risk Tags mapped to Primary Categories
export type SecondaryRiskTag = 
  | "security_risk"
  | "privacy_risk"
  | "technical_performance_risk"
  | "data_risk"
  | "compliance_regulatory_risk"
  | "legal_liability_risk"
  | "third_party_vendor_risk"
  | "business_financial_risk"
  | "reputational_risk"
  | "ethical_risk"
  | "strategic_risk";

export const primaryCategoryMapping: Record<SecondaryRiskTag, PrimaryRiskCategory> = {
  security_risk: "technical",
  privacy_risk: "technical",
  technical_performance_risk: "technical",
  data_risk: "technical",
  compliance_regulatory_risk: "operational",
  legal_liability_risk: "operational",
  third_party_vendor_risk: "operational",
  business_financial_risk: "business",
  reputational_risk: "business",
  ethical_risk: "business",
  strategic_risk: "business",
};

export const secondaryTagLabels: Record<SecondaryRiskTag, string> = {
  security_risk: "Security Risk",
  privacy_risk: "Privacy Risk",
  technical_performance_risk: "Technical/Performance Risk",
  data_risk: "Data Risk",
  compliance_regulatory_risk: "Compliance/Regulatory Risk",
  legal_liability_risk: "Legal/Liability Risk",
  third_party_vendor_risk: "Third-Party/Vendor Risk",
  business_financial_risk: "Business/Financial Risk",
  reputational_risk: "Reputational Risk",
  ethical_risk: "Ethical Risk",
  strategic_risk: "Strategic Risk",
};

// 7 Risk Domains
export type RiskDomain = 
  | "safety_harm"
  | "security_threats"
  | "privacy_data"
  | "fairness_bias"
  | "transparency_accountability"
  | "reliability_robustness"
  | "societal_environmental";

export const riskDomainLabels: Record<RiskDomain, string> = {
  safety_harm: "Safety & Harm",
  security_threats: "Security Threats",
  privacy_data: "Privacy & Data",
  fairness_bias: "Fairness & Bias",
  transparency_accountability: "Transparency & Accountability",
  reliability_robustness: "Reliability & Robustness",
  societal_environmental: "Societal & Environmental",
};

// Industry Types
export type IndustrySector = "public" | "private" | "nonprofit";

export const publicSectorIndustries = [
  "Federal Government (US)",
  "State Government (US)",
  "Local Government (US)",
  "International Governments",
  "Educational Institutions (Public)",
  "Public Healthcare Systems",
  "Public Utilities",
  "Defense & Military",
  "Law Enforcement & Emergency Services",
  "Unknown",
] as const;

export const privateSectorIndustries = [
  "Healthcare",
  "Finance & Banking",
  "Insurance",
  "GovTech",
  "Manufacturing",
  "Retail & E-commerce",
  "Technology & Software",
  "Telecommunications",
  "Energy & Utilities",
  "Transportation & Logistics",
  "Real Estate & Construction",
  "Professional Services",
  "Media & Entertainment",
  "Hospitality & Tourism",
  "Agriculture & Food Production",
  "Pharmaceuticals & Biotechnology",
  "Automotive",
  "Aerospace & Defense (Private)",
  "Chemical & Materials",
  "Consumer Goods",
  "Unknown",
] as const;

export const nonprofitIndustries = [
  "Educational Institutions (Non-Profit)",
  "Healthcare (Non-Profit)",
  "Social Services",
  "Arts & Culture",
  "Environmental & Conservation",
  "International Development & Relief",
  "Advocacy & Civil Rights",
  "Religious Organizations",
  "Research & Think Tanks",
  "Foundations & Grantmaking",
  "Community Development",
  "Unknown",
] as const;

export type TaxonomyLabel = 
  | "model_misuse" 
  | "data_poisoning" 
  | "misaligned_objectives" 
  | "privacy_violation" 
  | "fairness_bias" 
  | "robustness_failure" 
  | "safety_constraint_failure" 
  | "disinformation" 
  | "cybersecurity_vulnerability" 
  | "supply_chain_risk" 
  | "other";

export interface Extraction {
  id: number;
  article_id: number;
  taxonomy_label: TaxonomyLabel;
  taxonomy_subcategory: string;
  actor: string;
  asset: string;
  capability: string;
  harm: string;
  preconditions: string;
  sector: string;
  industries: string[];
  severity: 1 | 2 | 3 | 4 | 5;
  severity_rationale: string;
  likelihood: 1 | 2 | 3 | 4 | 5;
  likelihood_rationale: string;
  created_at: string;
  primary_category?: PrimaryRiskCategory;
  secondary_tag?: SecondaryRiskTag;
  confidence_score?: number;
  risk_domain?: RiskDomain;
}

export interface Article {
  id: number;
  url: string;
  title: string;
  raw_text?: string;
  sha256?: string;
  created_at: string;
  risks_count?: number;
}

// Time-based trend analysis types
export interface TrendData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: "up" | "down" | "stable";
}

export interface RiskCategoryTrend {
  category: SecondaryRiskTag;
  label: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: "up" | "down" | "stable";
}

export interface TimePeriodComparison {
  period: "week" | "month";
  severity: {
    low: TrendData;
    medium: TrendData;
    high: TrendData;
    critical: TrendData;
  };
  categories: RiskCategoryTrend[];
  primaryCategories: {
    technical: TrendData;
    operational: TrendData;
    business: TrendData;
  };
  overall: TrendData;
}

export interface RiskCategoryDistribution {
  primary: {
    technical: number;
    operational: number;
    business: number;
  };
  secondary: Record<SecondaryRiskTag, number>;
  domains: Record<RiskDomain, number>;
}

export interface IndustryDistribution {
  public: Record<string, number>;
  private: Record<string, number>;
  nonprofit: Record<string, number>;
}

export interface ConfidenceMetrics {
  average: number;
  high: number; // count of >90%
  medium: number; // count of 70-90%
  low: number; // count of <70%
}

// API Functions
export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await api.get('/dashboard/summary');
  return data;
};

export const fetchJobsSummary = async (): Promise<JobsSummary> => {
  const { data } = await api.get('/dashboard/jobs/summary');
  return data;
};

export const fetchArticles = async (): Promise<Article[]> => {
  const { data } = await api.get('/dashboard/articles');
  return data;
};

export const fetchRisks = async (): Promise<Extraction[]> => {
  const { data } = await api.get('/dashboard/risks');
  return data;
};

export const fetchRiskCategoryDistribution = async (): Promise<RiskCategoryDistribution> => {
  const { data } = await api.get('/dashboard/risk-categories');
  return data;
};

export const fetchIndustryDistribution = async (): Promise<IndustryDistribution> => {
  const { data } = await api.get('/dashboard/industries');
  return data;
};

export const fetchConfidenceMetrics = async (): Promise<ConfidenceMetrics> => {
  const { data } = await api.get('/dashboard/confidence');
  return data;
};

export const fetchTimePeriodComparison = async (period: "week" | "month" = "week"): Promise<TimePeriodComparison> => {
  const { data } = await api.get(`/dashboard/trends?period=${period}`);
  return data;
};

export const fetchJobs = async (): Promise<Job[]> => {
  const { data } = await api.get('/dashboard/jobs');
  return data;
};
