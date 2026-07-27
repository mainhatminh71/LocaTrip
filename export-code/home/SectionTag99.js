var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/4NLX7rmMNPFre6Q74huH/rh5n8hmgrx2bNCumzoMl/fmmzjhER7.js
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { addFonts, addPropertyControls, ControlType, cx, getFontsFromSharedStyle, getLoadingLazyAtYPosition, Image as Image1, RichText, useComponentViewport, useLocaleInfo, useVariantState, withCSS } from "./_framer-runtime.js";
import { LayoutGroup, motion, MotionConfigContext } from "framer-motion";
import * as React from "react";
import { useRef } from "react";

// http-url:https://framerusercontent.com/modules/ZP5msFN8qqgQHiAyv6dz/AOw0K4JBOEQ7KnMD9iUn/TiWSjQ2lc.js
import { fontStore } from "./_framer-runtime.js";
fontStore.loadFonts(["GF;Cal Sans-regular"]);
var fonts = [{ explicitInter: true, fonts: [{ cssFamilyName: "Cal Sans", openType: true, source: "google", style: "normal", uiFamilyName: "Cal Sans", url: "https://fonts.gstatic.com/s/calsans/v2/fdN99sWUv3gWqXxqqSBevloE4LZx.woff2", weight: "400" }] }];
var css = [`.framer-VgaHN .framer-styles-preset-1qeu4bo:not(.rich-text-wrapper), .framer-VgaHN .framer-styles-preset-1qeu4bo.rich-text-wrapper p { --framer-font-family: "Cal Sans", "Cal Sans Placeholder", sans-serif; --framer-font-open-type-features: 'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on; --framer-font-size: 16px; --framer-font-style: normal; --framer-font-variation-axes: normal; --framer-font-weight: 400; --framer-letter-spacing: 0em; --framer-line-height: 1.4em; --framer-paragraph-spacing: 20px; --framer-text-alignment: start; --framer-text-color: var(--token-73d82950-3751-42a6-927e-1ac6d9a336d2, #191919); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: none; }`];
var className = "framer-VgaHN";

// http-url:https://framerusercontent.com/modules/4NLX7rmMNPFre6Q74huH/rh5n8hmgrx2bNCumzoMl/fmmzjhER7.js
var cycleOrder = ["exlhOGd7O", "GcBcwB523"];
var serializationHash = "framer-uIJBa";
var variantClassNames = { exlhOGd7O: "framer-v-n0c9ug", GcBcwB523: "framer-v-1io9gg6" };
function addPropertyOverrides(overrides, ...variants) {
  const nextOverrides = {};
  variants?.forEach((variant) => variant && Object.assign(nextOverrides, overrides[variant]));
  return nextOverrides;
}
var transition1 = { bounce: 0.2, delay: 0, duration: 0.4, type: "spring" };
var toResponsiveImage = (value) => {
  if (typeof value === "object" && value !== null && typeof value.src === "string") {
    return value;
  }
  return typeof value === "string" ? { src: value } : void 0;
};
var Transition = ({ value, children }) => {
  const config = React.useContext(MotionConfigContext);
  const transition = value ?? config.transition;
  const contextValue = React.useMemo(() => ({ ...config, transition }), [JSON.stringify(transition)]);
  return /* @__PURE__ */ _jsx(MotionConfigContext.Provider, { value: contextValue, children });
};
var humanReadableVariantMap = { Dark: "exlhOGd7O", Light: "GcBcwB523" };
var Variants = motion.create(React.Fragment);
var getProps = ({ height, id, image, title, width, ...props }) => {
  return { ...props, dg_MYFFcN: title ?? props.dg_MYFFcN ?? "\u0110\u1ED9i ng\u0169", Qj6JTE_1X: image ?? props.Qj6JTE_1X, variant: humanReadableVariantMap[props.variant] ?? props.variant ?? "exlhOGd7O" };
};
var createLayoutDependency = (props, variants) => {
  if (props.layoutDependency)
    return variants.join("-") + props.layoutDependency;
  return variants.join("-");
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const fallbackRef = useRef(null);
  const refBinding = ref ?? fallbackRef;
  const defaultLayoutId = React.useId();
  const { activeLocale, setLocale } = useLocaleInfo();
  const componentViewport = useComponentViewport();
  const { style, className: className2, layoutId, variant, Qj6JTE_1X, dg_MYFFcN, ...restProps } = getProps(props);
  const { baseVariant, classNames, clearLoadingGesture, gestureHandlers, gestureVariant, isLoading, setGestureState, setVariant, variants } = useVariantState({ cycleOrder, defaultVariant: "exlhOGd7O", ref: refBinding, variant, variantClassNames });
  const layoutDependency = createLayoutDependency(props, variants);
  const sharedStyleClassNames = [className];
  const scopingClassNames = cx(serializationHash, ...sharedStyleClassNames);
  return /* @__PURE__ */ _jsx(LayoutGroup, { id: layoutId ?? defaultLayoutId, children: /* @__PURE__ */ _jsx(Variants, { animate: variants, initial: false, children: /* @__PURE__ */ _jsx(Transition, { value: transition1, children: /* @__PURE__ */ _jsx(motion.div, { ...restProps, ...gestureHandlers, className: cx(scopingClassNames, "framer-n0c9ug", className2, classNames), "data-framer-name": "Dark", layoutDependency, layoutId: "SectionTag__exlhOGd7O", ref: refBinding, style: { ...style }, ...addPropertyOverrides({ GcBcwB523: { "data-framer-name": "Light" } }, baseVariant, gestureVariant), children: /* @__PURE__ */ _jsxs(motion.div, { className: "framer-7p03cy", "data-framer-name": "Tag", layoutDependency, layoutId: "SectionTag__aPDd16SpA", children: [/* @__PURE__ */ _jsx(Image1, { background: { alt: "", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + (0 + ((componentViewport?.height || 24) - 0 - 24) / 2) + 0), sizes: "24px", ...toResponsiveImage(Qj6JTE_1X) }, className: "framer-aaagvs", layoutDependency, layoutId: "SectionTag__gb2BG94c0", style: { filter: "none", opacity: 0.65, WebkitFilter: "none" }, variants: { GcBcwB523: { filter: "invert(0.92)", opacity: 1, WebkitFilter: "invert(0.92)" } } }), /* @__PURE__ */ _jsx(RichText, { __fromCanvasComponent: true, children: /* @__PURE__ */ _jsx(React.Fragment, { children: /* @__PURE__ */ _jsx(motion.p, { className: "framer-styles-preset-1qeu4bo", "data-styles-preset": "TiWSjQ2lc", dir: "auto", style: { "--framer-text-color": "var(--extracted-r6o4lv, var(--token-1cce3232-33c3-4748-a258-ada69df4fa71, rgb(84, 84, 84)))" }, children: "Why Chose Us" }) }), className: "framer-jag73r", "data-framer-name": "Title", fonts: ["Inter"], layoutDependency, layoutId: "SectionTag__Q_M4iPO5C", style: { "--extracted-r6o4lv": "var(--token-1cce3232-33c3-4748-a258-ada69df4fa71, rgb(84, 84, 84))", "--framer-paragraph-spacing": "0px" }, text: dg_MYFFcN, variants: { GcBcwB523: { "--extracted-r6o4lv": "var(--token-d8bb658f-330c-4eac-af07-d4bcacb28cd9, rgb(240, 240, 240))" } }, verticalAlignment: "center", withExternalLayout: true, ...addPropertyOverrides({ GcBcwB523: { children: /* @__PURE__ */ _jsx(React.Fragment, { children: /* @__PURE__ */ _jsx(motion.p, { className: "framer-styles-preset-1qeu4bo", "data-styles-preset": "TiWSjQ2lc", dir: "auto", style: { "--framer-text-color": "var(--extracted-r6o4lv, var(--token-d8bb658f-330c-4eac-af07-d4bcacb28cd9, rgb(240, 240, 240)))" }, children: "Why Chose Us" }) }) } }, baseVariant, gestureVariant) })] }) }) }) }) });
});
var css2 = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-uIJBa.framer-8o4hon, .framer-uIJBa .framer-8o4hon { display: block; }", ".framer-uIJBa.framer-n0c9ug { align-content: center; align-items: center; cursor: default; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: min-content; }", ".framer-uIJBa .framer-7p03cy { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 8px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: min-content; }", ".framer-uIJBa .framer-aaagvs { aspect-ratio: 1 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 24px); overflow: var(--overflow-clip-fallback, clip); position: relative; width: 24px; will-change: var(--framer-will-change-filter-override, filter); }", ".framer-uIJBa .framer-jag73r { flex: none; height: auto; position: relative; white-space: pre; width: auto; }", ".framer-uIJBa.framer-v-1io9gg6 .framer-aaagvs { order: 0; }", ".framer-uIJBa.framer-v-1io9gg6 .framer-jag73r { order: 1; }", ...css];
var FramerfmmzjhER7 = withCSS(Component, css2, "framer-uIJBa");
var fmmzjhER7_default = FramerfmmzjhER7;
FramerfmmzjhER7.displayName = "Section Tag";
FramerfmmzjhER7.defaultProps = { height: 24, width: 87 };
addPropertyControls(FramerfmmzjhER7, { variant: { options: ["exlhOGd7O", "GcBcwB523"], optionTitles: ["Dark", "Light"], title: "Variant", type: ControlType.Enum }, Qj6JTE_1X: { title: "Image", type: ControlType.ResponsiveImage }, dg_MYFFcN: { defaultValue: "\u0110\u1ED9i ng\u0169", displayTextArea: false, title: "Title", type: ControlType.String }, ondg_MYFFcNChange: { changes: "dg_MYFFcN", type: ControlType.ChangeHandler } });
addFonts(FramerfmmzjhER7, [{ explicitInter: true, fonts: [{ cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2", weight: "400" }] }, ...getFontsFromSharedStyle(fonts)], { supportsExplicitInterCodegen: true });
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "FramerfmmzjhER7", "slots": [], "annotations": { "framerCanvasComponentVariantDetails": '{"propertyName":"variant","data":{"default":{"layout":["auto","auto"]},"GcBcwB523":{"layout":["auto","auto"]}}}', "framerContractVersion": "1", "framerDisplayContentsDiv": "false", "framerImmutableVariables": "true", "framerIntrinsicHeight": "24", "framerIntrinsicWidth": "87", "framerComponentViewportWidth": "true", "framerColorSyntax": "true", "framerAutoSizeImages": "true", "framerVariables": '{"Qj6JTE_1X":"image","dg_MYFFcN":"title"}' } }, "Props": { "type": "tsType", "annotations": { "framerContractVersion": "1" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  fmmzjhER7_default as default
};
