/**
 * Note: This interface may be incomplete.
 * Unresolved spread operators: defaultEvents
 * These may contain additional properties from external modules.
 */
export interface Phosphor34Props {
  /**
   * Select — pass as `selectByList` not `select`.
   */
  selectByList?: boolean;
  /**
   * Name — pass as `iconSelection` not `name`.
   */
  iconSelection?: string;
  /**
   * Name — pass as `iconSearch` not `name`.
   */
  iconSearch?: string;
  /**
   * Color
   */
  color?: string;
  /**
   * Weight
   */
  weight?: string;
  mirrored?: boolean;
  /** Additional properties */
  [key: string]: unknown;
}
