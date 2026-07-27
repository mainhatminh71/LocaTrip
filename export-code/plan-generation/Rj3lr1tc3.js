var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/FXwSb1FsIIagM0f2wSJJ/eeiIqW4JGYdh1txxYiqQ/RJ3LR1Tc_.js
import { jsx as _jsx } from "react/jsx-runtime";
import { addPropertyControls, ControlType, cx, motion, withCSS } from "./_framer-runtime.js";
import * as React from "react";
import { forwardRef as forwardRef2 } from "react";
var mask = `url('data:image/svg+xml,<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 3.75 6 L 2.25 6 C 1.007 6 0 7.007 0 8.25 L 0 17.25 C 0 18.493 1.007 19.5 2.25 19.5 L 11.25 19.5 C 12.493 19.5 13.5 18.493 13.5 17.25 L 13.5 8.25 C 13.5 7.007 12.493 6 11.25 6 L 9.75 6 M 3.75 9.75 L 6.75 12.75 M 6.75 12.75 L 9.75 9.75 M 6.75 12.75 L 6.75 0" fill="transparent" height="19.5px" id="GkkPxW2B7" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="var(--szd5nr, black)" transform="translate(5.25 2.25)" width="13.5px"/></svg>') alpha no-repeat center / auto var(--framer-icon-mask-mode, add), var(--framer-icon-mask, none)`;
var SVG = /* @__PURE__ */ forwardRef2((props, ref) => {
  const { animated, layoutId, children, ...rest } = props;
  return animated ? /* @__PURE__ */ _jsx(motion.div, { ...rest, layoutId, ref }) : /* @__PURE__ */ _jsx("div", { ...rest, ref });
});
var getProps = ({ height, id, stroke, width, ...props }) => {
  return { ...props, YmfIrZ3Ez: stroke ?? props.YmfIrZ3Ez ?? "rgb(0, 0, 0)" };
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const { style, className, layoutId, variant, YmfIrZ3Ez, ...restProps } = getProps(props);
  return /* @__PURE__ */ _jsx(SVG, { ...restProps, className: cx("framer-Kac74", className), layoutId, ref, style: { "--szd5nr": YmfIrZ3Ez, ...style } });
});
var css = [`.framer-Kac74 { -webkit-mask: ${mask}; aspect-ratio: 1; background-color: var(--szd5nr); mask: ${mask}; width: 24px; }`];
var Icon = withCSS(Component, css, "framer-Kac74");
Icon.displayName = "Arrow Down On Square";
var RJ3LR1Tc_default = Icon;
addPropertyControls(Icon, { YmfIrZ3Ez: { defaultValue: "rgb(0, 0, 0)", hidden: false, title: "Stroke", type: ControlType.Color } });
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "Icon", "slots": [], "annotations": { "framerContractVersion": "1", "framerSupportedLayoutWidth": "any-prefer-fixed", "framerSupportedLayoutHeight": "any-prefer-fixed", "framerIntrinsicWidth": "24", "framerVector": '{"name":"Arrow Down On Square","color":{"type":"variable","value":"szd5nr"},"set":{"localId":"vectorSet/kNBkgkDkJ","id":"kNBkgkDkJ","moduleId":"DyJDRQD0f0RPOu0ZYoEG"}}', "framerVariables": '{"YmfIrZ3Ez":"stroke"}', "framerImmutableVariables": "true", "framerIntrinsicHeight": "24", "framerDisableUnlink": "true" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  RJ3LR1Tc_default as default
};
