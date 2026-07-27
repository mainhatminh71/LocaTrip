# Section Tag

Exported from Framer using Design to AI.

## Components

- `SectionTag`
- `TourPackageCard`
- `PrimaryTravel`
- `SectionTag2`
- `TourPackageCard2`
- `PrimaryTravel2`
- `SectionTag3`
- `TourPackageCard3`
- `PrimaryTravel3`
- `SectionTag4`
- `SectionTag5`
- `TourPackageCard4`
- `PrimaryTravel4`
- `TourPackageCard5`
- `PrimaryTravel5`
- `PrimaryTravel6`
- `SectionTag6`
- `TourPackageCard6`
- `PrimaryTravel7`
- `SectionTag7`
- `TourPackageCard7`
- `PrimaryTravel8`
- `SectionTag8`
- `TourPackageCard8`
- `PrimaryTravel9`
- `SectionTag9`
- `SectionTag10`
- `TourPackageCard9`
- `PrimaryTravel10`
- `TourPackageCard10`
- `PrimaryTravel11`
- `PrimaryTravel12`
- `SectionTag11`
- `TourPackageCard11`
- `PrimaryTravel13`
- `SectionTag12`
- `TourPackageCard12`
- `PrimaryTravel14`
- `SectionTag13`
- `TourPackageCard13`
- `PrimaryTravel15`
- `SectionTag14`
- `SectionTag15`
- `TourPackageCard14`
- `PrimaryTravel16`
- `TourPackageCard15`
- `PrimaryTravel17`
- `PrimaryTravel18`

## Installation

```bash
# Copy this folder to your project, then install dependencies:
npm install react react-dom framer-motion
```

## Usage

```tsx
import { SectionTag } from './Section Tag';

function App() {
  return <SectionTag />;
}
```

## Responsive Components

For components with responsive variants, use the responsive runtime:

```tsx
// Import the CSS for responsive breakpoints
import './Section Tag/_responsive-runtime.css';

// Option 1: Use the useBreakpoint hook
import { useBreakpoint } from './Section Tag/_responsive-runtime';

function App() {
  const breakpoint = useBreakpoint(); // 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

  return <SectionTag variant={breakpoint === 'base' ? 'mobile' : 'desktop'} />;
}

// Option 2: Use the WithBreakpoints HOC
import { WithBreakpoints } from './Section Tag/_responsive-runtime';

function App() {
  return (
    <WithBreakpoints
      Component={SectionTag}
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
