var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/qiJEpkwSsFnqUfWbTBmG/XLyLJaRBM7cIlIUKbY9M/AvgDV_4pJ.js
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
var svg = '<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 0 8.25 C 0 3.694 3.694 0 8.25 0 C 12.806 0 16.5 3.694 16.5 8.25 C 16.5 12.806 12.806 16.5 8.25 16.5 C 3.694 16.5 0 12.806 0 8.25 Z" fill-opacity="var(--1m6trwb, 0)" fill="var(--21h8s6, rgb(0, 0, 0))" height="16.5px" id="NhKSbWj1M" transform="translate(3.75 3.75)" width="16.5px"/><path d="M 8.251 8.251 L 16.501 8.251 C 16.501 12.262 13.617 15.691 9.666 16.378 C 5.715 17.066 1.842 14.813 0.487 11.039 C -0.869 7.265 0.686 3.062 4.172 1.08 C 7.658 -0.903 12.064 -0.092 14.616 3.001" fill="transparent" height="16.5012377669649px" id="P9EYfzipw" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--pgex8v, 1.5)" stroke="var(--21h8s6, rgb(0, 0, 0))" transform="translate(3.749 3.749)" width="16.50107951728272px"/></svg>';
var getProps = ({ alpha, color, height, id, width, width1, ...props }) => {
  return { ...props, ezTt3ayMo: color ?? props.ezTt3ayMo ?? "rgb(0, 0, 0)", lschgej4H: width1 ?? props.lschgej4H ?? 1.5, qxTvv_EBh: alpha ?? props.qxTvv_EBh };
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const { style, className, layoutId, variant, ezTt3ayMo, lschgej4H, qxTvv_EBh, ...restProps } = getProps(props);
  const href = useSVGTemplate("361860326", svg);
  return /* @__PURE__ */ _jsx(SVG, { ...restProps, className: cx("framer-6ub3i", className), layoutId, ref, role: "presentation", style: { "--1m6trwb": qxTvv_EBh, "--21h8s6": ezTt3ayMo, "--pgex8v": lschgej4H, ...style }, viewBox: "0 0 24 24", children: /* @__PURE__ */ _jsx("use", { href }) });
});
var css = [`.framer-6ub3i { -webkit-mask: ${mask}; aspect-ratio: 1; display: block; mask: ${mask}; width: 24px; }`];
var Icon = withCSS(Component, css, "framer-6ub3i");
Icon.displayName = "Google Logo";
var AvgDV_4pJ_default = Icon;
addPropertyControls(Icon, { ezTt3ayMo: { defaultValue: "rgb(0, 0, 0)", hidden: false, title: "Color", type: ControlType.Color }, lschgej4H: { defaultValue: 1.5, displayStepper: true, hidden: false, max: 6, min: 0, step: 0.5, title: "Width", type: ControlType.Number }, qxTvv_EBh: { defaultValue: 0, displayStepper: true, hidden: false, max: 1, min: 0, step: 0.1, title: "Alpha", type: ControlType.Number } });
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "Icon", "slots": [], "annotations": { "framerImmutableVariables": "true", "framerVariables": '{"ezTt3ayMo":"color","lschgej4H":"width1","qxTvv_EBh":"alpha"}', "framerContractVersion": "1", "framerSupportedLayoutHeight": "any-prefer-fixed", "framerSupportedLayoutWidth": "any-prefer-fixed", "framerDisableUnlink": "true", "framerIntrinsicWidth": "24", "framerIntrinsicHeight": "24", "framerVector": '{"name":"Google Logo","color":{"type":"variable","value":"21h8s6"},"set":{"localId":"vectorSet/NGVKdicsm","id":"NGVKdicsm","moduleId":"omX0gWFPqDwhaiWwf6ab"}}' } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  AvgDV_4pJ_default as default
};
