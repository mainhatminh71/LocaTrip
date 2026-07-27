export interface Snowfallprod6Props {
  /**
   * Preview
   * @default true
   */
  preview?: boolean;
  /**
   * Count — pass as `snowflakeCount` not `count`.
   * Range: min: 10, max: 1000, step: 10
   */
  snowflakeCount?: number;
  /**
   * Speed
   */
  speed?: Record<string, unknown>;
  /**
   * Wind
   */
  wind?: Record<string, unknown>;
  /**
   * Radius
   */
  radius?: Record<string, unknown>;
  /**
   * Opacity
   */
  opacity?: Record<string, unknown>;
  /**
   * Direction
   * Options: "down" | "up"
   */
  direction?: 'down' | 'up';
  /**
   * Transition — pass as `transitionTime` not `transition`.
   * Range: min: 0, max: 5, step: 0.1
   */
  transitionTime?: number;
  /**
   * Color
   */
  color?: string;
  /**
   * Background
   */
  background?: string;
  /** Additional properties */
  [key: string]: unknown;
}
