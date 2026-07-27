
// ─────────────────────────────────────────────────────────────
// CMS Data Stub (Framer plugin v15)
//
// This component was bound to a Framer Collection. The runtime CMS
// machinery has been stripped — wire up your own data source by
// populating this object. Keys are the query aliases used internally
// by the design; values are arrays of items.
//
// AI INTEGRATION NOTE: identify the .map(item => ...) call(s) in
// the component below to learn what fields each item needs. Then
// replace the empty arrays here with your data (fetched from your
// CMS, an API, a JSON file, props, etc.).
// ─────────────────────────────────────────────────────────────
const __FRAMER_CMS_DATA__ = {
  // alias: [ { /* item fields */ } ],
};
const __framer_useQueryData = (query) => {
  const alias = query && query.from && query.from.alias;
  return (alias && __FRAMER_CMS_DATA__[alias]) || [];
};

var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/gFNP6F4CoVUu9xQHTkED/HE04kscOp67W4Gdh0wQ7/nFX7IZyxE.js
import { jsx as _jsx3, jsxs as _jsxs2, Fragment as _Fragment } from "react/jsx-runtime";
import { addFonts as addFonts2, addPropertyControls as addPropertyControls3, ChildrenCanSuspend, ComponentViewportProvider, ControlType as ControlType3, cx as cx3, forwardLoader, getFonts as getFonts2, PathVariablesContext, queryCache, ResolveLinks, SmartComponentScopedContainer, useComponentViewport as useComponentViewport2, useLocaleInfo as useLocaleInfo2, useQueryData, useRouter, useVariantState as useVariantState2, withCSS as withCSS3 } from "./_framer-runtime.js";
import { LayoutGroup as LayoutGroup2, motion as motion3, MotionConfigContext as MotionConfigContext2 } from "framer-motion";
import * as React3 from "react";
import { useRef as useRef2 } from "react";

// http-url:https://framerusercontent.com/modules/AfdNAFDqPZvubNcFJrwt/MAK9mRJvTXT9iGXX5xBd/ysqa11MKy.js
import { addPropertyControls as e5, ControlType as l3, QueryEngine as t4 } from "./_framer-runtime.js";

// http-url:https://framerusercontent.com/modules/AfdNAFDqPZvubNcFJrwt/MAK9mRJvTXT9iGXX5xBd/ysqa11MKy-0.js
import { ControlType as y } from "./_framer-runtime.js";
import { ControlType as P } from "./_framer-runtime.js";
var t;
var e = Object.create;
var r = Object.defineProperty;
var n = Object.getOwnPropertyDescriptor;
var i = Object.getOwnPropertyNames;
var s = Object.getPrototypeOf;
var a = Object.prototype.hasOwnProperty;
var o = (t5, e6, n4) => e6 in t5 ? r(t5, e6, { enumerable: true, configurable: true, writable: true, value: n4 }) : t5[e6] = n4;
var u = (t5, e6) => function() {
  return e6 || (0, t5[i(t5)[0]])((e6 = { exports: {} }).exports, e6), e6.exports;
};
var l = (t5, e6, s4, o4) => {
  if (e6 && "object" == typeof e6 || "function" == typeof e6)
    for (let u4 of i(e6))
      a.call(t5, u4) || u4 === s4 || r(t5, u4, { get: () => e6[u4], enumerable: !(o4 = n(e6, u4)) || o4.enumerable });
  return t5;
};
var h = (t5, n4, i3) => (i3 = null != t5 ? e(s(t5)) : {}, l(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  !n4 && t5 && t5.__esModule ? i3 : r(i3, "default", { value: t5, enumerable: true }),
  t5
));
var c = (t5, e6, r3) => o(t5, "symbol" != typeof e6 ? e6 + "" : e6, r3);
var f = u({ "../../../node_modules/dataloader/index.js"(t5, e6) {
  var r3, n4 = /* @__PURE__ */ function() {
    function t6(t7, e8) {
      if ("function" != typeof t7)
        throw TypeError("DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but got: " + t7 + ".");
      this._batchLoadFn = t7, this._maxBatchSize = function(t8) {
        if (!(!t8 || false !== t8.batch))
          return 1;
        var e9 = t8 && t8.maxBatchSize;
        if (void 0 === e9)
          return 1 / 0;
        if ("number" != typeof e9 || e9 < 1)
          throw TypeError("maxBatchSize must be a positive number: " + e9);
        return e9;
      }(e8), this._batchScheduleFn = function(t8) {
        var e9 = t8 && t8.batchScheduleFn;
        if (void 0 === e9)
          return i3;
        if ("function" != typeof e9)
          throw TypeError("batchScheduleFn must be a function: " + e9);
        return e9;
      }(e8), this._cacheKeyFn = function(t8) {
        var e9 = t8 && t8.cacheKeyFn;
        if (void 0 === e9)
          return function(t9) {
            return t9;
          };
        if ("function" != typeof e9)
          throw TypeError("cacheKeyFn must be a function: " + e9);
        return e9;
      }(e8), this._cacheMap = function(t8) {
        if (!(!t8 || false !== t8.cache))
          return null;
        var e9 = t8 && t8.cacheMap;
        if (void 0 === e9)
          return /* @__PURE__ */ new Map();
        if (null !== e9) {
          var r4 = ["get", "set", "delete", "clear"].filter(function(t9) {
            return e9 && "function" != typeof e9[t9];
          });
          if (0 !== r4.length)
            throw TypeError("Custom cacheMap missing methods: " + r4.join(", "));
        }
        return e9;
      }(e8), this._batch = null, this.name = e8 && e8.name ? e8.name : null;
    }
    var e7 = t6.prototype;
    return e7.load = function(t7) {
      if (null == t7)
        throw TypeError("The loader.load() function must be called with a value, but got: " + String(t7) + ".");
      var e8 = function(t8) {
        var e9 = t8._batch;
        if (null !== e9 && !e9.hasDispatched && e9.keys.length < t8._maxBatchSize)
          return e9;
        var r5 = { hasDispatched: false, keys: [], callbacks: [] };
        return t8._batch = r5, t8._batchScheduleFn(function() {
          (function(t9, e10) {
            var r6;
            if (e10.hasDispatched = true, 0 === e10.keys.length) {
              a3(e10);
              return;
            }
            try {
              r6 = t9._batchLoadFn(e10.keys);
            } catch (r7) {
              return s4(t9, e10, TypeError("DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but the function errored synchronously: " + String(r7) + "."));
            }
            if (!r6 || "function" != typeof r6.then)
              return s4(t9, e10, TypeError("DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but the function did not return a Promise: " + String(r6) + "."));
            r6.then(function(t10) {
              if (!o4(t10))
                throw TypeError("DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but the function did not return a Promise of an Array: " + String(t10) + ".");
              if (t10.length !== e10.keys.length)
                throw TypeError("DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but the function did not return a Promise of an Array of the same length as the Array of keys.\n\nKeys:\n" + String(e10.keys) + "\n\nValues:\n" + String(t10));
              a3(e10);
              for (var r7 = 0; r7 < e10.callbacks.length; r7++) {
                var n6 = t10[r7];
                n6 instanceof Error ? e10.callbacks[r7].reject(n6) : e10.callbacks[r7].resolve(n6);
              }
            }).catch(function(r7) {
              s4(t9, e10, r7);
            });
          })(t8, r5);
        }), r5;
      }(this), r4 = this._cacheMap, n5 = this._cacheKeyFn(t7);
      if (r4) {
        var i4 = r4.get(n5);
        if (i4) {
          var u4 = e8.cacheHits || (e8.cacheHits = []);
          return new Promise(function(t8) {
            u4.push(function() {
              t8(i4);
            });
          });
        }
      }
      e8.keys.push(t7);
      var l4 = new Promise(function(t8, r5) {
        e8.callbacks.push({ resolve: t8, reject: r5 });
      });
      return r4 && r4.set(n5, l4), l4;
    }, e7.loadMany = function(t7) {
      if (!o4(t7))
        throw TypeError("The loader.loadMany() function must be called with Array<key> but got: " + t7 + ".");
      for (var e8 = [], r4 = 0; r4 < t7.length; r4++)
        e8.push(this.load(t7[r4]).catch(function(t8) {
          return t8;
        }));
      return Promise.all(e8);
    }, e7.clear = function(t7) {
      var e8 = this._cacheMap;
      if (e8) {
        var r4 = this._cacheKeyFn(t7);
        e8.delete(r4);
      }
      return this;
    }, e7.clearAll = function() {
      var t7 = this._cacheMap;
      return t7 && t7.clear(), this;
    }, e7.prime = function(t7, e8) {
      var r4 = this._cacheMap;
      if (r4) {
        var n5, i4 = this._cacheKeyFn(t7);
        void 0 === r4.get(i4) && (e8 instanceof Error ? (n5 = Promise.reject(e8)).catch(function() {
        }) : n5 = Promise.resolve(e8), r4.set(i4, n5));
      }
      return this;
    }, t6;
  }(), i3 = "object" == typeof process && "function" == typeof process.nextTick ? function(t6) {
    r3 || (r3 = Promise.resolve()), r3.then(function() {
      process.nextTick(t6);
    });
  } : "function" == typeof setImmediate ? function(t6) {
    setImmediate(t6);
  } : function(t6) {
    setTimeout(t6);
  };
  function s4(t6, e7, r4) {
    a3(e7);
    for (var n5 = 0; n5 < e7.keys.length; n5++)
      t6.clear(e7.keys[n5]), e7.callbacks[n5].reject(r4);
  }
  function a3(t6) {
    if (t6.cacheHits)
      for (var e7 = 0; e7 < t6.cacheHits.length; e7++)
        t6.cacheHits[e7]();
  }
  function o4(t6) {
    return "object" == typeof t6 && null !== t6 && "number" == typeof t6.length && (0 === t6.length || t6.length > 0 && Object.prototype.hasOwnProperty.call(t6, t6.length - 1));
  }
  e6.exports = n4;
} });
var d = h(f(), 1);
var g = { Uint8: 1, Uint16: 2, Uint32: 4, BigUint64: 8, Int8: 1, Int16: 2, Int32: 4, BigInt64: 8, Float32: 4, Float64: 8 };
var p = class {
  getOffset() {
    return this.offset;
  }
  ensureLength(t5) {
    let e6 = this.bytes.length;
    if (!(this.offset + t5 <= e6))
      throw Error("Reading out of bounds");
  }
  readUint8() {
    let t5 = g.Uint8;
    this.ensureLength(t5);
    let e6 = this.view.getUint8(this.offset);
    return this.offset += t5, e6;
  }
  readUint16() {
    let t5 = g.Uint16;
    this.ensureLength(t5);
    let e6 = this.view.getUint16(this.offset);
    return this.offset += t5, e6;
  }
  readUint32() {
    let t5 = g.Uint32;
    this.ensureLength(t5);
    let e6 = this.view.getUint32(this.offset);
    return this.offset += t5, e6;
  }
  readUint64() {
    let t5 = this.readBigUint64();
    return Number(t5);
  }
  readBigUint64() {
    let t5 = g.BigUint64;
    this.ensureLength(t5);
    let e6 = this.view.getBigUint64(this.offset);
    return this.offset += t5, e6;
  }
  readInt8() {
    let t5 = g.Int8;
    this.ensureLength(t5);
    let e6 = this.view.getInt8(this.offset);
    return this.offset += t5, e6;
  }
  readInt16() {
    let t5 = g.Int16;
    this.ensureLength(t5);
    let e6 = this.view.getInt16(this.offset);
    return this.offset += t5, e6;
  }
  readInt32() {
    let t5 = g.Int32;
    this.ensureLength(t5);
    let e6 = this.view.getInt32(this.offset);
    return this.offset += t5, e6;
  }
  readInt64() {
    let t5 = this.readBigInt64();
    return Number(t5);
  }
  readBigInt64() {
    let t5 = g.BigInt64;
    this.ensureLength(t5);
    let e6 = this.view.getBigInt64(this.offset);
    return this.offset += t5, e6;
  }
  readFloat32() {
    let t5 = g.Float32;
    this.ensureLength(t5);
    let e6 = this.view.getFloat32(this.offset);
    return this.offset += t5, e6;
  }
  readFloat64() {
    let t5 = g.Float64;
    this.ensureLength(t5);
    let e6 = this.view.getFloat64(this.offset);
    return this.offset += t5, e6;
  }
  readBytes(t5) {
    let e6 = this.offset, r3 = e6 + t5, n4 = this.bytes.subarray(e6, r3);
    return this.offset = r3, n4;
  }
  readString() {
    let t5 = this.readUint32(), e6 = this.readBytes(t5);
    return this.decoder.decode(e6);
  }
  readJson() {
    let t5 = this.readString();
    return JSON.parse(t5);
  }
  constructor(t5) {
    this.bytes = t5, c(this, "offset", 0), c(this, "view"), c(this, "decoder", new TextDecoder()), this.view = v(this.bytes);
  }
};
function v(t5) {
  return new DataView(t5.buffer, t5.byteOffset, t5.byteLength);
}
var m = "undefined" != typeof __dai_window;
var w = m && "function" == typeof __dai_window.requestIdleCallback;
function I(t5, ...e6) {
  if (!t5)
    throw Error("Assertion Error" + (e6.length > 0 ? ": " + e6.join(" ") : ""));
}
function b(t5) {
  throw Error(`Unexpected value: ${t5}`);
}
var U = 1024;
var S = 1.5;
var k = (t5) => 2 ** t5 - 1;
var L = (t5) => -(2 ** (t5 - 1));
var B = (t5) => 2 ** (t5 - 1) - 1;
var E = { Uint8: 0, Uint16: 0, Uint32: 0, Uint64: 0, BigUint64: 0, Int8: L(8), Int16: L(16), Int32: L(32), Int64: Number.MIN_SAFE_INTEGER, BigInt64: -(BigInt(2) ** BigInt(63)) };
var M = { Uint8: k(8), Uint16: k(16), Uint32: k(32), Uint64: Number.MAX_SAFE_INTEGER, BigUint64: BigInt(2) ** BigInt(64) - BigInt(1), Int8: B(8), Int16: B(16), Int32: B(32), Int64: Number.MAX_SAFE_INTEGER, BigInt64: BigInt(2) ** BigInt(63) - BigInt(1) };
function T(t5, e6, r3, n4) {
  I(t5 >= e6, t5, "outside lower bound for", n4), I(t5 <= r3, t5, "outside upper bound for", n4);
}
var F = class {
  getOffset() {
    return this.offset;
  }
  slice(t5 = 0, e6 = this.offset) {
    return this.bytes.slice(t5, e6);
  }
  subarray(t5 = 0, e6 = this.offset) {
    return this.bytes.subarray(t5, e6);
  }
  ensureLength(t5) {
    let e6 = this.bytes.length;
    if (this.offset + t5 <= e6)
      return;
    let r3 = new Uint8Array(Math.ceil(e6 * S) + t5);
    r3.set(this.bytes), this.bytes = r3, this.view = v(r3);
  }
  writeUint8(t5) {
    T(t5, E.Uint8, M.Uint8, "Uint8");
    let e6 = g.Uint8;
    this.ensureLength(e6), this.view.setUint8(this.offset, t5), this.offset += e6;
  }
  writeUint16(t5) {
    T(t5, E.Uint16, M.Uint16, "Uint16");
    let e6 = g.Uint16;
    this.ensureLength(e6), this.view.setUint16(this.offset, t5), this.offset += e6;
  }
  writeUint32(t5) {
    T(t5, E.Uint32, M.Uint32, "Uint32");
    let e6 = g.Uint32;
    this.ensureLength(e6), this.view.setUint32(this.offset, t5), this.offset += e6;
  }
  writeUint64(t5) {
    T(t5, E.Uint64, M.Uint64, "Uint64");
    let e6 = BigInt(t5);
    this.writeBigUint64(e6);
  }
  writeBigUint64(t5) {
    T(t5, E.BigUint64, M.BigUint64, "BigUint64");
    let e6 = g.BigUint64;
    this.ensureLength(e6), this.view.setBigUint64(this.offset, t5), this.offset += e6;
  }
  writeInt8(t5) {
    T(t5, E.Int8, M.Int8, "Int8");
    let e6 = g.Int8;
    this.ensureLength(e6), this.view.setInt8(this.offset, t5), this.offset += e6;
  }
  writeInt16(t5) {
    T(t5, E.Int16, M.Int16, "Int16");
    let e6 = g.Int16;
    this.ensureLength(e6), this.view.setInt16(this.offset, t5), this.offset += e6;
  }
  writeInt32(t5) {
    T(t5, E.Int32, M.Int32, "Int32");
    let e6 = g.Int32;
    this.ensureLength(e6), this.view.setInt32(this.offset, t5), this.offset += e6;
  }
  writeInt64(t5) {
    T(t5, E.Int64, M.Int64, "Int64");
    let e6 = BigInt(t5);
    this.writeBigInt64(e6);
  }
  writeBigInt64(t5) {
    T(t5, E.BigInt64, M.BigInt64, "BigInt64");
    let e6 = g.BigInt64;
    this.ensureLength(e6), this.view.setBigInt64(this.offset, t5), this.offset += e6;
  }
  writeFloat32(t5) {
    let e6 = g.Float32;
    this.ensureLength(e6), this.view.setFloat32(this.offset, t5), this.offset += e6;
  }
  writeFloat64(t5) {
    let e6 = g.Float64;
    this.ensureLength(e6), this.view.setFloat64(this.offset, t5), this.offset += e6;
  }
  writeBytes(t5) {
    let e6 = t5.length;
    this.ensureLength(e6), this.bytes.set(t5, this.offset), this.offset += e6;
  }
  encodeString(t5) {
    let e6 = this.encodedStrings.get(t5);
    if (e6)
      return e6;
    let r3 = this.encoder.encode(t5);
    return this.encodedStrings.set(t5, r3), r3;
  }
  writeString(t5) {
    let e6 = this.encodeString(t5), r3 = e6.length;
    this.writeUint32(r3), this.writeBytes(e6);
  }
  writeJson(t5) {
    let e6 = JSON.stringify(t5);
    this.writeString(e6);
  }
  constructor() {
    c(this, "offset", 0), c(this, "bytes", new Uint8Array(U)), c(this, "view", v(this.bytes)), c(this, "encoder", new TextEncoder()), c(this, "encodedStrings", /* @__PURE__ */ new Map());
  }
};
function x(t5) {
  return "string" == typeof t5;
}
function N(t5) {
  return Number.isFinite(t5);
}
function A(t5) {
  return null === t5;
}
var O = class t2 {
  static fromString(e6) {
    let [r3, n4, i3] = e6.split("/").map(Number);
    return I(N(r3), "Invalid chunkId"), I(N(n4), "Invalid offset"), I(N(i3), "Invalid length"), new t2(r3, n4, i3);
  }
  toString() {
    return `${this.chunkId}/${this.offset}/${this.length}`;
  }
  static read(e6) {
    let r3 = e6.readUint16(), n4 = e6.readUint32(), i3 = e6.readUint32();
    return new t2(r3, n4, i3);
  }
  write(t5) {
    t5.writeUint16(this.chunkId), t5.writeUint32(this.offset), t5.writeUint32(this.length);
  }
  compare(t5) {
    return this.chunkId < t5.chunkId ? -1 : this.chunkId > t5.chunkId ? 1 : this.offset < t5.offset ? -1 : this.offset > t5.offset ? 1 : (I(this.length === t5.length), 0);
  }
  constructor(t5, e6, r3) {
    this.chunkId = t5, this.offset = e6, this.length = r3;
  }
};
function R(t5) {
  if (A(t5))
    return 0;
  switch (t5.type) {
    case P.Array:
      return 1;
    case P.Boolean:
      return 2;
    case P.Color:
      return 3;
    case P.Date:
      return 4;
    case P.Enum:
      return 5;
    case P.File:
      return 6;
    case P.ResponsiveImage:
      return 10;
    case P.Link:
      return 7;
    case P.Number:
      return 8;
    case P.Object:
      return 9;
    case P.RichText:
      return 11;
    case P.String:
      return 12;
    case P.VectorSetItem:
      return 13;
    default:
      b(t5);
  }
}
function q(e6) {
  let r3 = e6.readUint16(), n4 = [];
  for (let i3 = 0; i3 < r3; i3++) {
    let r4 = t.read(e6);
    n4.push(r4);
  }
  return { type: P.Array, value: n4 };
}
function _(e6, r3) {
  for (let n4 of (e6.writeUint16(r3.value.length), r3.value))
    t.write(e6, n4);
}
function D(e6, r3, n4) {
  let i3 = e6.value.length, s4 = r3.value.length;
  if (i3 < s4)
    return -1;
  if (i3 > s4)
    return 1;
  for (let s5 = 0; s5 < i3; s5++) {
    let i4 = e6.value[s5], a3 = r3.value[s5], o4 = t.compare(i4, a3, n4);
    if (0 !== o4)
      return o4;
  }
  return 0;
}
function j(t5) {
  return { type: P.Boolean, value: 0 !== t5.readUint8() };
}
function C(t5, e6) {
  t5.writeUint8(e6.value ? 1 : 0);
}
function J(t5, e6) {
  return t5.value < e6.value ? -1 : t5.value > e6.value ? 1 : 0;
}
function V(t5) {
  return { type: P.Color, value: t5.readString() };
}
function W(t5, e6) {
  t5.writeString(e6.value);
}
function $(t5, e6) {
  return t5.value < e6.value ? -1 : t5.value > e6.value ? 1 : 0;
}
function z(t5) {
  let e6 = t5.readInt64(), r3 = new Date(e6);
  return { type: P.Date, value: r3.toISOString() };
}
function G(t5, e6) {
  let r3 = new Date(e6.value), n4 = r3.getTime();
  t5.writeInt64(n4);
}
function K(t5, e6) {
  let r3 = new Date(t5.value), n4 = new Date(e6.value);
  return r3 < n4 ? -1 : r3 > n4 ? 1 : 0;
}
function H(t5) {
  return { type: P.Enum, value: t5.readString() };
}
function X(t5, e6) {
  t5.writeString(e6.value);
}
function Q(t5, e6) {
  return t5.value < e6.value ? -1 : t5.value > e6.value ? 1 : 0;
}
function Y(t5) {
  return { type: P.File, value: t5.readString() };
}
function Z(t5, e6) {
  t5.writeString(e6.value);
}
function tt(t5, e6) {
  return t5.value < e6.value ? -1 : t5.value > e6.value ? 1 : 0;
}
function te(t5) {
  return { type: P.Link, value: t5.readJson() };
}
function tr(t5, e6) {
  t5.writeJson(e6.value);
}
function tn(t5, e6) {
  let r3 = JSON.stringify(t5.value), n4 = JSON.stringify(e6.value);
  return r3 < n4 ? -1 : r3 > n4 ? 1 : 0;
}
function ti(t5) {
  return { type: P.Number, value: t5.readFloat64() };
}
function ts(t5, e6) {
  t5.writeFloat64(e6.value);
}
function ta(t5, e6) {
  return t5.value < e6.value ? -1 : t5.value > e6.value ? 1 : 0;
}
function to(e6) {
  let r3 = e6.readUint16(), n4 = {};
  for (let i3 = 0; i3 < r3; i3++) {
    let r4 = e6.readString();
    n4[r4] = t.read(e6);
  }
  return { type: P.Object, value: n4 };
}
function tu(e6, r3) {
  let n4 = Object.entries(r3.value);
  for (let [r4, i3] of (e6.writeUint16(n4.length), n4))
    e6.writeString(r4), t.write(e6, i3);
}
function tl(e6, r3, n4) {
  let i3 = Object.keys(e6.value).sort(), s4 = Object.keys(r3.value).sort();
  if (i3.length < s4.length)
    return -1;
  if (i3.length > s4.length)
    return 1;
  for (let a3 = 0; a3 < i3.length; a3++) {
    let o4 = i3[a3], u4 = s4[a3];
    if (o4 < u4)
      return -1;
    if (o4 > u4)
      return 1;
    let l4 = e6.value[o4] ?? null, h3 = r3.value[u4] ?? null, c4 = t.compare(l4, h3, n4);
    if (0 !== c4)
      return c4;
  }
  return 0;
}
function th(t5) {
  return { type: P.ResponsiveImage, value: t5.readJson() };
}
function tc(t5, e6) {
  t5.writeJson(e6.value);
}
function tf(t5, e6) {
  let r3 = JSON.stringify(t5.value), n4 = JSON.stringify(e6.value);
  return r3 < n4 ? -1 : r3 > n4 ? 1 : 0;
}
function td(t5) {
  let e6 = t5.readInt8();
  if (0 === e6)
    return { type: P.RichText, value: t5.readUint32() };
  if (1 === e6)
    return { type: P.RichText, value: t5.readString() };
  throw Error("Invalid rich text pointer");
}
function tg(t5, e6) {
  if (N(e6.value)) {
    t5.writeInt8(0), t5.writeUint32(e6.value);
    return;
  }
  if (x(e6.value)) {
    t5.writeInt8(1), t5.writeString(e6.value);
    return;
  }
  throw Error("Invalid rich text pointer");
}
function tp(t5, e6) {
  let r3 = t5.value, n4 = e6.value;
  if (N(r3) && N(n4) || x(r3) && x(n4))
    return r3 < n4 ? -1 : r3 > n4 ? 1 : 0;
  throw Error("Invalid rich text pointer");
}
function tv(t5) {
  return { type: P.String, value: t5.readString() };
}
function ty(t5, e6) {
  t5.writeString(e6.value);
}
function tm(t5, e6, r3) {
  let n4 = t5.value, i3 = e6.value;
  return (0 === r3.type && (n4 = t5.value.toLowerCase(), i3 = e6.value.toLowerCase()), n4 < i3) ? -1 : n4 > i3 ? 1 : 0;
}
function tw(t5) {
  return { type: P.VectorSetItem, value: t5.readUint32() };
}
function tI(t5, e6) {
  t5.writeUint32(e6.value);
}
function tb(t5, e6) {
  let r3 = t5.value, n4 = e6.value;
  return r3 < n4 ? -1 : r3 > n4 ? 1 : 0;
}
((t5) => {
  t5.read = function(t6) {
    let e6 = t6.readUint8();
    switch (e6) {
      case 0:
        return null;
      case 1:
        return q(t6);
      case 2:
        return j(t6);
      case 3:
        return V(t6);
      case 4:
        return z(t6);
      case 5:
        return H(t6);
      case 6:
        return Y(t6);
      case 7:
        return te(t6);
      case 8:
        return ti(t6);
      case 9:
        return to(t6);
      case 10:
        return th(t6);
      case 11:
        return td(t6);
      case 12:
        return tv(t6);
      case 13:
        return tw(t6);
      default:
        b(e6);
    }
  }, t5.write = function(t6, e6) {
    let r3 = R(e6);
    if (t6.writeUint8(r3), !A(e6))
      switch (e6.type) {
        case P.Array:
          return _(t6, e6);
        case P.Boolean:
          return C(t6, e6);
        case P.Color:
          return W(t6, e6);
        case P.Date:
          return G(t6, e6);
        case P.Enum:
          return X(t6, e6);
        case P.File:
          return Z(t6, e6);
        case P.Link:
          return tr(t6, e6);
        case P.Number:
          return ts(t6, e6);
        case P.Object:
          return tu(t6, e6);
        case P.ResponsiveImage:
          return tc(t6, e6);
        case P.RichText:
          return tg(t6, e6);
        case P.VectorSetItem:
          return tI(t6, e6);
        case P.String:
          return ty(t6, e6);
        default:
          b(e6);
      }
  }, t5.compare = function(t6, e6, r3) {
    let n4 = R(t6), i3 = R(e6);
    if (n4 < i3)
      return -1;
    if (n4 > i3)
      return 1;
    if (A(t6) || A(e6))
      return 0;
    switch (t6.type) {
      case P.Array:
        return I(e6.type === P.Array), D(t6, e6, r3);
      case P.Boolean:
        return I(e6.type === P.Boolean), J(t6, e6);
      case P.Color:
        return I(e6.type === P.Color), $(t6, e6);
      case P.Date:
        return I(e6.type === P.Date), K(t6, e6);
      case P.Enum:
        return I(e6.type === P.Enum), Q(t6, e6);
      case P.File:
        return I(e6.type === P.File), tt(t6, e6);
      case P.Link:
        return I(e6.type === P.Link), tn(t6, e6);
      case P.Number:
        return I(e6.type === P.Number), ta(t6, e6);
      case P.Object:
        return I(e6.type === P.Object), tl(t6, e6, r3);
      case P.ResponsiveImage:
        return I(e6.type === P.ResponsiveImage), tf(t6, e6);
      case P.RichText:
        return I(e6.type === P.RichText), tp(t6, e6);
      case P.VectorSetItem:
        return I(e6.type === P.VectorSetItem), tb(t6, e6);
      case P.String:
        return I(e6.type === P.String), tm(t6, e6, r3);
      default:
        b(t6);
    }
  };
})(t || (t = {}));
var tU = class e2 {
  sortEntries() {
    this.entries.sort((e6, r3) => {
      for (let n4 = 0; n4 < this.fieldNames.length; n4++) {
        let i3 = e6.values[n4], s4 = r3.values[n4], a3 = t.compare(i3, s4, this.options.collation);
        if (0 !== a3)
          return a3;
      }
      return e6.pointer.compare(r3.pointer);
    });
  }
  static deserialize(r3) {
    let n4 = new p(r3), i3 = n4.readJson(), s4 = n4.readUint8(), a3 = [];
    for (let t5 = 0; t5 < s4; t5++) {
      let t6 = n4.readString();
      a3.push(t6);
    }
    let o4 = new e2(a3, { collation: i3 }), u4 = n4.readUint32();
    for (let e6 = 0; e6 < u4; e6++) {
      let e7 = [];
      for (let r5 = 0; r5 < s4; r5++) {
        let r6 = t.read(n4);
        e7.push(r6);
      }
      let r4 = O.read(n4);
      o4.entries.push({ values: e7, pointer: r4 });
    }
    return o4;
  }
  serialize() {
    let e6 = new F();
    for (let t5 of (e6.writeJson(this.options.collation), e6.writeUint8(this.fieldNames.length), this.fieldNames))
      e6.writeString(t5);
    for (let r3 of (this.sortEntries(), e6.writeUint32(this.entries.length), this.entries)) {
      let { values: n4, pointer: i3 } = r3;
      for (let r4 of n4)
        t.write(e6, r4);
      i3.write(e6);
    }
    return e6.subarray();
  }
  addItem(t5, e6) {
    let r3 = this.fieldNames.map((e7) => t5.getField(e7) ?? null);
    this.entries.push({ values: r3, pointer: e6 });
  }
  constructor(t5, e6) {
    this.fieldNames = t5, this.options = e6, c(this, "entries", []);
  }
};
var tS = 3;
var tk = 250;
var tL = [
  408,
  // Request Timeout
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
];
var tB = async (t5, e6) => {
  let r3 = 0;
  for (; ; ) {
    try {
      let n4 = await fetch(t5, e6);
      if (!tL.includes(n4.status) || ++r3 > tS)
        return n4;
    } catch (t6) {
      if (e6?.signal?.aborted || ++r3 > tS)
        throw t6;
    }
    await tE(r3);
  }
};
async function tE(t5) {
  let e6 = Math.floor(tk * (Math.random() + 1) * 2 ** (t5 - 1));
  await new Promise((t6) => {
    setTimeout(t6, e6);
  });
}
async function tM(t5, e6) {
  let r3 = tx(e6), n4 = [], i3 = 0;
  for (let t6 of r3)
    n4.push(`${t6.from}-${t6.to - 1}`), i3 += t6.to - t6.from;
  let s4 = new URL(t5), a3 = n4.join(",");
  s4.searchParams.set("range", a3);
  let o4 = await tB(s4);
  if (200 !== o4.status)
    throw Error(`Request failed: ${o4.status} ${o4.statusText}`);
  let u4 = await o4.arrayBuffer(), l4 = new Uint8Array(u4);
  if (l4.length !== i3)
    throw Error("Request failed: Unexpected response length");
  let h3 = new tT(), c4 = 0;
  for (let t6 of r3) {
    let e7 = t6.to - t6.from, r4 = c4 + e7, n5 = l4.subarray(c4, r4);
    h3.write(t6.from, n5), c4 = r4;
  }
  return e6.map((t6) => h3.read(t6.from, t6.to - t6.from));
}
var tT = class {
  read(t5, e6) {
    for (let r3 of this.chunks) {
      if (t5 < r3.start)
        break;
      if (t5 > r3.end)
        continue;
      if (t5 + e6 > r3.end)
        break;
      let n4 = t5 - r3.start, i3 = n4 + e6;
      return r3.data.slice(n4, i3);
    }
    throw Error("Missing data");
  }
  write(t5, e6) {
    let r3 = t5, n4 = r3 + e6.length, i3 = 0, s4 = this.chunks.length;
    for (; i3 < s4; i3++) {
      let t6 = this.chunks[i3];
      if (I(t6, "Missing chunk"), !(r3 > t6.end)) {
        if (r3 > t6.start) {
          let n5 = r3 - t6.start, i4 = t6.data.subarray(0, n5);
          e6 = tF(i4, e6), r3 = t6.start;
        }
        break;
      }
    }
    for (; s4 > i3; s4--) {
      let t6 = this.chunks[s4 - 1];
      if (I(t6, "Missing chunk"), !(n4 < t6.start)) {
        if (n4 < t6.end) {
          let r4 = n4 - t6.start, i4 = t6.data.subarray(r4);
          e6 = tF(e6, i4), n4 = t6.end;
        }
        break;
      }
    }
    let a3 = { start: r3, end: n4, data: e6 }, o4 = s4 - i3;
    this.chunks.splice(i3, o4, a3);
  }
  constructor() {
    c(this, "chunks", []);
  }
};
function tF(t5, e6) {
  let r3 = t5.length + e6.length, n4 = new Uint8Array(r3);
  return n4.set(t5, 0), n4.set(e6, t5.length), n4;
}
function tx(t5) {
  I(t5.length > 0, "Must have at least one range");
  let e6 = [...t5].sort((t6, e7) => t6.from - e7.from), r3 = [];
  for (let t6 of e6) {
    let e7 = r3.length - 1, n4 = r3[e7];
    n4 && t6.from <= n4.to ? r3[e7] = { from: n4.from, to: Math.max(n4.to, t6.to) } : r3.push(t6);
  }
  return r3;
}
var tN = class {
  async loadModel() {
    let [t5] = await tM(this.options.url, [this.options.range]);
    return I(t5, "Failed to load model"), tU.deserialize(t5);
  }
  async getModel() {
    return this.modelPromise ?? (this.modelPromise = this.loadModel()), this.model ?? (this.model = await this.modelPromise), this.model;
  }
  async lookupItems(t5) {
    I(t5.length === this.fields.length, "Invalid query length");
    let e6 = await this.getModel(), r3 = t5.reduce((t6, e7, r4) => t6.flatMap((t7) => {
      switch (e7.type) {
        case "All":
          return [t7];
        case "Equals":
          return this.queryEquals(t7, e7, r4);
        case "NotEquals":
          return this.queryNotEquals(t7, e7, r4);
        case "LessThan":
          return this.queryLessThan(t7, e7, r4);
        case "GreaterThan":
          return this.queryGreaterThan(t7, e7, r4);
        case "Contains":
          return this.queryContains(t7, e7, r4);
        case "StartsWith":
          return this.queryStartsWith(t7, e7, r4);
        case "EndsWith":
          return this.queryEndsWith(t7, e7, r4);
        default:
          b(e7);
      }
    }), [e6.entries]), n4 = [];
    for (let t6 of r3)
      for (let e7 of t6) {
        let t7 = {};
        for (let r4 = 0; r4 < this.options.fieldNames.length; r4++) {
          let n5 = this.options.fieldNames[r4], i3 = e7.values[r4];
          t7[n5] = i3;
        }
        n4.push({ pointer: e7.pointer.toString(), data: t7 });
      }
    return n4;
  }
  queryEquals(t5, e6, r3) {
    let n4 = this.getLeftMost(t5, r3, e6.value), i3 = this.getRightMost(t5, r3, e6.value), s4 = t5.slice(n4, i3 + 1);
    return s4.length > 0 ? [s4] : [];
  }
  queryNotEquals(t5, e6, r3) {
    let n4 = this.getLeftMost(t5, r3, e6.value), i3 = this.getRightMost(t5, r3, e6.value), s4 = [], a3 = t5.slice(0, n4);
    a3.length > 0 && s4.push(a3);
    let o4 = t5.slice(i3 + 1);
    return o4.length > 0 && s4.push(o4), s4;
  }
  queryLessThan(t5, e6, r3) {
    let n4 = this.getRightMost(t5, r3, null);
    if (t5 = t5.slice(n4 + 1), e6.inclusive) {
      let n5 = this.getRightMost(t5, r3, e6.value), i4 = t5.slice(0, n5 + 1);
      return i4.length > 0 ? [i4] : [];
    }
    let i3 = this.getLeftMost(t5, r3, e6.value), s4 = t5.slice(0, i3);
    return s4.length > 0 ? [s4] : [];
  }
  queryGreaterThan(t5, e6, r3) {
    let n4 = this.getRightMost(t5, r3, null);
    if (t5 = t5.slice(n4 + 1), e6.inclusive) {
      let n5 = this.getLeftMost(t5, r3, e6.value), i4 = t5.slice(n5);
      return i4.length > 0 ? [i4] : [];
    }
    let i3 = this.getRightMost(t5, r3, e6.value), s4 = t5.slice(i3 + 1);
    return s4.length > 0 ? [s4] : [];
  }
  queryContains(t5, e6, r3) {
    return this.findItems(t5, r3, (t6) => {
      if (t6?.type !== y.String || e6.value?.type !== y.String)
        return false;
      let r4 = t6.value, n4 = e6.value.value;
      return 0 === this.collation.type && (r4 = r4.toLowerCase(), n4 = n4.toLowerCase()), r4.includes(n4);
    });
  }
  queryStartsWith(t5, e6, r3) {
    return this.findItems(t5, r3, (t6) => {
      if (t6?.type !== y.String || e6.value?.type !== y.String)
        return false;
      let r4 = t6.value, n4 = e6.value.value;
      return 0 === this.collation.type && (r4 = r4.toLowerCase(), n4 = n4.toLowerCase()), r4.startsWith(n4);
    });
  }
  queryEndsWith(t5, e6, r3) {
    return this.findItems(t5, r3, (t6) => {
      if (t6?.type !== y.String || e6.value?.type !== y.String)
        return false;
      let r4 = t6.value, n4 = e6.value.value;
      return 0 === this.collation.type && (r4 = r4.toLowerCase(), n4 = n4.toLowerCase()), r4.endsWith(n4);
    });
  }
  /**
  * Returns the index of the left most entry that is equal to the target.
  *
  * ```text
  *   Left most
  *       ↓
  * ┌───┬───┬───┬───┬───┬───┐
  * │ 1 │ 2 │ 2 │ 2 │ 2 │ 3 │
  * └───┴───┴───┴───┴───┴───┘
  * ```
  *
  * @param entries The entries array to search in.
  * @param position The position of the value in the entry.
  * @param target The target value to search for.
  * @returns The index of the left most entry that is equal to the target.
  */
  getLeftMost(e6, r3, n4) {
    let i3 = 0, s4 = e6.length;
    for (; i3 < s4; ) {
      let a3 = i3 + s4 >> 1, o4 = e6[a3], u4 = o4.values[r3];
      0 > t.compare(u4, n4, this.collation) ? i3 = a3 + 1 : s4 = a3;
    }
    return i3;
  }
  /**
  * Returns the index of the right most entry that is equal to the target.
  *
  * ```text
  *              Right most
  *                   ↓
  * ┌───┬───┬───┬───┬───┬───┐
  * │ 1 │ 2 │ 2 │ 2 │ 2 │ 3 │
  * └───┴───┴───┴───┴───┴───┘
  * ```
  *
  * @param entries The entries array to search in.
  * @param position The position of the value in the entry.
  * @param target The target value to search for.
  * @returns The index of the right most entry that is equal to the target.
  */
  getRightMost(e6, r3, n4) {
    let i3 = 0, s4 = e6.length;
    for (; i3 < s4; ) {
      let a3 = i3 + s4 >> 1, o4 = e6[a3], u4 = o4.values[r3];
      t.compare(u4, n4, this.collation) > 0 ? s4 = a3 : i3 = a3 + 1;
    }
    return s4 - 1;
  }
  /**
  * Finds all items that are matching the predicate and groups adjacent items together.
  *
  * @param entries The entries array to search in.
  * @param position The position of the value in the entry.
  * @param predicate The predicate to match the values against.
  * @returns An array of chunks that match the predicate.
  */
  findItems(t5, e6, r3) {
    let n4 = [], i3 = 0;
    for (let s4 = 0; s4 < t5.length; s4++) {
      let a3 = t5[s4], o4 = a3.values[e6], u4 = r3(o4);
      if (!u4) {
        if (i3 < s4) {
          let e7 = t5.slice(i3, s4);
          n4.push(e7);
        }
        i3 = s4 + 1;
      }
    }
    if (i3 < t5.length) {
      let e7 = t5.slice(i3);
      n4.push(e7);
    }
    return n4;
  }
  constructor(t5) {
    this.options = t5, c(this, "schema"), c(this, "fields"), c(this, "supportedLookupTypes", [
      "All",
      "Equals",
      "NotEquals",
      "LessThan",
      "GreaterThan",
      "Contains",
      "StartsWith",
      "EndsWith"
      /* EndsWith */
    ]), c(this, "modelPromise"), c(this, "model"), c(this, "collation");
    let e6 = {}, r3 = [];
    for (let t6 of this.options.fieldNames) {
      let n4 = this.options.collectionSchema[t6];
      I(n4, "Missing definition for field", t6), e6[t6] = n4, r3.push({ type: "Identifier", name: t6 });
    }
    this.schema = e6, this.fields = r3, this.collation = this.options.collation;
  }
};
var tA = class e3 {
  static read(r3) {
    let n4 = new e3(), i3 = r3.readUint16();
    for (let e6 = 0; e6 < i3; e6++) {
      let e7 = r3.readString(), i4 = t.read(r3);
      n4.setField(e7, i4);
    }
    return n4;
  }
  write(e6) {
    for (let [r3, n4] of (e6.writeUint16(this.fields.size), this.fields))
      e6.writeString(r3), t.write(e6, n4);
  }
  getData() {
    let t5 = {};
    for (let [e6, r3] of this.fields)
      t5[e6] = r3;
    return t5;
  }
  setField(t5, e6) {
    this.fields.set(t5, e6);
  }
  getField(t5) {
    return this.fields.get(t5);
  }
  constructor() {
    c(this, "fields", /* @__PURE__ */ new Map());
  }
};
var tO = class {
  scanItems() {
    return this.itemsPromise ?? (this.itemsPromise = tB(this.url).then(async (t5) => {
      if (!t5.ok)
        throw Error(`Request failed: ${t5.status} ${t5.statusText}`);
      let e6 = await t5.arrayBuffer(), r3 = new Uint8Array(e6), n4 = new p(r3), i3 = [], s4 = n4.readUint32();
      for (let t6 = 0; t6 < s4; t6++) {
        let t7 = n4.getOffset(), e7 = tA.read(n4), r4 = n4.getOffset() - t7, s5 = new O(this.id, t7, r4), a3 = s5.toString(), o4 = { pointer: a3, data: e7.getData() };
        this.itemLoader.prime(a3, o4), i3.push(o4);
      }
      return i3;
    })), this.itemsPromise;
  }
  resolveItem(t5) {
    return this.itemLoader.load(t5);
  }
  constructor(t5, e6) {
    this.id = t5, this.url = e6, c(this, "itemsPromise"), c(this, "itemLoader", new d.default(async (t6) => {
      let e7 = t6.map((t7) => {
        let e8 = O.fromString(t7);
        return { from: e8.offset, to: e8.offset + e8.length };
      }), r3 = await tM(this.url, e7);
      return r3.map((e8, r4) => {
        let n4 = new p(e8), i3 = tA.read(n4), s4 = t6[r4];
        return I(s4, "Missing pointer"), { pointer: s4, data: i3.getData() };
      });
    }, { maxBatchSize: 250 }));
  }
};
var tP = class {
  async scanItems() {
    let t5 = await Promise.all(this.chunks.map(async (t6) => t6.scanItems()));
    return t5.flat();
  }
  resolveItems(t5) {
    return Promise.all(t5.map((t6) => {
      let e6 = O.fromString(t6), r3 = this.chunks[e6.chunkId];
      return I(r3, "Missing chunk"), r3.resolveItem(t6);
    }));
  }
  compareItems(t5, e6) {
    let r3 = O.fromString(t5.pointer), n4 = O.fromString(e6.pointer);
    return r3.compare(n4);
  }
  compareValues(e6, r3, n4) {
    return t.compare(e6, r3, n4);
  }
  constructor(t5) {
    this.options = t5, c(this, "id"), c(this, "schema"), c(this, "indexes"), c(this, "resolveRichText"), c(this, "resolveVectorSetItem"), c(this, "chunks"), this.chunks = this.options.chunks.map((t6, e6) => new tO(e6, t6)), this.schema = t5.schema, this.indexes = t5.indexes, this.resolveRichText = t5.resolveRichText, this.resolveVectorSetItem = t5.resolveVectorSetItem, this.id = t5.id;
  }
};

// http-url:https://framerusercontent.com/modules/AfdNAFDqPZvubNcFJrwt/MAK9mRJvTXT9iGXX5xBd/ysqa11MKy-1.js
import { jsx as e4 } from "react/jsx-runtime";
import { AutoBreakpointVariant as t3, ComponentPresetsConsumer as r2, Link as n2, motion as o2 } from "./_framer-runtime.js";
import { isValidElement as i2 } from "react";
import { Fragment as p2, createElement as s2 } from "react";
var a2;
var l2 = "undefined" != typeof __dai_window;
var f2 = l2 && "function" == typeof __dai_window.requestIdleCallback;
var u2 = "preload";
function c2(e6) {
  return "object" == typeof e6 && null !== e6 && !/* @__PURE__ */ i2(e6) && u2 in e6;
}
function m2(e6, ...t5) {
  if (!e6)
    throw Error("Assertion Error" + (t5.length > 0 ? ": " + t5.join(" ") : ""));
}
var d2 = ((a2 = d2 || {})[a2.Fragment = 1] = "Fragment", a2[a2.Link = 2] = "Link", a2[a2.Module = 3] = "Module", a2[a2.Tag = 4] = "Tag", a2[a2.Text = 5] = "Text", a2);
function g2(i3) {
  let a3 = /* @__PURE__ */ new Map();
  return (l4) => {
    let f4 = a3.get(l4);
    if (f4)
      return f4;
    let u4 = JSON.parse(l4), d4 = function a4(l5) {
      switch (l5[0]) {
        case 1: {
          let [, ...e6] = l5, t5 = e6.map(a4);
          return /* @__PURE__ */ s2(p2, void 0, ...t5);
        }
        case 2: {
          let [, e6, ...t5] = l5, r3 = t5.map(a4);
          return /* @__PURE__ */ s2(n2, e6, ...r3);
        }
        case 3: {
          let [, n4, o4, f5, u5] = l5;
          for (let e6 of f5) {
            let t5 = o4[e6];
            t5 && (o4[e6] = a4(t5));
          }
          for (let e6 of u5) {
            let t5 = o4[e6];
            if ("string" != typeof t5)
              continue;
            let r3 = i3[t5];
            r3 && (c2(r3) && r3.preload(), o4[e6] = r3);
          }
          let p4 = i3[n4];
          return m2(p4, "Module not found"), c2(p4) && p4.preload(), /* @__PURE__ */ e4(r2, { componentIdentifier: n4, children: (r3) => /* @__PURE__ */ e4(t3, { component: p4, props: { ...r3, ...o4 } }) });
        }
        case 4: {
          let [, e6, t5, ...r3] = l5, n4 = r3.map(a4);
          if ("a" === e6)
            return /* @__PURE__ */ s2(o2.a, t5, ...n4);
          return /* @__PURE__ */ s2(e6, t5, ...n4);
        }
        case 5: {
          let [, e6] = l5;
          return e6;
        }
      }
    }(u4);
    return a3.set(l4, d4), d4;
  };
}

// http-url:https://framerusercontent.com/modules/AfdNAFDqPZvubNcFJrwt/MAK9mRJvTXT9iGXX5xBd/ysqa11MKy.js
var m3 = { AYlbiDb5i: { isNullable: true, type: l3.String }, BDvMFGdgf: { isNullable: true, type: l3.String }, Cqn7zXrt2: { isNullable: true, type: l3.RichText }, createdAt: { isNullable: true, type: l3.Date }, DUwgLv8de: { isNullable: true, type: l3.ResponsiveImage }, id: { isNullable: false, type: l3.String }, jwIgf6tBO: { isNullable: true, type: l3.ResponsiveImage }, kelY4xMsW: { isNullable: true, type: l3.String }, MdGfHiRoa: { isNullable: true, type: l3.ResponsiveImage }, mle5_OseC: { isNullable: true, type: l3.String }, moq7ENOXp: { isNullable: true, type: l3.ResponsiveImage }, N2sbwQtnk: { isNullable: true, type: l3.ResponsiveImage }, N6ZbQXHdN: { isNullable: true, type: l3.String }, nextItemId: { isNullable: true, type: l3.String }, previousItemId: { isNullable: true, type: l3.String }, tEiskHCQi: { isNullable: true, type: l3.String }, updatedAt: { isNullable: true, type: l3.Date }, y_oKHEKwv: { isNullable: true, type: l3.RichText } };
var o3 = ["id"];
var s3 = { type: 1 };
var n3 = ["previousItemId"];
var c3 = ["nextItemId"];
var d3 = ["id", "N6ZbQXHdN"];
var u3 = ["N6ZbQXHdN", "id"];
var f3 = ["MdGfHiRoa"];
var p3 = { type: 0 };
var y2 = ["AYlbiDb5i"];
var g3 = ["N6ZbQXHdN"];
var N2 = ["N2sbwQtnk"];
var w2 = ["mle5_OseC"];
var h2 = ["tEiskHCQi"];
var I2 = ["kelY4xMsW"];
var R2 = ["BDvMFGdgf"];
var b2 = ["Cqn7zXrt2"];
var S2 = ["moq7ENOXp"];
var x2 = ["DUwgLv8de"];
var M2 = ["jwIgf6tBO"];
var q2 = ["y_oKHEKwv"];
var v2 = [];
var K2 = (e6) => {
  let l4 = v2[e6];
  if (l4)
    return l4().then((e7) => e7.default);
};
var L2 = {};
var U2 = g2(L2);
var C2 = new t4();
var H2 = { collectionByLocaleId: { default: new tP({ chunks: [""], id: "4669c281-9008-42f2-9b08-ee6ada5a57dcdefault", indexes: [new tN({ collation: s3, collectionSchema: m3, fieldNames: o3, range: { from: 0, to: 121 }, url: "" }), new tN({ collation: s3, collectionSchema: m3, fieldNames: n3, range: { from: 121, to: 241 }, url: "" }), new tN({ collation: s3, collectionSchema: m3, fieldNames: c3, range: { from: 241, to: 357 }, url: "" }), new tN({ collation: s3, collectionSchema: m3, fieldNames: d3, range: { from: 357, to: 540 }, url: "" }), new tN({ collation: s3, collectionSchema: m3, fieldNames: u3, range: { from: 540, to: 723 }, url: "" }), new tN({ collation: p3, collectionSchema: m3, fieldNames: f3, range: { from: 723, to: 2889 }, url: "" }), new tN({ collation: p3, collectionSchema: m3, fieldNames: y2, range: { from: 2889, to: 3052 }, url: "" }), new tN({ collation: p3, collectionSchema: m3, fieldNames: g3, range: { from: 3052, to: 3173 }, url: "" }), new tN({ collation: p3, collectionSchema: m3, fieldNames: N2, range: { from: 3173, to: 5522 }, url: "" }), new tN({ collation: p3, collectionSchema: m3, fieldNames: w2, range: { from: 5522, to: 5779 }, url: "" }), new tN({ collation: p3, collectionSchema: m3, fieldNames: h2, range: { from: 5779, to: 5993 }, url: "" }), new tN({ collation: p3, collectionSchema: m3, fieldNames: I2, range: { from: 5993, to: 6130 }, url: "" }), new tN({ collation: p3, collectionSchema: m3, fieldNames: R2, range: { from: 6130, to: 6358 }, url: "" }), new tN({ collation: p3, collectionSchema: m3, fieldNames: b2, range: { from: 6358, to: 9556 }, url: "" }), new tN({ collation: p3, collectionSchema: m3, fieldNames: S2, range: { from: 9556, to: 11114 }, url: "" }), new tN({ collation: p3, collectionSchema: m3, fieldNames: x2, range: { from: 11114, to: 13365 }, url: "" }), new tN({ collation: p3, collectionSchema: m3, fieldNames: M2, range: { from: 13365, to: 15468 }, url: "" }), new tN({ collation: p3, collectionSchema: m3, fieldNames: q2, range: { from: 15468, to: 19539 }, url: "" })], resolveRichText: U2, resolveVectorSetItem: K2, schema: m3 }) }, displayName: "Destinations", id: "4669c281-9008-42f2-9b08-ee6ada5a57dc" };
var ysqa11MKy_default = H2;
e5(H2, { MdGfHiRoa: { title: "Cover Image", type: l3.ResponsiveImage }, AYlbiDb5i: { defaultValue: "", title: "Title", type: l3.String }, N6ZbQXHdN: { preventLocalization: true, title: "Slug", type: l3.String }, N2sbwQtnk: { title: "Icon Image", type: l3.ResponsiveImage }, mle5_OseC: { defaultValue: "", title: "Subtext", type: l3.String }, tEiskHCQi: { defaultValue: "", title: "Popular Cities", type: l3.String }, kelY4xMsW: { defaultValue: "", title: "Ideal Duration", type: l3.String }, BDvMFGdgf: { defaultValue: "", title: "Best Time Visit", type: l3.String }, Cqn7zXrt2: { defaultValue: "", title: "Content 1", type: l3.RichText }, moq7ENOXp: { title: "Image 1", type: l3.ResponsiveImage }, DUwgLv8de: { title: "Image 2", type: l3.ResponsiveImage }, jwIgf6tBO: { title: "Image 3", type: l3.ResponsiveImage }, y_oKHEKwv: { defaultValue: "", title: "Content 2", type: l3.RichText }, createdAt: { title: "Created", type: l3.Date }, updatedAt: { title: "Updated", type: l3.Date }, previousItemId: { dataIdentifier: "local-module:collection/ysqa11MKy:default", title: "Previous", type: l3.CollectionReference }, nextItemId: { dataIdentifier: "local-module:collection/ysqa11MKy:default", title: "Next", type: l3.CollectionReference } });

// http-url:https://framerusercontent.com/modules/9rfRG1v2BIGy9hG8XSbV/h3nMtfkXhmZqD8EfdyZ2/Lq1SCV08H.js
import { jsx as _jsx2, jsxs as _jsxs } from "react/jsx-runtime";
import { addFonts, addPropertyControls as addPropertyControls2, ControlType as ControlType2, cx as cx2, getFonts, getFontsFromSharedStyle, getLoadingLazyAtYPosition, Image, Link, RichText, useComponentViewport, useLocaleInfo, useVariantState, withCSS as withCSS2 } from "./_framer-runtime.js";
import { LayoutGroup, motion as motion2, MotionConfigContext } from "framer-motion";
import * as React2 from "react";
import { useRef } from "react";

// http-url:https://framerusercontent.com/modules/Ee7tnMPNLxjb4CKlYiaU/kMElE4QNJmmWe36RFgPm/Yas9PXVet.js
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
var svg = '<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 13 0 L 0 13 M 13 0 L 3 0 M 13 0 L 13 10" fill="transparent" height="13px" id="DzL2VWb89" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--1ww558a, 2)" stroke="var(--4rxgx6, black)" transform="translate(5.5 5.5)" width="13px"/></svg>';
var getProps = ({ color, height, id, width, width1, ...props }) => {
  return { ...props, CRY1Fpez4: color ?? props.CRY1Fpez4 ?? "rgb(0, 0, 0)", vet7gqNu_: width1 ?? props.vet7gqNu_ ?? 2 };
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const { style, className: className3, layoutId, variant, CRY1Fpez4, vet7gqNu_, ...restProps } = getProps(props);
  const href = useSVGTemplate("132019778", svg);
  return /* @__PURE__ */ _jsx(SVG, { ...restProps, className: cx("framer-faZej", className3), layoutId, ref, role: "presentation", style: { "--1ww558a": vet7gqNu_, "--4rxgx6": CRY1Fpez4, ...style }, viewBox: "0 0 24 24", children: /* @__PURE__ */ _jsx("use", { href }) });
});
var css = [`.framer-faZej { -webkit-mask: ${mask}; aspect-ratio: 1; display: block; mask: ${mask}; width: 24px; }`];
var Icon = withCSS(Component, css, "framer-faZej");
Icon.displayName = "Arrow Top Right";
var Yas9PXVet_default = Icon;
addPropertyControls(Icon, { CRY1Fpez4: { defaultValue: "rgb(0, 0, 0)", hidden: false, title: "Color", type: ControlType.Color }, vet7gqNu_: { defaultValue: 2, displayStepper: true, hidden: false, max: 4, min: 1, title: "Width", type: ControlType.Number } });

// http-url:https://framerusercontent.com/modules/gYrAOE9i6JYdV3lanhAI/6sIlP6bondpO71b1INtl/p3Qjml1gu.js
import { fontStore } from "./_framer-runtime.js";
fontStore.loadFonts(["FS;Manrope-bold", "FS;Manrope-extrabold"]);
var fonts = [{ explicitInter: true, fonts: [{ cssFamilyName: "Manrope", source: "fontshare", style: "normal", uiFamilyName: "Manrope", url: "https://framerusercontent.com/third-party-assets/fontshare/wf/NGBUP45ES3F7RD5XGKPEDJ6QEPO4TMOK/EXDVWJ2EDDVVV65UENMX33EDDYBX6OF7/6P4FPMFQH7CCC7RZ4UU4NKSGJ2RLF7V5.woff2", weight: "700" }, { cssFamilyName: "Manrope", source: "fontshare", style: "normal", uiFamilyName: "Manrope", url: "https://framerusercontent.com/third-party-assets/fontshare/wf/7EWHG4AMROQSXDCQTDPGBVASATB7CED2/TJSQTK5FHJ2MYKML5IXF2G6YTGFJLTYL/K4ZMLVLHYIFVTTTWGVOTVGOFUUX7NVGI.woff2", weight: "800" }] }];
var css2 = [`.framer-WZ0nL .framer-styles-preset-hskyqh:not(.rich-text-wrapper), .framer-WZ0nL .framer-styles-preset-hskyqh.rich-text-wrapper h4 { --framer-font-family: "Manrope", "Manrope Placeholder", sans-serif; --framer-font-family-bold: "Manrope", "Manrope Placeholder", sans-serif; --framer-font-open-type-features: 'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on; --framer-font-size: 24px; --framer-font-style: normal; --framer-font-style-bold: normal; --framer-font-variation-axes: normal; --framer-font-weight: 700; --framer-font-weight-bold: 800; --framer-letter-spacing: -0.02em; --framer-line-height: 1.3em; --framer-paragraph-spacing: 40px; --framer-text-alignment: start; --framer-text-color: var(--token-e15d98be-dc11-48c5-ad2b-3fbf85780d09, #000000); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: none; }`, `@media (max-width: 1199px) and (min-width: 810px) { .framer-WZ0nL .framer-styles-preset-hskyqh:not(.rich-text-wrapper), .framer-WZ0nL .framer-styles-preset-hskyqh.rich-text-wrapper h4 { --framer-font-family: "Manrope", "Manrope Placeholder", sans-serif; --framer-font-family-bold: "Manrope", "Manrope Placeholder", sans-serif; --framer-font-open-type-features: 'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on; --framer-font-size: 24px; --framer-font-style: normal; --framer-font-style-bold: normal; --framer-font-variation-axes: normal; --framer-font-weight: 700; --framer-font-weight-bold: 800; --framer-letter-spacing: -0.02em; --framer-line-height: 1.3em; --framer-paragraph-spacing: 40px; --framer-text-alignment: start; --framer-text-color: var(--token-e15d98be-dc11-48c5-ad2b-3fbf85780d09, #000000); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: none; } }`, `@media (max-width: 809px) and (min-width: 0px) { .framer-WZ0nL .framer-styles-preset-hskyqh:not(.rich-text-wrapper), .framer-WZ0nL .framer-styles-preset-hskyqh.rich-text-wrapper h4 { --framer-font-family: "Manrope", "Manrope Placeholder", sans-serif; --framer-font-family-bold: "Manrope", "Manrope Placeholder", sans-serif; --framer-font-open-type-features: 'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on; --framer-font-size: 24px; --framer-font-style: normal; --framer-font-style-bold: normal; --framer-font-variation-axes: normal; --framer-font-weight: 700; --framer-font-weight-bold: 800; --framer-letter-spacing: 0em; --framer-line-height: 1.3em; --framer-paragraph-spacing: 40px; --framer-text-alignment: start; --framer-text-color: var(--token-e15d98be-dc11-48c5-ad2b-3fbf85780d09, #000000); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: none; } }`];
var className = "framer-WZ0nL";

// http-url:https://framerusercontent.com/modules/cNlFhwbNhHhPewjAZmDP/Wu03lwJ3WEh6CxP6gHAe/RZB8g5F0A.js
import { fontStore as fontStore2 } from "./_framer-runtime.js";
fontStore2.loadFonts(["Inter", "Inter-Bold", "Inter-BoldItalic", "Inter-Italic"]);
var fonts2 = [{ explicitInter: true, fonts: [{ cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/DpPBYI0sL4fYLgAkX8KXOPVt7c.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/4RAEQdEOrcnDkhHiiCbJOw92Lk.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/1K3W8DizY3v4emK8Mb08YHxTbs.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/tUSCtfYVM1I1IchuyCwz9gDdQ.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/VgYFWiwsAC5OYxAycRXXvhze58.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/syRNPWzAMIrcJ3wIlPIP43KjQs.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/GIryZETIX4IFypco5pYZONKhJIo.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/H89BbHkbHDzlxZzxi8uPzTsp90.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/u6gJwDuwB143kpNK1T1MDKDWkMc.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/43sJ6MfOPh1LCJt46OvyDuSbA6o.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/wccHG0r4gBDAIRhfHiOlq6oEkqw.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/WZ367JPwf9bRW6LdTHN8rXgSjw.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/ia3uin3hQWqDrVloC1zEtYHWw.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/2A4Xx7CngadFGlVV4xrO06OBHY.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/CfMzU8w2e7tHgF4T4rATMPuWosA.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/867QObYax8ANsfX4TGEVU9YiCM.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/Oyn2ZbENFdnW7mt2Lzjk1h9Zb9k.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/cdAe8hgZ1cMyLu9g005pAW3xMo.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/DOfvtmE1UplCq161m6Hj8CSQYg.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/pKRFNWFoZl77qYCAIp84lN1h944.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/tKtBcDnBMevsEEJKdNGhhkLzYo.woff2", weight: "400" }] }];
var css3 = [`.framer-lEqfZ .framer-styles-preset-mxaz03:not(.rich-text-wrapper), .framer-lEqfZ .framer-styles-preset-mxaz03.rich-text-wrapper p { --framer-font-family: "Inter", "Inter Placeholder", sans-serif; --framer-font-family-bold: "Inter", "Inter Placeholder", sans-serif; --framer-font-family-bold-italic: "Inter", "Inter Placeholder", sans-serif; --framer-font-family-italic: "Inter", "Inter Placeholder", sans-serif; --framer-font-open-type-features: 'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on; --framer-font-size: 16px; --framer-font-style: normal; --framer-font-style-bold: normal; --framer-font-style-bold-italic: italic; --framer-font-style-italic: italic; --framer-font-variation-axes: normal; --framer-font-weight: 400; --framer-font-weight-bold: 700; --framer-font-weight-bold-italic: 700; --framer-font-weight-italic: 400; --framer-letter-spacing: -0.02em; --framer-line-height: 1.4em; --framer-paragraph-spacing: 20px; --framer-text-alignment: start; --framer-text-color: var(--token-ae4b47e4-3a13-4e24-99f2-2e3de59f762c, #404040); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: none; }`];
var className2 = "framer-lEqfZ";

// http-url:https://framerusercontent.com/modules/9rfRG1v2BIGy9hG8XSbV/h3nMtfkXhmZqD8EfdyZ2/Lq1SCV08H.js
var ArrowTopRightFonts = getFonts(Yas9PXVet_default);
var enabledGestures = { AO3sV8EPR: { pressed: true }, wyoBc5GAz: { hover: true } };
var cycleOrder = ["wyoBc5GAz", "AO3sV8EPR"];
var serializationHash = "framer-JBKnf";
var variantClassNames = { AO3sV8EPR: "framer-v-qc4m2r", wyoBc5GAz: "framer-v-dzmtqj" };
function addPropertyOverrides(overrides, ...variants) {
  const nextOverrides = {};
  variants?.forEach((variant) => variant && Object.assign(nextOverrides, overrides[variant]));
  return nextOverrides;
}
var transition1 = { delay: 0, duration: 0.6, ease: [0.69, 0.07, 0.25, 1.03], type: "tween" };
var transformTemplate1 = (_2, t5) => `translate(-50%, -50%) ${t5}`;
var toResponsiveImage = (value) => {
  if (typeof value === "object" && value !== null && typeof value.src === "string") {
    return value;
  }
  return typeof value === "string" ? { src: value } : void 0;
};
var Transition = ({ value, children }) => {
  const config = React2.useContext(MotionConfigContext);
  const transition = value ?? config.transition;
  const contextValue = React2.useMemo(() => ({ ...config, transition }), [JSON.stringify(transition)]);
  return /* @__PURE__ */ _jsx2(MotionConfigContext.Provider, { value: contextValue, children });
};
var Variants = motion2.create(React2.Fragment);
var humanReadableVariantMap = { Default: "wyoBc5GAz", Phone: "AO3sV8EPR" };
var getProps2 = ({ coverImage, height, id, image1, image2, image3, link, subtext, title, width, ...props }) => {
  return { ...props, C1hsZu46_: subtext ?? props.C1hsZu46_ ?? "From", dLGxupNR8: image3 ?? props.dLGxupNR8 ?? { alt: "Young girl with backpack walks on dirt path", pixelHeight: 3037, pixelWidth: 2013, src: "https://framerusercontent.com/images/7nnehATz27wC1HFJ0JlI1yM8.jpg?width=2013&height=3037", srcSet: "https://framerusercontent.com/images/7nnehATz27wC1HFJ0JlI1yM8.jpg?scale-down-to=1024&width=2013&height=3037 678w,https://framerusercontent.com/images/7nnehATz27wC1HFJ0JlI1yM8.jpg?scale-down-to=2048&width=2013&height=3037 1357w,https://framerusercontent.com/images/7nnehATz27wC1HFJ0JlI1yM8.jpg?width=2013&height=3037 2013w" }, frNH54qUR: coverImage ?? props.frNH54qUR ?? { pixelHeight: 2e3, pixelWidth: 3e3, src: "https://framerusercontent.com/images/MKvzy3Qdi77v1BBtq68mvd1N58Q.jpg?width=3000&height=2000", srcSet: "https://framerusercontent.com/images/MKvzy3Qdi77v1BBtq68mvd1N58Q.jpg?scale-down-to=512&width=3000&height=2000 512w,https://framerusercontent.com/images/MKvzy3Qdi77v1BBtq68mvd1N58Q.jpg?scale-down-to=1024&width=3000&height=2000 1024w,https://framerusercontent.com/images/MKvzy3Qdi77v1BBtq68mvd1N58Q.jpg?scale-down-to=2048&width=3000&height=2000 2048w,https://framerusercontent.com/images/MKvzy3Qdi77v1BBtq68mvd1N58Q.jpg?width=3000&height=2000 3000w" }, oPpVhQK2s: image1 ?? props.oPpVhQK2s ?? { alt: "Palm trees frame a dramatic mountain valley landscape", pixelHeight: 6e3, pixelWidth: 4e3, src: "https://framerusercontent.com/images/XnfhkUDKcheYsd1r63EcVmAEIc.jpg?width=4000&height=6000", srcSet: "https://framerusercontent.com/images/XnfhkUDKcheYsd1r63EcVmAEIc.jpg?scale-down-to=1024&width=4000&height=6000 682w,https://framerusercontent.com/images/XnfhkUDKcheYsd1r63EcVmAEIc.jpg?scale-down-to=2048&width=4000&height=6000 1365w,https://framerusercontent.com/images/XnfhkUDKcheYsd1r63EcVmAEIc.jpg?scale-down-to=4096&width=4000&height=6000 2730w,https://framerusercontent.com/images/XnfhkUDKcheYsd1r63EcVmAEIc.jpg?width=4000&height=6000 4000w" }, pkV0bmPey: title ?? props.pkV0bmPey ?? "Cleanspace", qpIcQu3Ta: image2 ?? props.qpIcQu3Ta ?? { alt: "Man photographing granite cliffs in yosemite national park", pixelHeight: 3718, pixelWidth: 2474, src: "https://framerusercontent.com/images/RCCCFpSS8EeEi61PbhHhnk4Ws.jpg?width=2474&height=3718", srcSet: "https://framerusercontent.com/images/RCCCFpSS8EeEi61PbhHhnk4Ws.jpg?scale-down-to=1024&width=2474&height=3718 681w,https://framerusercontent.com/images/RCCCFpSS8EeEi61PbhHhnk4Ws.jpg?scale-down-to=2048&width=2474&height=3718 1362w,https://framerusercontent.com/images/RCCCFpSS8EeEi61PbhHhnk4Ws.jpg?width=2474&height=3718 2474w" }, variant: humanReadableVariantMap[props.variant] ?? props.variant ?? "wyoBc5GAz", xHTzW6U42: link ?? props.xHTzW6U42 };
};
var createLayoutDependency = (props, variants) => {
  if (props.layoutDependency)
    return variants.join("-") + props.layoutDependency;
  return variants.join("-");
};
var Component2 = /* @__PURE__ */ React2.forwardRef(function(props, ref) {
  const fallbackRef = useRef(null);
  const refBinding = ref ?? fallbackRef;
  const defaultLayoutId = React2.useId();
  const { activeLocale, setLocale } = useLocaleInfo();
  const componentViewport = useComponentViewport();
  const { style, className: className3, layoutId, variant, frNH54qUR, pkV0bmPey, C1hsZu46_, oPpVhQK2s, qpIcQu3Ta, dLGxupNR8, xHTzW6U42, ...restProps } = getProps2(props);
  const { baseVariant, classNames, clearLoadingGesture, gestureHandlers, gestureVariant, isLoading, setGestureState, setVariant, variants } = useVariantState({ cycleOrder, defaultVariant: "wyoBc5GAz", enabledGestures, ref: refBinding, variant, variantClassNames });
  const layoutDependency = createLayoutDependency(props, variants);
  const sharedStyleClassNames = [className, className2];
  const scopingClassNames = cx2(serializationHash, ...sharedStyleClassNames);
  return /* @__PURE__ */ _jsx2(LayoutGroup, { id: layoutId ?? defaultLayoutId, children: /* @__PURE__ */ _jsx2(Variants, { animate: variants, initial: false, children: /* @__PURE__ */ _jsx2(Transition, { value: transition1, children: /* @__PURE__ */ _jsx2(Link, { href: xHTzW6U42, motionChild: true, nodeId: "wyoBc5GAz", openInNewTab: false, scopeId: "Lq1SCV08H", children: /* @__PURE__ */ _jsxs(motion2.a, { ...restProps, ...gestureHandlers, className: `${cx2(scopingClassNames, "framer-dzmtqj", className3, classNames)} framer-wwmqmz`, "data-framer-name": "Default", layoutDependency, layoutId: "DestinationCardVariations__wyoBc5GAz", ref: refBinding, style: { backgroundColor: "var(--token-e15d98be-dc11-48c5-ad2b-3fbf85780d09, rgb(0, 0, 0))", borderBottomLeftRadius: 24, borderBottomRightRadius: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, ...style }, ...addPropertyOverrides({ "AO3sV8EPR-pressed": { "data-framer-name": void 0 }, "wyoBc5GAz-hover": { "data-framer-name": void 0 }, AO3sV8EPR: { "data-framer-name": "Phone" } }, baseVariant, gestureVariant), children: [/* @__PURE__ */ _jsxs(motion2.div, { className: "framer-io8wqu", "data-border": true, "data-framer-name": "Icon Holder", layoutDependency, layoutId: "DestinationCardVariations__YGPOg1LVC", style: { "--border-bottom-width": "1px", "--border-color": "var(--token-59e7428e-3e7c-4ea0-9581-a7009089f11f, rgba(255, 255, 255, 0.1))", "--border-left-width": "1px", "--border-right-width": "1px", "--border-style": "solid", "--border-top-width": "1px", backdropFilter: "blur(2px)", backgroundColor: "var(--token-8bb26b5a-95c0-4c85-8e57-be16a6b97bca, rgba(0, 0, 0, 0.2))", borderBottomLeftRadius: 100, borderBottomRightRadius: 100, borderTopLeftRadius: 100, borderTopRightRadius: 100, WebkitBackdropFilter: "blur(2px)" }, children: [/* @__PURE__ */ _jsx2(Yas9PXVet_default, { animated: true, className: "framer-1c81yaj", layoutDependency, layoutId: "DestinationCardVariations__n8EEnRGOj", style: { "--1ww558a": 2, "--4rxgx6": "var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255))" }, transformTemplate: transformTemplate1, ...addPropertyOverrides({ "wyoBc5GAz-hover": { transformTemplate: void 0 } }, baseVariant, gestureVariant) }), /* @__PURE__ */ _jsx2(Yas9PXVet_default, { animated: true, className: "framer-13xq242", layoutDependency, layoutId: "DestinationCardVariations__HSwCFmOtY", style: { "--1ww558a": 2, "--4rxgx6": "var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255))" } })] }), /* @__PURE__ */ _jsx2(motion2.div, { className: "framer-1vuu6mm", "data-framer-name": "Content", layoutDependency, layoutId: "DestinationCardVariations__roPt11pFX", style: { scale: 1 }, variants: { "AO3sV8EPR-pressed": { scale: 1 }, "wyoBc5GAz-hover": { scale: 0.96 } }, children: /* @__PURE__ */ _jsxs(motion2.div, { className: "framer-vawcg6", "data-framer-name": "Row", layoutDependency, layoutId: "DestinationCardVariations__dfDvy8QBj", style: { filter: "invert(0)", WebkitFilter: "invert(0)" }, children: [/* @__PURE__ */ _jsx2(RichText, { __fromCanvasComponent: true, children: /* @__PURE__ */ _jsx2(React2.Fragment, { children: /* @__PURE__ */ _jsx2(motion2.h4, { className: "framer-styles-preset-hskyqh", "data-styles-preset": "p3Qjml1gu", dir: "auto", style: { "--framer-text-color": "var(--extracted-1eung3n, var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255)))" }, children: "Cleanspace" }) }), className: "framer-lfx149", fonts: ["Inter"], layoutDependency, layoutId: "DestinationCardVariations__qlbavjx6q", style: { "--extracted-1eung3n": "var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255))", "--framer-link-text-color": "rgb(0, 153, 255)", "--framer-link-text-decoration": "underline" }, text: pkV0bmPey, verticalAlignment: "top", withExternalLayout: true }), /* @__PURE__ */ _jsx2(motion2.div, { className: "framer-1m01ov5", "data-framer-name": "Subtext", layoutDependency, layoutId: "DestinationCardVariations__z4NfPOYeA", children: /* @__PURE__ */ _jsx2(RichText, { __fromCanvasComponent: true, children: /* @__PURE__ */ _jsx2(React2.Fragment, { children: /* @__PURE__ */ _jsx2(motion2.p, { className: "framer-styles-preset-mxaz03", "data-styles-preset": "RZB8g5F0A", dir: "auto", style: { "--framer-text-color": "var(--extracted-r6o4lv, var(--token-cb2a12ec-6d20-4c11-b2a8-88dcf46b2e32, rgb(204, 204, 204)))" }, children: "From" }) }), className: "framer-uh94ha", "data-framer-name": "Subtext", fonts: ["Inter"], layoutDependency, layoutId: "DestinationCardVariations__E1zyWlDDQ", style: { "--extracted-r6o4lv": "var(--token-cb2a12ec-6d20-4c11-b2a8-88dcf46b2e32, rgb(204, 204, 204))", "--framer-link-text-color": "rgb(0, 153, 255)", "--framer-link-text-decoration": "underline" }, text: C1hsZu46_, verticalAlignment: "top", withExternalLayout: true }) })] }) }), /* @__PURE__ */ _jsx2(Image, { as: "figure", background: { alt: "", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + 0), pixelHeight: 2e3, pixelWidth: 3e3, sizes: componentViewport?.width || "100vw", ...toResponsiveImage(frNH54qUR) }, className: "framer-vn9vcb", layoutDependency, layoutId: "DestinationCardVariations__zTAIMA6wF", style: { mask: "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 54%) add", scale: 1.1, WebkitMask: "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 54%) add" }, variants: { "wyoBc5GAz-hover": { scale: 1 } } }), /* @__PURE__ */ _jsx2(motion2.div, { className: "framer-j4xc9j", "data-framer-name": "Dark Bottom Overlay", layoutDependency, layoutId: "DestinationCardVariations__e0eG5xBui", style: { backgroundColor: "var(--token-e15d98be-dc11-48c5-ad2b-3fbf85780d09, rgb(0, 0, 0))", mask: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%) add", WebkitMask: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%) add" } }), /* @__PURE__ */ _jsxs(motion2.div, { className: "framer-1p99867", "data-framer-name": "Images", layoutDependency, layoutId: "DestinationCardVariations__QDV7EqWUD", style: { rotate: 24 }, children: [/* @__PURE__ */ _jsx2(Image, { as: "figure", background: { alt: "Palm trees frame a dramatic mountain valley landscape", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + (componentViewport?.height || 347) - -120 + 0), pixelHeight: 6e3, pixelWidth: 4e3, sizes: "100px", ...toResponsiveImage(oPpVhQK2s) }, className: "framer-1hpx716", "data-border": true, draggable: "false", layoutDependency, layoutId: "DestinationCardVariations__eH3j7dkvW", style: { "--border-bottom-width": "1px", "--border-color": "var(--token-d8bb658f-330c-4eac-af07-d4bcacb28cd9, rgb(247, 247, 247))", "--border-left-width": "1px", "--border-right-width": "1px", "--border-style": "solid", "--border-top-width": "1px", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, boxShadow: "0px 3px 15px 6px rgba(89, 89, 89, 0.25)", rotate: 0 }, variants: { "AO3sV8EPR-pressed": { rotate: 0 }, "wyoBc5GAz-hover": { rotate: 10 } }, ...addPropertyOverrides({ "wyoBc5GAz-hover": { background: { alt: "Palm trees frame a dramatic mountain valley landscape", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + (componentViewport?.height || 347) - 212 + 0), pixelHeight: 6e3, pixelWidth: 4e3, sizes: "100px", ...toResponsiveImage(oPpVhQK2s) } } }, baseVariant, gestureVariant) }), /* @__PURE__ */ _jsx2(Image, { as: "figure", background: { alt: "Man photographing granite cliffs in yosemite national park", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + (componentViewport?.height || 347) - -120 + 0), pixelHeight: 3718, pixelWidth: 2474, sizes: "100px", ...toResponsiveImage(qpIcQu3Ta) }, className: "framer-kc3xiu", "data-border": true, draggable: "false", layoutDependency, layoutId: "DestinationCardVariations__HRLqsYsSE", style: { "--border-bottom-width": "1px", "--border-color": "var(--token-d8bb658f-330c-4eac-af07-d4bcacb28cd9, rgb(247, 247, 247))", "--border-left-width": "1px", "--border-right-width": "1px", "--border-style": "solid", "--border-top-width": "1px", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, boxShadow: "0px 3px 15px 6px rgba(89, 89, 89, 0.25)", originX: 0, originY: 0, rotate: 0 }, variants: { "AO3sV8EPR-pressed": { rotate: 0 }, "wyoBc5GAz-hover": { rotate: -18 } }, ...addPropertyOverrides({ "wyoBc5GAz-hover": { background: { alt: "Man photographing granite cliffs in yosemite national park", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + (componentViewport?.height || 347) - 212 + 0), pixelHeight: 3718, pixelWidth: 2474, sizes: "100px", ...toResponsiveImage(qpIcQu3Ta) } } }, baseVariant, gestureVariant) }), /* @__PURE__ */ _jsx2(Image, { as: "figure", background: { alt: "Young girl with backpack walks on dirt path", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + (componentViewport?.height || 347) - -120 + 0), pixelHeight: 3037, pixelWidth: 2013, sizes: "100px", ...toResponsiveImage(dLGxupNR8) }, className: "framer-ua8t3l", "data-border": true, draggable: "false", layoutDependency, layoutId: "DestinationCardVariations__oE7C2U28U", style: { "--border-bottom-width": "1px", "--border-color": "var(--token-d8bb658f-330c-4eac-af07-d4bcacb28cd9, rgb(247, 247, 247))", "--border-left-width": "1px", "--border-right-width": "1px", "--border-style": "solid", "--border-top-width": "1px", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, boxShadow: "0px 3px 15px 6px rgba(89, 89, 89, 0.25)", originX: 0, originY: 0, rotate: 0 }, variants: { "AO3sV8EPR-pressed": { rotate: 0 }, "wyoBc5GAz-hover": { rotate: -46 } }, ...addPropertyOverrides({ "wyoBc5GAz-hover": { background: { alt: "Young girl with backpack walks on dirt path", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + (componentViewport?.height || 347) - 212 + 0), pixelHeight: 3037, pixelWidth: 2013, sizes: "100px", ...toResponsiveImage(dLGxupNR8) } } }, baseVariant, gestureVariant) })] })] }) }) }) }) });
});
var css4 = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-JBKnf.framer-wwmqmz, .framer-JBKnf .framer-wwmqmz { display: block; }", ".framer-JBKnf.framer-dzmtqj { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: 347px; justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; text-decoration: none; width: 460px; will-change: var(--framer-will-change-override, transform); }", ".framer-JBKnf .framer-io8wqu { aspect-ratio: 1 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 43px); overflow: var(--overflow-clip-fallback, clip); position: absolute; right: 16px; top: 16px; width: 43px; will-change: var(--framer-will-change-override, transform); z-index: 4; }", ".framer-JBKnf .framer-1c81yaj { flex: none; height: var(--framer-aspect-ratio-supported, 16px); left: 50%; position: absolute; top: 50%; width: 16px; }", ".framer-JBKnf .framer-13xq242 { bottom: -20px; flex: none; height: var(--framer-aspect-ratio-supported, 20px); left: -20px; position: absolute; width: 20px; }", ".framer-JBKnf .framer-1vuu6mm { align-content: flex-start; align-items: flex-start; display: flex; flex: 1 0 0px; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: 1px; justify-content: flex-end; overflow: var(--overflow-clip-fallback, clip); padding: 16px; position: relative; width: 100%; z-index: 4; }", ".framer-JBKnf .framer-vawcg6 { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 8px; height: min-content; justify-content: flex-start; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 100%; }", ".framer-JBKnf .framer-lfx149 { -webkit-user-select: none; flex: none; height: auto; position: relative; user-select: none; white-space: pre; width: auto; }", ".framer-JBKnf .framer-1m01ov5 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 8px; height: min-content; justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 100%; }", ".framer-JBKnf .framer-uh94ha { flex: 1 0 0px; height: auto; position: relative; white-space: pre-wrap; width: 1px; word-break: break-word; word-wrap: break-word; }", ".framer-JBKnf .framer-vn9vcb { bottom: 0px; flex: none; left: 0px; overflow: var(--overflow-clip-fallback, clip); position: absolute; right: 0px; top: 0px; will-change: var(--framer-will-change-filter-override, filter); z-index: 1; }", ".framer-JBKnf .framer-j4xc9j { bottom: 0px; flex: none; height: 60%; left: 0px; overflow: var(--overflow-clip-fallback, clip); position: absolute; right: 0px; z-index: 1; }", ".framer-JBKnf .framer-1p99867 { align-content: center; align-items: center; bottom: -250px; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; left: 138px; overflow: visible; padding: 0px; position: absolute; width: min-content; z-index: 1; }", ".framer-JBKnf .framer-1hpx716 { -webkit-user-select: none; flex: none; height: 130px; overflow: visible; position: relative; user-select: none; width: 100px; z-index: 1; }", ".framer-JBKnf .framer-kc3xiu { -webkit-user-select: none; flex: none; height: 130px; left: 25px; overflow: visible; position: absolute; top: calc(50.00000000000002% - 130px / 2); user-select: none; width: 100px; z-index: 1; }", ".framer-JBKnf .framer-ua8t3l { -webkit-user-select: none; flex: none; height: 130px; left: 54px; overflow: visible; position: absolute; top: calc(50.00000000000002% - 130px / 2); user-select: none; width: 100px; z-index: 1; }", ".framer-JBKnf.framer-v-dzmtqj.hover .framer-io8wqu { order: 0; right: 23px; top: 22px; }", ".framer-JBKnf.framer-v-dzmtqj.hover .framer-1c81yaj { left: unset; right: -20px; top: -20px; }", ".framer-JBKnf.framer-v-dzmtqj.hover .framer-13xq242 { aspect-ratio: 1 / 1; bottom: 10px; height: var(--framer-aspect-ratio-supported, 23px); left: unset; right: 10px; width: 23px; }", ".framer-JBKnf.framer-v-dzmtqj.hover .framer-1vuu6mm { order: 3; }", ".framer-JBKnf.framer-v-dzmtqj.hover .framer-vn9vcb { order: 4; }", ".framer-JBKnf.framer-v-dzmtqj.hover .framer-j4xc9j { order: 1; }", ".framer-JBKnf.framer-v-dzmtqj.hover .framer-1p99867 { bottom: 82px; order: 2; }", ...css2, ...css3, '.framer-JBKnf[data-border="true"]::after, .framer-JBKnf [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; corner-shape: inherit; pointer-events: none; }'];
var FramerLq1SCV08H = withCSS2(Component2, css4, "framer-JBKnf");
var Lq1SCV08H_default = FramerLq1SCV08H;
FramerLq1SCV08H.displayName = "Destination Card";
FramerLq1SCV08H.defaultProps = { height: 347, width: 460 };
addPropertyControls2(FramerLq1SCV08H, { variant: { options: ["wyoBc5GAz", "AO3sV8EPR"], optionTitles: ["Default", "Phone"], title: "Variant", type: ControlType2.Enum }, frNH54qUR: { __defaultAssetReference: "data:framer/asset-reference,MKvzy3Qdi77v1BBtq68mvd1N58Q.jpg?originalFilename=photo-1769112112632-26be33f821b0%3Fcrop%3Dentropy%26cs%3Dsrgb%26fm%3Djpg%26ixid%3DM3wxMzc5NjJ8MHwxfGFsbHw0fHx8fHx8fHwxNzY5NTEzNTI0fA%26ixlib%3Drb-4.1.jpg&width=3000&height=2000", title: "Cover Image", type: ControlType2.ResponsiveImage }, pkV0bmPey: { defaultValue: "Cleanspace", displayTextArea: false, title: "Title", type: ControlType2.String }, C1hsZu46_: { defaultValue: "From", displayTextArea: false, title: "Subtext", type: ControlType2.String }, oPpVhQK2s: { __defaultAssetReference: "data:framer/asset-reference,XnfhkUDKcheYsd1r63EcVmAEIc.jpg?originalFilename=photo-1755804127231-c493579c8ce5%3Fcrop%3Dentropy%26cs%3Dsrgb%26fm%3Djpg%26ixid%3DM3wxMzc5NjJ8MHwxfGFsbHwzMzJ8fHx8fHx8fDE3NTY4MzY0MDV8%26ixlib%3Drb-4.1.jpg&preferredSize=auto&width=4000&height=6000", __vekterDefault: { alt: "Palm trees frame a dramatic mountain valley landscape", assetReference: "data:framer/asset-reference,XnfhkUDKcheYsd1r63EcVmAEIc.jpg?originalFilename=photo-1755804127231-c493579c8ce5%3Fcrop%3Dentropy%26cs%3Dsrgb%26fm%3Djpg%26ixid%3DM3wxMzc5NjJ8MHwxfGFsbHwzMzJ8fHx8fHx8fDE3NTY4MzY0MDV8%26ixlib%3Drb-4.1.jpg&preferredSize=auto&width=4000&height=6000" }, title: "Image 1", type: ControlType2.ResponsiveImage }, qpIcQu3Ta: { __defaultAssetReference: "data:framer/asset-reference,RCCCFpSS8EeEi61PbhHhnk4Ws.jpg?originalFilename=photo-1755569309049-98410b94f66d%3Fcrop%3Dentropy%26cs%3Dsrgb%26fm%3Djpg%26ixid%3DM3wxMzc5NjJ8MHwxfGFsbHwzMjh8fHx8fHx8fDE3NTY4MzY0MDV8%26ixlib%3Drb-4.1.jpg&preferredSize=auto&width=2474&height=3718", __vekterDefault: { alt: "Man photographing granite cliffs in yosemite national park", assetReference: "data:framer/asset-reference,RCCCFpSS8EeEi61PbhHhnk4Ws.jpg?originalFilename=photo-1755569309049-98410b94f66d%3Fcrop%3Dentropy%26cs%3Dsrgb%26fm%3Djpg%26ixid%3DM3wxMzc5NjJ8MHwxfGFsbHwzMjh8fHx8fHx8fDE3NTY4MzY0MDV8%26ixlib%3Drb-4.1.jpg&preferredSize=auto&width=2474&height=3718" }, title: "Image 2", type: ControlType2.ResponsiveImage }, dLGxupNR8: { __defaultAssetReference: "data:framer/asset-reference,7nnehATz27wC1HFJ0JlI1yM8.jpg?originalFilename=photo-1756626976870-812e39e3cca0%3Fcrop%3Dentropy%26cs%3Dsrgb%26fm%3Djpg%26ixid%3DM3wxMzc5NjJ8MHwxfGFsbHw1Mnx8fHx8fHx8MTc1Njg0NjIxM3w%26ixlib%3Drb-4.1.jpg&preferredSize=auto&width=2013&height=3037", __vekterDefault: { alt: "Young girl with backpack walks on dirt path", assetReference: "data:framer/asset-reference,7nnehATz27wC1HFJ0JlI1yM8.jpg?originalFilename=photo-1756626976870-812e39e3cca0%3Fcrop%3Dentropy%26cs%3Dsrgb%26fm%3Djpg%26ixid%3DM3wxMzc5NjJ8MHwxfGFsbHw1Mnx8fHx8fHx8MTc1Njg0NjIxM3w%26ixlib%3Drb-4.1.jpg&preferredSize=auto&width=2013&height=3037" }, title: "Image 3", type: ControlType2.ResponsiveImage }, xHTzW6U42: { title: "Link", type: ControlType2.Link } });
addFonts(FramerLq1SCV08H, [{ explicitInter: true, fonts: [{ cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2", weight: "400" }] }, ...ArrowTopRightFonts, ...getFontsFromSharedStyle(fonts), ...getFontsFromSharedStyle(fonts2)], { supportsExplicitInterCodegen: true });

// http-url:https://framerusercontent.com/modules/gFNP6F4CoVUu9xQHTkED/HE04kscOp67W4Gdh0wQ7/nFX7IZyxE.js
var DestinationCardFonts = getFonts2(Lq1SCV08H_default);
var cycleOrder2 = ["lhS3MJFmA", "v6XQIQJDM", "lR8zEroRn", "h37dsFv_7", "hNnmQlfMO", "m_j1yDI2U", "Ghvlz5YZz", "CpRXzXKUV"];
var serializationHash2 = "framer-tCUGK";
var variantClassNames2 = { CpRXzXKUV: "framer-v-1xwkswy", Ghvlz5YZz: "framer-v-1cfk55y", h37dsFv_7: "framer-v-t42hci", hNnmQlfMO: "framer-v-9786tg", lhS3MJFmA: "framer-v-liv7n8", lR8zEroRn: "framer-v-dcsg04", m_j1yDI2U: "framer-v-7pic5c", v6XQIQJDM: "framer-v-1mo1ltp" };
function addPropertyOverrides2(overrides, ...variants) {
  const nextOverrides = {};
  variants?.forEach((variant) => variant && Object.assign(nextOverrides, overrides[variant]));
  return nextOverrides;
}
var transition12 = { duration: 0, type: "tween" };
var toResponsiveImage2 = (value) => {
  if (typeof value === "object" && value !== null && typeof value.src === "string") {
    return value;
  }
  return typeof value === "string" ? { src: value } : void 0;
};
var matchVariant = (...args) => {
  for (const arg of args) {
    if (arg && typeof arg === "string")
      return arg;
  }
  return void 0;
};
var query1 = () => ({ from: { alias: "jNjFDMmwJ", data: ysqa11MKy_default, type: "Collection" }, limit: { type: "LiteralValue", value: 1 }, offset: { type: "LiteralValue", value: 0 }, select: [{ collection: "jNjFDMmwJ", name: "MdGfHiRoa", type: "Identifier" }, { collection: "jNjFDMmwJ", name: "AYlbiDb5i", type: "Identifier" }, { collection: "jNjFDMmwJ", name: "mle5_OseC", type: "Identifier" }, { collection: "jNjFDMmwJ", name: "moq7ENOXp", type: "Identifier" }, { collection: "jNjFDMmwJ", name: "DUwgLv8de", type: "Identifier" }, { collection: "jNjFDMmwJ", name: "jwIgf6tBO", type: "Identifier" }, { collection: "jNjFDMmwJ", name: "N6ZbQXHdN", type: "Identifier" }, { collection: "jNjFDMmwJ", name: "id", type: "Identifier" }] });
var QueryData = ({ query, pageSize, children }) => {
  const data = __framer_useQueryData(query);
  return children(data);
};
var query3 = () => ({ from: { alias: "g1zPKUogk", data: ysqa11MKy_default, type: "Collection" }, limit: { type: "LiteralValue", value: 1 }, offset: { type: "LiteralValue", value: 1 }, select: [{ collection: "g1zPKUogk", name: "MdGfHiRoa", type: "Identifier" }, { collection: "g1zPKUogk", name: "AYlbiDb5i", type: "Identifier" }, { collection: "g1zPKUogk", name: "mle5_OseC", type: "Identifier" }, { collection: "g1zPKUogk", name: "moq7ENOXp", type: "Identifier" }, { collection: "g1zPKUogk", name: "DUwgLv8de", type: "Identifier" }, { collection: "g1zPKUogk", name: "jwIgf6tBO", type: "Identifier" }, { collection: "g1zPKUogk", name: "N6ZbQXHdN", type: "Identifier" }, { collection: "g1zPKUogk", name: "id", type: "Identifier" }] });
var query5 = () => ({ from: { alias: "V7cCACaWH", data: ysqa11MKy_default, type: "Collection" }, limit: { type: "LiteralValue", value: 1 }, offset: { type: "LiteralValue", value: 2 }, select: [{ collection: "V7cCACaWH", name: "MdGfHiRoa", type: "Identifier" }, { collection: "V7cCACaWH", name: "AYlbiDb5i", type: "Identifier" }, { collection: "V7cCACaWH", name: "mle5_OseC", type: "Identifier" }, { collection: "V7cCACaWH", name: "moq7ENOXp", type: "Identifier" }, { collection: "V7cCACaWH", name: "DUwgLv8de", type: "Identifier" }, { collection: "V7cCACaWH", name: "jwIgf6tBO", type: "Identifier" }, { collection: "V7cCACaWH", name: "N6ZbQXHdN", type: "Identifier" }, { collection: "V7cCACaWH", name: "id", type: "Identifier" }] });
var query7 = () => ({ from: { alias: "CSIa3gOmb", data: ysqa11MKy_default, type: "Collection" }, limit: { type: "LiteralValue", value: 1 }, offset: { type: "LiteralValue", value: 3 }, select: [{ collection: "CSIa3gOmb", name: "MdGfHiRoa", type: "Identifier" }, { collection: "CSIa3gOmb", name: "AYlbiDb5i", type: "Identifier" }, { collection: "CSIa3gOmb", name: "mle5_OseC", type: "Identifier" }, { collection: "CSIa3gOmb", name: "moq7ENOXp", type: "Identifier" }, { collection: "CSIa3gOmb", name: "DUwgLv8de", type: "Identifier" }, { collection: "CSIa3gOmb", name: "jwIgf6tBO", type: "Identifier" }, { collection: "CSIa3gOmb", name: "N6ZbQXHdN", type: "Identifier" }, { collection: "CSIa3gOmb", name: "id", type: "Identifier" }] });
var Transition2 = ({ value, children }) => {
  const config = React3.useContext(MotionConfigContext2);
  const transition = value ?? config.transition;
  const contextValue = React3.useMemo(() => ({ ...config, transition }), [JSON.stringify(transition)]);
  return /* @__PURE__ */ _jsx3(MotionConfigContext2.Provider, { value: contextValue, children });
};
var Variants2 = motion3.create(React3.Fragment);
var humanReadableVariantMap2 = { "1": "lhS3MJFmA", "2": "v6XQIQJDM", "3": "lR8zEroRn", "4": "h37dsFv_7", "Phone 1": "hNnmQlfMO", "Phone 2": "m_j1yDI2U", "Phone 3": "Ghvlz5YZz", "Phone 4": "CpRXzXKUV" };
var getProps3 = ({ height, id, width, ...props }) => {
  return { ...props, variant: humanReadableVariantMap2[props.variant] ?? props.variant ?? "lhS3MJFmA" };
};
var createLayoutDependency2 = (props, variants) => {
  if (props.layoutDependency)
    return variants.join("-") + props.layoutDependency;
  return variants.join("-");
};
var Component3 = /* @__PURE__ */ React3.forwardRef(function(props, ref) {
  const fallbackRef = useRef2(null);
  const refBinding = ref ?? fallbackRef;
  const defaultLayoutId = React3.useId();
  const { activeLocale, setLocale } = useLocaleInfo2();
  const componentViewport = useComponentViewport2();
  const { style, className: className3, layoutId, variant, ...restProps } = getProps3(props);
  const { baseVariant, classNames, clearLoadingGesture, gestureHandlers, gestureVariant, isLoading, setGestureState, setVariant, variants } = useVariantState2({ cycleOrder: cycleOrder2, defaultVariant: "lhS3MJFmA", ref: refBinding, variant, variantClassNames: variantClassNames2 });
  const layoutDependency = createLayoutDependency2(props, variants);
  const sharedStyleClassNames = [];
  const scopingClassNames = cx3(serializationHash2, ...sharedStyleClassNames);
  const isDisplayed = () => {
    if (["v6XQIQJDM", "lR8zEroRn", "h37dsFv_7", "m_j1yDI2U", "Ghvlz5YZz", "CpRXzXKUV"].includes(baseVariant))
      return false;
    return true;
  };
  const router = useRouter();
  const isDisplayed1 = () => {
    if (["v6XQIQJDM", "m_j1yDI2U"].includes(baseVariant))
      return true;
    return false;
  };
  const isDisplayed2 = () => {
    if (["lR8zEroRn", "Ghvlz5YZz"].includes(baseVariant))
      return true;
    return false;
  };
  const isDisplayed3 = () => {
    if (["h37dsFv_7", "CpRXzXKUV"].includes(baseVariant))
      return true;
    return false;
  };
  return /* @__PURE__ */ _jsx3(LayoutGroup2, { id: layoutId ?? defaultLayoutId, children: /* @__PURE__ */ _jsx3(Variants2, { animate: variants, initial: false, children: /* @__PURE__ */ _jsx3(Transition2, { value: transition12, children: /* @__PURE__ */ _jsxs2(motion3.div, { ...restProps, ...gestureHandlers, className: cx3(scopingClassNames, "framer-liv7n8", className3, classNames), "data-framer-name": "1", layoutDependency, layoutId: "DestinationCardVariations__lhS3MJFmA", ref: refBinding, style: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, ...style }, ...addPropertyOverrides2({ CpRXzXKUV: { "data-framer-name": "Phone 4" }, Ghvlz5YZz: { "data-framer-name": "Phone 3" }, h37dsFv_7: { "data-framer-name": "4" }, hNnmQlfMO: { "data-framer-name": "Phone 1" }, lR8zEroRn: { "data-framer-name": "3" }, m_j1yDI2U: { "data-framer-name": "Phone 2" }, v6XQIQJDM: { "data-framer-name": "2" } }, baseVariant, gestureVariant), children: [isDisplayed() && /* @__PURE__ */ _jsx3(motion3.div, { className: "framer-1va5b8b", layoutDependency, layoutId: "DestinationCardVariations__jNjFDMmwJ", style: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 }, children: /* @__PURE__ */ _jsx3(ChildrenCanSuspend, { children: /* @__PURE__ */ _jsx3(QueryData, { query: query1(), children: (collection, paginationInfo, loadMore) => {
    return /* @__PURE__ */ _jsx3(_Fragment, { children: collection?.map(({ AYlbiDb5i: AYlbiDb5ijNjFDMmwJ, DUwgLv8de: DUwgLv8dejNjFDMmwJ, id: idjNjFDMmwJ, jwIgf6tBO: jwIgf6tBOjNjFDMmwJ, MdGfHiRoa: MdGfHiRoajNjFDMmwJ, mle5_OseC: mle5_OseCjNjFDMmwJ, moq7ENOXp: moq7ENOXpjNjFDMmwJ, N6ZbQXHdN: N6ZbQXHdNjNjFDMmwJ }, index) => {
      AYlbiDb5ijNjFDMmwJ ?? (AYlbiDb5ijNjFDMmwJ = "");
      mle5_OseCjNjFDMmwJ ?? (mle5_OseCjNjFDMmwJ = "");
      N6ZbQXHdNjNjFDMmwJ ?? (N6ZbQXHdNjNjFDMmwJ = "");
      return /* @__PURE__ */ _jsx3(LayoutGroup2, { id: `jNjFDMmwJ-${idjNjFDMmwJ}`, children: /* @__PURE__ */ _jsx3(PathVariablesContext.Provider, { value: { N6ZbQXHdN: N6ZbQXHdNjNjFDMmwJ }, children: /* @__PURE__ */ _jsx3(ResolveLinks, { links: [{ href: { pathVariables: { N6ZbQXHdN: N6ZbQXHdNjNjFDMmwJ }, webPageId: "GyTaKLM2w" }, implicitPathVariables: void 0 }, { href: { pathVariables: { N6ZbQXHdN: N6ZbQXHdNjNjFDMmwJ }, webPageId: "GyTaKLM2w" }, implicitPathVariables: void 0 }], children: (resolvedLinks) => /* @__PURE__ */ _jsx3(ComponentViewportProvider, { height: 347, width: componentViewport?.width || "100vw", y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 347) - 0 - 347) / 2 + 0 + 0) + 0 + 0, ...addPropertyOverrides2({ hNnmQlfMO: { height: 410, y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 410) - 0 - 410) / 2 + 0 + 0) + 0 + 0 } }, baseVariant, gestureVariant), children: /* @__PURE__ */ _jsx3(SmartComponentScopedContainer, { className: "framer-47x4db-container", "data-framer-name": "1", layoutDependency, layoutId: "DestinationCardVariations__TzlDwCMoh-container", name: "1", nodeId: "TzlDwCMoh", rendersWithMotion: true, scopeId: "nFX7IZyxE", children: /* @__PURE__ */ _jsx3(Lq1SCV08H_default, { C1hsZu46_: mle5_OseCjNjFDMmwJ, dLGxupNR8: toResponsiveImage2(jwIgf6tBOjNjFDMmwJ), frNH54qUR: toResponsiveImage2(MdGfHiRoajNjFDMmwJ), height: "100%", id: "TzlDwCMoh", layoutId: "DestinationCardVariations__TzlDwCMoh", name: "1", oPpVhQK2s: toResponsiveImage2(moq7ENOXpjNjFDMmwJ), pkV0bmPey: AYlbiDb5ijNjFDMmwJ, qpIcQu3Ta: toResponsiveImage2(DUwgLv8dejNjFDMmwJ), style: { height: "100%", width: "100%" }, variant: matchVariant("wyoBc5GAz"), width: "100%", xHTzW6U42: resolvedLinks[0], ...addPropertyOverrides2({ hNnmQlfMO: { variant: matchVariant("AO3sV8EPR"), xHTzW6U42: resolvedLinks[1] } }, baseVariant, gestureVariant) }) }) }) }) }) }, idjNjFDMmwJ);
    }) });
  } }) }) }), isDisplayed1() && /* @__PURE__ */ _jsx3(motion3.div, { className: "framer-qgqt6f", layoutDependency, layoutId: "DestinationCardVariations__g1zPKUogk", style: { rotateX: 180 }, children: /* @__PURE__ */ _jsx3(ChildrenCanSuspend, { children: /* @__PURE__ */ _jsx3(QueryData, { query: query3(), children: (collection1, paginationInfo1, loadMore1) => {
    return /* @__PURE__ */ _jsx3(_Fragment, { children: collection1?.map(({ AYlbiDb5i: AYlbiDb5ig1zPKUogk, DUwgLv8de: DUwgLv8deg1zPKUogk, id: idg1zPKUogk, jwIgf6tBO: jwIgf6tBOg1zPKUogk, MdGfHiRoa: MdGfHiRoag1zPKUogk, mle5_OseC: mle5_OseCg1zPKUogk, moq7ENOXp: moq7ENOXpg1zPKUogk, N6ZbQXHdN: N6ZbQXHdNg1zPKUogk }, index1) => {
      AYlbiDb5ig1zPKUogk ?? (AYlbiDb5ig1zPKUogk = "");
      mle5_OseCg1zPKUogk ?? (mle5_OseCg1zPKUogk = "");
      N6ZbQXHdNg1zPKUogk ?? (N6ZbQXHdNg1zPKUogk = "");
      return /* @__PURE__ */ _jsx3(LayoutGroup2, { id: `g1zPKUogk-${idg1zPKUogk}`, children: /* @__PURE__ */ _jsx3(PathVariablesContext.Provider, { value: { N6ZbQXHdN: N6ZbQXHdNg1zPKUogk }, children: /* @__PURE__ */ _jsx3(ResolveLinks, { links: [{ href: { pathVariables: { N6ZbQXHdN: N6ZbQXHdNg1zPKUogk }, webPageId: "GyTaKLM2w" }, implicitPathVariables: void 0 }, { href: { pathVariables: { N6ZbQXHdN: N6ZbQXHdNg1zPKUogk }, webPageId: "GyTaKLM2w" }, implicitPathVariables: void 0 }, { href: { pathVariables: { N6ZbQXHdN: N6ZbQXHdNg1zPKUogk }, webPageId: "GyTaKLM2w" }, implicitPathVariables: void 0 }], children: (resolvedLinks1) => /* @__PURE__ */ _jsx3(ComponentViewportProvider, { height: 347, ...addPropertyOverrides2({ m_j1yDI2U: { height: 410, width: componentViewport?.width || "100vw", y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 410) - 0 - 410) / 2 + 0 + 0) + 0 + 0 }, v6XQIQJDM: { width: componentViewport?.width || "100vw", y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 347) - 0 - 347) / 2 + 0 + 0) + 0 + 0 } }, baseVariant, gestureVariant), children: /* @__PURE__ */ _jsx3(SmartComponentScopedContainer, { className: "framer-7pu9fc-container", "data-framer-name": "2", layoutDependency, layoutId: "DestinationCardVariations__xXwTZjN0w-container", name: "2", nodeId: "xXwTZjN0w", rendersWithMotion: true, scopeId: "nFX7IZyxE", children: /* @__PURE__ */ _jsx3(Lq1SCV08H_default, { C1hsZu46_: mle5_OseCg1zPKUogk, dLGxupNR8: toResponsiveImage2(jwIgf6tBOg1zPKUogk), frNH54qUR: toResponsiveImage2(MdGfHiRoag1zPKUogk), height: "100%", id: "xXwTZjN0w", layoutId: "DestinationCardVariations__xXwTZjN0w", name: "2", oPpVhQK2s: toResponsiveImage2(moq7ENOXpg1zPKUogk), pkV0bmPey: AYlbiDb5ig1zPKUogk, qpIcQu3Ta: toResponsiveImage2(DUwgLv8deg1zPKUogk), style: { height: "100%", width: "100%" }, variant: matchVariant("wyoBc5GAz"), width: "100%", xHTzW6U42: resolvedLinks1[0], ...addPropertyOverrides2({ m_j1yDI2U: { variant: matchVariant("AO3sV8EPR"), xHTzW6U42: resolvedLinks1[2] }, v6XQIQJDM: { xHTzW6U42: resolvedLinks1[1] } }, baseVariant, gestureVariant) }) }) }) }) }) }, idg1zPKUogk);
    }) });
  } }) }) }), isDisplayed2() && /* @__PURE__ */ _jsx3(motion3.div, { className: "framer-14ua9as", layoutDependency, layoutId: "DestinationCardVariations__V7cCACaWH", children: /* @__PURE__ */ _jsx3(ChildrenCanSuspend, { children: /* @__PURE__ */ _jsx3(QueryData, { query: query5(), children: (collection2, paginationInfo2, loadMore2) => {
    return /* @__PURE__ */ _jsx3(_Fragment, { children: collection2?.map(({ AYlbiDb5i: AYlbiDb5iV7cCACaWH, DUwgLv8de: DUwgLv8deV7cCACaWH, id: idV7cCACaWH, jwIgf6tBO: jwIgf6tBOV7cCACaWH, MdGfHiRoa: MdGfHiRoaV7cCACaWH, mle5_OseC: mle5_OseCV7cCACaWH, moq7ENOXp: moq7ENOXpV7cCACaWH, N6ZbQXHdN: N6ZbQXHdNV7cCACaWH }, index2) => {
      AYlbiDb5iV7cCACaWH ?? (AYlbiDb5iV7cCACaWH = "");
      mle5_OseCV7cCACaWH ?? (mle5_OseCV7cCACaWH = "");
      N6ZbQXHdNV7cCACaWH ?? (N6ZbQXHdNV7cCACaWH = "");
      return /* @__PURE__ */ _jsx3(LayoutGroup2, { id: `V7cCACaWH-${idV7cCACaWH}`, children: /* @__PURE__ */ _jsx3(PathVariablesContext.Provider, { value: { N6ZbQXHdN: N6ZbQXHdNV7cCACaWH }, children: /* @__PURE__ */ _jsx3(ResolveLinks, { links: [{ href: { pathVariables: { N6ZbQXHdN: N6ZbQXHdNV7cCACaWH }, webPageId: "GyTaKLM2w" }, implicitPathVariables: void 0 }, { href: { pathVariables: { N6ZbQXHdN: N6ZbQXHdNV7cCACaWH }, webPageId: "GyTaKLM2w" }, implicitPathVariables: void 0 }, { href: { pathVariables: { N6ZbQXHdN: N6ZbQXHdNV7cCACaWH }, webPageId: "GyTaKLM2w" }, implicitPathVariables: void 0 }], children: (resolvedLinks2) => /* @__PURE__ */ _jsx3(ComponentViewportProvider, { height: 347, ...addPropertyOverrides2({ Ghvlz5YZz: { height: 410, width: componentViewport?.width || "100vw", y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 410) - 0 - 410) / 2 + 0 + 0) + 0 + 0 }, lR8zEroRn: { width: componentViewport?.width || "100vw", y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 347) - 0 - 347) / 2 + 0 + 0) + 0 + 0 } }, baseVariant, gestureVariant), children: /* @__PURE__ */ _jsx3(SmartComponentScopedContainer, { className: "framer-1cplgsm-container", "data-framer-name": "3", layoutDependency, layoutId: "DestinationCardVariations__TVImvWq9v-container", name: "3", nodeId: "TVImvWq9v", rendersWithMotion: true, scopeId: "nFX7IZyxE", children: /* @__PURE__ */ _jsx3(Lq1SCV08H_default, { C1hsZu46_: mle5_OseCV7cCACaWH, dLGxupNR8: toResponsiveImage2(jwIgf6tBOV7cCACaWH), frNH54qUR: toResponsiveImage2(MdGfHiRoaV7cCACaWH), height: "100%", id: "TVImvWq9v", layoutId: "DestinationCardVariations__TVImvWq9v", name: "3", oPpVhQK2s: toResponsiveImage2(moq7ENOXpV7cCACaWH), pkV0bmPey: AYlbiDb5iV7cCACaWH, qpIcQu3Ta: toResponsiveImage2(DUwgLv8deV7cCACaWH), style: { height: "100%", width: "100%" }, variant: matchVariant("wyoBc5GAz"), width: "100%", xHTzW6U42: resolvedLinks2[0], ...addPropertyOverrides2({ Ghvlz5YZz: { variant: matchVariant("AO3sV8EPR"), xHTzW6U42: resolvedLinks2[2] }, lR8zEroRn: { xHTzW6U42: resolvedLinks2[1] } }, baseVariant, gestureVariant) }) }) }) }) }) }, idV7cCACaWH);
    }) });
  } }) }) }), isDisplayed3() && /* @__PURE__ */ _jsx3(motion3.div, { className: "framer-10245o3", layoutDependency, layoutId: "DestinationCardVariations__CSIa3gOmb", style: { rotateX: 180 }, children: /* @__PURE__ */ _jsx3(ChildrenCanSuspend, { children: /* @__PURE__ */ _jsx3(QueryData, { query: query7(), children: (collection3, paginationInfo3, loadMore3) => {
    return /* @__PURE__ */ _jsx3(_Fragment, { children: collection3?.map(({ AYlbiDb5i: AYlbiDb5iCSIa3gOmb, DUwgLv8de: DUwgLv8deCSIa3gOmb, id: idCSIa3gOmb, jwIgf6tBO: jwIgf6tBOCSIa3gOmb, MdGfHiRoa: MdGfHiRoaCSIa3gOmb, mle5_OseC: mle5_OseCCSIa3gOmb, moq7ENOXp: moq7ENOXpCSIa3gOmb, N6ZbQXHdN: N6ZbQXHdNCSIa3gOmb }, index3) => {
      AYlbiDb5iCSIa3gOmb ?? (AYlbiDb5iCSIa3gOmb = "");
      mle5_OseCCSIa3gOmb ?? (mle5_OseCCSIa3gOmb = "");
      N6ZbQXHdNCSIa3gOmb ?? (N6ZbQXHdNCSIa3gOmb = "");
      return /* @__PURE__ */ _jsx3(LayoutGroup2, { id: `CSIa3gOmb-${idCSIa3gOmb}`, children: /* @__PURE__ */ _jsx3(PathVariablesContext.Provider, { value: { N6ZbQXHdN: N6ZbQXHdNCSIa3gOmb }, children: /* @__PURE__ */ _jsx3(ResolveLinks, { links: [{ href: { pathVariables: { N6ZbQXHdN: N6ZbQXHdNCSIa3gOmb }, webPageId: "GyTaKLM2w" }, implicitPathVariables: void 0 }, { href: { pathVariables: { N6ZbQXHdN: N6ZbQXHdNCSIa3gOmb }, webPageId: "GyTaKLM2w" }, implicitPathVariables: void 0 }, { href: { pathVariables: { N6ZbQXHdN: N6ZbQXHdNCSIa3gOmb }, webPageId: "GyTaKLM2w" }, implicitPathVariables: void 0 }], children: (resolvedLinks3) => /* @__PURE__ */ _jsx3(ComponentViewportProvider, { height: 347, ...addPropertyOverrides2({ CpRXzXKUV: { height: 410, width: componentViewport?.width || "100vw", y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 410) - 0 - 410) / 2 + 0 + 0) + 0 + 0 }, h37dsFv_7: { width: componentViewport?.width || "100vw", y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 347) - 0 - 347) / 2 + 0 + 0) + 0 + 0 } }, baseVariant, gestureVariant), children: /* @__PURE__ */ _jsx3(SmartComponentScopedContainer, { className: "framer-g6wdwt-container", "data-framer-name": "4", layoutDependency, layoutId: "DestinationCardVariations__UI0TFIRrZ-container", name: "4", nodeId: "UI0TFIRrZ", rendersWithMotion: true, scopeId: "nFX7IZyxE", children: /* @__PURE__ */ _jsx3(Lq1SCV08H_default, { C1hsZu46_: mle5_OseCCSIa3gOmb, dLGxupNR8: toResponsiveImage2(jwIgf6tBOCSIa3gOmb), frNH54qUR: toResponsiveImage2(MdGfHiRoaCSIa3gOmb), height: "100%", id: "UI0TFIRrZ", layoutId: "DestinationCardVariations__UI0TFIRrZ", name: "4", oPpVhQK2s: toResponsiveImage2(moq7ENOXpCSIa3gOmb), pkV0bmPey: AYlbiDb5iCSIa3gOmb, qpIcQu3Ta: toResponsiveImage2(DUwgLv8deCSIa3gOmb), style: { height: "100%", width: "100%" }, variant: matchVariant("wyoBc5GAz"), width: "100%", xHTzW6U42: resolvedLinks3[0], ...addPropertyOverrides2({ CpRXzXKUV: { variant: matchVariant("AO3sV8EPR"), xHTzW6U42: resolvedLinks3[2] }, h37dsFv_7: { xHTzW6U42: resolvedLinks3[1] } }, baseVariant, gestureVariant) }) }) }) }) }) }, idCSIa3gOmb);
    }) });
  } }) }) })] }) }) }) });
});
var css5 = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-tCUGK.framer-1dadiei, .framer-tCUGK .framer-1dadiei { display: block; }", ".framer-tCUGK.framer-liv7n8 { align-content: center; align-items: center; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 100%; will-change: var(--framer-will-change-override, transform); }", ".framer-tCUGK .framer-1va5b8b, .framer-tCUGK .framer-qgqt6f, .framer-tCUGK .framer-14ua9as, .framer-tCUGK .framer-10245o3 { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; padding: 0px; position: relative; width: 100%; }", ".framer-tCUGK .framer-47x4db-container { aspect-ratio: 1.3256484149855907 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 347px); position: relative; width: 100%; }", ".framer-tCUGK .framer-7pu9fc-container, .framer-tCUGK .framer-1cplgsm-container, .framer-tCUGK .framer-g6wdwt-container { aspect-ratio: 1.3256484149855907 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 151px); position: relative; width: 100%; }", ".framer-tCUGK.framer-v-1mo1ltp .framer-7pu9fc-container, .framer-tCUGK.framer-v-dcsg04 .framer-1cplgsm-container, .framer-tCUGK.framer-v-t42hci .framer-g6wdwt-container { height: var(--framer-aspect-ratio-supported, 347px); }", ".framer-tCUGK.framer-v-9786tg .framer-47x4db-container, .framer-tCUGK.framer-v-7pic5c .framer-7pu9fc-container, .framer-tCUGK.framer-v-1cfk55y .framer-1cplgsm-container, .framer-tCUGK.framer-v-1xwkswy .framer-g6wdwt-container { aspect-ratio: 1.1219512195121952 / 1; height: var(--framer-aspect-ratio-supported, 410px); }"];
var FramernFX7IZyxE = withCSS3(Component3, css5, "framer-tCUGK");
var nFX7IZyxE_default = FramernFX7IZyxE;
FramernFX7IZyxE.displayName = "Destination Card Variations";
FramernFX7IZyxE.defaultProps = { height: 347, width: 460 };
addPropertyControls3(FramernFX7IZyxE, { variant: { options: ["lhS3MJFmA", "v6XQIQJDM", "lR8zEroRn", "h37dsFv_7", "hNnmQlfMO", "m_j1yDI2U", "Ghvlz5YZz", "CpRXzXKUV"], optionTitles: ["1", "2", "3", "4", "Phone 1", "Phone 2", "Phone 3", "Phone 4"], title: "Variant", type: ControlType3.Enum } });
addFonts2(FramernFX7IZyxE, [{ explicitInter: true, fonts: [] }, ...DestinationCardFonts], { supportsExplicitInterCodegen: true });
FramernFX7IZyxE.loader = { load: (props, context) => {
  const locale = context.locale;
  const queryCacheEntry = queryCache.get(query1(), locale);
  const queryCacheEntry1 = queryCache.get(query3(), locale);
  const queryCacheEntry2 = queryCache.get(query5(), locale);
  const queryCacheEntry3 = queryCache.get(query7(), locale);
  return Promise.allSettled([queryCacheEntry.preload(), queryCacheEntry1.preload(), queryCacheEntry2.preload(), queryCacheEntry3.preload(), (async () => {
    const parentData = await queryCacheEntry.readMaybeAsync() ?? [];
    return Promise.allSettled(parentData.flatMap((item) => forwardLoader(Lq1SCV08H_default, {}, context)));
  })(), (async () => {
    const parentData = await queryCacheEntry1.readMaybeAsync() ?? [];
    return Promise.allSettled(parentData.flatMap((item) => forwardLoader(Lq1SCV08H_default, {}, context)));
  })(), (async () => {
    const parentData = await queryCacheEntry2.readMaybeAsync() ?? [];
    return Promise.allSettled(parentData.flatMap((item) => forwardLoader(Lq1SCV08H_default, {}, context)));
  })(), (async () => {
    const parentData = await queryCacheEntry3.readMaybeAsync() ?? [];
    return Promise.allSettled(parentData.flatMap((item) => forwardLoader(Lq1SCV08H_default, {}, context)));
  })()]);
} };
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "FramernFX7IZyxE", "slots": [], "annotations": { "framerAutoSizeImages": "true", "framerCanvasComponentVariantDetails": '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"v6XQIQJDM":{"layout":["fixed","auto"]},"lR8zEroRn":{"layout":["fixed","auto"]},"h37dsFv_7":{"layout":["fixed","auto"]},"hNnmQlfMO":{"layout":["fixed","auto"]},"m_j1yDI2U":{"layout":["fixed","auto"]},"Ghvlz5YZz":{"layout":["fixed","auto"]},"CpRXzXKUV":{"layout":["fixed","auto"]}}}', "framerIntrinsicWidth": "460", "framerColorSyntax": "true", "framerContractVersion": "1", "framerIntrinsicHeight": "347", "framerImmutableVariables": "true", "framerDisplayContentsDiv": "false", "framerComponentViewportWidth": "true" } }, "Props": { "type": "tsType", "annotations": { "framerContractVersion": "1" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  nFX7IZyxE_default as default
};
