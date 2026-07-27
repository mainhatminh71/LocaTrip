var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/HapYo3WyooB3OlnHaoXC/aTBLRT2wpWc3pBYaEgkG/tjx1Isk1b.js
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
var svg = '<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 0 2 C 0 0.895 0.895 0 2 0 L 8.5 0 C 9.605 0 10.5 0.895 10.5 2 L 10.5 14.5 L 5.25 10 L 0 14.5 Z" fill="transparent" height="14.5px" id="nRRyB_sYQ" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--1335ju, 1.5)" stroke="var(--18mrqx2, rgb(0, 0, 0))" transform="translate(6.75 4.75)" width="10.5px"/></svg>';
var getProps = ({ dots, height, id, stroke, width, width1, ...props }) => {
  return { ...props, BKVe8Pgvw: dots ?? props.BKVe8Pgvw ?? 1, fICyAUQY1: stroke ?? props.fICyAUQY1 ?? "rgb(0, 0, 0)", lKf_CQTz5: width1 ?? props.lKf_CQTz5 ?? 1.5 };
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const { style, className, layoutId, variant, fICyAUQY1, lKf_CQTz5, BKVe8Pgvw, ...restProps } = getProps(props);
  const href = useSVGTemplate("1443960583", svg);
  return /* @__PURE__ */ _jsx(SVG, { ...restProps, className: cx("framer-fXu5h", className), layoutId, ref, role: "presentation", style: { "--1335ju": lKf_CQTz5, "--18mrqx2": fICyAUQY1, ...style }, viewBox: "0 0 24 24", children: /* @__PURE__ */ _jsx("use", { href }) });
});
var css = [`.framer-fXu5h { -webkit-mask: ${mask}; aspect-ratio: 1; display: block; mask: ${mask}; width: 24px; }`];
var Icon = withCSS(Component, css, "framer-fXu5h");
Icon.displayName = "Bookmark";
var tjx1Isk1b_default = Icon;
addPropertyControls(Icon, { fICyAUQY1: { defaultValue: "rgb(0, 0, 0)", hidden: false, title: "Stroke", type: ControlType.Color }, lKf_CQTz5: { defaultValue: 1.5, displayStepper: true, hidden: false, max: 4, min: 0, step: 0.5, title: "Width", type: ControlType.Number }, BKVe8Pgvw: { defaultValue: 1, displayStepper: true, hidden: true, max: 4, min: 1, title: "Dots", type: ControlType.Number } });
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "Icon", "slots": [], "annotations": { "framerIntrinsicHeight": "24", "framerIntrinsicWidth": "24", "framerContractVersion": "1", "framerVariables": '{"fICyAUQY1":"stroke","lKf_CQTz5":"width1","BKVe8Pgvw":"dots"}', "framerSupportedLayoutWidth": "any-prefer-fixed", "framerSupportedLayoutHeight": "any-prefer-fixed", "framerVector": '{"name":"Bookmark","color":{"type":"variable","value":"18mrqx2"},"set":{"localId":"vectorSet/SuYHhKUZG","id":"SuYHhKUZG","moduleId":"EqX8thWQjdZcOB1c6p5N"}}', "framerDisableUnlink": "true", "framerImmutableVariables": "true" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  tjx1Isk1b_default as default
};
