var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/szbhLeB08uGF6jj4Bvtk/E6QSqL5QAlN8pnbjS5YM/g07TANoSb.js
import { jsx as _jsx2 } from "react/jsx-runtime";
import { addFonts, addPropertyControls as addPropertyControls2, ComponentViewportProvider, ControlType as ControlType2, cx, getFonts, getFontsFromSharedStyle, RichText, SmartComponentScopedContainer, useComponentViewport, useLocaleInfo, useVariantState, withCSS } from "./_framer-runtime.js";
import { LayoutGroup as LayoutGroup2, motion as motion2, MotionConfigContext } from "framer-motion";
import * as React from "react";
import { useRef as useRef2 } from "react";

// http-url:https://framerusercontent.com/modules/B2xAlJLcN0gOnt11mSPw/plhC5PVnCMllW5QXjFK5/Ticker.js
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, useLayoutEffect, useEffect, useState, useRef, useMemo, useCallback, cloneElement, startTransition, forwardRef, useImperativeHandle } from "react";
import { addPropertyControls, ControlType, RenderTarget } from "./_framer-runtime.js";
import { useReducedMotion, LayoutGroup, useInView, useMotionValue, useTransform, motion, frame } from "framer-motion";
import { resize } from "@motionone/dom";
var MAX_DUPLICATED_ITEMS = 100;
var directionTransformers = { left: (offset) => `translateX(-${offset}px)`, right: (offset) => `translateX(${offset}px)`, top: (offset) => `translateY(-${offset}px)`, bottom: (offset) => `translateY(${offset}px)` };
function Ticker(props) {
  let { slots = [], gap, padding, paddingPerSide, paddingTop, paddingRight, paddingBottom, paddingLeft, speed, hoverFactor, direction, alignment, sizingOptions, fadeOptions, style } = props;
  const { fadeContent, overflow, fadeWidth, fadeInset, fadeAlpha } = fadeOptions;
  const { widthType, heightType } = sizingOptions;
  const paddingValue = paddingPerSide ? `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px` : `${padding}px`;
  const currentTarget = RenderTarget.current();
  const isCanvas = currentTarget === RenderTarget.canvas || currentTarget === RenderTarget.export;
  const writingDirection = useWritingDirection();
  const filteredSlots = slots.filter(Boolean);
  const numChildren = Children.count(filteredSlots);
  const hasChildren = numChildren > 0;
  const offset = useMotionValue(0);
  const resolvedDirection = getTickerResolvedDirection(direction === true ? "left" : direction, writingDirection);
  const isHorizontal = resolvedDirection === "left" || resolvedDirection === "right";
  const transformer = directionTransformers[resolvedDirection];
  const transform = useTransform(offset, transformer);
  const parentRef = useRef(null);
  const childrenRef = useMemo(() => {
    return [{ current: null }, { current: null }];
  }, []);
  const [size, setSize] = useState({ parent: null, children: null });
  let clonedChildren = null;
  let dupedChildren = [];
  let duplicateBy = 0;
  let opacity = 0;
  if (isCanvas) {
    duplicateBy = numChildren ? Math.floor(10 / numChildren) : 0;
    opacity = 1;
  }
  if (!isCanvas && hasChildren && size.parent) {
    duplicateBy = Math.round(size.parent / size.children * 2) + 1;
    duplicateBy = Math.min(duplicateBy, MAX_DUPLICATED_ITEMS);
    opacity = 1;
  }
  const measure = useCallback(() => {
    if (hasChildren && parentRef.current) {
      const parentLength = isHorizontal ? parentRef.current.offsetWidth : parentRef.current.offsetHeight;
      const start = childrenRef[0].current ? isHorizontal ? childrenRef[0].current.offsetLeft : childrenRef[0].current.offsetTop : 0;
      const end = childrenRef[1].current ? isHorizontal ? childrenRef[1].current.offsetLeft + childrenRef[1].current.offsetWidth : childrenRef[1].current.offsetTop + childrenRef[1].current.offsetHeight : 0;
      const childrenLength = end - start + gap;
      startTransition(() => {
        setSize({ parent: parentLength, children: childrenLength });
      });
    }
  }, []);
  const childrenStyles = isCanvas ? { contentVisibility: "auto" } : {};
  if (hasChildren) {
    if (!isCanvas) {
      let initialResize = useRef(true);
      useLayoutEffect(() => {
        frame.read(measure, false, true);
        return resize(parentRef.current, ({ contentSize }) => {
          if (!initialResize.current && (contentSize.width || contentSize.height)) {
            frame.read(measure, false, true);
          }
          initialResize.current = false;
        });
      }, []);
    }
    clonedChildren = Children.map(filteredSlots, (child, index) => {
      let ref;
      if (index === 0) {
        ref = childrenRef[writingDirection === "rtl" && isHorizontal ? 1 : 0];
      }
      if (index === filteredSlots.length - 1) {
        ref = childrenRef[writingDirection === "rtl" && isHorizontal ? 0 : 1];
      }
      const size2 = { width: widthType ? child.props?.width : "100%", height: heightType ? child.props?.height : "100%" };
      return /* @__PURE__ */ _jsx(LayoutGroup, { inherit: "id", children: /* @__PURE__ */ _jsx(Wrapper, { ref, style: size2, children: /* @__PURE__ */ cloneElement(child, { style: { ...child.props?.style, ...size2, flexShrink: 0, ...childrenStyles }, layoutId: child.props.layoutId ? child.props.layoutId + "-original-" + index : void 0 }, child.props?.children) }) });
    });
  }
  const isInView = isCanvas ? true : useInView(parentRef);
  if (!isCanvas) {
    for (let i = 0; i < duplicateBy; i++) {
      dupedChildren = dupedChildren.concat(Children.map(filteredSlots, (child, childIndex) => {
        const size2 = { width: widthType ? child.props?.width : "100%", height: heightType ? child.props?.height : "100%", willChange: !isInView ? void 0 : "transform" };
        return /* @__PURE__ */ _jsx(LayoutGroup, { inherit: "id", children: /* @__PURE__ */ _jsx(Wrapper, { style: size2, children: /* @__PURE__ */ cloneElement(child, { key: i + " " + childIndex, style: { ...child.props?.style, width: widthType ? child.props?.width : "100%", height: heightType ? child.props?.height : "100%", flexShrink: 0, ...childrenStyles }, layoutId: child.props.layoutId ? child.props.layoutId + "-dupe-" + i : void 0 }, child.props?.children) }, i + "li" + childIndex) }, i + "lg" + childIndex);
      }));
    }
  }
  const animateToValue = size.children + size.children * Math.round(size.parent / size.children);
  const initialTime = useRef(null);
  const prevTime = useRef(null);
  const xOrY = useRef(0);
  const isHover = useRef(false);
  const isReducedMotion = useReducedMotion();
  const listRef = useRef(null);
  const animationRef = useRef(null);
  if (!isCanvas) {
    useEffect(() => {
      if (isReducedMotion || !animateToValue || !speed) {
        return;
      }
      animationRef.current = listRef.current.animate({ transform: [transformer(0), transformer(animateToValue)] }, { duration: Math.abs(animateToValue) / speed * 1e3, iterations: Infinity, iterationStart: writingDirection === "rtl" ? 1 : 0, easing: "linear" });
      return () => animationRef.current.cancel();
    }, [hoverFactor, animateToValue, speed, writingDirection]);
    const playOrPause = useCallback(() => {
      if (!animationRef.current)
        return;
      const hidden = document.hidden;
      if (isInView && !hidden && animationRef.current.playState === "paused") {
        animationRef.current.play();
      } else if ((!isInView || hidden) && animationRef.current.playState === "running") {
        animationRef.current.pause();
      }
    }, [isInView]);
    useEffect(() => {
      playOrPause();
    }, [isInView, hoverFactor, animateToValue, speed]);
    useEffect(() => {
      document.addEventListener("visibilitychange", playOrPause);
      return () => {
        document.removeEventListener("visibilitychange", playOrPause);
      };
    }, [playOrPause]);
  }
  const fadeDirection = isHorizontal ? "to right" : "to bottom";
  const fadeWidthStart = fadeWidth / 2;
  const fadeWidthEnd = 100 - fadeWidth / 2;
  const fadeInsetStart = clamp(fadeInset, 0, fadeWidthStart);
  const fadeInsetEnd = 100 - fadeInset;
  const fadeMask = `linear-gradient(${fadeDirection}, rgba(0, 0, 0, ${fadeAlpha}) ${fadeInsetStart}%, rgba(0, 0, 0, 1) ${fadeWidthStart}%, rgba(0, 0, 0, 1) ${fadeWidthEnd}%, rgba(0, 0, 0, ${fadeAlpha}) ${fadeInsetEnd}%)`;
  if (!hasChildren) {
    return /* @__PURE__ */ _jsxs("section", { style: placeholderStyles, children: [/* @__PURE__ */ _jsx("div", { style: emojiStyles, children: "\u2728" }), /* @__PURE__ */ _jsx("p", { style: titleStyles, children: "Connect to Content" }), /* @__PURE__ */ _jsx("p", { style: subtitleStyles, children: "Add layers or components to infinitely loop on your page." })] });
  }
  return /* @__PURE__ */ _jsx("section", { style: { ...containerStyle, opacity, WebkitMaskImage: fadeContent ? fadeMask : void 0, maskImage: fadeContent ? fadeMask : void 0, overflow: overflow ? "visible" : "hidden", padding: paddingValue }, ref: parentRef, children: /* @__PURE__ */ _jsxs(motion.ul, { ref: listRef, style: { ...containerStyle, gap, top: direction === "bottom" && isValidNumber(animateToValue) ? -animateToValue : void 0, left: direction === "right" && isValidNumber(animateToValue) ? animateToValue * (writingDirection === "rtl" ? 1 : -1) : void 0, placeItems: alignment, position: "relative", flexDirection: isHorizontal ? "row" : "column", ...style, willChange: isCanvas || !isInView ? "auto" : "transform", transform: transformer(0) }, onMouseEnter: () => {
    isHover.current = true;
    if (animationRef.current) {
      animationRef.current.playbackRate = hoverFactor;
    }
  }, onMouseLeave: () => {
    isHover.current = false;
    if (animationRef.current) {
      animationRef.current.playbackRate = 1;
    }
  }, children: [clonedChildren, dupedChildren] }) });
}
var Wrapper = /* @__PURE__ */ forwardRef(({ children, ...props }, ref) => {
  const innerRef = useRef();
  const inView = useInView(innerRef);
  useImperativeHandle(ref, () => innerRef.current);
  useEffect(() => {
    const current = innerRef.current;
    if (!current)
      return;
    if (inView) {
      current.querySelectorAll("button,a").forEach((el) => {
        const orig = el.dataset.origTabIndex;
        if (orig)
          el.tabIndex = orig;
        else
          el.removeAttribute("tabIndex");
      });
    } else {
      current.querySelectorAll("button,a").forEach((el) => {
        const orig = el.getAttribute("tabIndex");
        if (orig)
          el.dataset.origTabIndex = orig;
        el.tabIndex = -1;
      });
    }
  }, [inView]);
  return /* @__PURE__ */ _jsx("li", { ...props, "aria-hidden": !inView, ref: innerRef, children });
});
Ticker.defaultProps = { gap: 10, padding: 10, sizingOptions: { widthType: true, heightType: true }, fadeOptions: { fadeContent: true, overflow: false, fadeWidth: 25, fadeAlpha: 0, fadeInset: 0 }, direction: true };
addPropertyControls(Ticker, { slots: { type: ControlType.Array, title: "Children", control: { type: ControlType.ComponentInstance } }, speed: { type: ControlType.Number, title: "Speed", min: 0, max: 1e3, defaultValue: 100, unit: "%", displayStepper: true, step: 5 }, direction: { type: ControlType.Enum, title: "Direction", options: ["left", "right", "top", "bottom"], optionIcons: ["direction-left", "direction-right", "direction-up", "direction-down"], optionTitles: ["Left", "Right", "Top", "Bottom"], defaultValue: "left", displaySegmentedControl: true }, alignment: { type: ControlType.Enum, title: "Align", options: ["flex-start", "center", "flex-end"], optionIcons: { direction: { right: ["align-top", "align-middle", "align-bottom"], left: ["align-top", "align-middle", "align-bottom"], top: ["align-left", "align-center", "align-right"], bottom: ["align-left", "align-center", "align-right"] } }, defaultValue: "center", displaySegmentedControl: true }, gap: { type: ControlType.Number, title: "Gap" }, padding: { title: "Padding", type: ControlType.FusedNumber, toggleKey: "paddingPerSide", toggleTitles: ["Padding", "Padding per side"], valueKeys: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"], valueLabels: ["T", "R", "B", "L"], min: 0 }, sizingOptions: { type: ControlType.Object, title: "Sizing", controls: { widthType: { type: ControlType.Boolean, title: "Width", enabledTitle: "Auto", disabledTitle: "Stretch", defaultValue: true }, heightType: { type: ControlType.Boolean, title: "Height", enabledTitle: "Auto", disabledTitle: "Stretch", defaultValue: true } } }, fadeOptions: { type: ControlType.Object, title: "Clipping", controls: { fadeContent: { type: ControlType.Boolean, title: "Fade", defaultValue: true }, overflow: { type: ControlType.Boolean, title: "Overflow", enabledTitle: "Show", disabledTitle: "Hide", defaultValue: false, hidden(props) {
  return props.fadeContent === true;
} }, fadeWidth: { type: ControlType.Number, title: "Width", defaultValue: 25, min: 0, max: 100, unit: "%", hidden(props) {
  return props.fadeContent === false;
} }, fadeInset: { type: ControlType.Number, title: "Inset", defaultValue: 0, min: 0, max: 100, unit: "%", hidden(props) {
  return props.fadeContent === false;
} }, fadeAlpha: { type: ControlType.Number, title: "Opacity", defaultValue: 0, min: 0, max: 1, step: 0.05, hidden(props) {
  return props.fadeContent === false;
} } } }, hoverFactor: { type: ControlType.Number, title: "Hover", min: 0, max: 1, unit: "x", defaultValue: 1, step: 0.1, displayStepper: true, description: "Slows down the speed while you are hovering." } });
var containerStyle = { display: "flex", width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", placeItems: "center", margin: 0, padding: 0, listStyleType: "none", textIndent: "none" };
var placeholderStyles = { display: "flex", width: "100%", height: "100%", placeContent: "center", placeItems: "center", flexDirection: "column", color: "#96F", background: "rgba(136, 85, 255, 0.1)", fontSize: 11, overflow: "hidden", padding: "20px 20px 30px 20px" };
var emojiStyles = { fontSize: 32, marginBottom: 10 };
var titleStyles = { margin: 0, marginBottom: 10, fontWeight: 600, textAlign: "center" };
var subtitleStyles = { margin: 0, opacity: 0.7, maxWidth: 150, lineHeight: 1.5, textAlign: "center" };
var clamp = (num, min, max) => Math.min(Math.max(num, min), max);
var isValidNumber = (value) => typeof value === "number" && !isNaN(value);
function useWritingDirection() {
  if (!__dai_window || !__dai_window.document || !__dai_window.document.documentElement)
    return "ltr";
  return __dai_window.document.documentElement.dir === "rtl" ? "rtl" : "ltr";
}
function getTickerResolvedDirection(direction, writingDirection) {
  if (writingDirection !== "rtl")
    return direction;
  if (direction === "left")
    return "right";
  if (direction === "right")
    return "left";
  return direction;
}

// http-url:https://framerusercontent.com/modules/fOhSVgkmg6rJ9ucWs7I8/Axo3YGE9omrwVEi1S8vF/pru_285pj.js
import { fontStore } from "./_framer-runtime.js";
fontStore.loadFonts(["FS;Manrope-semibold", "FS;Manrope-bold"]);
var fonts = [{ explicitInter: true, fonts: [{ cssFamilyName: "Manrope", source: "fontshare", style: "normal", uiFamilyName: "Manrope", url: "https://framerusercontent.com/third-party-assets/fontshare/wf/6U2SGH566NSNERG6RGEV3DSNEK7DL2RF/JRDYRKMSAW2H35IWEQIPL67HAJQ35MG5/JNU3GNMUBPWW6V6JTED3S27XL5HN7NM5.woff2", weight: "600" }, { cssFamilyName: "Manrope", source: "fontshare", style: "normal", uiFamilyName: "Manrope", url: "https://framerusercontent.com/third-party-assets/fontshare/wf/NGBUP45ES3F7RD5XGKPEDJ6QEPO4TMOK/EXDVWJ2EDDVVV65UENMX33EDDYBX6OF7/6P4FPMFQH7CCC7RZ4UU4NKSGJ2RLF7V5.woff2", weight: "700" }] }];
var css = [`.framer-fzoOP .framer-styles-preset-b1i24i:not(.rich-text-wrapper), .framer-fzoOP .framer-styles-preset-b1i24i.rich-text-wrapper h3 { --framer-font-family: "Manrope", "Manrope Placeholder", sans-serif; --framer-font-family-bold: "Manrope", "Manrope Placeholder", sans-serif; --framer-font-open-type-features: 'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on; --framer-font-size: 54px; --framer-font-style: normal; --framer-font-style-bold: normal; --framer-font-variation-axes: normal; --framer-font-weight: 600; --framer-font-weight-bold: 700; --framer-letter-spacing: -0.01em; --framer-line-height: 1.1em; --framer-paragraph-spacing: 40px; --framer-text-alignment: start; --framer-text-color: var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, #ffffff); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: capitalize; }`, `@media (max-width: 1199px) and (min-width: 810px) { .framer-fzoOP .framer-styles-preset-b1i24i:not(.rich-text-wrapper), .framer-fzoOP .framer-styles-preset-b1i24i.rich-text-wrapper h3 { --framer-font-family: "Manrope", "Manrope Placeholder", sans-serif; --framer-font-family-bold: "Manrope", "Manrope Placeholder", sans-serif; --framer-font-open-type-features: 'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on; --framer-font-size: 48px; --framer-font-style: normal; --framer-font-style-bold: normal; --framer-font-variation-axes: normal; --framer-font-weight: 600; --framer-font-weight-bold: 700; --framer-letter-spacing: -0.01em; --framer-line-height: 1.1em; --framer-paragraph-spacing: 40px; --framer-text-alignment: start; --framer-text-color: var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, #ffffff); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: capitalize; } }`, `@media (max-width: 809px) and (min-width: 0px) { .framer-fzoOP .framer-styles-preset-b1i24i:not(.rich-text-wrapper), .framer-fzoOP .framer-styles-preset-b1i24i.rich-text-wrapper h3 { --framer-font-family: "Manrope", "Manrope Placeholder", sans-serif; --framer-font-family-bold: "Manrope", "Manrope Placeholder", sans-serif; --framer-font-open-type-features: 'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on; --framer-font-size: 32px; --framer-font-style: normal; --framer-font-style-bold: normal; --framer-font-variation-axes: normal; --framer-font-weight: 600; --framer-font-weight-bold: 700; --framer-letter-spacing: -0.01em; --framer-line-height: 1.1em; --framer-paragraph-spacing: 40px; --framer-text-alignment: start; --framer-text-color: var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, #ffffff); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: capitalize; } }`];
var className = "framer-fzoOP";

// http-url:https://framerusercontent.com/modules/szbhLeB08uGF6jj4Bvtk/E6QSqL5QAlN8pnbjS5YM/g07TANoSb.js
var TickerFonts = getFonts(Ticker);
var serializationHash = "framer-Wrq3t";
var variantClassNames = { MvSyJzaN7: "framer-v-cix19i" };
var transition1 = { bounce: 0.2, delay: 0, duration: 0.4, type: "spring" };
var Transition = ({ value, children }) => {
  const config = React.useContext(MotionConfigContext);
  const transition = value ?? config.transition;
  const contextValue = React.useMemo(() => ({ ...config, transition }), [JSON.stringify(transition)]);
  return /* @__PURE__ */ _jsx2(MotionConfigContext.Provider, { value: contextValue, children });
};
var Variants = motion2.create(React.Fragment);
var getProps = ({ height, id, text, width, ...props }) => {
  return { ...props, nt_Y8wV9r: text ?? props.nt_Y8wV9r ?? "CLEANSPACE" };
};
var createLayoutDependency = (props, variants) => {
  if (props.layoutDependency)
    return variants.join("-") + props.layoutDependency;
  return variants.join("-");
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const fallbackRef = useRef2(null);
  const refBinding = ref ?? fallbackRef;
  const defaultLayoutId = React.useId();
  const { activeLocale, setLocale } = useLocaleInfo();
  const componentViewport = useComponentViewport();
  const { style, className: className2, layoutId, variant, nt_Y8wV9r, ...restProps } = getProps(props);
  const { baseVariant, classNames, clearLoadingGesture, gestureHandlers, gestureVariant, isLoading, setGestureState, setVariant, variants } = useVariantState({ defaultVariant: "MvSyJzaN7", ref: refBinding, variant, variantClassNames });
  const layoutDependency = createLayoutDependency(props, variants);
  const sharedStyleClassNames = [className];
  const scopingClassNames = cx(serializationHash, ...sharedStyleClassNames);
  return /* @__PURE__ */ _jsx2(LayoutGroup2, { id: layoutId ?? defaultLayoutId, children: /* @__PURE__ */ _jsx2(Variants, { animate: variants, initial: false, children: /* @__PURE__ */ _jsx2(Transition, { value: transition1, children: /* @__PURE__ */ _jsx2(motion2.div, { ...restProps, ...gestureHandlers, className: cx(scopingClassNames, "framer-cix19i", className2, classNames), "data-framer-name": "Default", layoutDependency, layoutId: "RunningText4__MvSyJzaN7", ref: refBinding, style: { ...style }, children: /* @__PURE__ */ _jsx2(ComponentViewportProvider, { children: /* @__PURE__ */ _jsx2(SmartComponentScopedContainer, { className: "framer-j7qup7-container", isAuthoredByUser: true, isModuleExternal: true, layoutDependency, layoutId: "RunningText4__qyLvg5QBv-container", nodeId: "qyLvg5QBv", rendersWithMotion: true, scopeId: "g07TANoSb", children: /* @__PURE__ */ _jsx2(Ticker, { alignment: "center", direction: "left", fadeOptions: { fadeAlpha: 0, fadeContent: false, fadeInset: 0, fadeWidth: 25, overflow: false }, gap: 100, height: "100%", hoverFactor: 1, id: "qyLvg5QBv", layoutId: "RunningText4__qyLvg5QBv", padding: 10, paddingBottom: 10, paddingLeft: 10, paddingPerSide: false, paddingRight: 10, paddingTop: 10, sizingOptions: { heightType: true, widthType: true }, slots: [/* @__PURE__ */ _jsx2(motion2.div, { className: "framer-1yka1ez", "data-framer-name": "Text", layoutDependency, layoutId: "RunningText4__LnTJMxnwM", children: /* @__PURE__ */ _jsx2(RichText, { __fromCanvasComponent: true, children: /* @__PURE__ */ _jsx2(React.Fragment, { children: /* @__PURE__ */ _jsx2(motion2.h3, { className: "framer-styles-preset-b1i24i", "data-styles-preset": "pru_285pj", dir: "auto", style: { "--framer-text-color": "var(--extracted-a0htzi, var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255)))" }, children: "CLEANSPACE" }) }), className: "framer-707e2c", fonts: ["Inter"], layoutDependency, layoutId: "RunningText4__sq3kmhpKr", style: { "--extracted-a0htzi": "var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255))", "--framer-link-text-color": "rgb(0, 153, 255)", "--framer-link-text-decoration": "underline" }, text: nt_Y8wV9r, verticalAlignment: "top", withExternalLayout: true }) })], speed: 50, style: { height: "100%", width: "100%" }, width: "100%" }) }) }) }) }) }) });
});
var css2 = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-Wrq3t.framer-vqejcd, .framer-Wrq3t .framer-vqejcd { display: block; }", ".framer-Wrq3t.framer-cix19i { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: auto; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 100%; }", ".framer-Wrq3t .framer-j7qup7-container { flex: 1 0 0px; height: 100%; position: relative; width: 1px; }", ".framer-Wrq3t .framer-1yka1ez { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: min-content; }", ".framer-Wrq3t .framer-707e2c { -webkit-user-select: none; flex: none; height: auto; position: relative; user-select: none; white-space: pre; width: auto; }", ...css];
var Framerg07TANoSb = withCSS(Component, css2, "framer-Wrq3t");
var g07TANoSb_default = Framerg07TANoSb;
Framerg07TANoSb.displayName = "Running Text 4";
Framerg07TANoSb.defaultProps = { height: 120, width: 1200 };
addPropertyControls2(Framerg07TANoSb, { nt_Y8wV9r: { defaultValue: "CLEANSPACE", displayTextArea: false, title: "Text", type: ControlType2.String } });
addFonts(Framerg07TANoSb, [{ explicitInter: true, fonts: [{ cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2", weight: "400" }] }, ...TickerFonts, ...getFontsFromSharedStyle(fonts)], { supportsExplicitInterCodegen: true });
var __FramerMetadata__ = { "exports": { "Props": { "type": "tsType", "annotations": { "framerContractVersion": "1" } }, "default": { "type": "reactComponent", "name": "Framerg07TANoSb", "slots": [], "annotations": { "framerIntrinsicHeight": "120", "framerImmutableVariables": "true", "framerCanvasComponentVariantDetails": '{"propertyName":"variant","data":{"default":{"layout":["fixed","fixed"]}}}', "framerVariables": '{"nt_Y8wV9r":"text"}', "framerDisplayContentsDiv": "false", "framerContractVersion": "1", "framerColorSyntax": "true", "framerAutoSizeImages": "true", "framerIntrinsicWidth": "1200", "framerComponentViewportWidth": "true" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  g07TANoSb_default as default
};
