# Phosphor

Exported from Framer using Design to AI.

## Components

- `Phosphor`
- `Phosphor2`
- `Phosphor3`
- `FormButton2`
- `Phosphor4`
- `Phosphor5`
- `Phosphor6`
- `FormButton22`
- `Phosphor7`
- `Phosphor8`
- `Phosphor9`
- `FormButton23`
- `Phosphor10`
- `Phosphor11`
- `Phosphor12`
- `Phosphor13`
- `Phosphor14`
- `Phosphor15`
- `Phosphor16`
- `Phosphor17`
- `Phosphor18`
- `Phosphor19`
- `Phosphor20`
- `Phosphor21`
- `Phosphor22`
- `Phosphor23`
- `Phosphor24`
- `FormButton24`
- `FormButton25`
- `FormButton26`
- `FormButton27`
- `FormButton28`
- `FormButton29`
- `Phosphor25`
- `Phosphor26`
- `Phosphor27`
- `FormButton210`
- `Phosphor28`
- `Phosphor29`
- `Phosphor30`
- `FormButton211`
- `Phosphor31`
- `Phosphor32`
- `Phosphor33`
- `FormButton212`
- `Phosphor34`
- `Phosphor35`
- `Phosphor36`
- `Phosphor37`
- `Phosphor38`
- `Phosphor39`
- `Phosphor40`
- `Phosphor41`
- `Phosphor42`
- `Phosphor43`
- `Phosphor44`
- `Phosphor45`
- `Phosphor46`
- `Phosphor47`
- `Phosphor48`
- `FormButton213`
- `FormButton214`
- `FormButton215`
- `FormButton216`
- `FormButton217`
- `FormButton218`
- `Phosphor49`
- `Phosphor50`
- `Phosphor51`
- `FormButton219`
- `Phosphor52`
- `Phosphor53`
- `Phosphor54`
- `FormButton220`
- `Phosphor55`
- `Phosphor56`
- `Phosphor57`
- `FormButton221`
- `Phosphor58`
- `Phosphor59`
- `Phosphor60`
- `Phosphor61`
- `Phosphor62`
- `Phosphor63`
- `Phosphor64`
- `Phosphor65`
- `Phosphor66`
- `Phosphor67`
- `Phosphor68`
- `Phosphor69`
- `Phosphor70`
- `Phosphor71`
- `Phosphor72`
- `FormButton222`
- `FormButton223`
- `FormButton224`
- `FormButton225`
- `FormButton226`
- `FormButton227`

## Installation

```bash
# Copy this folder to your project, then install dependencies:
npm install react react-dom framer-motion
```

## Usage

```tsx
import { Phosphor } from './Phosphor';

function App() {
  return <Phosphor />;
}
```

## Responsive Components

For components with responsive variants, use the responsive runtime:

```tsx
// Import the CSS for responsive breakpoints
import './Phosphor/_responsive-runtime.css';

// Option 1: Use the useBreakpoint hook
import { useBreakpoint } from './Phosphor/_responsive-runtime';

function App() {
  const breakpoint = useBreakpoint(); // 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

  return <Phosphor variant={breakpoint === 'base' ? 'mobile' : 'desktop'} />;
}

// Option 2: Use the WithBreakpoints HOC
import { WithBreakpoints } from './Phosphor/_responsive-runtime';

function App() {
  return (
    <WithBreakpoints
      Component={Phosphor}
      variants={{
        base: 'mobile',    // 0px+
        md: 'tablet',      // 768px+
        lg: 'desktop'      // 1024px+
      }}
    />
  );
}
```

### Breakpoints

| Name | Min Width | Typical Use |
|------|-----------|-------------|
| base | 0px | Mobile |
| sm | 390px | Large mobile |
| md | 768px | Tablet |
| lg | 1024px | Laptop |
| xl | 1280px | Desktop |
| 2xl | 1536px | Large desktop |

## Peer Dependencies

These components require the following packages in your project:

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `framer-motion` >= 10.0.0

## Note

The Framer runtime is bundled as `_framer-runtime.js` - no external Framer dependency needed.
These exports are self-contained and work out of the box.

## Generated

Created with [Design to AI](https://designtoai.com)
