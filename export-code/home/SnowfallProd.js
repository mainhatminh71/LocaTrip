var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/UJTblaXGpa171ax0fxm2/aL3CIT6XOu67y94npjE3/Snowfall_prod.js
import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import { addPropertyControls, ControlType, RenderTarget } from "./_framer-runtime.js";

// http-url:https://cdn.jsdelivr.net/gh/framer-university/components/npm-bundles/snow-final.js
import t, { useState as e, useCallback as i, useEffect as n, useMemo as a, useRef as s } from "react";
function r(t2) {
  return t2 && t2.__esModule && Object.prototype.hasOwnProperty.call(t2, "default") ? t2.default : t2;
}
var o;
var h;
var c = r(function() {
  if (h)
    return o;
  h = 1;
  var t2 = "undefined" != typeof Element, e2 = "function" == typeof Map, i2 = "function" == typeof Set, n2 = "function" == typeof ArrayBuffer && !!ArrayBuffer.isView;
  function a2(s2, r2) {
    if (s2 === r2)
      return true;
    if (s2 && r2 && "object" == typeof s2 && "object" == typeof r2) {
      if (s2.constructor !== r2.constructor)
        return false;
      var o2, h2, c2, f2;
      if (Array.isArray(s2)) {
        if ((o2 = s2.length) != r2.length)
          return false;
        for (h2 = o2; 0 !== h2--; )
          if (!a2(s2[h2], r2[h2]))
            return false;
        return true;
      }
      if (e2 && s2 instanceof Map && r2 instanceof Map) {
        if (s2.size !== r2.size)
          return false;
        for (f2 = s2.entries(); !(h2 = f2.next()).done; )
          if (!r2.has(h2.value[0]))
            return false;
        for (f2 = s2.entries(); !(h2 = f2.next()).done; )
          if (!a2(h2.value[1], r2.get(h2.value[0])))
            return false;
        return true;
      }
      if (i2 && s2 instanceof Set && r2 instanceof Set) {
        if (s2.size !== r2.size)
          return false;
        for (f2 = s2.entries(); !(h2 = f2.next()).done; )
          if (!r2.has(h2.value[0]))
            return false;
        return true;
      }
      if (n2 && ArrayBuffer.isView(s2) && ArrayBuffer.isView(r2)) {
        if ((o2 = s2.length) != r2.length)
          return false;
        for (h2 = o2; 0 !== h2--; )
          if (s2[h2] !== r2[h2])
            return false;
        return true;
      }
      if (s2.constructor === RegExp)
        return s2.source === r2.source && s2.flags === r2.flags;
      if (s2.valueOf !== Object.prototype.valueOf && "function" == typeof s2.valueOf && "function" == typeof r2.valueOf)
        return s2.valueOf() === r2.valueOf();
      if (s2.toString !== Object.prototype.toString && "function" == typeof s2.toString && "function" == typeof r2.toString)
        return s2.toString() === r2.toString();
      if ((o2 = (c2 = Object.keys(s2)).length) !== Object.keys(r2).length)
        return false;
      for (h2 = o2; 0 !== h2--; )
        if (!Object.prototype.hasOwnProperty.call(r2, c2[h2]))
          return false;
      if (t2 && s2 instanceof Element)
        return false;
      for (h2 = o2; 0 !== h2--; )
        if (("_owner" !== c2[h2] && "__v" !== c2[h2] && "__o" !== c2[h2] || !s2.$$typeof) && !a2(s2[c2[h2]], r2[c2[h2]]))
          return false;
      return true;
    }
    return s2 != s2 && r2 != r2;
  }
  return o = function(t3, e3) {
    try {
      return a2(t3, e3);
    } catch (t4) {
      if ((t4.message || "").match(/stack|recursion/i))
        return false;
      throw t4;
    }
  };
}());
function f(t2, e2) {
  return Number.isInteger(t2) && Number.isInteger(e2) ? Math.floor(Math.random() * (e2 - t2 + 1) + t2) : Math.random() * (e2 - t2) + t2;
}
function p(t2, e2, i2) {
  return (1 - i2) * t2 + i2 * e2;
}
function u(t2) {
  return t2 ? { height: t2.offsetHeight, width: t2.offsetWidth } : { height: 0, width: 0 };
}
var l = 2 * Math.PI;
function m(t2) {
  if (!t2)
    return { r: 222, g: 228, b: 253 };
  const e2 = t2.trim(), i2 = e2.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i);
  if (i2)
    return { r: Math.max(0, Math.min(255, parseFloat(i2[1]))), g: Math.max(0, Math.min(255, parseFloat(i2[2]))), b: Math.max(0, Math.min(255, parseFloat(i2[3]))) };
  const n2 = e2.replace(/^#/, "");
  return 6 === n2.length ? { r: parseInt(n2.slice(0, 2), 16), g: parseInt(n2.slice(2, 4), 16), b: parseInt(n2.slice(4, 6), 16) } : 3 === n2.length ? { r: parseInt(n2[0] + n2[0], 16), g: parseInt(n2[1] + n2[1], 16), b: parseInt(n2[2] + n2[2], 16) } : { r: 222, g: 228, b: 253 };
}
function d(t2, e2, i2) {
  const n2 = m(t2), a2 = m(e2);
  return function(t3, e3, i3) {
    const n3 = (t4) => {
      const e4 = Math.round(Math.max(0, Math.min(255, t4))).toString(16);
      return 1 === e4.length ? "0" + e4 : e4;
    };
    return "#" + n3(t3) + n3(e3) + n3(i3);
  }(p(n2.r, a2.r, i2), p(n2.g, a2.g, i2), p(n2.b, a2.b, i2));
}
var g = { pointerEvents: "none", backgroundColor: "transparent", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" };
var w = 1e3 / 60;
var y = { color: "#dee4fd", radius: [0.5, 3], speed: [1, 3], wind: [-0.5, 2], changeFrequency: 200, rotationSpeed: [-1, 1], opacity: [1, 1], enable3DRotation: false, transitionTime: 0, direction: "down" };
var v = class _v {
  static createSnowflakes(t2, e2, i2) {
    if (!t2)
      return [];
    const n2 = [];
    for (let a2 = 0; a2 < e2; a2++)
      n2.push(new _v(t2, i2));
    return n2;
  }
  constructor(t2, e2 = {}) {
    this.updateConfig(e2);
    const { radius: i2, wind: n2, speed: a2, rotationSpeed: s2, opacity: r2, enable3DRotation: o2, direction: h2 } = this.config, c2 = f(...i2), p2 = f(...r2), u2 = f(...n2);
    let l2;
    const m2 = t2.offsetWidth, d2 = (n2[0] + n2[1]) / 2;
    let g2;
    l2 = d2 < -0.5 ? f(0.8 * m2, m2) : f(0, d2 > 0.5 ? 0.2 * m2 : m2), g2 = "up" === h2 ? f(t2.offsetHeight, 2 * t2.offsetHeight) : f(-t2.offsetHeight, 0);
    const w2 = "up" === h2 ? -f(...a2) : f(...a2);
    this.params = { x: l2, y: g2, rotation: f(0, 360), radius: c2, nextRadius: c2, speed: w2, wind: u2, rotationSpeed: f(...s2), nextSpeed: w2, nextWind: f(...n2), nextRotationSpeed: f(...s2), opacity: p2, nextOpacity: p2, rotationX: o2 ? f(0, 360) : 0, rotationY: o2 ? f(0, 360) : 0, rotationSpeedX: o2 ? f(-2, 2) : 0, rotationSpeedY: o2 ? f(-2, 2) : 0, nextRotationSpeedX: o2 ? f(-2, 2) : 0, nextRotationSpeedY: o2 ? f(-2, 2) : 0, currentColor: this.config.color, nextColor: this.config.color, isRemoving: false }, this.framesSinceLastUpdate = 0;
  }
  selectImage() {
    var t2;
    this.config.images && this.config.images.length > 0 ? this.image = (t2 = this.config.images)[Math.floor(Math.random() * t2.length)] : this.image = void 0;
  }
  updateConfig(t2) {
    const e2 = this.config;
    this.config = { ...y, ...t2 }, this.config.changeFrequency = f(this.config.changeFrequency, 1.5 * this.config.changeFrequency), this.params && (c(this.config.speed, null == e2 ? void 0 : e2.speed) && c(this.config.direction, null == e2 ? void 0 : e2.direction) || (this.params.nextSpeed = "up" === this.config.direction ? -f(...this.config.speed) : f(...this.config.speed), 0 === this.config.transitionTime && (this.params.speed = this.params.nextSpeed)), c(this.config.wind, null == e2 ? void 0 : e2.wind) || (this.params.nextWind = f(...this.config.wind), 0 === this.config.transitionTime && (this.params.wind = this.params.nextWind)), c(this.config.rotationSpeed, null == e2 ? void 0 : e2.rotationSpeed) || (this.params.nextRotationSpeed = f(...this.config.rotationSpeed), 0 === this.config.transitionTime && (this.params.rotationSpeed = this.params.nextRotationSpeed)), this.config.enable3DRotation && !c(this.config.enable3DRotation, null == e2 ? void 0 : e2.enable3DRotation) && (this.params.nextRotationSpeedX = f(-2, 2), this.params.nextRotationSpeedY = f(-2, 2), 0 === this.config.transitionTime && (this.params.rotationSpeedX = this.params.nextRotationSpeedX, this.params.rotationSpeedY = this.params.nextRotationSpeedY)), c(this.config.color, null == e2 ? void 0 : e2.color) || (this.params.nextColor = this.config.color, 0 === this.config.transitionTime && (this.params.currentColor = this.params.nextColor)), c(this.config.radius, null == e2 ? void 0 : e2.radius) || (this.params.nextRadius = f(...this.config.radius), 0 === this.config.transitionTime && (this.params.radius = this.params.nextRadius)), c(this.config.opacity, null == e2 ? void 0 : e2.opacity) || (this.params.nextOpacity = f(...this.config.opacity), 0 === this.config.transitionTime && (this.params.opacity = this.params.nextOpacity))), c(this.config.images, null == e2 ? void 0 : e2.images) || this.selectImage();
  }
  markForRemoval() {
    this.params.isRemoving || (this.params.isRemoving = true);
  }
  shouldRemove(t2, e2) {
    return !!this.params.isRemoving && ("up" === this.config.direction ? this.params.y < -this.params.radius : this.params.y > e2 + this.params.radius);
  }
  updateTargetParams() {
    this.params.nextSpeed = "up" === this.config.direction ? -f(...this.config.speed) : f(...this.config.speed), this.params.nextWind = f(...this.config.wind), this.image && (this.params.nextRotationSpeed = f(...this.config.rotationSpeed)), this.config.enable3DRotation && (this.params.nextRotationSpeedX = f(-2, 2), this.params.nextRotationSpeedY = f(-2, 2));
  }
  update(t2, e2, i2 = 1) {
    const { x: n2, y: a2, rotation: s2, rotationSpeed: r2, nextRotationSpeed: o2, wind: h2, speed: c2, nextWind: f2, nextSpeed: u2, radius: l2 } = this.params;
    this.params.x = n2 + h2 * i2, h2 < 0 ? this.params.x < -l2 && (this.params.x = t2 + l2) : (h2 > 0 || (this.params.x = (this.params.x % (t2 + 2 * l2) + (t2 + 2 * l2)) % (t2 + 2 * l2)), this.params.x > t2 + l2 && (this.params.x = -l2)), this.params.y = a2 + c2 * i2, this.params.isRemoving || ("up" === this.config.direction ? (this.params.y = (this.params.y % (e2 + 2 * l2) + (e2 + 2 * l2)) % (e2 + 2 * l2), this.params.y < -l2 && (this.params.y = e2 + l2)) : (this.params.y = this.params.y % (e2 + 2 * l2), this.params.y > e2 + l2 && (this.params.y = -l2))), (this.image || this.config.enable3DRotation) && (this.params.rotation = (s2 + r2) % 360), this.config.enable3DRotation && (this.params.rotationX = (this.params.rotationX + this.params.rotationSpeedX * i2) % 360, this.params.rotationY = (this.params.rotationY + this.params.rotationSpeedY * i2) % 360);
    const m2 = w, g2 = this.config.transitionTime > 0 ? this.config.transitionTime / m2 : 1, y2 = this.config.transitionTime > 0 ? Math.min(i2 / g2, 1) : 1;
    this.params.speed = p(c2, u2, y2), this.params.wind = p(h2, f2, y2), this.params.rotationSpeed = p(r2, o2, y2), this.params.radius = p(this.params.radius, this.params.nextRadius, y2), this.params.opacity = p(this.params.opacity, this.params.nextOpacity, y2), this.params.currentColor !== this.params.nextColor && (this.params.currentColor = d(this.params.currentColor, this.params.nextColor, y2)), this.config.enable3DRotation && (this.params.rotationSpeedX = p(this.params.rotationSpeedX, this.params.nextRotationSpeedX, y2), this.params.rotationSpeedY = p(this.params.rotationSpeedY, this.params.nextRotationSpeedY, y2)), this.framesSinceLastUpdate++ > this.config.changeFrequency && (this.updateTargetParams(), this.framesSinceLastUpdate = 0);
  }
  getImageOffscreenCanvas(t2, e2) {
    var i2, n2;
    if (t2 instanceof HTMLImageElement && t2.loading)
      return t2;
    let a2 = _v.offscreenCanvases.get(t2);
    if (a2 || (a2 = {}, _v.offscreenCanvases.set(t2, a2)), !(e2 in a2)) {
      const n3 = document.createElement("canvas");
      n3.width = e2, n3.height = e2, null === (i2 = n3.getContext("2d")) || void 0 === i2 || i2.drawImage(t2, 0, 0, e2, e2), a2[e2] = n3;
    }
    return null !== (n2 = a2[e2]) && void 0 !== n2 ? n2 : t2;
  }
  apply3DTransform(t2, e2, i2) {
    if (this.config.enable3DRotation) {
      const { rotationX: n2, rotationY: a2 } = this.params, s2 = this.params.rotation || 0, r2 = n2 * Math.PI / 180, o2 = a2 * Math.PI / 180, h2 = s2 * Math.PI / 180, c2 = Math.cos(r2), f2 = Math.sin(r2), p2 = Math.cos(o2), u2 = Math.sin(o2), l2 = Math.cos(h2), m2 = Math.sin(h2), d2 = l2 * p2, g2 = l2 * u2 * f2 - m2 * c2, w2 = l2 * u2 * c2 + m2 * f2, y2 = m2 * p2;
      t2.setTransform(d2, g2, w2, y2, e2, i2);
    } else {
      const n2 = (this.params.rotation || 0) * Math.PI / 180, a2 = Math.cos(n2), s2 = Math.sin(n2);
      t2.setTransform(a2, s2, -s2, a2, e2, i2);
    }
  }
  drawCircleWithOpacity(t2, e2) {
    const { x: i2, y: n2, radius: a2, opacity: s2 } = this.params;
    t2.save(), t2.globalAlpha = s2, t2.beginPath(), t2.moveTo(i2, n2), t2.arc(i2, n2, a2, 0, l), t2.fillStyle = e2, t2.fill(), t2.restore();
  }
  drawCircle3D(t2, e2) {
    const { x: i2, y: n2, radius: a2, opacity: s2 } = this.params;
    t2.save(), t2.globalAlpha = s2, this.config.enable3DRotation ? this.apply3DTransform(t2, i2, n2) : t2.translate(i2, n2), t2.beginPath(), t2.arc(0, 0, a2, 0, l), t2.fillStyle = e2, t2.fill(), t2.restore();
  }
  drawImage(t2) {
    const { x: e2, y: i2, radius: n2, opacity: a2 } = this.params;
    t2.save(), t2.globalAlpha = a2, this.apply3DTransform(t2, e2, i2);
    const s2 = this.getImageOffscreenCanvas(this.image, n2);
    t2.drawImage(s2, -n2 / 2, -n2 / 2, n2, n2), t2.restore();
  }
};
v.offscreenCanvases = /* @__PURE__ */ new WeakMap();
var x;
var S;
var R = function(t2, e2, i2, n2) {
  if ("a" === i2 && !n2)
    throw new TypeError("Private accessor was defined without a getter");
  if ("function" == typeof e2 ? t2 !== e2 || !n2 : !e2.has(t2))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return "m" === i2 ? n2 : "a" === i2 ? n2.call(t2) : n2 ? n2.value : e2.get(t2);
};
var b = function(t2, e2, i2, n2, a2) {
  if ("m" === n2)
    throw new TypeError("Private method is not writable");
  if ("a" === n2 && !a2)
    throw new TypeError("Private accessor was defined without a setter");
  if ("function" == typeof e2 ? t2 !== e2 || !a2 : !e2.has(t2))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return "a" === n2 ? a2.call(t2, i2) : a2 ? a2.value = i2 : e2.set(t2, i2), i2;
};
var k = class {
  get ctx() {
    return R(this, x, "f");
  }
  get canvas() {
    return R(this, S, "f");
  }
  set canvas(t2) {
    b(this, S, t2, "f"), b(this, x, t2.getContext("2d"), "f");
  }
  constructor(t2, e2) {
    this.lastUpdate = Date.now(), this.snowflakes = [], this.shouldAnimate = true, this.animationFrame = void 0, x.set(this, void 0), S.set(this, void 0), b(this, S, t2, "f"), b(this, x, t2.getContext("2d"), "f"), this.config = { snowflakeCount: 150, ...y, ...e2 }, this.snowflakes = [], this.snowflakes = v.createSnowflakes(t2, e2.snowflakeCount || 150, e2), this.play();
  }
  updateConfig(t2) {
    this.config = { ...this.config, ...t2 };
    const e2 = this.snowflakes.filter((t3) => !t3.params.isRemoving), i2 = this.snowflakes.filter((t3) => t3.params.isRemoving), n2 = this.config.snowflakeCount - e2.length;
    if (n2 > 0) {
      const e3 = Math.min(n2, i2.length);
      let a3 = 0;
      for (let t3 = 0; t3 < this.snowflakes.length && a3 < e3; t3++)
        this.snowflakes[t3].params.isRemoving && (this.snowflakes[t3].params.isRemoving = false, a3++);
      const s3 = n2 - a3;
      s3 > 0 && (this.snowflakes = [...this.snowflakes, ...v.createSnowflakes(this.canvas, s3, t2)]);
    } else if (n2 < 0) {
      const t3 = Math.abs(n2);
      let e3 = 0;
      for (let i3 = this.snowflakes.length - 1; i3 >= 0 && e3 < t3; i3--)
        this.snowflakes[i3].params.isRemoving || (this.snowflakes[i3].markForRemoval(), e3++);
    }
    for (const t3 of this.snowflakes)
      t3.updateConfig(this.config);
    const { offsetWidth: a2, offsetHeight: s2 } = this.canvas;
    this.snowflakes = this.snowflakes.filter((t3) => !t3.shouldRemove(a2, s2));
  }
  render(t2 = 1) {
    const { ctx: e2, canvas: i2, snowflakes: n2 } = this;
    if (!e2 || !i2)
      return;
    const { offsetWidth: a2, offsetHeight: s2 } = i2;
    for (const e3 of n2)
      e3.update(a2, s2, t2);
    this.snowflakes = this.snowflakes.filter((t3) => !t3.shouldRemove(a2, s2)), this.renderFrame();
  }
  renderFrame() {
    const { ctx: t2, canvas: e2 } = this;
    if (!t2 || !e2)
      return;
    const { offsetWidth: i2, offsetHeight: n2 } = e2;
    this.snowflakes = this.snowflakes.filter((t3) => !t3.shouldRemove(i2, n2));
    const a2 = this.snowflakes;
    if (t2.setTransform(1, 0, 0, 1, 0, 0), t2.clearRect(0, 0, i2, n2), this.config.images && this.config.images.length > 0)
      for (const e3 of a2)
        e3.drawImage(t2);
    else
      for (const e3 of a2)
        this.config.enable3DRotation ? e3.drawCircle3D(t2, e3.params.currentColor) : e3.drawCircleWithOpacity(t2, e3.params.currentColor);
  }
  loop() {
    if (!this.shouldAnimate)
      return void (this.animationFrame = void 0);
    const t2 = Date.now(), e2 = Date.now() - this.lastUpdate;
    this.lastUpdate = t2;
    const i2 = e2 / w;
    this.render(i2), this.animationFrame = requestAnimationFrame(() => this.loop());
  }
  play() {
    this.shouldAnimate = true, this.animationFrame || this.loop();
  }
  pause() {
    this.shouldAnimate = false, this.animationFrame && (cancelAnimationFrame(this.animationFrame), this.animationFrame = void 0);
  }
};
x = /* @__PURE__ */ new WeakMap(), S = /* @__PURE__ */ new WeakMap();
function C(t2) {
  const [i2, a2] = e(t2);
  return function(t3, e2) {
    const i3 = s(e2);
    c(e2, i3.current) || (i3.current = e2), n(t3, i3.current);
  }(() => a2(t2), [t2]), i2;
}
var M = ({ color: r2 = y.color, changeFrequency: o2 = y.changeFrequency, radius: h2 = y.radius, speed: c2 = y.speed, wind: f2 = y.wind, rotationSpeed: p2 = y.rotationSpeed, opacity: l2 = y.opacity, snowflakeCount: m2 = 150, images: d2, enable3DRotation: w2 = y.enable3DRotation, transitionTime: v2 = y.transitionTime, direction: x2 = y.direction, paused: S2 = false, style: R2 } = {}) => {
  const b2 = a(() => ({ ...g, ...M2 || {} }), [M2 = R2]);
  var M2;
  const T = s(null), F = ((t2) => {
    const [a2, s2] = e(u(t2.current)), r3 = i(() => {
      t2.current && s2(u(t2.current));
    }, [t2]);
    return n(() => {
      const { ResizeObserver: e2 } = __dai_window;
      if (t2.current) {
        if (r3(), "function" == typeof e2) {
          const i2 = new e2(r3);
          return i2.observe(t2.current), () => i2.disconnect();
        }
        return __dai_window.addEventListener("resize", r3), () => __dai_window.removeEventListener("resize", r3);
      }
    }, [t2, r3]), a2;
  })(T), D = C({ color: r2, changeFrequency: o2, radius: h2, speed: c2, wind: f2, rotationSpeed: p2, images: d2, snowflakeCount: m2, opacity: l2, enable3DRotation: w2, transitionTime: v2, direction: x2 }), O = s(D), I = s(), A = s(S2);
  return n(() => (!I.current && T.current && (I.current = new k(T.current, O.current), S2 && (A.current = true, I.current.pause(), setTimeout(() => {
    if (I.current && A.current) {
      for (let t2 = 0; t2 < 180; t2++)
        I.current.render(1);
      I.current.renderFrame();
    }
  }, 100))), () => {
    var t2;
    null === (t2 = I.current) || void 0 === t2 || t2.pause(), I.current = void 0;
  }), []), n(() => {
    I.current && (I.current.updateConfig(D), A.current && setTimeout(() => {
      I.current && A.current && I.current.renderFrame();
    }, 0));
  }, [D]), n(() => {
    I.current && (A.current = S2, S2 ? (I.current.pause(), setTimeout(() => {
      I.current && A.current && I.current.renderFrame();
    }, 0)) : I.current.play());
  }, [S2]), t.createElement("canvas", { ref: T, height: F.height, width: F.width, style: b2, "data-testid": "SnowfallCanvas" });
};

// http-url:https://framerusercontent.com/modules/UJTblaXGpa171ax0fxm2/aL3CIT6XOu67y94npjE3/Snowfall_prod.js
var cssVariableRegex = /var\s*\(\s*(--[\w-]+)(?:\s*,\s*((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*))?\s*\)/;
function extractDefaultValue(cssVar) {
  if (!cssVar || !cssVar.startsWith("var("))
    return cssVar;
  const match = cssVariableRegex.exec(cssVar);
  if (!match)
    return cssVar;
  const fallback = (match[2] || "").trim();
  if (fallback.startsWith("var("))
    return extractDefaultValue(fallback);
  return fallback || cssVar;
}
function resolveTokenColor(input) {
  if (!input || typeof input !== "string")
    return input || "";
  if (!input.startsWith("var("))
    return input;
  return extractDefaultValue(input);
}
function mapLinear(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin)
    return outMin;
  const t2 = (value - inMin) / (inMax - inMin);
  return outMin + t2 * (outMax - outMin);
}
function mapSpeed(ui) {
  return mapLinear(Math.max(0, Math.min(1, ui)), 0, 1, 0.1, 10);
}
function mapWind(ui) {
  return mapLinear(Math.max(-1, Math.min(1, ui)), -1, 1, -10, 10);
}
function mapRadius(ui) {
  return mapLinear(Math.max(0, Math.min(1, ui)), 0, 1, 0.1, 5);
}
var DEFAULTS = { background: "#000000", color: "#dee4fd", snowflakeCount: 150, speed: { min: 0.1, max: 0.3 }, wind: { min: -0.05, max: 0.2 }, radius: { min: 0.1, max: 0.4 }, opacity: { min: 0.5, max: 1 }, direction: "down", transitionTime: 0.5 };
function SnowFall({ preview = false, background, color = DEFAULTS.color, snowflakeCount = DEFAULTS.snowflakeCount, speed = DEFAULTS.speed, wind = DEFAULTS.wind, radius = DEFAULTS.radius, opacity = DEFAULTS.opacity, direction = DEFAULTS.direction, transitionTime = DEFAULTS.transitionTime, style }) {
  const containerRef = useRef(null);
  const isCanvasMode = RenderTarget.current() === RenderTarget.canvas;
  const [isInViewport, setIsInViewport] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);
  useEffect(() => {
    if (isCanvasMode) {
      setIsInViewport(true);
      return;
    }
    const element = containerRef.current;
    if (!element)
      return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setIsInViewport(!!entry?.isIntersecting);
    }, { threshold: 0, rootMargin: "0px" });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [isCanvasMode]);
  useEffect(() => {
    if (isCanvasMode) {
      setIsPageVisible(true);
      return;
    }
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isCanvasMode]);
  const shouldAnimate = isInViewport && isPageVisible && (!isCanvasMode || preview);
  const resolvedBackground = resolveTokenColor(background);
  const resolvedColor = resolveTokenColor(color);
  const mappedSpeed = [mapSpeed(speed.min), mapSpeed(speed.max)];
  const mappedWind = [mapWind(wind.min), mapWind(wind.max)];
  const mappedRadius = [mapRadius(radius.min), mapRadius(radius.max)];
  const snowfallConfig = { color: resolvedColor, snowflakeCount, speed: mappedSpeed, wind: mappedWind, radius: mappedRadius, opacity: [opacity.min, opacity.max], direction, transitionTime: transitionTime * 1e3 };
  return /* @__PURE__ */ _jsx("div", { ref: containerRef, style: { ...style, position: "relative", width: "100%", height: "100%", overflow: "hidden", backgroundColor: resolvedBackground }, children: /* @__PURE__ */ _jsx(M, { ...snowfallConfig, paused: !shouldAnimate, style: { position: "absolute", inset: 0, width: "100%", height: "100%" } }) });
}
addPropertyControls(SnowFall, { preview: { type: ControlType.Boolean, title: "Preview", defaultValue: true, enabledTitle: "On", disabledTitle: "Off" }, snowflakeCount: { type: ControlType.Number, title: "Count", min: 10, max: 1e3, step: 10, defaultValue: DEFAULTS.snowflakeCount }, speed: { type: ControlType.Object, title: "Speed", controls: { min: { type: ControlType.Number, title: "Min", min: 0, max: 1, step: 0.01, defaultValue: DEFAULTS.speed.min }, max: { type: ControlType.Number, title: "Max", min: 0, max: 1, step: 0.01, defaultValue: DEFAULTS.speed.max } }, defaultValue: DEFAULTS.speed }, wind: { type: ControlType.Object, title: "Wind", controls: { min: { type: ControlType.Number, title: "Min", min: -1, max: 1, step: 0.1, defaultValue: DEFAULTS.wind.min }, max: { type: ControlType.Number, title: "Max", min: -1, max: 1, step: 0.1, defaultValue: DEFAULTS.wind.max } }, defaultValue: DEFAULTS.wind }, radius: { type: ControlType.Object, title: "Radius", controls: { min: { type: ControlType.Number, title: "Min", min: 0, max: 1, step: 0.1, defaultValue: DEFAULTS.radius.min }, max: { type: ControlType.Number, title: "Max", min: 0, max: 1, step: 0.1, defaultValue: DEFAULTS.radius.max } }, defaultValue: DEFAULTS.radius }, opacity: { type: ControlType.Object, title: "Opacity", controls: { min: { type: ControlType.Number, title: "Min", min: 0, max: 1, step: 0.1, defaultValue: DEFAULTS.opacity.min }, max: { type: ControlType.Number, title: "Max", min: 0, max: 1, step: 0.1, defaultValue: DEFAULTS.opacity.max } }, defaultValue: DEFAULTS.opacity }, direction: { type: ControlType.Enum, title: "Direction", options: ["down", "up"], optionTitles: ["Down", "Up"], defaultValue: DEFAULTS.direction, displaySegmentedControl: true, segmentedControlDirection: "vertical" }, transitionTime: { type: ControlType.Number, title: "Transition", min: 0, max: 5, step: 0.1, defaultValue: DEFAULTS.transitionTime, unit: "s" }, color: { type: ControlType.Color, title: "Color", defaultValue: DEFAULTS.color }, background: { type: ControlType.Color, title: "Background", defaultValue: DEFAULTS.background, optional: true, description: "More components at [Framer University](https://frameruni.link/cc)." } });
SnowFall.displayName = "Snow Fall";
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "SnowFall", "slots": [], "annotations": { "framerIntrinsicHeight": "400", "framerContractVersion": "1", "framerDisableUnlink": "", "framerIntrinsicWidth": "600", "framerSupportedLayoutHeight": "any-prefer-fixed", "framerSupportedLayoutWidth": "any-prefer-fixed" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  SnowFall as default
};
