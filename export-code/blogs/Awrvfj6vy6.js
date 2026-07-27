var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/sPDWDrYD23Lvf7Va66T2/wHPLpatdcaVtP6Kt2gvH/AWRvFj6VY.js
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
var svg = '<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 7.245 1.483 C 5.796 -0.14 3.378 -0.577 1.562 0.91 C -0.254 2.396 -0.51 4.881 0.917 6.639 L 7.245 12.5 L 13.574 6.639 C 15 4.881 14.775 2.38 12.928 0.91 C 11.081 -0.561 8.695 -0.14 7.245 1.483 Z" fill="transparent" height="12.500011836293409px" id="L3ZT6vaS3" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--1335ju, 1.5)" stroke="var(--18mrqx2, rgb(0, 0, 0))" transform="translate(4.75 5.75)" width="14.500012148564352px"/></svg>';
var getProps = ({ dots, height, id, stroke, width, width1, ...props }) => {
  return { ...props, BKVe8Pgvw: dots ?? props.BKVe8Pgvw ?? 1, fICyAUQY1: stroke ?? props.fICyAUQY1 ?? "rgb(0, 0, 0)", lKf_CQTz5: width1 ?? props.lKf_CQTz5 ?? 1.5 };
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const { style, className, layoutId, variant, fICyAUQY1, lKf_CQTz5, BKVe8Pgvw, ...restProps } = getProps(props);
  const href = useSVGTemplate("1331392601", svg);
  return /* @__PURE__ */ _jsx(SVG, { ...restProps, className: cx("framer-A81Vb", className), layoutId, ref, role: "presentation", style: { "--1335ju": lKf_CQTz5, "--18mrqx2": fICyAUQY1, ...style }, viewBox: "0 0 24 24", children: /* @__PURE__ */ _jsx("use", { href }) });
});
var css = [`.framer-A81Vb { -webkit-mask: ${mask}; aspect-ratio: 1; display: block; mask: ${mask}; width: 24px; }`];
var Icon = withCSS(Component, css, "framer-A81Vb");
Icon.displayName = "Heart";
var AWRvFj6VY_default = Icon;
addPropertyControls(Icon, { fICyAUQY1: { defaultValue: "rgb(0, 0, 0)", hidden: false, title: "Stroke", type: ControlType.Color }, lKf_CQTz5: { defaultValue: 1.5, displayStepper: true, hidden: false, max: 4, min: 0, step: 0.5, title: "Width", type: ControlType.Number }, BKVe8Pgvw: { defaultValue: 1, displayStepper: true, hidden: true, max: 4, min: 1, title: "Dots", type: ControlType.Number } });
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "Icon", "slots": [], "annotations": { "framerContractVersion": "1", "framerSupportedLayoutWidth": "any-prefer-fixed", "framerIntrinsicWidth": "24", "framerDisableUnlink": "true", "framerIntrinsicHeight": "24", "framerSupportedLayoutHeight": "any-prefer-fixed", "framerVector": '{"name":"Heart","color":{"type":"variable","value":"18mrqx2"},"set":{"localId":"vectorSet/SuYHhKUZG","id":"SuYHhKUZG","moduleId":"EqX8thWQjdZcOB1c6p5N"}}', "framerVariables": '{"fICyAUQY1":"stroke","lKf_CQTz5":"width1","BKVe8Pgvw":"dots"}', "framerImmutableVariables": "true" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  AWRvFj6VY_default as default
};
