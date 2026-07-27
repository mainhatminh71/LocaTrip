var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/4fG4cShT3d4otPHwh9yc/odhSpbtWT7SLEIItfAUg/hMOJB0YG8.js
import { jsx as _jsx } from "react/jsx-runtime";
import { addFonts, addPropertyControls, ControlType, cx, getLoadingLazyAtYPosition, Image, useActiveVariantCallback, useComponentViewport, useLocaleInfo, useOnVariantChange, useVariantState, withCSS } from "./_framer-runtime.js";
import { LayoutGroup, motion, MotionConfigContext } from "framer-motion";
import * as React from "react";
import { useRef } from "react";
var cycleOrder = ["ndPGIR4bn", "oO6Ql4cYU", "IaKhFFXTq", "qLXUXHtoS"];
var serializationHash = "framer-KZeRi";
var variantClassNames = { IaKhFFXTq: "framer-v-kffml3", ndPGIR4bn: "framer-v-c9vzou", oO6Ql4cYU: "framer-v-3k9g30", qLXUXHtoS: "framer-v-1m7665l" };
function addPropertyOverrides(overrides, ...variants) {
  const nextOverrides = {};
  variants?.forEach((variant) => variant && Object.assign(nextOverrides, overrides[variant]));
  return nextOverrides;
}
var toResponsiveImage = (value) => {
  if (typeof value === "object" && value !== null && typeof value.src === "string") {
    return value;
  }
  return typeof value === "string" ? { src: value } : void 0;
};
var transition1 = { delay: 0, duration: 4.3, ease: [0, 0, 1, 1], type: "tween" };
var Transition = ({ value, children }) => {
  const config = React.useContext(MotionConfigContext);
  const transition = value ?? config.transition;
  const contextValue = React.useMemo(() => ({ ...config, transition }), [JSON.stringify(transition)]);
  return /* @__PURE__ */ _jsx(MotionConfigContext.Provider, { value: contextValue, children });
};
var Variants = motion.create(React.Fragment);
var humanReadableVariantMap = { "Image 1": "ndPGIR4bn", "Image 2": "oO6Ql4cYU", "Image 3": "IaKhFFXTq", "Image 4": "qLXUXHtoS" };
var getProps = ({ height, id, image1, image2, image3, image4, width, ...props }) => {
  return { ...props, bNIxmSYTX: image1 ?? props.bNIxmSYTX ?? { alt: "", pixelHeight: 1280, pixelWidth: 896, src: "https://framerusercontent.com/images/kDDFdQi11eufzZl2QNW6DZQPHc.png?width=896&height=1280", srcSet: "https://framerusercontent.com/images/kDDFdQi11eufzZl2QNW6DZQPHc.png?scale-down-to=1024&width=896&height=1280 716w,https://framerusercontent.com/images/kDDFdQi11eufzZl2QNW6DZQPHc.png?width=896&height=1280 896w" }, CXo7fyVBS: image2 ?? props.CXo7fyVBS ?? { alt: "", pixelHeight: 1408, pixelWidth: 768, src: "https://framerusercontent.com/images/opHG6G3XXBPn4u7fJmN9pqpI.png?width=768&height=1408", srcSet: "https://framerusercontent.com/images/opHG6G3XXBPn4u7fJmN9pqpI.png?scale-down-to=1024&width=768&height=1408 558w,https://framerusercontent.com/images/opHG6G3XXBPn4u7fJmN9pqpI.png?width=768&height=1408 768w" }, Hu6fn5bt1: image4 ?? props.Hu6fn5bt1 ?? { alt: "", pixelHeight: 1280, pixelWidth: 896, src: "https://framerusercontent.com/images/8Hyh6pB3pbhNuDNsxVZH0w3kvKo.png?width=896&height=1280", srcSet: "https://framerusercontent.com/images/8Hyh6pB3pbhNuDNsxVZH0w3kvKo.png?scale-down-to=1024&width=896&height=1280 716w,https://framerusercontent.com/images/8Hyh6pB3pbhNuDNsxVZH0w3kvKo.png?width=896&height=1280 896w" }, variant: humanReadableVariantMap[props.variant] ?? props.variant ?? "ndPGIR4bn", YzLWPJL0x: image3 ?? props.YzLWPJL0x ?? { alt: "", pixelHeight: 1280, pixelWidth: 896, src: "https://framerusercontent.com/images/uEuzLmHidyU1NDRflf2P1Y4ylsY.png?width=896&height=1280", srcSet: "https://framerusercontent.com/images/uEuzLmHidyU1NDRflf2P1Y4ylsY.png?scale-down-to=1024&width=896&height=1280 716w,https://framerusercontent.com/images/uEuzLmHidyU1NDRflf2P1Y4ylsY.png?width=896&height=1280 896w" } };
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
  const { style, className, layoutId, variant, bNIxmSYTX, CXo7fyVBS, YzLWPJL0x, Hu6fn5bt1, ...restProps } = getProps(props);
  const { baseVariant, classNames, clearLoadingGesture, gestureHandlers, gestureVariant, isLoading, setGestureState, setVariant, variants } = useVariantState({ cycleOrder, defaultVariant: "ndPGIR4bn", ref: refBinding, variant, variantClassNames });
  const layoutDependency = createLayoutDependency(props, variants);
  const { activeVariantCallback, delay } = useActiveVariantCallback(baseVariant);
  const onAppeariz7bn1 = activeVariantCallback(async (...args) => {
    await delay(() => setVariant("oO6Ql4cYU", true), 1e3);
  });
  const onAppear19e3htk = activeVariantCallback(async (...args) => {
    await delay(() => setVariant("IaKhFFXTq", true), 1e3);
  });
  const onAppearfpxln2 = activeVariantCallback(async (...args) => {
    await delay(() => setVariant("qLXUXHtoS", true), 1e3);
  });
  const onAppearx6dgp9 = activeVariantCallback(async (...args) => {
    setVariant("ndPGIR4bn", true);
  });
  useOnVariantChange(baseVariant, { default: onAppeariz7bn1, IaKhFFXTq: onAppearfpxln2, oO6Ql4cYU: onAppear19e3htk, qLXUXHtoS: onAppearx6dgp9 });
  const sharedStyleClassNames = [];
  const scopingClassNames = cx(serializationHash, ...sharedStyleClassNames);
  return /* @__PURE__ */ _jsx(LayoutGroup, { id: layoutId ?? defaultLayoutId, children: /* @__PURE__ */ _jsx(Variants, { animate: variants, initial: false, children: /* @__PURE__ */ _jsx(Transition, { value: transition1, children: /* @__PURE__ */ _jsx(Image, { ...restProps, ...gestureHandlers, background: { alt: "", fit: "fill", loading: getLoadingLazyAtYPosition(componentViewport?.y || 0), sizes: componentViewport?.width || "100vw", ...toResponsiveImage(bNIxmSYTX) }, className: cx(scopingClassNames, "framer-c9vzou", className, classNames), "data-framer-name": "Image 1", "data-highlight": true, layoutDependency, layoutId: "ImageLoopCard__ndPGIR4bn", ref: refBinding, style: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, ...style }, ...addPropertyOverrides({ IaKhFFXTq: { "data-framer-name": "Image 3", background: { alt: "", fit: "fill", loading: getLoadingLazyAtYPosition(componentViewport?.y || 0), pixelHeight: 1280, pixelWidth: 896, sizes: componentViewport?.width || "100vw", ...toResponsiveImage(YzLWPJL0x) } }, oO6Ql4cYU: { "data-framer-name": "Image 2", background: { alt: "", fit: "fill", loading: getLoadingLazyAtYPosition(componentViewport?.y || 0), pixelHeight: 1408, pixelWidth: 768, sizes: componentViewport?.width || "100vw", ...toResponsiveImage(CXo7fyVBS) } }, qLXUXHtoS: { "data-framer-name": "Image 4", background: { alt: "", fit: "fill", loading: getLoadingLazyAtYPosition(componentViewport?.y || 0), pixelHeight: 1280, pixelWidth: 896, sizes: componentViewport?.width || "100vw", ...toResponsiveImage(Hu6fn5bt1) } } }, baseVariant, gestureVariant) }) }) }) });
});
var css = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-KZeRi.framer-xx2pyn, .framer-KZeRi .framer-xx2pyn { display: block; }", ".framer-KZeRi.framer-c9vzou { height: auto; position: relative; width: 100%; }"];
var FramerhMOJB0YG8 = withCSS(Component, css, "framer-KZeRi");
var hMOJB0YG8_default = FramerhMOJB0YG8;
FramerhMOJB0YG8.displayName = "Image Loop Card";
FramerhMOJB0YG8.defaultProps = { height: 560, width: 400 };
addPropertyControls(FramerhMOJB0YG8, { variant: { options: ["ndPGIR4bn", "oO6Ql4cYU", "IaKhFFXTq", "qLXUXHtoS"], optionTitles: ["Image 1", "Image 2", "Image 3", "Image 4"], title: "Variant", type: ControlType.Enum }, bNIxmSYTX: { __defaultAssetReference: "data:framer/asset-reference,kDDFdQi11eufzZl2QNW6DZQPHc.png?originalFilename=porsche-1920x-q72.png&preferredSize=auto", __vekterDefault: { alt: "", assetReference: "data:framer/asset-reference,kDDFdQi11eufzZl2QNW6DZQPHc.png?originalFilename=porsche-1920x-q72.png&preferredSize=auto" }, title: "Image 1", type: ControlType.ResponsiveImage }, CXo7fyVBS: { __defaultAssetReference: "data:framer/asset-reference,opHG6G3XXBPn4u7fJmN9pqpI.png?originalFilename=visualelectric-1743070022280.png&preferredSize=auto", __vekterDefault: { alt: "", assetReference: "data:framer/asset-reference,opHG6G3XXBPn4u7fJmN9pqpI.png?originalFilename=visualelectric-1743070022280.png&preferredSize=auto" }, title: "Image 2", type: ControlType.ResponsiveImage }, YzLWPJL0x: { __defaultAssetReference: "data:framer/asset-reference,uEuzLmHidyU1NDRflf2P1Y4ylsY.png?originalFilename=visualelectric-1743151990833.png&preferredSize=auto", __vekterDefault: { alt: "", assetReference: "data:framer/asset-reference,uEuzLmHidyU1NDRflf2P1Y4ylsY.png?originalFilename=visualelectric-1743151990833.png&preferredSize=auto" }, title: "Image 3", type: ControlType.ResponsiveImage }, Hu6fn5bt1: { __defaultAssetReference: "data:framer/asset-reference,8Hyh6pB3pbhNuDNsxVZH0w3kvKo.png?originalFilename=visualelectric-1743060486232.png&preferredSize=auto", __vekterDefault: { alt: "", assetReference: "data:framer/asset-reference,8Hyh6pB3pbhNuDNsxVZH0w3kvKo.png?originalFilename=visualelectric-1743060486232.png&preferredSize=auto" }, title: "Image 4", type: ControlType.ResponsiveImage } });
addFonts(FramerhMOJB0YG8, [{ explicitInter: true, fonts: [] }], { supportsExplicitInterCodegen: true });
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "FramerhMOJB0YG8", "slots": [], "annotations": { "framerImmutableVariables": "true", "framerCanvasComponentVariantDetails": '{"propertyName":"variant","data":{"default":{"layout":["fixed","fixed"]},"oO6Ql4cYU":{"layout":["fixed","fixed"]},"IaKhFFXTq":{"layout":["fixed","fixed"]},"qLXUXHtoS":{"layout":["fixed","fixed"]}}}', "framerColorSyntax": "true", "framerDisplayContentsDiv": "false", "framerAutoSizeImages": "true", "framerIntrinsicWidth": "400", "framerVariables": '{"bNIxmSYTX":"image1","CXo7fyVBS":"image2","YzLWPJL0x":"image3","Hu6fn5bt1":"image4"}', "framerContractVersion": "1", "framerComponentViewportWidth": "true", "framerIntrinsicHeight": "560" } }, "Props": { "type": "tsType", "annotations": { "framerContractVersion": "1" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  hMOJB0YG8_default as default
};
