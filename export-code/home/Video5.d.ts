/**
 * Note: This interface may be incomplete.
 * Unresolved spread operators: borderRadiusControl, defaultEvents
 * These may contain additional properties from external modules.
 */
export interface Video5Props {
  /**
   * Source — pass as `srcType` not `source`.
   * Options: "URL" | "Upload"
   */
  srcType?: 'URL' | 'Upload';
  /**
   * URL — pass as `srcUrl` not `url`.
   * @default "https://framerusercontent.com/assets/MLWPbW1dUQawJLhhun3dBwpgJak.mp4"
   */
  srcUrl?: string;
  /**
   * File — pass as `srcFile` not `file`.
   */
  srcFile?: string;
  /**
   * Playing
   */
  playing?: boolean;
  /**
   * Poster — pass as `posterEnabled` not `poster`.
   */
  posterEnabled?: boolean;
  /**
   * Image — pass as `poster` not `image`.
   */
  poster?: string;
  /**
   * Background — pass as `backgroundColor` not `background`.
   * @default "rgba(0,0,0,0)"
   */
  backgroundColor?: string;
  /**
   * Start Time
   * Range: min: 0, max: 100, step: 0.1
   */
  startTime?: number;
  /**
   * Loop
   */
  loop?: boolean;
  /**
   * Fit — pass as `objectFit` not `fit`.
   */
  objectFit?: string;
  /**
   * Controls
   * @default false
   */
  controls?: boolean;
  /**
   * Muted
   */
  muted?: boolean;
  /**
   * Range: min: 0, max: 100
   * @default 25
   */
  volume?: number;
  onEnd?: () => void;
  onSeeked?: () => void;
  onPause?: () => void;
  onPlay?: () => void;
  /** Additional properties */
  [key: string]: unknown;
}
