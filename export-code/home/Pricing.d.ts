export interface PricingProps {
  /**
   * Variant
   * Friendly names map to internal IDs:
   *   "Variant 1" → GP0CtixS7
   *   "Variant 2" → qEdFs0INC
   *   "MobileMonthly" → AEvfTLsh6
   *   "MobileYearly" → XLLbScKvk
   */
  variant?: 'Variant 1' | 'Variant 2' | 'MobileMonthly' | 'MobileYearly' | 'GP0CtixS7' | 'qEdFs0INC' | 'AEvfTLsh6' | 'XLLbScKvk';
  /** Additional properties */
  [key: string]: unknown;
}
