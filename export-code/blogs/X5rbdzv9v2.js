var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/f8Q5x3tcvy2sgigvrEse/WjPolkbUODUXgM3l5QnQ/X5rbDZv9v.js
import { jsx as _jsx } from "react/jsx-runtime";
import { addPropertyControls, ControlType, cx, motion, withCSS } from "./_framer-runtime.js";
import * as React from "react";
import { forwardRef as forwardRef2 } from "react";
var mask = `url('data:image/svg+xml,<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 0 10 L 10 0" fill="transparent" height="10px" id="Gm6ErcvSs" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="var(--43q7um, rgb(0,0,0))" transform="translate(7 7)" width="10px"/><path d="M 0 0 L 10 0 L 10 10" fill="transparent" height="10px" id="TScaaNOIP" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="var(--43q7um, rgb(0,0,0))" transform="translate(7 7)" width="10px"/></svg>') alpha no-repeat center / auto var(--framer-icon-mask-mode, add), var(--framer-icon-mask, none)`;
var SVG = /* @__PURE__ */ forwardRef2((props, ref) => {
  const { animated, layoutId, children, ...rest } = props;
  return animated ? /* @__PURE__ */ _jsx(motion.div, { ...rest, layoutId, ref }) : /* @__PURE__ */ _jsx("div", { ...rest, ref });
});
var getProps = ({ height, id, stroke, width, ...props }) => {
  return { ...props, UO5clYVeQ: stroke ?? props.UO5clYVeQ ?? "rgb(0, 0, 0)" };
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const { style, className, layoutId, variant, UO5clYVeQ, ...restProps } = getProps(props);
  return /* @__PURE__ */ _jsx(SVG, { ...restProps, className: cx("framer-r0AVb", className), layoutId, ref, style: { "--43q7um": UO5clYVeQ, ...style } });
});
var css = [`.framer-r0AVb { -webkit-mask: ${mask}; aspect-ratio: 1; background-color: var(--43q7um); mask: ${mask}; width: 24px; }`];
var Icon = withCSS(Component, css, "framer-r0AVb");
Icon.displayName = "Arrow Up Right";
var X5rbDZv9v_default = Icon;
addPropertyControls(Icon, { UO5clYVeQ: { defaultValue: "rgb(0, 0, 0)", hidden: false, title: "Stroke", type: ControlType.Color } });
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "Icon", "slots": [], "annotations": { "framerIntrinsicHeight": "24", "framerDisableUnlink": "true", "framerSupportedLayoutHeight": "any-prefer-fixed", "framerVariables": '{"UO5clYVeQ":"stroke"}', "framerVector": '{"name":"Arrow Up Right","color":{"type":"variable","value":"43q7um"},"set":{"localId":"vectorSet/T8qKXkLfy","id":"T8qKXkLfy","moduleId":"fiHEoJwBMFnT6QLOcpPz"}}', "framerSupportedLayoutWidth": "any-prefer-fixed", "framerImmutableVariables": "true", "framerContractVersion": "1", "framerIntrinsicWidth": "24" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  X5rbDZv9v_default as default
};
