import { cn } from "@/lib/utils";
import { TaxonomyLabel } from "@/lib/api";

interface TaxonomyBadgeProps {
  label: TaxonomyLabel;
  className?: string;
}

const taxonomyConfig: Record<TaxonomyLabel, { display: string; className: string }> = {
  model_misuse: {
    display: "Model Misuse",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  data_poisoning: {
    display: "Data Poisoning",
    className: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },
  misaligned_objectives: {
    display: "Misaligned Objectives",
    className: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  },
  privacy_violation: {
    display: "Privacy Violation",
    className: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  },
  fairness_bias: {
    display: "Fairness & Bias",
    className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  },
  robustness_failure: {
    display: "Robustness Failure",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  safety_constraint_failure: {
    display: "Safety Constraint",
    className: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  },
  disinformation: {
    display: "Disinformation",
    className: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  },
  cybersecurity_vulnerability: {
    display: "Cybersecurity",
    className: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  },
  supply_chain_risk: {
    display: "Supply Chain",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  other: {
    display: "Other",
    className: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  },
};

export function TaxonomyBadge({ label, className }: TaxonomyBadgeProps) {
  const config = taxonomyConfig[label];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wide",
        config.className,
        className
      )}
    >
      {config.display}
    </span>
  );
}
