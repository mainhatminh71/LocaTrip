# Primary Travel button

Exported from Framer using Design to AI.

## Components

- `PrimaryTravel`
- `PrimaryTravel2`
- `PrimaryTravel3`
- `PrimaryTravel4`
- `PrimaryTravel5`
- `PrimaryTravel6`
- `PrimaryTravel7`
- `PrimaryTravel8`
- `PrimaryTravel9`
- `PrimaryTravel10`
- `PrimaryTravel11`
- `PrimaryTravel12`

## Installation

```bash
# Copy this folder to your project, then install dependencies:
npm install react react-dom framer-motion
```

## Usage

```tsx
import { PrimaryTravel } from './Primary Travel button';

function App() {
  return <PrimaryTravel />;
}
```

## Responsive Components

For components with responsive variants, use the responsive runtime:

```tsx
// Import the CSS for responsive breakpoints
import './Primary Travel button/_responsive-runtime.css';

// Option 1: Use the useBreakpoint hook
import { useBreakpoint } from './Primary Travel button/_responsive-runtime';

function App() {
  const breakpoint = useBreakpoint(); // 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

  return <PrimaryTravel variant={breakpoint === 'base' ? 'mobile' : 'desktop'} />;
}

// Option 2: Use the WithBreakpoints HOC
import { WithBreakpoints } from './Primary Travel button/_responsive-runtime';

function App() {
  return (
    <WithBreakpoints
      Component={PrimaryTravel}
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
