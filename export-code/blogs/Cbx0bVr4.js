var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/OL9eRRkY8weiNRHBRpng/v4d6rLZWQbUweDzHaUJa/CbX0b__Vr.js
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
var svg = '<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 0 7.25 C 0 3.246 3.246 0 7.25 0 L 7.25 0 C 11.254 0 14.5 3.246 14.5 7.25 L 14.5 7.25 C 14.5 11.254 11.254 14.5 7.25 14.5 L 7.25 14.5 C 3.246 14.5 0 11.254 0 7.25 Z" fill="transparent" height="14.5px" id="pn5fFM997" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--1335ju, 1.5)" stroke="var(--18mrqx2, rgb(0, 0, 0))" transform="translate(4.75 4.75)" width="14.5px"/><path d="M 0 3 L 0.434 3.924 C 0.777 4.657 1.804 4.699 2.206 3.997 L 4.5 0" fill="transparent" height="4.499652874612709px" id="lKzatC_KM" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--1335ju, 1.5)" stroke="var(--18mrqx2, rgb(0, 0, 0))" transform="translate(9.75 9.75)" width="4.5px"/></svg>';
var getProps = ({ dots, height, id, stroke, width, width1, ...props }) => {
  return { ...props, BKVe8Pgvw: dots ?? props.BKVe8Pgvw ?? 1, fICyAUQY1: stroke ?? props.fICyAUQY1 ?? "rgb(0, 0, 0)", lKf_CQTz5: width1 ?? props.lKf_CQTz5 ?? 1.5 };
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const { style, className, layoutId, variant, fICyAUQY1, lKf_CQTz5, BKVe8Pgvw, ...restProps } = getProps(props);
  const href = useSVGTemplate("1124763718", svg);
  return /* @__PURE__ */ _jsx(SVG, { ...restProps, className: cx("framer-LSL4w", className), layoutId, ref, role: "presentation", style: { "--1335ju": lKf_CQTz5, "--18mrqx2": fICyAUQY1, ...style }, viewBox: "0 0 24 24", children: /* @__PURE__ */ _jsx("use", { href }) });
});
var css = [`.framer-LSL4w { -webkit-mask: ${mask}; aspect-ratio: 1; display: block; mask: ${mask}; width: 24px; }`];
var Icon = withCSS(Component, css, "framer-LSL4w");
Icon.displayName = "Check Circle";
var CbX0b_Vr_default = Icon;
addPropertyControls(Icon, { fICyAUQY1: { defaultValue: "rgb(0, 0, 0)", hidden: false, title: "Stroke", type: ControlType.Color }, lKf_CQTz5: { defaultValue: 1.5, displayStepper: true, hidden: false, max: 4, min: 0, step: 0.5, title: "Width", type: ControlType.Number }, BKVe8Pgvw: { defaultValue: 1, displayStepper: true, hidden: true, max: 4, min: 1, title: "Dots", type: ControlType.Number } });
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "Icon", "slots": [], "annotations": { "framerIntrinsicHeight": "24", "framerContractVersion": "1", "framerDisableUnlink": "true", "framerSupportedLayoutHeight": "any-prefer-fixed", "framerVariables": '{"fICyAUQY1":"stroke","lKf_CQTz5":"width1","BKVe8Pgvw":"dots"}', "framerSupportedLayoutWidth": "any-prefer-fixed", "framerImmutableVariables": "true", "framerIntrinsicWidth": "24", "framerVector": '{"name":"Check Circle","color":{"type":"variable","value":"18mrqx2"},"set":{"localId":"vectorSet/SuYHhKUZG","id":"SuYHhKUZG","moduleId":"EqX8thWQjdZcOB1c6p5N"}}' } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  CbX0b_Vr_default as default
};
