import type { ContentStage } from "@/types";
import clsx from "clsx";

const STAGE_CONFIG: Record<
  ContentStage,
  { label: string; className: string }
> = {
  DRAFT: { label: "Draft", className: "stage-badge--draft" },
  IN_REVIEW: { label: "In review", className: "stage-badge--in-review" },
  PUBLISHED: { label: "Published", className: "stage-badge--published" },
};

interface StageBadgeProps {
  stage: ContentStage;
}

export function StageBadge({ stage }: StageBadgeProps) {
  const config = STAGE_CONFIG[stage];
  if (!config) return null;
  return (
    <span className={clsx("stage-badge", config.className)}>
      {config.label}
    </span>
  );
}
