export interface Instagramstory3Props {
  /**
   * Stories
   * @default [{"image":{"src":"https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg","alt":"Story 1"},"duration":5},{"image":{"src":"https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg","alt":"Story 2"},"duration":5},{"image":{"src":"https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg","alt":"Story 3"},"duration":5}]
   */
  stories?: unknown[];
  /**
   * Auto Play
   * @default true
   */
  autoPlay?: boolean;
  /**
   * Pause on Hover
   * @default true
   */
  pauseOnHover?: boolean;
  /**
   * Radius — pass as `borderRadius` not `radius`.
   * Range: min: 0, max: 50, step: 1
   * @default 0
   */
  borderRadius?: number;
  /**
   * Progress Bars — pass as `showProgressBars` not `progressBars`.
   * @default true
   */
  showProgressBars?: boolean;
  /**
   * Bar Color — pass as `progressBarColor` not `barColor`.
   * @default "#FFFFFF"
   */
  progressBarColor?: string;
  /**
   * Bar Background — pass as `progressBarBackground` not `barBackground`.
   * @default "rgba(255, 255, 255, 0.3)"
   */
  progressBarBackground?: string;
  /**
   * Bar Height — pass as `progressBarHeight` not `barHeight`.
   * Range: min: 1, max: 10, step: 1
   * @default 2
   */
  progressBarHeight?: number;
  /** Additional properties */
  [key: string]: unknown;
}
