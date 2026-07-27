export interface TourpackagecardProps {
  /**
   * Variant
   * Friendly names map to internal IDs:
   *   "Desktop" → Qs8tpwbzJ
   *   "Phone" → xThOoVjZW
   */
  variant?: 'Desktop' | 'Phone' | 'Qs8tpwbzJ' | 'xThOoVjZW';
  /**
   * Image — pass as `zfXuuYS0f` not `image`.
   */
  zfXuuYS0f?: string;
  /**
   * Days/Nights — pass as `MNSKzlU9q` not `days/nights`.
   * @default "3 Ngày / 2 Đêm"
   */
  MNSKzlU9q?: string;
  onMNSKzlU9qChange?: string;
  /**
   * Title — pass as `TYD0ZRJdw` not `title`.
   * @default "Bali"
   */
  TYD0ZRJdw?: string;
  onTYD0ZRJdwChange?: string;
  /**
   * Price — pass as `EYMgQFvXw` not `price`.
   * @default "40000"
   */
  EYMgQFvXw?: string;
  onEYMgQFvXwChange?: string;
  /**
   * Link — pass as `yv9cnGTFs` not `link`.
   */
  yv9cnGTFs?: string;
  /** Additional properties */
  [key: string]: unknown;
}
