export interface TickerProps {
  /**
   * Children — pass as `slots` not `children`.
   */
  slots?: unknown[];
  /**
   * Speed
   * Range: min: 0, max: 1000, step: 5
   * @default 100
   */
  speed?: number;
  /**
   * Direction
   * Options: "left" | "right" | "top" | "bottom"
   * @default "left"
   */
  direction?: 'left' | 'right' | 'top' | 'bottom';
  /**
   * Align — pass as `alignment` not `align`.
   * Options: "flex-start" | "center" | "flex-end"
   * @default "center"
   */
  alignment?: 'flex-start' | 'center' | 'flex-end';
  /**
   * Gap
   */
  gap?: number;
  /**
   * Padding
   * Range: min: 0
   */
  padding?: string;
  /**
   * Sizing — pass as `sizingOptions` not `sizing`.
   */
  sizingOptions?: Record<string, unknown>;
  /**
   * Clipping — pass as `fadeOptions` not `clipping`.
   */
  fadeOptions?: Record<string, unknown>;
  /**
   * Hover — pass as `hoverFactor` not `hover`.
   * Range: min: 0, max: 1, step: 0.1
   * @default 1
   */
  hoverFactor?: number;
  /** Additional properties */
  [key: string]: unknown;
}
