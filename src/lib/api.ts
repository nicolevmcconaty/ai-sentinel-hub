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

// Mock data for development
export const mockDashboardSummary: DashboardSummary = {
  totals: {
    articles: 10247,
    risks: 3892,
  },
  top_taxonomy_labels: [
    ["model_misuse", 847],
    ["data_poisoning", 634],
    ["privacy_violation", 521],
    ["cybersecurity_vulnerability", 489],
    ["fairness_bias", 412],
    ["misaligned_objectives", 298],
    ["disinformation", 267],
    ["robustness_failure", 198],
    ["safety_constraint_failure", 142],
    ["supply_chain_risk", 84],
  ],
  top_tags: [
    ["LLM", 892],
    ["Healthcare", 567],
    ["Finance", 498],
    ["Autonomous Systems", 387],
    ["Deepfakes", 312],
  ],
};

export const mockJobsSummary: JobsSummary = {
  totals: {
    total: 2847,
    pending: 18,
    running: 7,
    done: 2654,
    error: 89,
    skipped: 74,
  },
  success_rate: 94,
  recent_activity: {
    last_24h: 342,
    completed_24h: 328,
  },
  job_types: { ingest: 1892, aiid: 955 },
  sources: { manual: 423, discovery: 2424 },
  avg_processing_time_seconds: 2.3,
  severity_distribution: { "1": 1362, "2": 1751, "3": 195, "4": 584, "5": 0 },
};

// Risk category distribution (mapped to new taxonomy)
export const mockRiskCategoryDistribution = {
  primary: {
    technical: 1456,
    operational: 987,
    business: 1449,
  },
  secondary: {
    security_risk: 234,
    privacy_risk: 156,
    technical_performance_risk: 89,
    data_risk: 142,
    compliance_regulatory_risk: 189,
    legal_liability_risk: 67,
    third_party_vendor_risk: 45,
    business_financial_risk: 134,
    reputational_risk: 98,
    ethical_risk: 76,
    strategic_risk: 54,
  } as Record<SecondaryRiskTag, number>,
};

// Industry distribution
export const mockIndustryDistribution = {
  public: {
    "Federal Government (US)": 289,
    "State Government (US)": 156,
    "Defense & Military": 134,
    "Educational Institutions (Public)": 98,
    "Law Enforcement & Emergency Services": 67,
  },
  private: {
    "Healthcare": 456,
    "Finance & Banking": 398,
    "Technology & Software": 367,
    "Insurance": 234,
    "Manufacturing": 189,
  },
  nonprofit: {
    "Research & Think Tanks": 145,
    "Educational Institutions (Non-Profit)": 123,
    "Healthcare (Non-Profit)": 89,
    "Environmental & Conservation": 56,
  },
};

// Average confidence score
export const mockConfidenceScore = 87.3;

export const mockJobs: Job[] = [
  { id: 1001, url: "https://arxiv.org/abs/2401.12345", status: "done", kind: "ingest", source: "discovery", created_at: "2024-01-15T10:30:00Z", updated_at: "2024-01-15T10:32:15Z", tries: 1, last_error: null },
  { id: 1002, url: "https://openai.com/research/gpt-5-safety", status: "running", kind: "aiid", source: "manual", created_at: "2024-01-15T10:45:00Z", updated_at: "2024-01-15T10:45:30Z", tries: 1, last_error: null },
  { id: 1003, url: "https://deepmind.google/safety-research", status: "pending", kind: "ingest", source: "discovery", created_at: "2024-01-15T11:00:00Z", updated_at: "2024-01-15T11:00:00Z", tries: 0, last_error: null },
  { id: 1004, url: "https://anthropic.com/research/constitutional-ai", status: "error", kind: "ingest", source: "manual", created_at: "2024-01-15T09:15:00Z", updated_at: "2024-01-15T09:18:45Z", tries: 3, last_error: "Connection timeout after 30s" },
  { id: 1005, url: "https://microsoft.com/ai-red-team", status: "done", kind: "aiid", source: "discovery", created_at: "2024-01-15T08:30:00Z", updated_at: "2024-01-15T08:35:22Z", tries: 1, last_error: null },
  { id: 1006, url: "https://nist.gov/ai-risk-framework", status: "skipped", kind: "ingest", source: "discovery", created_at: "2024-01-15T07:00:00Z", updated_at: "2024-01-15T07:00:05Z", tries: 0, last_error: "Duplicate content detected" },
  { id: 1007, url: "https://ieee.org/ai-ethics-standards", status: "done", kind: "ingest", source: "manual", created_at: "2024-01-14T22:30:00Z", updated_at: "2024-01-14T22:34:18Z", tries: 1, last_error: null },
  { id: 1008, url: "https://acm.org/ai-bias-study", status: "done", kind: "aiid", source: "discovery", created_at: "2024-01-14T20:15:00Z", updated_at: "2024-01-14T20:19:33Z", tries: 2, last_error: null },
];

export const mockRisks: Extraction[] = [
  { id: 100001, article_id: 501, taxonomy_label: "model_misuse", taxonomy_subcategory: "Prompt Injection", actor: "Malicious Users", asset: "LLM Systems", capability: "Bypass safety filters through crafted prompts", harm: "Unauthorized access to restricted content and actions", preconditions: "Direct API access or chat interface", sector: "Technology", industries: ["AI/ML", "SaaS"], severity: 5, severity_rationale: "Direct exploitation path with immediate impact", likelihood: 4, likelihood_rationale: "Well-documented attack vector with public examples", created_at: "2024-01-15T10:32:15Z", primary_category: "technical", secondary_tag: "security_risk", confidence_score: 92 },
  { id: 100002, article_id: 502, taxonomy_label: "data_poisoning", taxonomy_subcategory: "Training Data Manipulation", actor: "Nation State Actors", asset: "Foundation Models", capability: "Inject malicious patterns into training data", harm: "Compromised model behavior at scale", preconditions: "Access to training pipeline or data sources", sector: "Defense", industries: ["Government", "Defense"], severity: 5, severity_rationale: "Critical infrastructure at risk", likelihood: 3, likelihood_rationale: "Requires significant resources and access", created_at: "2024-01-15T09:18:45Z", primary_category: "technical", secondary_tag: "data_risk", confidence_score: 88 },
  { id: 100003, article_id: 503, taxonomy_label: "privacy_violation", taxonomy_subcategory: "Data Leakage", actor: "Researchers", asset: "User Data", capability: "Extract training data through model queries", harm: "Exposure of PII and sensitive information", preconditions: "API access to trained model", sector: "Healthcare", industries: ["Healthcare", "Insurance"], severity: 4, severity_rationale: "Regulatory and reputational impact", likelihood: 4, likelihood_rationale: "Proven extraction techniques exist", created_at: "2024-01-15T08:35:22Z", primary_category: "technical", secondary_tag: "privacy_risk", confidence_score: 94 },
  { id: 100004, article_id: 504, taxonomy_label: "fairness_bias", taxonomy_subcategory: "Demographic Bias", actor: "System Operators", asset: "Decision Systems", capability: "Unintentional discrimination in outputs", harm: "Unfair treatment of protected groups", preconditions: "Biased training data or evaluation", sector: "Finance", industries: ["Banking", "Lending"], severity: 4, severity_rationale: "Legal liability and discrimination", likelihood: 5, likelihood_rationale: "Common in deployed systems", created_at: "2024-01-14T22:34:18Z", primary_category: "business", secondary_tag: "ethical_risk", confidence_score: 91 },
  { id: 100005, article_id: 505, taxonomy_label: "cybersecurity_vulnerability", taxonomy_subcategory: "Model Theft", actor: "Competitors", asset: "Proprietary Models", capability: "Replicate model through API queries", harm: "IP theft and competitive disadvantage", preconditions: "Public API access", sector: "Technology", industries: ["AI/ML", "Enterprise"], severity: 3, severity_rationale: "Financial impact but recoverable", likelihood: 4, likelihood_rationale: "Distillation attacks well documented", created_at: "2024-01-14T20:19:33Z", primary_category: "business", secondary_tag: "business_financial_risk", confidence_score: 86 },
  { id: 100006, article_id: 506, taxonomy_label: "disinformation", taxonomy_subcategory: "Synthetic Media", actor: "Political Actors", asset: "Public Trust", capability: "Generate convincing fake content at scale", harm: "Election interference and social discord", preconditions: "Access to generative AI tools", sector: "Media", industries: ["Media", "Social Platforms"], severity: 5, severity_rationale: "Democratic process at risk", likelihood: 5, likelihood_rationale: "Already occurring in multiple countries", created_at: "2024-01-14T18:45:00Z", primary_category: "business", secondary_tag: "reputational_risk", confidence_score: 89 },
];

export const mockArticles: Article[] = [
  { id: 501, url: "https://arxiv.org/abs/2401.12345", title: "Prompt Injection Attacks on Large Language Models: A Comprehensive Survey", created_at: "2024-01-15T10:30:00Z", risks_count: 3 },
  { id: 502, url: "https://openai.com/research/gpt-5-safety", title: "Adversarial Training Data: Risks and Mitigations in Foundation Models", created_at: "2024-01-15T09:15:00Z", risks_count: 2 },
  { id: 503, url: "https://deepmind.google/safety-research", title: "Privacy-Preserving Machine Learning: Current State and Challenges", created_at: "2024-01-15T08:30:00Z", risks_count: 4 },
  { id: 504, url: "https://anthropic.com/research/constitutional-ai", title: "Measuring and Mitigating Algorithmic Bias in AI Systems", created_at: "2024-01-14T22:30:00Z", risks_count: 2 },
  { id: 505, url: "https://microsoft.com/ai-red-team", title: "Model Extraction Attacks: Techniques and Defenses", created_at: "2024-01-14T20:15:00Z", risks_count: 1 },
  { id: 506, url: "https://nist.gov/ai-risk-framework", title: "AI-Generated Disinformation: Detection and Prevention Strategies", created_at: "2024-01-14T18:45:00Z", risks_count: 5 },
];