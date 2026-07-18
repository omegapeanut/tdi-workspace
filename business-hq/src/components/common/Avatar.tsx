import { initials } from "../../lib/format";

const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
} as const;

export function Avatar({
  name,
  color = "#8A9A7E",
  size = "md",
  ring = false,
}: {
  name: string;
  color?: string;
  size?: keyof typeof SIZES;
  ring?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white ${SIZES[size]} ${ring ? "ring-2 ring-white" : ""}`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials(name || "?")}
    </span>
  );
}

export function AvatarStack({ names, colors, max = 4 }: { names: string[]; colors: string[]; max?: number }) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <span className="flex items-center -space-x-2">
      {shown.map((n, i) => (
        <Avatar key={n + i} name={n} color={colors[i]} size="xs" ring />
      ))}
      {extra > 0 && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-soft text-[10px] font-bold text-ink-soft ring-2 ring-white">
          +{extra}
        </span>
      )}
    </span>
  );
}
