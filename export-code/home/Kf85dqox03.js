var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/4NPoFPQEhSNg2OoiApwj/ob6f5zVw0r8uyASOMKVq/KF85dqOX0.js
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
var svg = '<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 0 4.875 C 0 2.183 2.183 0 4.875 0 C 7.567 0 9.75 2.183 9.75 4.875 C 9.75 7.567 7.567 9.75 4.875 9.75 C 2.183 9.75 0 7.567 0 4.875 Z" fill-opacity="var(--1m6trwb, 0)" fill="var(--21h8s6, rgb(0, 0, 0))" height="9.75px" id="tjlKcqq_S" transform="translate(3 5.25)" width="9.75px"/><path d="M 0 3.752 C 1.522 1.412 4.124 0 6.916 0 C 9.708 0 12.31 1.412 13.832 3.752" fill="transparent" height="3.751966152184508px" id="Y_D97Q52v" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--pgex8v, 1.5)" stroke="var(--21h8s6, rgb(0, 0, 0))" transform="translate(0.959 14.998)" width="13.831875px"/><path d="M 0 0 C 2.792 -0.002 5.394 1.41 6.916 3.75" fill="transparent" height="3.750001425001699px" id="wf06kpyW8" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--pgex8v, 1.5)" stroke="var(--21h8s6, rgb(0, 0, 0))" transform="translate(16.125 15)" width="6.915937499999984px"/><path d="M 0 4.875 C 0 2.183 2.183 0 4.875 0 C 7.567 0 9.75 2.183 9.75 4.875 C 9.75 7.567 7.567 9.75 4.875 9.75 C 2.183 9.75 0 7.567 0 4.875 Z" fill="transparent" height="9.75px" id="Wx0EkSCiK" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--pgex8v, 1.5)" stroke="var(--21h8s6, rgb(0, 0, 0))" transform="translate(3 5.25)" width="9.75px"/><path d="M 0 0.347 C 1.824 -0.38 3.906 0.057 5.282 1.457 C 6.659 2.858 7.061 4.947 6.303 6.758 C 5.545 8.569 3.774 9.748 1.81 9.75" fill="transparent" height="9.750149315941101px" id="Eesqcmrby" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--pgex8v, 1.5)" stroke="var(--21h8s6, rgb(0, 0, 0))" transform="translate(14.315 5.25)" width="6.681148882469131px"/></svg>';
var getProps = ({ alpha, color, height, id, width, width1, ...props }) => {
  return { ...props, ezTt3ayMo: color ?? props.ezTt3ayMo ?? "rgb(0, 0, 0)", lschgej4H: width1 ?? props.lschgej4H ?? 1.5, qxTvv_EBh: alpha ?? props.qxTvv_EBh };
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const { style, className, layoutId, variant, ezTt3ayMo, lschgej4H, qxTvv_EBh, ...restProps } = getProps(props);
  const href = useSVGTemplate("2109778876", svg);
  return /* @__PURE__ */ _jsx(SVG, { ...restProps, className: cx("framer-5yi3D", className), layoutId, ref, role: "presentation", style: { "--1m6trwb": qxTvv_EBh, "--21h8s6": ezTt3ayMo, "--pgex8v": lschgej4H, ...style }, viewBox: "0 0 24 24", children: /* @__PURE__ */ _jsx("use", { href }) });
});
var css = [`.framer-5yi3D { -webkit-mask: ${mask}; aspect-ratio: 1; display: block; mask: ${mask}; width: 24px; }`];
var Icon = withCSS(Component, css, "framer-5yi3D");
Icon.displayName = "Users";
var KF85dqOX0_default = Icon;
addPropertyControls(Icon, { ezTt3ayMo: { defaultValue: "rgb(0, 0, 0)", hidden: false, title: "Color", type: ControlType.Color }, lschgej4H: { defaultValue: 1.5, displayStepper: true, hidden: false, max: 6, min: 0, step: 0.5, title: "Width", type: ControlType.Number }, qxTvv_EBh: { defaultValue: 0, displayStepper: true, hidden: false, max: 1, min: 0, step: 0.1, title: "Alpha", type: ControlType.Number } });
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "Icon", "slots": [], "annotations": { "framerVector": '{"name":"Users","color":{"type":"variable","value":"21h8s6"},"set":{"localId":"vectorSet/NGVKdicsm","id":"NGVKdicsm","moduleId":"omX0gWFPqDwhaiWwf6ab"}}', "framerContractVersion": "1", "framerIntrinsicHeight": "24", "framerSupportedLayoutWidth": "any-prefer-fixed", "framerImmutableVariables": "true", "framerIntrinsicWidth": "24", "framerSupportedLayoutHeight": "any-prefer-fixed", "framerDisableUnlink": "true", "framerVariables": '{"ezTt3ayMo":"color","lschgej4H":"width1","qxTvv_EBh":"alpha"}' } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  KF85dqOX0_default as default
};
