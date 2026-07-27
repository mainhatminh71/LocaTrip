var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/N5H1Rg0MfkwPwrEHRucY/svzyO7VKgTDzypPfdXuK/fUg5ZhkAq.js
import { jsx as _jsx } from "react/jsx-runtime";
import { addPropertyControls, ControlType, cx, motion, useSVGTemplate, withCSS } from "./_framer-runtime.js";
import * as React from "react";
import { forwardRef as forwardRef2 } from "react";
var mask = "var(--framer-icon-mask)";
var Base = /* @__PURE__ */ forwardRef2(function(props, ref) {
  return /* @__PURE__ */ _jsx("svg", { ...props, ref, children: props.children });
});
var MotionSVG = motion.create(Base);
var SVG = /* @__PURE__ */ forwardRef2((props, ref) => {
  const { animated, layoutId, children, ...rest } = props;
  return animated ? /* @__PURE__ */ _jsx(MotionSVG, { ...rest, layoutId, ref, children }) : /* @__PURE__ */ _jsx("svg", { ...rest, ref, children });
});
var svg = '<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 0 2 C 0 0.895 0.895 0 2 0 L 12.5 0 C 13.605 0 14.5 0.895 14.5 2 L 14.5 9.5 C 14.5 10.605 13.605 11.5 12.5 11.5 L 9.875 11.5 L 7.25 14.5 L 4.625 11.5 L 2 11.5 C 0.895 11.5 0 10.605 0 9.5 Z" fill="transparent" height="14.5px" id="MKFiBvDK7" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--1335ju, 1.5)" stroke="var(--18mrqx2, rgb(0, 0, 0))" transform="translate(4.75 4.75)" width="14.5px"/><path d="M 1 0.5 C 1 0.776 0.776 1 0.5 1 C 0.224 1 0 0.776 0 0.5 C 0 0.224 0.224 0 0.5 0 C 0.776 0 1 0.224 1 0.5 Z" fill="transparent" height="1px" id="A19lCBr1D" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--3it368, 1)" stroke="var(--18mrqx2, rgb(0, 0, 0))" transform="translate(8.5 10.5)" width="1px"/><path d="M 1 0.5 C 1 0.776 0.776 1 0.5 1 C 0.224 1 0 0.776 0 0.5 C 0 0.224 0.224 0 0.5 0 C 0.776 0 1 0.224 1 0.5 Z" fill="transparent" height="1px" id="yjzF9aNLe" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--3it368, 1)" stroke="var(--18mrqx2, rgb(0, 0, 0))" transform="translate(11.5 10.5)" width="1px"/><path d="M 1 0.5 C 1 0.776 0.776 1 0.5 1 C 0.224 1 0 0.776 0 0.5 C 0 0.224 0.224 0 0.5 0 C 0.776 0 1 0.224 1 0.5 Z" fill="transparent" height="1px" id="jf7iRqZnO" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--3it368, 1)" stroke="var(--18mrqx2, rgb(0, 0, 0))" transform="translate(14.5 10.5)" width="1px"/></svg>';
var getProps = ({ dots, height, id, stroke, width, width1, ...props }) => {
  return { ...props, BKVe8Pgvw: dots ?? props.BKVe8Pgvw ?? 1, fICyAUQY1: stroke ?? props.fICyAUQY1 ?? "rgb(0, 0, 0)", lKf_CQTz5: width1 ?? props.lKf_CQTz5 ?? 1.5 };
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const { style, className, layoutId, variant, fICyAUQY1, lKf_CQTz5, BKVe8Pgvw, ...restProps } = getProps(props);
  const href = useSVGTemplate("3515162542", svg);
  return /* @__PURE__ */ _jsx(SVG, { ...restProps, className: cx("framer-FbAzB", className), layoutId, ref, role: "presentation", style: { "--1335ju": lKf_CQTz5, "--18mrqx2": fICyAUQY1, "--3it368": BKVe8Pgvw, ...style }, viewBox: "0 0 24 24", children: /* @__PURE__ */ _jsx("use", { href }) });
});
var css = [`.framer-FbAzB { -webkit-mask: ${mask}; aspect-ratio: 1; display: block; mask: ${mask}; width: 24px; }`];
var Icon = withCSS(Component, css, "framer-FbAzB");
Icon.displayName = "Annotation Dots";
var fUg5ZhkAq_default = Icon;
addPropertyControls(Icon, { fICyAUQY1: { defaultValue: "rgb(0, 0, 0)", hidden: false, title: "Stroke", type: ControlType.Color }, lKf_CQTz5: { defaultValue: 1.5, displayStepper: true, hidden: false, max: 4, min: 0, step: 0.5, title: "Width", type: ControlType.Number }, BKVe8Pgvw: { defaultValue: 1, displayStepper: true, hidden: false, max: 4, min: 1, title: "Dots", type: ControlType.Number } });
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "Icon", "slots": [], "annotations": { "framerIntrinsicWidth": "24", "framerDisableUnlink": "true", "framerContractVersion": "1", "framerIntrinsicHeight": "24", "framerVariables": '{"fICyAUQY1":"stroke","lKf_CQTz5":"width1","BKVe8Pgvw":"dots"}', "framerSupportedLayoutWidth": "any-prefer-fixed", "framerVector": '{"name":"Annotation Dots","color":{"type":"variable","value":"18mrqx2"},"set":{"localId":"vectorSet/SuYHhKUZG","id":"SuYHhKUZG","moduleId":"EqX8thWQjdZcOB1c6p5N"}}', "framerSupportedLayoutHeight": "any-prefer-fixed", "framerImmutableVariables": "true" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  fUg5ZhkAq_default as default
};
