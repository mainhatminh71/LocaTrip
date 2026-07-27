var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/iDls7szIyOapA0UqOzub/ZD1jBHPD0PE6KjKR4bcw/GJ_1IPmVJ.js
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { addFonts, addPropertyControls, ControlType, cx, getLoadingLazyAtYPosition, Image as Image1, useComponentViewport, useLocaleInfo, useVariantState, withCSS } from "./_framer-runtime.js";
import { LayoutGroup, motion, MotionConfigContext } from "framer-motion";
import * as React from "react";
import { useRef } from "react";
var cycleOrder = ["LTxJMqaG2", "vQ1S1fEfF", "jEzU1nk_u", "JmylZ0nTo", "aFhEldEIm"];
var serializationHash = "framer-wrrY1";
var variantClassNames = { aFhEldEIm: "framer-v-7iak5t", jEzU1nk_u: "framer-v-10swdw1", JmylZ0nTo: "framer-v-1qj0fqq", LTxJMqaG2: "framer-v-1o1fx2u", vQ1S1fEfF: "framer-v-1xg1uzm" };
function addPropertyOverrides(overrides, ...variants) {
  const nextOverrides = {};
  variants?.forEach((variant) => variant && Object.assign(nextOverrides, overrides[variant]));
  return nextOverrides;
}
var transition1 = { delay: 0.2, duration: 0.6, ease: [0.44, 0, 0.56, 1], type: "tween" };
var Transition = ({ value, children }) => {
  const config = React.useContext(MotionConfigContext);
  const transition = value ?? config.transition;
  const contextValue = React.useMemo(() => ({ ...config, transition }), [JSON.stringify(transition)]);
  return /* @__PURE__ */ _jsx(MotionConfigContext.Provider, { value: contextValue, children });
};
var humanReadableVariantMap = { "New York": "JmylZ0nTo", "Variant 5": "aFhEldEIm", Japan: "LTxJMqaG2", Paris: "jEzU1nk_u", Swizerland: "vQ1S1fEfF" };
var Variants = motion.create(React.Fragment);
var getProps = ({ height, id, width, ...props }) => {
  return { ...props, variant: humanReadableVariantMap[props.variant] ?? props.variant ?? "LTxJMqaG2" };
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
  const { style, className, layoutId, variant, ...restProps } = getProps(props);
  const { baseVariant, classNames, clearLoadingGesture, gestureHandlers, gestureVariant, isLoading, setGestureState, setVariant, variants } = useVariantState({ cycleOrder, defaultVariant: "LTxJMqaG2", ref: refBinding, variant, variantClassNames });
  const layoutDependency = createLayoutDependency(props, variants);
  const sharedStyleClassNames = [];
  const scopingClassNames = cx(serializationHash, ...sharedStyleClassNames);
  return /* @__PURE__ */ _jsx(LayoutGroup, { id: layoutId ?? defaultLayoutId, children: /* @__PURE__ */ _jsx(Variants, { animate: variants, initial: false, children: /* @__PURE__ */ _jsx(Transition, { value: transition1, children: /* @__PURE__ */ _jsxs(motion.div, { ...restProps, ...gestureHandlers, className: cx(scopingClassNames, "framer-1o1fx2u", className, classNames), "data-framer-name": "Japan", layoutDependency, layoutId: "DestinationBgImage__LTxJMqaG2", ref: refBinding, style: { backgroundColor: "var(--token-e15d98be-dc11-48c5-ad2b-3fbf85780d09, rgb(0, 0, 0))", ...style }, ...addPropertyOverrides({ aFhEldEIm: { "data-framer-name": "Variant 5" }, jEzU1nk_u: { "data-framer-name": "Paris" }, JmylZ0nTo: { "data-framer-name": "New York" }, vQ1S1fEfF: { "data-framer-name": "Swizerland" } }, baseVariant, gestureVariant), children: [/* @__PURE__ */ _jsx(Image1, { as: "figure", background: { alt: "buildings near body of water landscape photography", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + 0), pixelHeight: 3648, pixelWidth: 5472, sizes: componentViewport?.width || "100vw", src: "https://framerusercontent.com/images/fwhqG03zmpiJ9yMcAtxyEH17kA.jpg?width=5472&height=3648", srcSet: "https://framerusercontent.com/images/fwhqG03zmpiJ9yMcAtxyEH17kA.jpg?scale-down-to=512&width=5472&height=3648 512w,https://framerusercontent.com/images/fwhqG03zmpiJ9yMcAtxyEH17kA.jpg?scale-down-to=1024&width=5472&height=3648 1024w,https://framerusercontent.com/images/fwhqG03zmpiJ9yMcAtxyEH17kA.jpg?scale-down-to=2048&width=5472&height=3648 2048w,https://framerusercontent.com/images/fwhqG03zmpiJ9yMcAtxyEH17kA.jpg?scale-down-to=4096&width=5472&height=3648 4096w,https://framerusercontent.com/images/fwhqG03zmpiJ9yMcAtxyEH17kA.jpg?width=5472&height=3648 5472w" }, className: "framer-a1i1p4", "data-framer-name": "Image 4", layoutDependency, layoutId: "DestinationBgImage__Wd6Jo_Xyi" }), /* @__PURE__ */ _jsx(Image1, { as: "figure", background: { alt: "the eiffel tower is lit up at night", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + 0), pixelHeight: 3349, pixelWidth: 5020, sizes: componentViewport?.width || "100vw", src: "https://framerusercontent.com/images/GIL3Q3c3bqKBFgpYyeVpC7bP4I.jpg?width=5020&height=3349", srcSet: "https://framerusercontent.com/images/GIL3Q3c3bqKBFgpYyeVpC7bP4I.jpg?scale-down-to=512&width=5020&height=3349 512w,https://framerusercontent.com/images/GIL3Q3c3bqKBFgpYyeVpC7bP4I.jpg?scale-down-to=1024&width=5020&height=3349 1024w,https://framerusercontent.com/images/GIL3Q3c3bqKBFgpYyeVpC7bP4I.jpg?scale-down-to=2048&width=5020&height=3349 2048w,https://framerusercontent.com/images/GIL3Q3c3bqKBFgpYyeVpC7bP4I.jpg?scale-down-to=4096&width=5020&height=3349 4096w,https://framerusercontent.com/images/GIL3Q3c3bqKBFgpYyeVpC7bP4I.jpg?width=5020&height=3349 5020w" }, className: "framer-ipbsvu", "data-framer-name": "Image 3", layoutDependency, layoutId: "DestinationBgImage__K5pjoUIb8", style: { opacity: 1 }, variants: { aFhEldEIm: { opacity: 1 }, JmylZ0nTo: { opacity: 0 } } }), /* @__PURE__ */ _jsx(Image1, { as: "figure", background: { alt: "A scenic view of a lake in the mountains", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + 0), pixelHeight: 3024, pixelWidth: 4032, sizes: componentViewport?.width || "100vw", src: "https://framerusercontent.com/images/I6igcYQetVpLzLeJMFWe3js5R8.jpg?width=4032&height=3024", srcSet: "https://framerusercontent.com/images/I6igcYQetVpLzLeJMFWe3js5R8.jpg?scale-down-to=512&width=4032&height=3024 512w,https://framerusercontent.com/images/I6igcYQetVpLzLeJMFWe3js5R8.jpg?scale-down-to=1024&width=4032&height=3024 1024w,https://framerusercontent.com/images/I6igcYQetVpLzLeJMFWe3js5R8.jpg?scale-down-to=2048&width=4032&height=3024 2048w,https://framerusercontent.com/images/I6igcYQetVpLzLeJMFWe3js5R8.jpg?width=4032&height=3024 4032w" }, className: "framer-dpqlgo", "data-framer-name": "Image 2", layoutDependency, layoutId: "DestinationBgImage__WQe5KvKIc", style: { opacity: 1 }, variants: { aFhEldEIm: { opacity: 1 }, jEzU1nk_u: { opacity: 0 }, JmylZ0nTo: { opacity: 0 } } }), /* @__PURE__ */ _jsx(Image1, { as: "figure", background: { alt: "canal between cherry blossom trees", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + 0), pixelHeight: 673, pixelWidth: 1200, sizes: componentViewport?.width || "100vw", src: "https://framerusercontent.com/images/xPq9YoLQc0DjJyTkUVKVGxOgZzU.png?width=1200&height=673", srcSet: "https://framerusercontent.com/images/xPq9YoLQc0DjJyTkUVKVGxOgZzU.png?scale-down-to=512&width=1200&height=673 512w,https://framerusercontent.com/images/xPq9YoLQc0DjJyTkUVKVGxOgZzU.png?scale-down-to=1024&width=1200&height=673 1024w,https://framerusercontent.com/images/xPq9YoLQc0DjJyTkUVKVGxOgZzU.png?width=1200&height=673 1200w" }, className: "framer-1yl1wzg", "data-framer-name": "Image 1", layoutDependency, layoutId: "DestinationBgImage__mImUJGc_Z", style: { opacity: 1 }, variants: { aFhEldEIm: { opacity: 1 }, jEzU1nk_u: { opacity: 0 }, JmylZ0nTo: { opacity: 0 }, vQ1S1fEfF: { opacity: 0 } } })] }) }) }) });
});
var css = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-wrrY1.framer-1dvtel2, .framer-wrrY1 .framer-1dvtel2 { display: block; }", ".framer-wrrY1.framer-1o1fx2u { height: auto; overflow: var(--overflow-clip-fallback, clip); position: relative; width: 100%; }", ".framer-wrrY1 .framer-a1i1p4, .framer-wrrY1 .framer-ipbsvu, .framer-wrrY1 .framer-dpqlgo, .framer-wrrY1 .framer-1yl1wzg { bottom: 0px; flex: none; left: 0px; overflow: var(--overflow-clip-fallback, clip); position: absolute; right: 0px; top: 0px; will-change: var(--framer-will-change-filter-override, filter); }"];
var FramerGJ_1IPmVJ = withCSS(Component, css, "framer-wrrY1");
var GJ_1IPmVJ_default = FramerGJ_1IPmVJ;
FramerGJ_1IPmVJ.displayName = "Destination Bg Image";
FramerGJ_1IPmVJ.defaultProps = { height: 800, width: 1200 };
addPropertyControls(FramerGJ_1IPmVJ, { variant: { options: ["LTxJMqaG2", "vQ1S1fEfF", "jEzU1nk_u", "JmylZ0nTo", "aFhEldEIm"], optionTitles: ["Japan", "Swizerland", "Paris", "New York", "Variant 5"], title: "Variant", type: ControlType.Enum } });
addFonts(FramerGJ_1IPmVJ, [{ explicitInter: true, fonts: [] }], { supportsExplicitInterCodegen: true });
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "FramerGJ_1IPmVJ", "slots": [], "annotations": { "framerIntrinsicHeight": "800", "framerIntrinsicWidth": "1200", "framerColorSyntax": "true", "framerImmutableVariables": "true", "framerAutoSizeImages": "true", "framerCanvasComponentVariantDetails": '{"propertyName":"variant","data":{"default":{"layout":["fixed","fixed"]},"vQ1S1fEfF":{"layout":["fixed","fixed"]},"jEzU1nk_u":{"layout":["fixed","fixed"]},"JmylZ0nTo":{"layout":["fixed","fixed"]},"aFhEldEIm":{"layout":["fixed","fixed"]}}}', "framerDisplayContentsDiv": "false", "framerContractVersion": "1", "framerComponentViewportWidth": "true" } }, "Props": { "type": "tsType", "annotations": { "framerContractVersion": "1" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  GJ_1IPmVJ_default as default
};
