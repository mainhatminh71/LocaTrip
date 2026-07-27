# Stats

Exported from Framer using Design to AI.

## Components

- `Stats`
- `Stats2`
- `Stats3`
- `Stats4`
- `Stats5`
- `Stats6`
- `SectionTag`
- `SectionTag2`
- `TeamCard`
- `TeamCard2`
- `TeamCard3`
- `TeamCard4`
- `TeamCard5`
- `Stats7`
- `Stats8`
- `Stats9`
- `Stats10`
- `Stats11`
- `Stats12`
- `Stats13`
- `Stats14`
- `Stats15`
- `Stats16`
- `Stats17`
- `Stats18`
- `Stats19`
- `Stats20`
- `Stats21`
- `Stats22`
- `Stats23`
- `Stats24`
- `Stats25`
- `Stats26`
- `Stats27`
- `Stats28`
- `Stats29`
- `Stats30`
- `Stats31`
- `Stats32`
- `Stats33`
- `Stats34`
- `Stats35`
- `Stats36`
- `SectionTag3`
- `SectionTag4`
- `SectionTag5`
- `SectionTag6`
- `SectionTag7`
- `TeamCard6`
- `TeamCard7`
- `TeamCard8`
- `TeamCard9`
- `TeamCard10`
- `SectionTag8`
- `TeamCard11`
- `TeamCard12`
- `TeamCard13`
- `TeamCard14`
- `TeamCard15`
- `SectionTag9`
- `SectionTag10`
- `TeamCard16`
- `TeamCard17`
- `TeamCard18`
- `TeamCard19`
- `TeamCard20`
- `TeamCard21`
- `TeamCard22`
- `TeamCard23`
- `TeamCard24`
- `TeamCard25`
- `Stats37`
- `Stats38`
- `Stats39`
- `Stats40`
- `Stats41`
- `Stats42`
- `SectionTag11`
- `SectionTag12`
- `TeamCard26`
- `TeamCard27`
- `TeamCard28`
- `TeamCard29`
- `TeamCard30`
- `Stats43`
- `Stats44`
- `Stats45`
- `Stats46`
- `Stats47`
- `Stats48`
- `Stats49`
- `Stats50`
- `Stats51`
- `Stats52`
- `Stats53`
- `Stats54`
- `Stats55`
- `Stats56`
- `Stats57`
- `Stats58`
- `Stats59`
- `Stats60`
- `Stats61`
- `Stats62`
- `Stats63`
- `Stats64`
- `Stats65`
- `Stats66`
- `Stats67`
- `Stats68`
- `Stats69`
- `Stats70`
- `Stats71`
- `Stats72`
- `SectionTag13`
- `SectionTag14`
- `SectionTag15`
- `SectionTag16`
- `SectionTag17`
- `TeamCard31`
- `TeamCard32`
- `TeamCard33`
- `TeamCard34`
- `TeamCard35`
- `SectionTag18`
- `TeamCard36`
- `TeamCard37`
- `TeamCard38`
- `TeamCard39`
- `TeamCard40`
- `SectionTag19`
- `SectionTag20`
- `TeamCard41`
- `TeamCard42`
- `TeamCard43`
- `TeamCard44`
- `TeamCard45`
- `TeamCard46`
- `TeamCard47`
- `TeamCard48`
- `TeamCard49`
- `TeamCard50`
- `Stats73`
- `Stats74`
- `Stats75`
- `Stats76`
- `Stats77`
- `Stats78`
- `SectionTag21`
- `SectionTag22`
- `TeamCard51`
- `TeamCard52`
- `TeamCard53`
- `TeamCard54`
- `TeamCard55`
- `Stats79`
- `Stats80`
- `Stats81`
- `Stats82`
- `Stats83`
- `Stats84`
- `Stats85`
- `Stats86`
- `Stats87`
- `Stats88`
- `Stats89`
- `Stats90`
- `Stats91`
- `Stats92`
- `Stats93`
- `Stats94`
- `Stats95`
- `Stats96`
- `Stats97`
- `Stats98`
- `Stats99`
- `Stats100`
- `Stats101`
- `Stats102`
- `Stats103`
- `Stats104`
- `Stats105`
- `Stats106`
- `Stats107`
- `Stats108`
- `SectionTag23`
- `SectionTag24`
- `SectionTag25`
- `SectionTag26`
- `SectionTag27`
- `TeamCard56`
- `TeamCard57`
- `TeamCard58`
- `TeamCard59`
- `TeamCard60`
- `SectionTag28`
- `TeamCard61`
- `TeamCard62`
- `TeamCard63`
- `TeamCard64`
- `TeamCard65`
- `SectionTag29`
- `SectionTag30`
- `TeamCard66`
- `TeamCard67`
- `TeamCard68`
- `TeamCard69`
- `TeamCard70`
- `TeamCard71`
- `TeamCard72`
- `TeamCard73`
- `TeamCard74`
- `TeamCard75`

## Installation

```bash
# Copy this folder to your project, then install dependencies:
npm install react react-dom framer-motion
```

## Usage

```tsx
import { Stats } from './Stats';

function App() {
  return <Stats />;
}
```

## Responsive Components

For components with responsive variants, use the responsive runtime:

```tsx
// Import the CSS for responsive breakpoints
import './Stats/_responsive-runtime.css';

// Option 1: Use the useBreakpoint hook
import { useBreakpoint } from './Stats/_responsive-runtime';

function App() {
  const breakpoint = useBreakpoint(); // 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

  return <Stats variant={breakpoint === 'base' ? 'mobile' : 'desktop'} />;
}

// Option 2: Use the WithBreakpoints HOC
import { WithBreakpoints } from './Stats/_responsive-runtime';

function App() {
  return (
    <WithBreakpoints
      Component={Stats}
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
