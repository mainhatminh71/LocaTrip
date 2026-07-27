# Container

Exported from Framer using Design to AI.

## Components

- `Container`
- `Rj3lr1tc`
- `Zfx1kjuqg`
- `Container2`
- `Rj3lr1tc2`
- `Zfx1kjuqg2`
- `Container3`
- `Rj3lr1tc3`
- `Zfx1kjuqg3`
- `Rj3lr1tc4`
- `Rj3lr1tc5`
- `Zfx1kjuqg4`
- `Zfx1kjuqg5`
- `Container4`
- `Rj3lr1tc6`
- `Zfx1kjuqg6`
- `Container5`
- `Rj3lr1tc7`
- `Zfx1kjuqg7`
- `Container6`
- `Rj3lr1tc8`
- `Zfx1kjuqg8`
- `Rj3lr1tc9`
- `Rj3lr1tc10`
- `Zfx1kjuqg9`
- `Zfx1kjuqg10`
- `Container7`
- `Rj3lr1tc11`
- `Zfx1kjuqg11`
- `Container8`
- `Rj3lr1tc12`
- `Zfx1kjuqg12`
- `Container9`
- `Rj3lr1tc13`
- `Zfx1kjuqg13`
- `Rj3lr1tc14`
- `Rj3lr1tc15`
- `Zfx1kjuqg14`
- `Zfx1kjuqg15`

## Installation

```bash
# Copy this folder to your project, then install dependencies:
npm install react react-dom framer-motion
```

## Usage

```tsx
import { Container } from './Container';

function App() {
  return <Container />;
}
```

## Responsive Components

For components with responsive variants, use the responsive runtime:

```tsx
// Import the CSS for responsive breakpoints
import './Container/_responsive-runtime.css';

// Option 1: Use the useBreakpoint hook
import { useBreakpoint } from './Container/_responsive-runtime';

function App() {
  const breakpoint = useBreakpoint(); // 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

  return <Container variant={breakpoint === 'base' ? 'mobile' : 'desktop'} />;
}

// Option 2: Use the WithBreakpoints HOC
import { WithBreakpoints } from './Container/_responsive-runtime';

function App() {
  return (
    <WithBreakpoints
      Component={Container}
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
