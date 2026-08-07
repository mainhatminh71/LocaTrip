/**
 * Shared design tokens (TypeScript) — mirror of styles/tokens.css.
 * Use these in TS when you need values outside CSS modules.
 */
export const LT = {
  font: {
    body: 'var(--lt-font-body)',
    display: 'var(--lt-font-display)',
    brand: 'var(--lt-font-brand)',
  },
  color: {
    ink: 'var(--lt-ink)',
    muted: 'var(--lt-muted)',
    section: 'var(--lt-section)',
    field: 'var(--lt-field)',
    line: 'var(--lt-line)',
    white: 'var(--lt-white)',
    black: 'var(--lt-black)',
    nearBlack: 'var(--lt-near-black)',
    deep: 'var(--lt-deep)',
    teal: 'var(--lt-teal)',
    tealDeep: 'var(--lt-teal-deep)',
    mint: 'var(--lt-mint)',
  },
  radius: {
    sm: 'var(--lt-radius-sm)',
    md: 'var(--lt-radius-md)',
    lg: 'var(--lt-radius-lg)',
    xl: 'var(--lt-radius-xl)',
    '2xl': 'var(--lt-radius-2xl)',
    pill: 'var(--lt-radius-pill)',
  },
  max: 'var(--lt-max)',
} as const;
