var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/D5cULE6MTuc8hnZ5CxMo/doO1wHaMhcF0DPvUj7Q1/ZFX1kjuqG.js
import { jsx as _jsx } from "react/jsx-runtime";
import { addPropertyControls, ControlType, cx, motion, withCSS } from "./_framer-runtime.js";
import * as React from "react";
import { forwardRef as forwardRef2 } from "react";
var mask = `url('data:image/svg+xml,<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 4.217 8.657 C 3.833 7.967 3.096 7.5 2.25 7.5 C 1.007 7.5 0 8.507 0 9.75 C 0 10.993 1.007 12 2.25 12 C 3.096 12 3.833 11.533 4.217 10.843 M 4.217 8.657 C 4.397 8.981 4.5 9.353 4.5 9.75 C 4.5 10.147 4.397 10.519 4.217 10.843 M 4.217 8.657 L 13.783 3.343 M 4.217 10.843 L 13.783 16.157 M 13.783 16.157 C 13.603 16.481 13.5 16.853 13.5 17.25 C 13.5 18.493 14.507 19.5 15.75 19.5 C 16.993 19.5 18 18.493 18 17.25 C 18 16.007 16.993 15 15.75 15 C 14.904 15 14.167 15.467 13.783 16.157 Z M 13.783 3.343 C 14.167 4.033 14.904 4.5 15.75 4.5 C 16.993 4.5 18 3.493 18 2.25 C 18 1.007 16.993 0 15.75 0 C 14.507 0 13.5 1.007 13.5 2.25 C 13.5 2.647 13.603 3.019 13.783 3.343 Z" fill="transparent" height="19.5px" id="uQqv0pI8L" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="var(--szd5nr, black)" transform="translate(3 2.25)" width="18px"/></svg>') alpha no-repeat center / auto var(--framer-icon-mask-mode, add), var(--framer-icon-mask, none)`;
var SVG = /* @__PURE__ */ forwardRef2((props, ref) => {
  const { animated, layoutId, children, ...rest } = props;
  return animated ? /* @__PURE__ */ _jsx(motion.div, { ...rest, layoutId, ref }) : /* @__PURE__ */ _jsx("div", { ...rest, ref });
});
var getProps = ({ height, id, stroke, width, ...props }) => {
  return { ...props, YmfIrZ3Ez: stroke ?? props.YmfIrZ3Ez ?? "rgb(0, 0, 0)" };
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const { style, className, layoutId, variant, YmfIrZ3Ez, ...restProps } = getProps(props);
  return /* @__PURE__ */ _jsx(SVG, { ...restProps, className: cx("framer-9Xfyj", className), layoutId, ref, style: { "--szd5nr": YmfIrZ3Ez, ...style } });
});
var css = [`.framer-9Xfyj { -webkit-mask: ${mask}; aspect-ratio: 1; background-color: var(--szd5nr); mask: ${mask}; width: 24px; }`];
var Icon = withCSS(Component, css, "framer-9Xfyj");
Icon.displayName = "Share";
var ZFX1kjuqG_default = Icon;
addPropertyControls(Icon, { YmfIrZ3Ez: { defaultValue: "rgb(0, 0, 0)", hidden: false, title: "Stroke", type: ControlType.Color } });
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "Icon", "slots": [], "annotations": { "framerIntrinsicHeight": "24", "framerSupportedLayoutWidth": "any-prefer-fixed", "framerSupportedLayoutHeight": "any-prefer-fixed", "framerVariables": '{"YmfIrZ3Ez":"stroke"}', "framerImmutableVariables": "true", "framerContractVersion": "1", "framerVector": '{"name":"Share","color":{"type":"variable","value":"szd5nr"},"set":{"localId":"vectorSet/kNBkgkDkJ","id":"kNBkgkDkJ","moduleId":"DyJDRQD0f0RPOu0ZYoEG"}}', "framerDisableUnlink": "true", "framerIntrinsicWidth": "24" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  ZFX1kjuqG_default as default
};
