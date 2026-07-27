var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/udGim1kr58Y813YdtpGH/5df4DEAN5e4WBJWj2i6W/jFeUJgOyD.js
import { jsx as _jsx3, jsxs as _jsxs2 } from "react/jsx-runtime";
import { addFonts, addPropertyControls as addPropertyControls3, ComponentViewportProvider, ControlType as ControlType3, cx as cx2, getFonts, getFontsFromSharedStyle, Instance, Link, RichText, SmartComponentScopedContainer, useComponentViewport, useLocaleInfo, useVariantState, withCSS as withCSS2 } from "./_framer-runtime.js";
import { LayoutGroup, motion as motion2, MotionConfigContext } from "framer-motion";
import * as React2 from "react";
import { useRef as useRef2 } from "react";

// http-url:https://framerusercontent.com/modules/F4MfArLyripoeG7R4oNS/S5zw6PeyO8cUQIM98bdg/Gooey_Prod.js
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { addPropertyControls, ControlType, RenderTarget } from "./_framer-runtime.js";
import { useEffect, useRef, useMemo, useState } from "react";
import hash from "@emotion/hash";
var CLASS_NAME = "gooey-component";
function Gooey(props) {
  const ref = useRef(null);
  const componentId = props.id ? hash(props.id) : null;
  const instanceId = useMemo(generateRandomString, []);
  const id = componentId || instanceId;
  const isCanvas = RenderTarget.current() === RenderTarget.canvas;
  const [parentId, setParentId] = useState("");
  const [parentClass, setParentClass] = useState("");
  useEffect(() => {
    if (ref.current) {
      var _ref_current_parentElement;
      const parent = (_ref_current_parentElement = ref.current.parentElement) === null || _ref_current_parentElement === void 0 ? void 0 : _ref_current_parentElement.parentElement;
      if (parent) {
        if (isCanvas) {
          setParentId(parent.id);
        } else {
          setParentClass(parent.class);
        }
      }
    }
    return () => {
      if (ref.current) {
        var _ref_current_parentElement2;
        const parent = (_ref_current_parentElement2 = ref.current.parentElement) === null || _ref_current_parentElement2 === void 0 ? void 0 : _ref_current_parentElement2.parentElement;
        if (parent) {
          parent.style.filter = "";
        }
      }
    };
  }, []);
  return /* @__PURE__ */ _jsxs("div", { ref, className: CLASS_NAME, style: { display: "none" }, children: [!isSafari() && /* @__PURE__ */ _jsx("style", { dangerouslySetInnerHTML: { __html: `
                        ${componentId ? `div:has(> .framer-${componentId}-container) { filter: url(#goo-${id}) !important }` : ""}
                        ${parentId ? `div#${parentId} { filter: url(#goo-${id}) !important }` : ""}
                        ${parentClass ? `div.${parentClass} { filter: url(#goo-${id}) !important }` : ""}` } }), /* @__PURE__ */ _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", version: "1.1", children: /* @__PURE__ */ _jsx("defs", { children: /* @__PURE__ */ _jsxs("filter", { id: `goo-${id}`, children: [/* @__PURE__ */ _jsx("feGaussianBlur", { in: "SourceGraphic", stdDeviation: props.intensity, result: "blur" }), /* @__PURE__ */ _jsx("feColorMatrix", { in: "blur", mode: "matrix", values: `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8`, result: "goo" }), /* @__PURE__ */ _jsx("feComposite", { in: "SourceGraphic", in2: "goo", operator: "atop" })] }) }) })] });
}
Gooey.displayName = "Gooey Effect";
addPropertyControls(Gooey, { intensity: { type: ControlType.Number, defaultValue: 10, min: 2, max: 20, step: 1, description: "More components at [Framer University](https://frameruni.link/cc)." } });
function generateRandomString() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}
function isSafari() {
  if (typeof __dai_navigator === "undefined") {
    return false;
  } else {
    return /^((?!chrome|android).)*safari/i.test(__dai_navigator.userAgent);
  }
}

// http-url:https://framerusercontent.com/modules/f8Q5x3tcvy2sgigvrEse/WjPolkbUODUXgM3l5QnQ/X5rbDZv9v.js
import { jsx as _jsx2 } from "react/jsx-runtime";
import { addPropertyControls as addPropertyControls2, ControlType as ControlType2, cx, motion, withCSS } from "./_framer-runtime.js";
import * as React from "react";
import { forwardRef as forwardRef2 } from "react";
var mask = `url('data:image/svg+xml,<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 0 10 L 10 0" fill="transparent" height="10px" id="Gm6ErcvSs" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="var(--43q7um, rgb(0,0,0))" transform="translate(7 7)" width="10px"/><path d="M 0 0 L 10 0 L 10 10" fill="transparent" height="10px" id="TScaaNOIP" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="var(--43q7um, rgb(0,0,0))" transform="translate(7 7)" width="10px"/></svg>') alpha no-repeat center / auto var(--framer-icon-mask-mode, add), var(--framer-icon-mask, none)`;
var SVG = /* @__PURE__ */ forwardRef2((props, ref) => {
  const { animated, layoutId, children, ...rest } = props;
  return animated ? /* @__PURE__ */ _jsx2(motion.div, { ...rest, layoutId, ref }) : /* @__PURE__ */ _jsx2("div", { ...rest, ref });
});
var getProps = ({ height, id, stroke, width, ...props }) => {
  return { ...props, UO5clYVeQ: stroke ?? props.UO5clYVeQ ?? "rgb(0, 0, 0)" };
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const { style, className: className2, layoutId, variant, UO5clYVeQ, ...restProps } = getProps(props);
  return /* @__PURE__ */ _jsx2(SVG, { ...restProps, className: cx("framer-r0AVb", className2), layoutId, ref, style: { "--43q7um": UO5clYVeQ, ...style } });
});
var css = [`.framer-r0AVb { -webkit-mask: ${mask}; aspect-ratio: 1; background-color: var(--43q7um); mask: ${mask}; width: 24px; }`];
var Icon = withCSS(Component, css, "framer-r0AVb");
Icon.displayName = "Arrow Up Right";
var X5rbDZv9v_default = Icon;
addPropertyControls2(Icon, { UO5clYVeQ: { defaultValue: "rgb(0, 0, 0)", hidden: false, title: "Stroke", type: ControlType2.Color } });

// http-url:https://framerusercontent.com/modules/ZP5msFN8qqgQHiAyv6dz/AOw0K4JBOEQ7KnMD9iUn/TiWSjQ2lc.js
import { fontStore } from "./_framer-runtime.js";
fontStore.loadFonts(["GF;Cal Sans-regular"]);
var fonts = [{ explicitInter: true, fonts: [{ cssFamilyName: "Cal Sans", openType: true, source: "google", style: "normal", uiFamilyName: "Cal Sans", url: "https://fonts.gstatic.com/s/calsans/v2/fdN99sWUv3gWqXxqqSBevloE4LZx.woff2", weight: "400" }] }];
var css2 = [`.framer-VgaHN .framer-styles-preset-1qeu4bo:not(.rich-text-wrapper), .framer-VgaHN .framer-styles-preset-1qeu4bo.rich-text-wrapper p { --framer-font-family: "Cal Sans", "Cal Sans Placeholder", sans-serif; --framer-font-open-type-features: 'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on; --framer-font-size: 16px; --framer-font-style: normal; --framer-font-variation-axes: normal; --framer-font-weight: 400; --framer-letter-spacing: 0em; --framer-line-height: 1.4em; --framer-paragraph-spacing: 20px; --framer-text-alignment: start; --framer-text-color: var(--token-73d82950-3751-42a6-927e-1ac6d9a336d2, #191919); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: none; }`];
var className = "framer-VgaHN";

// http-url:https://framerusercontent.com/modules/udGim1kr58Y813YdtpGH/5df4DEAN5e4WBJWj2i6W/jFeUJgOyD.js
var GooeyEffectFonts = getFonts(Gooey);
var enabledGestures = { PSYyXkAMb: { hover: true }, vKU8t3fnb: { hover: true } };
var cycleOrder = ["PSYyXkAMb", "vKU8t3fnb", "a6nq4qYg2", "pAbrcX5KL"];
var serializationHash = "framer-tAqrM";
var variantClassNames = { a6nq4qYg2: "framer-v-1nn03t2", pAbrcX5KL: "framer-v-xsocss", PSYyXkAMb: "framer-v-yq80hn", vKU8t3fnb: "framer-v-sgnsee" };
function addPropertyOverrides(overrides, ...variants) {
  const nextOverrides = {};
  variants?.forEach((variant) => variant && Object.assign(nextOverrides, overrides[variant]));
  return nextOverrides;
}
var transition1 = { bounce: 0.1, delay: 0, duration: 0.6, type: "spring" };
var transformTemplate1 = (_, t) => `translateY(-50%) ${t}`;
var Transition = ({ value, children }) => {
  const config = React2.useContext(MotionConfigContext);
  const transition = value ?? config.transition;
  const contextValue = React2.useMemo(() => ({ ...config, transition }), [JSON.stringify(transition)]);
  return /* @__PURE__ */ _jsx3(MotionConfigContext.Provider, { value: contextValue, children });
};
var humanReadableVariantMap = { "Desktop Dark": "vKU8t3fnb", "Phone Dark": "pAbrcX5KL", "Phone Primary": "a6nq4qYg2", Desktop: "PSYyXkAMb" };
var Variants = motion2.create(React2.Fragment);
var getProps2 = ({ height, icon, id, link, title, width, ...props }) => {
  return { ...props, a17_dlysY: link ?? props.a17_dlysY, ICeZ1XzMB: title ?? props.ICeZ1XzMB ?? "T\u1EA1o l\u1ECBch tr\xECnh t\u1EE9c th\xEC", nXlOjCdEz: icon ?? props.nXlOjCdEz ?? X5rbDZv9v_default, variant: humanReadableVariantMap[props.variant] ?? props.variant ?? "PSYyXkAMb" };
};
var createLayoutDependency = (props, variants) => {
  if (props.layoutDependency)
    return variants.join("-") + props.layoutDependency;
  return variants.join("-");
};
var Component2 = /* @__PURE__ */ React2.forwardRef(function(props, ref) {
  const fallbackRef = useRef2(null);
  const refBinding = ref ?? fallbackRef;
  const defaultLayoutId = React2.useId();
  const { activeLocale, setLocale } = useLocaleInfo();
  const componentViewport = useComponentViewport();
  const { style, className: className2, layoutId, variant, ICeZ1XzMB, nXlOjCdEz, a17_dlysY, ...restProps } = getProps2(props);
  const { baseVariant, classNames, clearLoadingGesture, gestureHandlers, gestureVariant, isLoading, setGestureState, setVariant, variants } = useVariantState({ cycleOrder, defaultVariant: "PSYyXkAMb", enabledGestures, ref: refBinding, variant, variantClassNames });
  const layoutDependency = createLayoutDependency(props, variants);
  const sharedStyleClassNames = [className];
  const scopingClassNames = cx2(serializationHash, ...sharedStyleClassNames);
  return /* @__PURE__ */ _jsx3(LayoutGroup, { id: layoutId ?? defaultLayoutId, children: /* @__PURE__ */ _jsx3(Variants, { animate: variants, initial: false, children: /* @__PURE__ */ _jsx3(Transition, { value: transition1, children: /* @__PURE__ */ _jsx3(Link, { href: a17_dlysY, motionChild: true, nodeId: "PSYyXkAMb", openInNewTab: false, scopeId: "jFeUJgOyD", smoothScroll: false, children: /* @__PURE__ */ _jsxs2(motion2.a, { ...restProps, ...gestureHandlers, className: `${cx2(scopingClassNames, "framer-yq80hn", className2, classNames)} framer-sorfvr`, "data-framer-name": "Desktop", "data-reset": "button", layoutDependency, layoutId: "PrimaryTravelbutton__PSYyXkAMb", ref: refBinding, style: { ...style }, ...addPropertyOverrides({ "PSYyXkAMb-hover": { "data-framer-name": void 0 }, "vKU8t3fnb-hover": { "data-framer-name": void 0 }, a6nq4qYg2: { "data-framer-name": "Phone Primary" }, pAbrcX5KL: { "data-framer-name": "Phone Dark" }, vKU8t3fnb: { "data-framer-name": "Desktop Dark" } }, baseVariant, gestureVariant), children: [/* @__PURE__ */ _jsx3(ComponentViewportProvider, { children: /* @__PURE__ */ _jsx3(SmartComponentScopedContainer, { className: "framer-5ttt6j-container", isAuthoredByUser: true, isModuleExternal: true, layoutDependency, layoutId: "PrimaryTravelbutton__l64lIrCXi-container", nodeId: "l64lIrCXi", rendersWithMotion: true, scopeId: "jFeUJgOyD", children: /* @__PURE__ */ _jsx3(Gooey, { height: "100%", id: "l64lIrCXi", intensity: 3, layoutId: "PrimaryTravelbutton__l64lIrCXi", width: "100%" }) }) }), /* @__PURE__ */ _jsx3(motion2.div, { className: "framer-6rw8b9", "data-framer-name": "Content", layoutDependency, layoutId: "PrimaryTravelbutton__pJY5P0XzU", style: { backgroundColor: "var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255))", borderBottomLeftRadius: 48, borderBottomRightRadius: 48, borderTopLeftRadius: 48, borderTopRightRadius: 48 }, variants: { pAbrcX5KL: { backgroundColor: "var(--token-7e7de517-525f-4f9d-b74c-fcabbb614510, rgb(3, 61, 74))" }, vKU8t3fnb: { backgroundColor: "var(--token-7e7de517-525f-4f9d-b74c-fcabbb614510, rgb(3, 61, 74))" } }, children: /* @__PURE__ */ _jsx3(RichText, { __fromCanvasComponent: true, children: /* @__PURE__ */ _jsx3(React2.Fragment, { children: /* @__PURE__ */ _jsx3(motion2.p, { className: "framer-styles-preset-1qeu4bo", "data-styles-preset": "TiWSjQ2lc", dir: "auto", children: "Book a Consultation" }) }), className: "framer-6lrm9m", fonts: ["Inter"], layoutDependency, layoutId: "PrimaryTravelbutton__fDaGk9mSp", style: { "--framer-link-text-color": "rgb(0, 153, 255)", "--framer-link-text-decoration": "underline" }, text: ICeZ1XzMB, variants: { pAbrcX5KL: { "--extracted-r6o4lv": "var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255))" }, vKU8t3fnb: { "--extracted-r6o4lv": "var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255))" } }, verticalAlignment: "top", withExternalLayout: true, ...addPropertyOverrides({ pAbrcX5KL: { children: /* @__PURE__ */ _jsx3(React2.Fragment, { children: /* @__PURE__ */ _jsx3(motion2.p, { className: "framer-styles-preset-1qeu4bo", "data-styles-preset": "TiWSjQ2lc", dir: "auto", style: { "--framer-text-color": "var(--extracted-r6o4lv, var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255)))" }, children: "Book a Consultation" }) }) }, vKU8t3fnb: { children: /* @__PURE__ */ _jsx3(React2.Fragment, { children: /* @__PURE__ */ _jsx3(motion2.p, { className: "framer-styles-preset-1qeu4bo", "data-styles-preset": "TiWSjQ2lc", dir: "auto", style: { "--framer-text-color": "var(--extracted-r6o4lv, var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255)))" }, children: "Book a Consultation" }) }) } }, baseVariant, gestureVariant) }) }), /* @__PURE__ */ _jsx3(motion2.div, { className: "framer-1ngjz3e", "data-framer-name": "Icon", layoutDependency, layoutId: "PrimaryTravelbutton__u1WTDehRz", style: { backgroundColor: "var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255))", borderBottomLeftRadius: 48, borderBottomRightRadius: 48, borderTopLeftRadius: 48, borderTopRightRadius: 48, rotate: 0 }, transformTemplate: transformTemplate1, variants: { "PSYyXkAMb-hover": { rotate: 45 }, "vKU8t3fnb-hover": { rotate: 45 }, pAbrcX5KL: { backgroundColor: "var(--token-7e7de517-525f-4f9d-b74c-fcabbb614510, rgb(3, 61, 74))" }, vKU8t3fnb: { backgroundColor: "var(--token-7e7de517-525f-4f9d-b74c-fcabbb614510, rgb(3, 61, 74))" } }, children: /* @__PURE__ */ _jsx3(Instance, { animated: true, className: "framer-18f9kur", Component: nXlOjCdEz, layoutDependency, layoutId: "PrimaryTravelbutton__Xi8zbvNC5", style: { "--43q7um": "var(--token-e15d98be-dc11-48c5-ad2b-3fbf85780d09, rgb(0, 0, 0))", filter: "none", WebkitFilter: "none" }, variants: { "PSYyXkAMb-hover": { filter: "none", WebkitFilter: "none" }, a6nq4qYg2: { filter: "none", WebkitFilter: "none" }, pAbrcX5KL: { "--43q7um": "var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255))", filter: "invert(0)", WebkitFilter: "invert(0)" }, vKU8t3fnb: { "--43q7um": "var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255))", filter: "invert(0)", WebkitFilter: "invert(0)" } } }) })] }) }) }) }) });
});
var css3 = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-tAqrM.framer-sorfvr, .framer-tAqrM .framer-sorfvr { display: block; }", ".framer-tAqrM.framer-yq80hn { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; overflow: visible; padding: 0px 40px 0px 0px; position: relative; text-decoration: none; width: min-content; }", ".framer-tAqrM .framer-5ttt6j-container { flex: none; height: auto; position: absolute; right: 16px; top: 22px; width: auto; z-index: 1; }", ".framer-tAqrM .framer-6rw8b9 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 10px 24px 10px 24px; position: relative; width: min-content; will-change: var(--framer-will-change-override, transform); }", ".framer-tAqrM .framer-6lrm9m { flex: none; height: auto; position: relative; white-space: pre; width: auto; }", ".framer-tAqrM .framer-1ngjz3e { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 13px; position: absolute; right: 0px; top: 51%; width: min-content; will-change: var(--framer-will-change-override, transform); z-index: 1; }", ".framer-tAqrM .framer-18f9kur { flex: none; height: var(--framer-aspect-ratio-supported, 18px); position: relative; width: 18px; }", ".framer-tAqrM.framer-v-1nn03t2.framer-yq80hn, .framer-tAqrM.framer-v-xsocss.framer-yq80hn { cursor: unset; }", ".framer-tAqrM.framer-v-yq80hn.hover .framer-1ngjz3e, .framer-tAqrM.framer-v-sgnsee.hover .framer-1ngjz3e { right: -13px; }", ...css2];
var FramerjFeUJgOyD = withCSS2(Component2, css3, "framer-tAqrM");
var jFeUJgOyD_default = FramerjFeUJgOyD;
FramerjFeUJgOyD.displayName = "Primary Travel button";
FramerjFeUJgOyD.defaultProps = { height: 42, width: 221 };
addPropertyControls3(FramerjFeUJgOyD, { variant: { options: ["PSYyXkAMb", "vKU8t3fnb", "a6nq4qYg2", "pAbrcX5KL"], optionTitles: ["Desktop", "Desktop Dark", "Phone Primary", "Phone Dark"], title: "Variant", type: ControlType3.Enum }, ICeZ1XzMB: { defaultValue: "T\u1EA1o l\u1ECBch tr\xECnh t\u1EE9c th\xEC", displayTextArea: false, title: "Title", type: ControlType3.String }, onICeZ1XzMBChange: { changes: "ICeZ1XzMB", type: ControlType3.ChangeHandler }, nXlOjCdEz: { defaultValue: { identifier: "module:f8Q5x3tcvy2sgigvrEse/WjPolkbUODUXgM3l5QnQ/X5rbDZv9v.js:default", moduleId: "f8Q5x3tcvy2sgigvrEse" }, setModuleId: "fiHEoJwBMFnT6QLOcpPz", title: "Icon", type: ControlType3.VectorSetItem }, a17_dlysY: { title: "Link", type: ControlType3.Link } });
addFonts(FramerjFeUJgOyD, [{ explicitInter: true, fonts: [{ cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2", weight: "400" }] }, ...GooeyEffectFonts, ...getFontsFromSharedStyle(fonts)], { supportsExplicitInterCodegen: true });
var __FramerMetadata__ = { "exports": { "Props": { "type": "tsType", "annotations": { "framerContractVersion": "1" } }, "default": { "type": "reactComponent", "name": "FramerjFeUJgOyD", "slots": [], "annotations": { "framerIntrinsicHeight": "42", "framerContractVersion": "1", "framerComponentViewportWidth": "true", "framerImmutableVariables": "true", "framerVariables": '{"ICeZ1XzMB":"title","nXlOjCdEz":"icon","a17_dlysY":"link"}', "framerIntrinsicWidth": "221", "framerAutoSizeImages": "true", "framerColorSyntax": "true", "framerDisplayContentsDiv": "false", "framerCanvasComponentVariantDetails": '{"propertyName":"variant","data":{"default":{"layout":["auto","auto"]},"vKU8t3fnb":{"layout":["auto","auto"]},"a6nq4qYg2":{"layout":["auto","auto"]},"pAbrcX5KL":{"layout":["auto","auto"]},"RuLYMjIJz":{"layout":["auto","auto"]},"MOz7Qr4Bi":{"layout":["auto","auto"]}}}', "framerVectorSets": '["fiHEoJwBMFnT6QLOcpPz"]' } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  jFeUJgOyD_default as default
};
