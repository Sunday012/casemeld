import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type BrandGlyphProps = {
  className?: string;
  size?: number;
};

export function BrandGlyph({ className, size = 16 }: BrandGlyphProps) {
  return (
    <span
      className={cn("brand-glyph", className)}
      style={{ "--brand-glyph-size": `${size}px` } as CSSProperties}
      aria-hidden="true"
    >
      <span />
    </span>
  );
}
