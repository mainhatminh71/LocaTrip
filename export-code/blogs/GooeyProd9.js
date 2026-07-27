var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

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
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "Gooey", "slots": [], "annotations": { "framerContractVersion": "1", "framerSupportedLayoutWidth": "auto", "framerSupportedLayoutHeight": "auto", "framerDisableUnlink": "*" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  Gooey as default
};
