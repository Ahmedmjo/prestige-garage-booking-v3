/**
 * Branch color system
 * Branches do not carry their own color field, so we derive a stable accent
 * per branch from its position in the sorted list.
 * Avoids indigo / blue per project styling rules.
 */
export interface BranchColor {
  dot: string;
  ring: string;
  soft: string;
}

const PALETTE: BranchColor[] = [
  { dot: "#DC143C", ring: "rgba(220,20,60,0.45)",  soft: "rgba(220,20,60,0.12)"  },
  { dot: "#EAB308", ring: "rgba(234,179,8,0.45)",  soft: "rgba(234,179,8,0.12)"  },
  { dot: "#10B981", ring: "rgba(16,185,129,0.45)", soft: "rgba(16,185,129,0.12)" },
  { dot: "#F97316", ring: "rgba(249,115,22,0.45)", soft: "rgba(249,115,22,0.12)" },
  { dot: "#A855F7", ring: "rgba(168,85,247,0.45)", soft: "rgba(168,85,247,0.12)" },
  { dot: "#EC4899", ring: "rgba(236,72,153,0.45)", soft: "rgba(236,72,153,0.12)" },
  { dot: "#D946EF", ring: "rgba(217,70,239,0.45)", soft: "rgba(217,70,239,0.12)" },
  { dot: "#84CC16", ring: "rgba(132,204,22,0.45)", soft: "rgba(132,204,22,0.12)" },
];

const FALLBACK_COLOR: BranchColor = {
  dot: "#DC143C",
  ring: "rgba(220,20,60,0.45)",
  soft: "rgba(220,20,60,0.12)",
};

export function branchColor(index: number): BranchColor {
  if (!Number.isFinite(index) || index < 0) return FALLBACK_COLOR;
  return PALETTE[index % PALETTE.length] ?? FALLBACK_COLOR;
}

export function branchColorById(id: string): BranchColor {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return PALETTE[h % PALETTE.length] ?? FALLBACK_COLOR;
}

export const BRANCH_PALETTE = PALETTE;
