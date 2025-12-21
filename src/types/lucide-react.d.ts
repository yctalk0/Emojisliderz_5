declare module 'lucide-react' {
  import * as React from 'react';

  // Basic SVG icon component type exported by lucide-react
  export type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement> & { title?: string }>;

  // Commonly used icons in this project (named exports)
  export const Lock: LucideIcon;
  export const Unlock: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowUp: LucideIcon;
  export const ArrowDown: LucideIcon;
  export const Clock: LucideIcon;
  export const Medal: LucideIcon;
  export const Move: LucideIcon;
  export const Play: LucideIcon;
  export const SkipForward: LucideIcon;
  export const X: LucideIcon;
  export const Volume1: LucideIcon;
  export const Volume2: LucideIcon;
  export const VolumeX: LucideIcon;
  export const Info: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const RotateCw: LucideIcon;
  export const WandSparkles: LucideIcon;
  export const Undo2: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Check: LucideIcon;
  export const Circle: LucideIcon;
  export const PanelLeft: LucideIcon;
  export const PanelRight: LucideIcon;
  export const ChevronDownCircle: LucideIcon;

  // Default export: map of icon names to components (covers other icons if imported dynamically)
  const _default: { [key: string]: LucideIcon };
  export default _default;

  // Utility (kept permissive)
  export function createIcon(...args: any[]): any;
}
