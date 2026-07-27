# Check Circle

Exported from Framer using Design to AI.

## Components

- `Cbx0bVr`
- `Awrvfj6vy`
- `Fug5zhkaq`
- `Tjx1isk1b`
- `GooeyProd`
- `X5rbdzv9v`
- `SectionTag`
- `BlogCard`
- `PrimaryTravel`
- `Cbx0bVr2`
- `Awrvfj6vy2`
- `Fug5zhkaq2`
- `Tjx1isk1b2`
- `GooeyProd2`
- `X5rbdzv9v2`
- `Cbx0bVr3`
- `Awrvfj6vy3`
- `Fug5zhkaq3`
- `Tjx1isk1b3`
- `Cbx0bVr4`
- `Cbx0bVr5`
- `Cbx0bVr6`
- `Awrvfj6vy4`
- `Awrvfj6vy5`
- `Fug5zhkaq4`
- `Fug5zhkaq5`
- `Tjx1isk1b4`
- `Tjx1isk1b5`
- `GooeyProd3`
- `X5rbdzv9v3`
- `GooeyProd4`
- `X5rbdzv9v4`
- `X5rbdzv9v5`
- `SectionTag2`
- `BlogCard2`
- `PrimaryTravel2`
- `SectionTag3`
- `BlogCard3`
- `PrimaryTravel3`
- `SectionTag4`
- `SectionTag5`
- `BlogCard4`
- `PrimaryTravel4`
- `BlogCard5`
- `BlogCard6`
- `PrimaryTravel5`
- `PrimaryTravel6`
- `Cbx0bVr7`
- `Awrvfj6vy6`
- `Fug5zhkaq6`
- `Tjx1isk1b6`
- `GooeyProd5`
- `X5rbdzv9v6`
- `SectionTag6`
- `BlogCard7`
- `PrimaryTravel7`
- `Cbx0bVr8`
- `Awrvfj6vy7`
- `Fug5zhkaq7`
- `Tjx1isk1b7`
- `GooeyProd6`
- `X5rbdzv9v7`
- `Cbx0bVr9`
- `Awrvfj6vy8`
- `Fug5zhkaq8`
- `Tjx1isk1b8`
- `Cbx0bVr10`
- `Cbx0bVr11`
- `Cbx0bVr12`
- `Awrvfj6vy9`
- `Awrvfj6vy10`
- `Fug5zhkaq9`
- `Fug5zhkaq10`
- `Tjx1isk1b9`
- `Tjx1isk1b10`
- `GooeyProd7`
- `X5rbdzv9v8`
- `GooeyProd8`
- `X5rbdzv9v9`
- `X5rbdzv9v10`
- `SectionTag7`
- `BlogCard8`
- `PrimaryTravel8`
- `SectionTag8`
- `BlogCard9`
- `PrimaryTravel9`
- `SectionTag9`
- `SectionTag10`
- `BlogCard10`
- `PrimaryTravel10`
- `BlogCard11`
- `BlogCard12`
- `PrimaryTravel11`
- `PrimaryTravel12`
- `Cbx0bVr13`
- `Awrvfj6vy11`
- `Fug5zhkaq11`
- `Tjx1isk1b11`
- `GooeyProd9`
- `X5rbdzv9v11`
- `SectionTag11`
- `BlogCard13`
- `PrimaryTravel13`
- `Cbx0bVr14`
- `Awrvfj6vy12`
- `Fug5zhkaq12`
- `Tjx1isk1b12`
- `GooeyProd10`
- `X5rbdzv9v12`
- `Cbx0bVr15`
- `Awrvfj6vy13`
- `Fug5zhkaq13`
- `Tjx1isk1b13`
- `Cbx0bVr16`
- `Cbx0bVr17`
- `Cbx0bVr18`
- `Awrvfj6vy14`
- `Awrvfj6vy15`
- `Fug5zhkaq14`
- `Fug5zhkaq15`
- `Tjx1isk1b14`
- `Tjx1isk1b15`
- `GooeyProd11`
- `X5rbdzv9v13`
- `GooeyProd12`
- `X5rbdzv9v14`
- `X5rbdzv9v15`
- `SectionTag12`
- `BlogCard14`
- `PrimaryTravel14`
- `SectionTag13`
- `BlogCard15`
- `PrimaryTravel15`
- `SectionTag14`
- `SectionTag15`
- `BlogCard16`
- `PrimaryTravel16`
- `BlogCard17`
- `BlogCard18`
- `PrimaryTravel17`
- `PrimaryTravel18`

## Installation

```bash
# Copy this folder to your project, then install dependencies:
npm install react react-dom framer-motion
```

## Usage

```tsx
import { Cbx0bVr } from './Check Circle';

function App() {
  return <Cbx0bVr />;
}
```

## Responsive Components

For components with responsive variants, use the responsive runtime:

```tsx
// Import the CSS for responsive breakpoints
import './Check Circle/_responsive-runtime.css';

// Option 1: Use the useBreakpoint hook
import { useBreakpoint } from './Check Circle/_responsive-runtime';

function App() {
  const breakpoint = useBreakpoint(); // 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

  return <Cbx0bVr variant={breakpoint === 'base' ? 'mobile' : 'desktop'} />;
}

// Option 2: Use the WithBreakpoints HOC
import { WithBreakpoints } from './Check Circle/_responsive-runtime';

function App() {
  return (
    <WithBreakpoints
      Component={Cbx0bVr}
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
