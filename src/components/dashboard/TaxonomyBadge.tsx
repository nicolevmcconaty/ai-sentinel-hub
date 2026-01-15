import { cn } from "@/lib/utils";
import { TaxonomyLabel } from "@/lib/api";

interface TaxonomyBadgeProps {
  label: TaxonomyLabel;
  className?: string;
}

const taxonomyConfig: Record<TaxonomyLabel, { display: string; className: string }> = {
  model_misuse: {
    display: "Model Misuse",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  data_poisoning: {
    display: "Data Poisoning",
    className: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  misaligned_objectives: {
    display: "Misaligned Objectives",
    className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
  privacy_violation: {
    display: "Privacy Violation",
    className: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  },
  fairness_bias: {
    display: "Fairness & Bias",
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  robustness_failure: {
    display: "Robustness Failure",
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  safety_constraint_failure: {
    display: "Safety Constraint",
    className: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
  disinformation: {
    display: "Disinformation",
    className: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  },
  cybersecurity_vulnerability: {
    display: "Cybersecurity",
    className: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  },
  supply_chain_risk: {
    display: "Supply Chain",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  other: {
    display: "Other",
    className: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  },
};

export function TaxonomyBadge({ label, className }: TaxonomyBadgeProps) {
  const config = taxonomyConfig[label];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.display}
    </span>
  );
}
