
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

// http-url:https://framerusercontent.com/modules/5u066Mg7NSSrwZQp42cB/U3eJp3Xwly9imlp7efk1/Evu3KTFo4.js
import { jsx as _jsx4, jsxs as _jsxs4, Fragment as _Fragment } from "react/jsx-runtime";
import { addFonts as addFonts4, addPropertyControls as addPropertyControls4, ChildrenCanSuspend, ComponentViewportProvider, ControlType as ControlType4, cx as cx4, forwardLoader, getFonts, PathVariablesContext, queryCache, ResolveLinks, SmartComponentScopedContainer, useActiveVariantCallback as useActiveVariantCallback3, useComponentViewport as useComponentViewport4, useLoadMorePaginatedQuery, useLocaleInfo as useLocaleInfo4, useQueryData, useRouter, useVariantState as useVariantState4, withCSS as withCSS4, withFX as withFX2 } from "./_framer-runtime.js";
import { LayoutGroup as LayoutGroup4, motion as motion4, MotionConfigContext as MotionConfigContext4 } from "framer-motion";
import * as React4 from "react";
import { useRef as useRef4 } from "react";

// http-url:https://framerusercontent.com/modules/9ai24qA0VdxiK97eOIiT/UgR9i1pOTQfZjX21t9QM/ofgUd8RAs.js
import { addPropertyControls as e5, ControlType as l3, QueryEngine as t4 } from "./_framer-runtime.js";

// http-url:https://framerusercontent.com/modules/9ai24qA0VdxiK97eOIiT/UgR9i1pOTQfZjX21t9QM/ofgUd8RAs-0.js
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

// http-url:https://framerusercontent.com/modules/9ai24qA0VdxiK97eOIiT/UgR9i1pOTQfZjX21t9QM/ofgUd8RAs-1.js
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

// http-url:https://framerusercontent.com/modules/9ai24qA0VdxiK97eOIiT/UgR9i1pOTQfZjX21t9QM/ofgUd8RAs.js
var o3 = { bRavtZ4WJ: { isNullable: true, type: l3.String }, bRq_cg2f1: { isNullable: true, type: l3.String }, cfJPgXq_U: { isNullable: true, type: l3.ResponsiveImage }, CG2fq80OB: { isNullable: true, type: l3.String }, createdAt: { isNullable: true, type: l3.Date }, cVAeiPYEI: { isNullable: true, type: l3.String }, dOhhE2NhA: { isNullable: true, type: l3.String }, ffrqBkpLP: { isNullable: true, type: l3.String }, g7An3ABSN: { isNullable: true, type: l3.String }, GN9Ro20DO: { isNullable: true, type: l3.RichText }, hiaV5ugMo: { isNullable: true, type: l3.Enum }, id: { isNullable: false, type: l3.String }, jAG_ZOrDt: { isNullable: true, type: l3.String }, JeJn0Mzjq: { isNullable: true, type: l3.String }, jYJd_eJeg: { isNullable: true, type: l3.String }, L76jPdbmu: { isNullable: true, type: l3.String }, LBEguSwMh: { isNullable: true, type: l3.String }, mn_jPvvis: { isNullable: true, type: l3.RichText }, mpGhkoH7G: { isNullable: true, type: l3.String }, n_FA_YuPi: { isNullable: true, type: l3.String }, nextItemId: { isNullable: true, type: l3.String }, NFLTxUnmf: { isNullable: true, type: l3.String }, NqO1rNcKC: { isNullable: true, type: l3.ResponsiveImage }, OQB9wac6B: { isNullable: true, type: l3.String }, previousItemId: { isNullable: true, type: l3.String }, R57mAdaW0: { isNullable: true, type: l3.RichText }, rocdeOeJh: { isNullable: true, type: l3.Boolean }, rrBsiGNOX: { isNullable: true, type: l3.String }, S3hWR1Uhi: { isNullable: true, type: l3.String }, TK4NoE0J2: { isNullable: true, type: l3.String }, updatedAt: { isNullable: true, type: l3.Date }, Vbv0PxwNP: { isNullable: true, type: l3.String }, veair9Kgg: { isNullable: true, type: l3.String }, VYZgQYnYx: { isNullable: true, type: l3.String }, xAY55kYOW: { isNullable: true, type: l3.String }, Y0YgAVySr: { definition: { definitions: { id: { isNullable: false, type: l3.String }, rJYK8h7zU: { isNullable: true, type: l3.ResponsiveImage } }, isNullable: true, type: l3.Object }, isNullable: true, type: l3.Array }, zMn8laqhR: { isNullable: true, type: l3.String } };
var m3 = ["id"];
var n3 = { type: 1 };
var c3 = ["previousItemId"];
var u3 = ["nextItemId"];
var s3 = ["id", "ffrqBkpLP"];
var f3 = ["ffrqBkpLP", "id"];
var d3 = ["rocdeOeJh"];
var p3 = { type: 0 };
var g3 = ["L76jPdbmu"];
var h2 = ["cfJPgXq_U"];
var y2 = ["ffrqBkpLP"];
var R2 = ["hiaV5ugMo"];
var S2 = ["NqO1rNcKC"];
var N2 = ["n_FA_YuPi"];
var w2 = ["R57mAdaW0"];
var U2 = ["mn_jPvvis"];
var A2 = ["bRavtZ4WJ"];
var x2 = ["zMn8laqhR"];
var b2 = ["bRq_cg2f1"];
var L2 = ["g7An3ABSN"];
var I2 = ["cVAeiPYEI"];
var V2 = ["LBEguSwMh"];
var v2 = ["Vbv0PxwNP"];
var P2 = ["OQB9wac6B"];
var B2 = ["S3hWR1Uhi"];
var O2 = ["mpGhkoH7G"];
var q2 = ["veair9Kgg"];
var Y2 = ["jAG_ZOrDt"];
var T2 = ["VYZgQYnYx"];
var J2 = ["CG2fq80OB"];
var _2 = ["jYJd_eJeg"];
var j2 = ["TK4NoE0J2"];
var G2 = ["GN9Ro20DO"];
var D2 = ["dOhhE2NhA"];
var k2 = ["NFLTxUnmf"];
var C2 = ["JeJn0Mzjq"];
var X2 = ["rrBsiGNOX"];
var E2 = ["xAY55kYOW"];
var M2 = ["Y0YgAVySr"];
var K2 = [];
var Z2 = (e6) => {
  let l4 = K2[e6];
  if (l4)
    return l4().then((e7) => e7.default);
};
var W2 = {};
var z2 = g2(W2);
var F2 = new t4();
var Q2 = { collectionByLocaleId: { default: new tP({ chunks: [""], id: "116b9a87-dd9e-4f92-8f76-f4bc0dad097bdefault", indexes: [new tN({ collation: n3, collectionSchema: o3, fieldNames: m3, range: { from: 0, to: 625 }, url: "" }), new tN({ collation: n3, collectionSchema: o3, fieldNames: c3, range: { from: 625, to: 1249 }, url: "" }), new tN({ collation: n3, collectionSchema: o3, fieldNames: u3, range: { from: 1249, to: 1869 }, url: "" }), new tN({ collation: n3, collectionSchema: o3, fieldNames: s3, range: { from: 1869, to: 3143 }, url: "" }), new tN({ collation: n3, collectionSchema: o3, fieldNames: f3, range: { from: 3143, to: 4417 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: d3, range: { from: 4417, to: 4749 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: g3, range: { from: 4749, to: 5672 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: h2, range: { from: 5672, to: 22386 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: y2, range: { from: 22386, to: 23304 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: R2, range: { from: 23304, to: 23936 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: S2, range: { from: 23936, to: 42296 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: N2, range: { from: 42296, to: 42885 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: w2, range: { from: 42885, to: 56315 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: U2, range: { from: 56315, to: 66547 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: A2, range: { from: 66547, to: 67666 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: x2, range: { from: 67666, to: 70437 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: b2, range: { from: 70437, to: 71568 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: L2, range: { from: 71568, to: 74532 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: I2, range: { from: 74532, to: 75722 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: V2, range: { from: 75722, to: 78454 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: v2, range: { from: 78454, to: 79663 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: P2, range: { from: 79663, to: 82296 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: B2, range: { from: 82296, to: 83424 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: O2, range: { from: 83424, to: 85577 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: q2, range: { from: 85577, to: 86276 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: Y2, range: { from: 86276, to: 87702 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: T2, range: { from: 87702, to: 88109 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: J2, range: { from: 88109, to: 88516 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: _2, range: { from: 88516, to: 88923 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: j2, range: { from: 88923, to: 89330 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: G2, range: { from: 89330, to: 105317 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: D2, range: { from: 105317, to: 106149 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: k2, range: { from: 106149, to: 106817 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: C2, range: { from: 106817, to: 107572 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: X2, range: { from: 107572, to: 108141 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: E2, range: { from: 108141, to: 109270 }, url: "" }), new tN({ collation: p3, collectionSchema: o3, fieldNames: M2, range: { from: 109270, to: 169579 }, url: "" })], resolveRichText: z2, resolveVectorSetItem: Z2, schema: o3 }) }, displayName: "Tours", id: "116b9a87-dd9e-4f92-8f76-f4bc0dad097b" };
var ofgUd8RAs_default = Q2;
e5(Q2, { rocdeOeJh: { defaultValue: true, title: "Featured", type: l3.Boolean }, L76jPdbmu: { defaultValue: "", title: "Title", type: l3.String }, cfJPgXq_U: { title: "Cover Image", type: l3.ResponsiveImage }, ffrqBkpLP: { preventLocalization: true, title: "Slug", type: l3.String }, hiaV5ugMo: { defaultValue: "E0vZXLKDX", options: ["E0vZXLKDX", "qA5ChX0_j", "ZClquX4Sh", "PORP5XpN1"], optionTitles: ["All", "Nature ", "Romantic", "Adventure"], title: "Categories", type: l3.Enum }, NqO1rNcKC: { title: "Secondary Image", type: l3.ResponsiveImage }, n_FA_YuPi: { defaultValue: "", title: "Category", type: l3.String }, R57mAdaW0: { defaultValue: "", title: "Trip Overview", type: l3.RichText }, mn_jPvvis: { defaultValue: "", title: "Trip Highlights", type: l3.RichText }, bRavtZ4WJ: { defaultValue: "", title: "Itinerary Title 1", type: l3.String }, zMn8laqhR: { defaultValue: "", title: "Itinerary Subtext 1", type: l3.String }, bRq_cg2f1: { defaultValue: "", title: "Itinerary Title 2", type: l3.String }, g7An3ABSN: { defaultValue: "", title: "Itinerary Subtext 2", type: l3.String }, cVAeiPYEI: { defaultValue: "", title: "Itinerary Title 3", type: l3.String }, LBEguSwMh: { defaultValue: "", title: "Itinerary Subtext 3", type: l3.String }, Vbv0PxwNP: { defaultValue: "", title: "Itinerary Title 4", type: l3.String }, OQB9wac6B: { defaultValue: "", title: "Itinerary Subtext 4", type: l3.String }, S3hWR1Uhi: { defaultValue: "", title: "Itinerary Title 5", type: l3.String }, mpGhkoH7G: { defaultValue: "", title: "Itinerary Subtext 5", type: l3.String }, veair9Kgg: { defaultValue: "", title: "Itinerary Title 6", type: l3.String }, jAG_ZOrDt: { defaultValue: "", title: "Itinerary Subtext 6", type: l3.String }, VYZgQYnYx: { defaultValue: "", title: "Itinerary Title 7", type: l3.String }, CG2fq80OB: { defaultValue: "", title: "Itinerary Subtext 7", type: l3.String }, jYJd_eJeg: { defaultValue: "", title: "Itinerary Title 8", type: l3.String }, TK4NoE0J2: { defaultValue: "", title: "Itinerary Subtext 8", type: l3.String }, GN9Ro20DO: { defaultValue: "", title: "What\u2019s Included", type: l3.RichText }, dOhhE2NhA: { defaultValue: "", title: "Duration", type: l3.String }, NFLTxUnmf: { defaultValue: "", title: "Departure", type: l3.String }, JeJn0Mzjq: { defaultValue: "", title: "Group Size", type: l3.String }, rrBsiGNOX: { defaultValue: "", title: "Price:", type: l3.String }, xAY55kYOW: { defaultValue: "", title: "Includes", type: l3.String }, Y0YgAVySr: { __vekterDefault: [], control: { controls: { rJYK8h7zU: { title: "Image", type: "responsiveimage" } }, type: "object" }, title: "Gallery", type: l3.Array }, createdAt: { title: "Created", type: l3.Date }, updatedAt: { title: "Updated", type: l3.Date }, previousItemId: { dataIdentifier: "local-module:collection/ofgUd8RAs:default", title: "Previous", type: l3.CollectionReference }, nextItemId: { dataIdentifier: "local-module:collection/ofgUd8RAs:default", title: "Next", type: l3.CollectionReference } });

// http-url:https://framerusercontent.com/modules/zu1vk3TGjJV2K21QzbPL/AqjoNi6KQK8NbN3Czm5k/eq8nK2pZY.js
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { addFonts, addPropertyControls, ControlType, cx, getFontsFromSharedStyle, RichText, useActiveVariantCallback, useComponentViewport, useLocaleInfo, useVariantState, withCSS, withFX, withOptimizedAppearEffect } from "./_framer-runtime.js";
import { LayoutGroup, motion, MotionConfigContext } from "framer-motion";
import * as React from "react";
import { useRef } from "react";

// http-url:https://framerusercontent.com/modules/ZP5msFN8qqgQHiAyv6dz/AOw0K4JBOEQ7KnMD9iUn/TiWSjQ2lc.js
import { fontStore } from "./_framer-runtime.js";
fontStore.loadFonts(["GF;Cal Sans-regular"]);
var fonts = [{ explicitInter: true, fonts: [{ cssFamilyName: "Cal Sans", openType: true, source: "google", style: "normal", uiFamilyName: "Cal Sans", url: "https://fonts.gstatic.com/s/calsans/v2/fdN99sWUv3gWqXxqqSBevloE4LZx.woff2", weight: "400" }] }];
var css = [`.framer-VgaHN .framer-styles-preset-1qeu4bo:not(.rich-text-wrapper), .framer-VgaHN .framer-styles-preset-1qeu4bo.rich-text-wrapper p { --framer-font-family: "Cal Sans", "Cal Sans Placeholder", sans-serif; --framer-font-open-type-features: 'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on; --framer-font-size: 16px; --framer-font-style: normal; --framer-font-variation-axes: normal; --framer-font-weight: 400; --framer-letter-spacing: 0em; --framer-line-height: 1.4em; --framer-paragraph-spacing: 20px; --framer-text-alignment: start; --framer-text-color: var(--token-73d82950-3751-42a6-927e-1ac6d9a336d2, #191919); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: none; }`];
var className = "framer-VgaHN";

// http-url:https://framerusercontent.com/modules/zu1vk3TGjJV2K21QzbPL/AqjoNi6KQK8NbN3Czm5k/eq8nK2pZY.js
var MotionDivWithFX = withFX(motion.div);
var MotionDivWithFXWithOptimizedAppearEffect = withOptimizedAppearEffect(withFX(motion.div));
var cycleOrder = ["GYEiMU0kJ", "XM_9Tb_ss", "xNZjJyuDJ"];
var serializationHash = "framer-brk1c";
var variantClassNames = { GYEiMU0kJ: "framer-v-hmv0df", XM_9Tb_ss: "framer-v-4wjtoj", xNZjJyuDJ: "framer-v-jd8enl" };
function addPropertyOverrides(overrides, ...variants) {
  const nextOverrides = {};
  variants?.forEach((variant) => variant && Object.assign(nextOverrides, overrides[variant]));
  return nextOverrides;
}
var transition1 = { duration: 0, type: "tween" };
var transition2 = { delay: 0, duration: 0.3, ease: [0.44, 0, 0.56, 1], type: "tween" };
var animation = { opacity: 1, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, skewX: 0, skewY: 0, transition: transition2, x: 0, y: 0 };
var animation1 = { opacity: 1e-3, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
var transition3 = { delay: 0, duration: 1, ease: [0, 0, 1, 1], type: "tween" };
var animation2 = { opacity: 1, rotate: 360, rotateX: 0, rotateY: 0, scale: 1, skewX: 0, skewY: 0, x: 0, y: 0 };
var Transition = ({ value, children }) => {
  const config = React.useContext(MotionConfigContext);
  const transition = value ?? config.transition;
  const contextValue = React.useMemo(() => ({ ...config, transition }), [JSON.stringify(transition)]);
  return /* @__PURE__ */ _jsx(MotionConfigContext.Provider, { value: contextValue, children });
};
var humanReadableVariantMap = { Default: "GYEiMU0kJ", Hidden: "xNZjJyuDJ", Loading: "XM_9Tb_ss" };
var Variants = motion.create(React.Fragment);
var getProps = ({ click, height, id, width, ...props }) => {
  return { ...props, variant: humanReadableVariantMap[props.variant] ?? props.variant ?? "GYEiMU0kJ", Wld3NDzSj: click ?? props.Wld3NDzSj };
};
var createLayoutDependency = (props, variants) => {
  if (props.layoutDependency)
    return variants.join("-") + props.layoutDependency;
  return variants.join("-");
};
var Component = /* @__PURE__ */ React.forwardRef(function(props, ref) {
  const fallbackRef = useRef(null);
  const refBinding = ref ?? fallbackRef;
  const defaultLayoutId = React.useId();
  const { activeLocale, setLocale } = useLocaleInfo();
  const componentViewport = useComponentViewport();
  const { style, className: className6, layoutId, variant, Wld3NDzSj, ...restProps } = getProps(props);
  const { baseVariant, classNames, clearLoadingGesture, gestureHandlers, gestureVariant, isLoading, setGestureState, setVariant, variants } = useVariantState({ cycleOrder, defaultVariant: "GYEiMU0kJ", ref: refBinding, variant, variantClassNames });
  const layoutDependency = createLayoutDependency(props, variants);
  const { activeVariantCallback, delay } = useActiveVariantCallback(baseVariant);
  const onTapn9xadi = activeVariantCallback(async (...args) => {
    setGestureState({ isPressed: false });
    if (Wld3NDzSj) {
      const res = await Wld3NDzSj(...args);
      if (res === false)
        return false;
    }
  });
  const sharedStyleClassNames = [className];
  const isDisplayed = () => {
    if (baseVariant === "xNZjJyuDJ")
      return false;
    return true;
  };
  const scopingClassNames = cx(serializationHash, ...sharedStyleClassNames);
  const isDisplayed1 = () => {
    if (baseVariant === "XM_9Tb_ss")
      return false;
    return true;
  };
  const isDisplayed2 = () => {
    if (baseVariant === "XM_9Tb_ss")
      return true;
    return false;
  };
  return /* @__PURE__ */ _jsx(LayoutGroup, { id: layoutId ?? defaultLayoutId, children: /* @__PURE__ */ _jsx(Variants, { animate: variants, initial: false, children: isDisplayed() && /* @__PURE__ */ _jsx(Transition, { value: transition1, children: /* @__PURE__ */ _jsxs(motion.button, { ...restProps, ...gestureHandlers, className: cx(scopingClassNames, "framer-hmv0df", className6, classNames), "data-framer-name": "Default", "data-highlight": true, "data-reset": "button", layoutDependency, layoutId: "TourCategoryCard__GYEiMU0kJ", onTap: onTapn9xadi, ref: refBinding, style: { backgroundColor: "var(--token-7e7de517-525f-4f9d-b74c-fcabbb614510, rgb(3, 61, 74))", borderBottomLeftRadius: 24, borderBottomRightRadius: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, ...style }, ...addPropertyOverrides({ XM_9Tb_ss: { "data-framer-name": "Loading" } }, baseVariant, gestureVariant), children: [isDisplayed1() && /* @__PURE__ */ _jsx(RichText, { __fromCanvasComponent: true, children: /* @__PURE__ */ _jsx(React.Fragment, { children: /* @__PURE__ */ _jsx(motion.p, { className: "framer-styles-preset-1qeu4bo", "data-styles-preset": "TiWSjQ2lc", dir: "auto", style: { "--framer-text-color": "var(--extracted-r6o4lv, var(--token-d8bb658f-330c-4eac-af07-d4bcacb28cd9, rgb(247, 247, 247)))" }, children: "Load More" }) }), className: "framer-w96eie", fonts: ["Inter"], layoutDependency, layoutId: "TourCategoryCard__Ibtij73xY", style: { "--extracted-r6o4lv": "var(--token-d8bb658f-330c-4eac-af07-d4bcacb28cd9, rgb(247, 247, 247))" }, verticalAlignment: "top", withExternalLayout: true }), isDisplayed2() && /* @__PURE__ */ _jsx(MotionDivWithFXWithOptimizedAppearEffect, { __perspectiveFX: false, __smartComponentFX: true, __targetOpacity: 1, animate: animation, className: "framer-v9hdzx", "data-framer-appear-id": "v9hdzx", "data-framer-name": "Spinner", initial: animation1, layoutDependency, layoutId: "TourCategoryCard__BC0WNS0F6", optimized: true, style: { mask: "url('https://framerusercontent.com/images/pGiXYozQ3mE4cilNOItfe2L2fUA.svg?width=20&height=20') alpha no-repeat center / cover add", WebkitMask: "url('https://framerusercontent.com/images/pGiXYozQ3mE4cilNOItfe2L2fUA.svg?width=20&height=20') alpha no-repeat center / cover add" }, children: /* @__PURE__ */ _jsx(MotionDivWithFX, { __framer__loop: animation2, __framer__loopEffectEnabled: true, __framer__loopRepeatDelay: 0, __framer__loopRepeatType: "loop", __framer__loopTransition: transition3, __perspectiveFX: false, __smartComponentFX: true, __targetOpacity: 1, className: "framer-gqe5ud", "data-framer-name": "Conic", layoutDependency, layoutId: "TourCategoryCard__HO6k_kCYH", style: { background: "conic-gradient(from 0deg at 50% 50%, rgba(255, 255, 255, 0) 0deg, rgb(255, 255, 255) 342deg)" }, children: /* @__PURE__ */ _jsx(motion.div, { className: "framer-16xbh8s", "data-framer-name": "Round", layoutDependency, layoutId: "TourCategoryCard__ysEW8H9lS", style: { backgroundColor: "var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255))", borderBottomLeftRadius: 1, borderBottomRightRadius: 1, borderTopLeftRadius: 1, borderTopRightRadius: 1 } }) }) })] }) }) }) });
});
var css2 = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-brk1c.framer-e3m6zl, .framer-brk1c .framer-e3m6zl { display: block; }", ".framer-brk1c.framer-hmv0df { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: auto; justify-content: center; padding: 0px; position: relative; width: 100%; }", ".framer-brk1c .framer-w96eie { -webkit-user-select: none; flex: none; height: auto; position: relative; user-select: none; white-space: pre; width: auto; }", ".framer-brk1c .framer-v9hdzx { aspect-ratio: 1 / 1; flex: none; gap: 10px; height: var(--framer-aspect-ratio-supported, 20px); overflow: visible; position: relative; width: 20px; }", ".framer-brk1c .framer-gqe5ud { bottom: 0px; flex: none; gap: 10px; left: 0px; overflow: visible; position: absolute; right: 0px; top: 0px; }", ".framer-brk1c .framer-16xbh8s { flex: none; height: 2px; left: calc(50.00000000000002% - 2px / 2); overflow: visible; position: absolute; top: 0px; width: 2px; }", ...css];
var Framereq8nK2pZY = withCSS(Component, css2, "framer-brk1c");
var eq8nK2pZY_default = Framereq8nK2pZY;
Framereq8nK2pZY.displayName = "Load More";
Framereq8nK2pZY.defaultProps = { height: 40, width: 120 };
addPropertyControls(Framereq8nK2pZY, { variant: { options: ["GYEiMU0kJ", "XM_9Tb_ss", "xNZjJyuDJ"], optionTitles: ["Default", "Loading", "Hidden"], title: "Variant", type: ControlType.Enum }, Wld3NDzSj: { title: "Click", type: ControlType.EventHandler } });
addFonts(Framereq8nK2pZY, [{ explicitInter: true, fonts: [{ cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2", weight: "400" }] }, ...getFontsFromSharedStyle(fonts)], { supportsExplicitInterCodegen: true });

// http-url:https://framerusercontent.com/modules/qI9SGOlt76RUvkUIGDZG/nb4JdyqkX9eChZnuPvkG/HZgGFYLHJ.js
import { jsx as _jsx2, jsxs as _jsxs2 } from "react/jsx-runtime";
import { addFonts as addFonts2, addPropertyControls as addPropertyControls2, ControlType as ControlType2, cx as cx2, getFontsFromSharedStyle as getFontsFromSharedStyle2, getLoadingLazyAtYPosition, Image as Image1, Link, RichText as RichText2, useComponentViewport as useComponentViewport2, useLocaleInfo as useLocaleInfo2, useVariantState as useVariantState2, withCSS as withCSS2 } from "./_framer-runtime.js";
import { LayoutGroup as LayoutGroup2, motion as motion2, MotionConfigContext as MotionConfigContext2 } from "framer-motion";
import * as React2 from "react";
import { useRef as useRef2 } from "react";

// http-url:https://framerusercontent.com/modules/x29sbpurx8Pc4wP695Ll/hF5vo6yZFhc249Kbg25Q/Bx0vIP7KX.js
import { fontStore as fontStore2 } from "./_framer-runtime.js";
fontStore2.loadFonts(["Inter", "Inter-Bold", "Inter-BoldItalic", "Inter-Italic"]);
var fonts2 = [{ explicitInter: true, fonts: [{ cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/DpPBYI0sL4fYLgAkX8KXOPVt7c.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/4RAEQdEOrcnDkhHiiCbJOw92Lk.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/1K3W8DizY3v4emK8Mb08YHxTbs.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/tUSCtfYVM1I1IchuyCwz9gDdQ.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/VgYFWiwsAC5OYxAycRXXvhze58.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/syRNPWzAMIrcJ3wIlPIP43KjQs.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/GIryZETIX4IFypco5pYZONKhJIo.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/H89BbHkbHDzlxZzxi8uPzTsp90.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/u6gJwDuwB143kpNK1T1MDKDWkMc.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/43sJ6MfOPh1LCJt46OvyDuSbA6o.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/wccHG0r4gBDAIRhfHiOlq6oEkqw.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/WZ367JPwf9bRW6LdTHN8rXgSjw.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/ia3uin3hQWqDrVloC1zEtYHWw.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/2A4Xx7CngadFGlVV4xrO06OBHY.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/CfMzU8w2e7tHgF4T4rATMPuWosA.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/867QObYax8ANsfX4TGEVU9YiCM.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/Oyn2ZbENFdnW7mt2Lzjk1h9Zb9k.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/cdAe8hgZ1cMyLu9g005pAW3xMo.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/DOfvtmE1UplCq161m6Hj8CSQYg.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/pKRFNWFoZl77qYCAIp84lN1h944.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/tKtBcDnBMevsEEJKdNGhhkLzYo.woff2", weight: "400" }] }];
var css3 = ['.framer-rgKzi .framer-styles-preset-4wqll1:not(.rich-text-wrapper), .framer-rgKzi .framer-styles-preset-4wqll1.rich-text-wrapper p { --framer-font-family: "Inter", "Inter Placeholder", sans-serif; --framer-font-family-bold: "Inter", "Inter Placeholder", sans-serif; --framer-font-family-bold-italic: "Inter", "Inter Placeholder", sans-serif; --framer-font-family-italic: "Inter", "Inter Placeholder", sans-serif; --framer-font-open-type-features: normal; --framer-font-size: 14px; --framer-font-style: normal; --framer-font-style-bold: normal; --framer-font-style-bold-italic: italic; --framer-font-style-italic: italic; --framer-font-variation-axes: normal; --framer-font-weight: 400; --framer-font-weight-bold: 700; --framer-font-weight-bold-italic: 700; --framer-font-weight-italic: 400; --framer-letter-spacing: 0.07em; --framer-line-height: 1.3em; --framer-paragraph-spacing: 20px; --framer-text-alignment: right; --framer-text-color: var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, #ffffff); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: none; }'];
var className2 = "framer-rgKzi";

// http-url:https://framerusercontent.com/modules/51qI8GnOlq6PLw46xRt0/xta85hPp5Eg6MiViwyRJ/IwLGSnMVM.js
import { fontStore as fontStore3 } from "./_framer-runtime.js";
fontStore3.loadFonts(["FS;Manrope-semibold", "FS;Manrope-bold"]);
var fonts3 = [{ explicitInter: true, fonts: [{ cssFamilyName: "Manrope", source: "fontshare", style: "normal", uiFamilyName: "Manrope", url: "https://framerusercontent.com/third-party-assets/fontshare/wf/6U2SGH566NSNERG6RGEV3DSNEK7DL2RF/JRDYRKMSAW2H35IWEQIPL67HAJQ35MG5/JNU3GNMUBPWW6V6JTED3S27XL5HN7NM5.woff2", weight: "600" }, { cssFamilyName: "Manrope", source: "fontshare", style: "normal", uiFamilyName: "Manrope", url: "https://framerusercontent.com/third-party-assets/fontshare/wf/NGBUP45ES3F7RD5XGKPEDJ6QEPO4TMOK/EXDVWJ2EDDVVV65UENMX33EDDYBX6OF7/6P4FPMFQH7CCC7RZ4UU4NKSGJ2RLF7V5.woff2", weight: "700" }] }];
var css4 = [`.framer-XfvRQ .framer-styles-preset-s9j4b3:not(.rich-text-wrapper), .framer-XfvRQ .framer-styles-preset-s9j4b3.rich-text-wrapper h5 { --framer-font-family: "Manrope", "Manrope Placeholder", sans-serif; --framer-font-family-bold: "Manrope", "Manrope Placeholder", sans-serif; --framer-font-open-type-features: 'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on; --framer-font-size: 20px; --framer-font-style: normal; --framer-font-style-bold: normal; --framer-font-variation-axes: normal; --framer-font-weight: 600; --framer-font-weight-bold: 700; --framer-letter-spacing: -0.01em; --framer-line-height: 1.3em; --framer-paragraph-spacing: 40px; --framer-text-alignment: start; --framer-text-color: var(--token-e15d98be-dc11-48c5-ad2b-3fbf85780d09, #000000); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: none; }`];
var className3 = "framer-XfvRQ";

// http-url:https://framerusercontent.com/modules/cPT3WhX1cmNdVAmHyZ6N/BJv2ocybYFYhQNiAjgAM/KaUjbt5l5.js
import { fontStore as fontStore4 } from "./_framer-runtime.js";
fontStore4.loadFonts(["GF;Cal Sans-regular"]);
var fonts4 = [{ explicitInter: true, fonts: [{ cssFamilyName: "Cal Sans", openType: true, source: "google", style: "normal", uiFamilyName: "Cal Sans", url: "https://fonts.gstatic.com/s/calsans/v2/fdN99sWUv3gWqXxqqSBevloE4LZx.woff2", weight: "400" }] }];
var css5 = [`.framer-hbzA8 .framer-styles-preset-1pzgksg:not(.rich-text-wrapper), .framer-hbzA8 .framer-styles-preset-1pzgksg.rich-text-wrapper h6 { --framer-font-family: "Cal Sans", "Cal Sans Placeholder", sans-serif; --framer-font-open-type-features: 'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on; --framer-font-size: 18px; --framer-font-style: normal; --framer-font-variation-axes: normal; --framer-font-weight: 400; --framer-letter-spacing: -0.02em; --framer-line-height: 1.4em; --framer-paragraph-spacing: 40px; --framer-text-alignment: start; --framer-text-color: var(--token-73d82950-3751-42a6-927e-1ac6d9a336d2, #191919); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: none; }`];
var className4 = "framer-hbzA8";

// http-url:https://framerusercontent.com/modules/cNlFhwbNhHhPewjAZmDP/Wu03lwJ3WEh6CxP6gHAe/RZB8g5F0A.js
import { fontStore as fontStore5 } from "./_framer-runtime.js";
fontStore5.loadFonts(["Inter", "Inter-Bold", "Inter-BoldItalic", "Inter-Italic"]);
var fonts5 = [{ explicitInter: true, fonts: [{ cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/DpPBYI0sL4fYLgAkX8KXOPVt7c.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/4RAEQdEOrcnDkhHiiCbJOw92Lk.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/1K3W8DizY3v4emK8Mb08YHxTbs.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/tUSCtfYVM1I1IchuyCwz9gDdQ.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/VgYFWiwsAC5OYxAycRXXvhze58.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/syRNPWzAMIrcJ3wIlPIP43KjQs.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/GIryZETIX4IFypco5pYZONKhJIo.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/H89BbHkbHDzlxZzxi8uPzTsp90.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/u6gJwDuwB143kpNK1T1MDKDWkMc.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/43sJ6MfOPh1LCJt46OvyDuSbA6o.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/wccHG0r4gBDAIRhfHiOlq6oEkqw.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/WZ367JPwf9bRW6LdTHN8rXgSjw.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/ia3uin3hQWqDrVloC1zEtYHWw.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/2A4Xx7CngadFGlVV4xrO06OBHY.woff2", weight: "700" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/CfMzU8w2e7tHgF4T4rATMPuWosA.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/867QObYax8ANsfX4TGEVU9YiCM.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/Oyn2ZbENFdnW7mt2Lzjk1h9Zb9k.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/cdAe8hgZ1cMyLu9g005pAW3xMo.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/DOfvtmE1UplCq161m6Hj8CSQYg.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/pKRFNWFoZl77qYCAIp84lN1h944.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "italic", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/tKtBcDnBMevsEEJKdNGhhkLzYo.woff2", weight: "400" }] }];
var css6 = [`.framer-lEqfZ .framer-styles-preset-mxaz03:not(.rich-text-wrapper), .framer-lEqfZ .framer-styles-preset-mxaz03.rich-text-wrapper p { --framer-font-family: "Inter", "Inter Placeholder", sans-serif; --framer-font-family-bold: "Inter", "Inter Placeholder", sans-serif; --framer-font-family-bold-italic: "Inter", "Inter Placeholder", sans-serif; --framer-font-family-italic: "Inter", "Inter Placeholder", sans-serif; --framer-font-open-type-features: 'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on; --framer-font-size: 16px; --framer-font-style: normal; --framer-font-style-bold: normal; --framer-font-style-bold-italic: italic; --framer-font-style-italic: italic; --framer-font-variation-axes: normal; --framer-font-weight: 400; --framer-font-weight-bold: 700; --framer-font-weight-bold-italic: 700; --framer-font-weight-italic: 400; --framer-letter-spacing: -0.02em; --framer-line-height: 1.4em; --framer-paragraph-spacing: 20px; --framer-text-alignment: start; --framer-text-color: var(--token-ae4b47e4-3a13-4e24-99f2-2e3de59f762c, #404040); --framer-text-decoration: none; --framer-text-stroke-color: initial; --framer-text-stroke-width: initial; --framer-text-transform: none; }`];
var className5 = "framer-lEqfZ";

// http-url:https://framerusercontent.com/modules/qI9SGOlt76RUvkUIGDZG/nb4JdyqkX9eChZnuPvkG/HZgGFYLHJ.js
var enabledGestures = { Qs8tpwbzJ: { hover: true }, xThOoVjZW: { pressed: true } };
var cycleOrder2 = ["Qs8tpwbzJ", "xThOoVjZW"];
var serializationHash2 = "framer-Q1jQh";
var variantClassNames2 = { Qs8tpwbzJ: "framer-v-15krg2q", xThOoVjZW: "framer-v-guyto7" };
function addPropertyOverrides2(overrides, ...variants) {
  const nextOverrides = {};
  variants?.forEach((variant) => variant && Object.assign(nextOverrides, overrides[variant]));
  return nextOverrides;
}
var transition12 = { delay: 0, duration: 0.7, ease: [0.44, 0, 0.56, 1], type: "tween" };
var toResponsiveImage = (value) => {
  if (typeof value === "object" && value !== null && typeof value.src === "string") {
    return value;
  }
  return typeof value === "string" ? { src: value } : void 0;
};
var Transition2 = ({ value, children }) => {
  const config = React2.useContext(MotionConfigContext2);
  const transition = value ?? config.transition;
  const contextValue = React2.useMemo(() => ({ ...config, transition }), [JSON.stringify(transition)]);
  return /* @__PURE__ */ _jsx2(MotionConfigContext2.Provider, { value: contextValue, children });
};
var humanReadableVariantMap2 = { Desktop: "Qs8tpwbzJ", Phone: "xThOoVjZW" };
var Variants2 = motion2.create(React2.Fragment);
var getProps2 = ({ daysNights, height, id, image, link, price, title, width, ...props }) => {
  return { ...props, EYMgQFvXw: price ?? props.EYMgQFvXw ?? "40000", MNSKzlU9q: daysNights ?? props.MNSKzlU9q ?? "3 Ng\xE0y / 2 \u0110\xEAm", TYD0ZRJdw: title ?? props.TYD0ZRJdw ?? "Bali", variant: humanReadableVariantMap2[props.variant] ?? props.variant ?? "Qs8tpwbzJ", yv9cnGTFs: link ?? props.yv9cnGTFs, zfXuuYS0f: image ?? props.zfXuuYS0f ?? { alt: "", pixelHeight: 1592, pixelWidth: 2048, src: "https://framerusercontent.com/images/kJwV5maqgeUYjAS9yhanQaNuYg.png?width=2048&height=1592", srcSet: "https://framerusercontent.com/images/kJwV5maqgeUYjAS9yhanQaNuYg.png?scale-down-to=512&width=2048&height=1592 512w,https://framerusercontent.com/images/kJwV5maqgeUYjAS9yhanQaNuYg.png?scale-down-to=1024&width=2048&height=1592 1024w,https://framerusercontent.com/images/kJwV5maqgeUYjAS9yhanQaNuYg.png?width=2048&height=1592 2048w" } };
};
var createLayoutDependency2 = (props, variants) => {
  if (props.layoutDependency)
    return variants.join("-") + props.layoutDependency;
  return variants.join("-");
};
var Component2 = /* @__PURE__ */ React2.forwardRef(function(props, ref) {
  const fallbackRef = useRef2(null);
  const refBinding = ref ?? fallbackRef;
  const defaultLayoutId = React2.useId();
  const { activeLocale, setLocale } = useLocaleInfo2();
  const componentViewport = useComponentViewport2();
  const { style, className: className6, layoutId, variant, zfXuuYS0f, MNSKzlU9q, TYD0ZRJdw, EYMgQFvXw, yv9cnGTFs, ...restProps } = getProps2(props);
  const { baseVariant, classNames, clearLoadingGesture, gestureHandlers, gestureVariant, isLoading, setGestureState, setVariant, variants } = useVariantState2({ cycleOrder: cycleOrder2, defaultVariant: "Qs8tpwbzJ", enabledGestures, ref: refBinding, variant, variantClassNames: variantClassNames2 });
  const layoutDependency = createLayoutDependency2(props, variants);
  const sharedStyleClassNames = [className2, className3, className5, className4];
  const scopingClassNames = cx2(serializationHash2, ...sharedStyleClassNames);
  return /* @__PURE__ */ _jsx2(LayoutGroup2, { id: layoutId ?? defaultLayoutId, children: /* @__PURE__ */ _jsx2(Variants2, { animate: variants, initial: false, children: /* @__PURE__ */ _jsx2(Transition2, { value: transition12, children: /* @__PURE__ */ _jsx2(Link, { href: yv9cnGTFs, motionChild: true, nodeId: "Qs8tpwbzJ", scopeId: "HZgGFYLHJ", children: /* @__PURE__ */ _jsxs2(motion2.a, { ...restProps, ...gestureHandlers, className: `${cx2(scopingClassNames, "framer-15krg2q", className6, classNames)} framer-1d8apr4`, "data-framer-name": "Desktop", layoutDependency, layoutId: "TourCategoryCard__Qs8tpwbzJ", ref: refBinding, style: { ...style }, ...addPropertyOverrides2({ "Qs8tpwbzJ-hover": { "data-framer-name": void 0 }, "xThOoVjZW-pressed": { "data-framer-name": void 0 }, xThOoVjZW: { "data-framer-name": "Phone" } }, baseVariant, gestureVariant), children: [/* @__PURE__ */ _jsxs2(motion2.div, { className: "framer-4cb7np", "data-framer-name": "Image", layoutDependency, layoutId: "TourCategoryCard__IocN5ixSd", style: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 }, children: [/* @__PURE__ */ _jsx2(Image1, { as: "figure", background: { alt: "", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + 0 + (((componentViewport?.height || 780) - 0 - 779.7) / 2 + 0 + 0) + 0.25), pixelHeight: 1592, pixelWidth: 2048, sizes: `max(${componentViewport?.width || "100vw"}, 1px)`, ...toResponsiveImage(zfXuuYS0f), ...{ positionX: "center", positionY: "top" } }, className: "framer-1ga9dig", layoutDependency, layoutId: "TourCategoryCard__MWrul1Wg4", style: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 }, ...addPropertyOverrides2({ "Qs8tpwbzJ-hover": { background: { alt: "", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + 0 + (((componentViewport?.height || 780) - 0 - 779.7) / 2 + 0 + 0) + 0.25), pixelHeight: 1592, pixelWidth: 2048, sizes: `calc(${componentViewport?.width || "100vw"} * 1.05)`, ...toResponsiveImage(zfXuuYS0f), ...{ positionX: "center", positionY: "top" } } }, xThOoVjZW: { background: { alt: "", fit: "fill", loading: getLoadingLazyAtYPosition((componentViewport?.y || 0) + 0 + (((componentViewport?.height || 780) - 0 - 779.2) / 2 + 0 + 0) + 0), pixelHeight: 1592, pixelWidth: 2048, sizes: `max(${componentViewport?.width || "100vw"}, 1px)`, ...toResponsiveImage(zfXuuYS0f), ...{ positionX: "center", positionY: "top" } } } }, baseVariant, gestureVariant) }), /* @__PURE__ */ _jsx2(motion2.div, { className: "framer-plw2ye", "data-border": true, "data-framer-name": "Days/Nights", layoutDependency, layoutId: "TourCategoryCard__nYMRDM6t6", style: { "--border-bottom-width": "1px", "--border-color": "var(--token-c4df83b7-8200-46ff-aeaa-6504d8d1824a, rgba(255, 255, 255, 0.2))", "--border-left-width": "1px", "--border-right-width": "1px", "--border-style": "solid", "--border-top-width": "1px", backdropFilter: "blur(4px)", backgroundColor: "var(--token-5d1db366-da21-4c86-bfe6-ca9841ac9d25, rgba(5, 5, 5, 0.35))", borderBottomLeftRadius: 1e3, borderBottomRightRadius: 1e3, borderTopLeftRadius: 1e3, borderTopRightRadius: 1e3, WebkitBackdropFilter: "blur(4px)" }, children: /* @__PURE__ */ _jsx2(RichText2, { __fromCanvasComponent: true, children: /* @__PURE__ */ _jsx2(React2.Fragment, { children: /* @__PURE__ */ _jsx2(motion2.p, { className: "framer-styles-preset-4wqll1", "data-styles-preset": "Bx0vIP7KX", dir: "auto", children: "6 Nights / 7 Days" }) }), className: "framer-vw22ea", fonts: ["Inter"], layoutDependency, layoutId: "TourCategoryCard__dyo4s6NaT", style: { "--framer-link-text-color": "rgb(0, 153, 255)", "--framer-link-text-decoration": "underline" }, text: MNSKzlU9q, verticalAlignment: "top", withExternalLayout: true }) })] }), /* @__PURE__ */ _jsx2(motion2.div, { className: "framer-1cpgu58", "data-framer-name": "Content", layoutDependency, layoutId: "TourCategoryCard__OCTxsVadU", children: /* @__PURE__ */ _jsxs2(motion2.div, { className: "framer-1jd9yqr", "data-framer-name": "Name and Price", layoutDependency, layoutId: "TourCategoryCard__g4WVwF_M3", children: [/* @__PURE__ */ _jsx2(RichText2, { __fromCanvasComponent: true, children: /* @__PURE__ */ _jsx2(React2.Fragment, { children: /* @__PURE__ */ _jsx2(motion2.h5, { className: "framer-styles-preset-s9j4b3", "data-styles-preset": "IwLGSnMVM", dir: "auto", children: "Bali" }) }), className: "framer-xcq6qy", "data-framer-name": "Name", fonts: ["Inter"], layoutDependency, layoutId: "TourCategoryCard__zJc8Y6Uc1", style: { "--framer-link-text-color": "rgb(0, 153, 255)", "--framer-link-text-decoration": "underline" }, text: TYD0ZRJdw, verticalAlignment: "top", withExternalLayout: true }), /* @__PURE__ */ _jsxs2(motion2.div, { className: "framer-heo9w7", "data-framer-name": "Price", layoutDependency, layoutId: "TourCategoryCard__MywTTsBIU", children: [/* @__PURE__ */ _jsx2(RichText2, { __fromCanvasComponent: true, children: /* @__PURE__ */ _jsx2(React2.Fragment, { children: /* @__PURE__ */ _jsx2(motion2.p, { className: "framer-styles-preset-mxaz03", "data-styles-preset": "RZB8g5F0A", dir: "auto", style: { "--framer-text-color": "var(--extracted-r6o4lv, var(--token-ae4b47e4-3a13-4e24-99f2-2e3de59f762c, rgb(64, 64, 64)))" }, children: "T\u1EEB" }) }), className: "framer-1yu0qul", fonts: ["Inter"], layoutDependency, layoutId: "TourCategoryCard__EXKQnldSk", style: { "--extracted-r6o4lv": "var(--token-ae4b47e4-3a13-4e24-99f2-2e3de59f762c, rgb(64, 64, 64))", "--framer-link-text-color": "rgb(0, 153, 255)", "--framer-link-text-decoration": "underline" }, verticalAlignment: "top", withExternalLayout: true, ...addPropertyOverrides2({ xThOoVjZW: { children: /* @__PURE__ */ _jsx2(React2.Fragment, { children: /* @__PURE__ */ _jsx2(motion2.p, { className: "framer-styles-preset-mxaz03", "data-styles-preset": "RZB8g5F0A", dir: "auto", style: { "--framer-text-alignment": "left", "--framer-text-color": "var(--extracted-r6o4lv, var(--token-ae4b47e4-3a13-4e24-99f2-2e3de59f762c, rgb(64, 64, 64)))" }, children: "T\u1EEB" }) }) } }, baseVariant, gestureVariant) }), /* @__PURE__ */ _jsx2(RichText2, { __fromCanvasComponent: true, children: /* @__PURE__ */ _jsx2(React2.Fragment, { children: /* @__PURE__ */ _jsx2(motion2.h6, { className: "framer-styles-preset-1pzgksg", "data-styles-preset": "KaUjbt5l5", dir: "auto", children: "40000" }) }), className: "framer-ihwm3f", "data-framer-name": "Price", fonts: ["Inter"], layoutDependency, layoutId: "TourCategoryCard__m9u71Bn82", style: { "--framer-link-text-color": "rgb(0, 153, 255)", "--framer-link-text-decoration": "underline" }, text: EYMgQFvXw, verticalAlignment: "top", withExternalLayout: true, ...addPropertyOverrides2({ xThOoVjZW: { children: /* @__PURE__ */ _jsx2(React2.Fragment, { children: /* @__PURE__ */ _jsx2(motion2.h6, { className: "framer-styles-preset-1pzgksg", "data-styles-preset": "KaUjbt5l5", dir: "auto", style: { "--framer-text-alignment": "left" }, children: "40000" }) }) } }, baseVariant, gestureVariant) }), /* @__PURE__ */ _jsx2(RichText2, { __fromCanvasComponent: true, children: /* @__PURE__ */ _jsx2(React2.Fragment, { children: /* @__PURE__ */ _jsx2(motion2.p, { className: "framer-styles-preset-mxaz03", "data-styles-preset": "RZB8g5F0A", dir: "auto", style: { "--framer-text-color": "var(--extracted-r6o4lv, var(--token-ae4b47e4-3a13-4e24-99f2-2e3de59f762c, rgb(64, 64, 64)))" }, children: "/ m\u1ED7i ng\u01B0\u1EDDi" }) }), className: "framer-11v0qx6", fonts: ["Inter"], layoutDependency, layoutId: "TourCategoryCard__XIwWsJumO", style: { "--extracted-r6o4lv": "var(--token-ae4b47e4-3a13-4e24-99f2-2e3de59f762c, rgb(64, 64, 64))", "--framer-link-text-color": "rgb(0, 153, 255)", "--framer-link-text-decoration": "underline" }, verticalAlignment: "top", withExternalLayout: true, ...addPropertyOverrides2({ xThOoVjZW: { children: /* @__PURE__ */ _jsx2(React2.Fragment, { children: /* @__PURE__ */ _jsx2(motion2.p, { className: "framer-styles-preset-mxaz03", "data-styles-preset": "RZB8g5F0A", dir: "auto", style: { "--framer-text-alignment": "left", "--framer-text-color": "var(--extracted-r6o4lv, var(--token-ae4b47e4-3a13-4e24-99f2-2e3de59f762c, rgb(64, 64, 64)))" }, children: "/ m\u1ED7i ng\u01B0\u1EDDi" }) }) } }, baseVariant, gestureVariant) })] })] }) })] }) }) }) }) });
});
var css7 = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-Q1jQh.framer-1d8apr4, .framer-Q1jQh .framer-1d8apr4 { display: block; }", ".framer-Q1jQh.framer-15krg2q { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 16px; height: min-content; justify-content: center; overflow: hidden; padding: 0px; position: relative; text-decoration: none; width: 538px; }", ".framer-Q1jQh .framer-4cb7np { align-content: center; align-items: center; aspect-ratio: 0.7636621717530163 / 1; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: var(--framer-aspect-ratio-supported, 705px); justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; will-change: var(--framer-will-change-override, transform); }", ".framer-Q1jQh .framer-1ga9dig { aspect-ratio: 0.7634943181818182 / 1; flex: 1 0 0px; height: var(--framer-aspect-ratio-supported, 705px); overflow: hidden; position: relative; width: 1px; will-change: var(--framer-will-change-override, transform); }", ".framer-Q1jQh .framer-plw2ye { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; left: 12px; overflow: hidden; padding: 6px 10px 6px 10px; position: absolute; top: 12px; width: min-content; will-change: var(--framer-will-change-override, transform); z-index: 1; }", ".framer-Q1jQh .framer-vw22ea, .framer-Q1jQh .framer-1yu0qul, .framer-Q1jQh .framer-ihwm3f, .framer-Q1jQh .framer-11v0qx6 { flex: none; height: auto; position: relative; white-space: pre; width: auto; }", ".framer-Q1jQh .framer-1cpgu58 { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 16px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 100%; }", ".framer-Q1jQh .framer-1jd9yqr { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 8px; height: min-content; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }", ".framer-Q1jQh .framer-xcq6qy { flex: none; height: auto; position: relative; white-space: pre-wrap; width: 100%; word-break: break-word; word-wrap: break-word; }", ".framer-Q1jQh .framer-heo9w7 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 4px; height: min-content; justify-content: flex-start; overflow: visible; padding: 0px; position: relative; width: min-content; }", ".framer-Q1jQh.framer-v-guyto7 .framer-4cb7np { aspect-ratio: unset; height: min-content; }", ".framer-Q1jQh.framer-v-15krg2q.hover .framer-1ga9dig { aspect-ratio: 0.7642045454545454 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 739px); width: 105%; }", ".framer-Q1jQh.framer-v-guyto7.pressed .framer-4cb7np { aspect-ratio: unset; }", ...css3, ...css4, ...css6, ...css5, '.framer-Q1jQh[data-border="true"]::after, .framer-Q1jQh [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; corner-shape: inherit; pointer-events: none; }'];
var FramerHZgGFYLHJ = withCSS2(Component2, css7, "framer-Q1jQh");
var HZgGFYLHJ_default = FramerHZgGFYLHJ;
FramerHZgGFYLHJ.displayName = "Tour Package Card";
FramerHZgGFYLHJ.defaultProps = { height: 780, width: 538 };
addPropertyControls2(FramerHZgGFYLHJ, { variant: { options: ["Qs8tpwbzJ", "xThOoVjZW"], optionTitles: ["Desktop", "Phone"], title: "Variant", type: ControlType2.Enum }, zfXuuYS0f: { __defaultAssetReference: "data:framer/asset-reference,kJwV5maqgeUYjAS9yhanQaNuYg.png?originalFilename=Qmb8QFfcVgGXXSJjx7wjZQFCbiu8psPFp7iZk9SpkTHzf9.png&preferredSize=auto", __vekterDefault: { alt: "", assetReference: "data:framer/asset-reference,kJwV5maqgeUYjAS9yhanQaNuYg.png?originalFilename=Qmb8QFfcVgGXXSJjx7wjZQFCbiu8psPFp7iZk9SpkTHzf9.png&preferredSize=auto" }, title: "Image", type: ControlType2.ResponsiveImage }, MNSKzlU9q: { defaultValue: "3 Ng\xE0y / 2 \u0110\xEAm", displayTextArea: false, title: "Days/Nights", type: ControlType2.String }, onMNSKzlU9qChange: { changes: "MNSKzlU9q", type: ControlType2.ChangeHandler }, TYD0ZRJdw: { defaultValue: "Bali", displayTextArea: false, title: "Title", type: ControlType2.String }, onTYD0ZRJdwChange: { changes: "TYD0ZRJdw", type: ControlType2.ChangeHandler }, EYMgQFvXw: { defaultValue: "40000", displayTextArea: false, title: "Price", type: ControlType2.String }, onEYMgQFvXwChange: { changes: "EYMgQFvXw", type: ControlType2.ChangeHandler }, yv9cnGTFs: { title: "Link", type: ControlType2.Link } });
addFonts2(FramerHZgGFYLHJ, [{ explicitInter: true, fonts: [{ cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2", weight: "400" }] }, ...getFontsFromSharedStyle2(fonts2), ...getFontsFromSharedStyle2(fonts3), ...getFontsFromSharedStyle2(fonts5), ...getFontsFromSharedStyle2(fonts4)], { supportsExplicitInterCodegen: true });

// http-url:https://framerusercontent.com/modules/EDGPZ3ADCRROn7onCFA3/y6J5y6wbtPi6HGx6Z1Bm/TagKODQtj.js
import { jsx as _jsx3, jsxs as _jsxs3 } from "react/jsx-runtime";
import { addFonts as addFonts3, addPropertyControls as addPropertyControls3, ControlType as ControlType3, cx as cx3, getFontsFromSharedStyle as getFontsFromSharedStyle3, getLoadingLazyAtYPosition as getLoadingLazyAtYPosition2, Image, RichText as RichText3, useActiveVariantCallback as useActiveVariantCallback2, useComponentViewport as useComponentViewport3, useLocaleInfo as useLocaleInfo3, useVariantState as useVariantState3, withCSS as withCSS3 } from "./_framer-runtime.js";
import { LayoutGroup as LayoutGroup3, motion as motion3, MotionConfigContext as MotionConfigContext3 } from "framer-motion";
import * as React3 from "react";
import { useRef as useRef3 } from "react";
var enabledGestures2 = { YDzyuzidw: { hover: true } };
var cycleOrder3 = ["YDzyuzidw", "iaV1LV90K", "M0mCzIuez", "YrPhUjgyz"];
var serializationHash3 = "framer-YSxHX";
var variantClassNames3 = { iaV1LV90K: "framer-v-1u83any", M0mCzIuez: "framer-v-7ner59", YDzyuzidw: "framer-v-14q5dvy", YrPhUjgyz: "framer-v-h98jee" };
function addPropertyOverrides3(overrides, ...variants) {
  const nextOverrides = {};
  variants?.forEach((variant) => variant && Object.assign(nextOverrides, overrides[variant]));
  return nextOverrides;
}
var transition13 = { delay: 0, duration: 0.6, ease: [0.44, 0, 0.56, 1], type: "tween" };
var toResponsiveImage2 = (value) => {
  if (typeof value === "object" && value !== null && typeof value.src === "string") {
    return value;
  }
  return typeof value === "string" ? { src: value } : void 0;
};
var Transition3 = ({ value, children }) => {
  const config = React3.useContext(MotionConfigContext3);
  const transition = value ?? config.transition;
  const contextValue = React3.useMemo(() => ({ ...config, transition }), [JSON.stringify(transition)]);
  return /* @__PURE__ */ _jsx3(MotionConfigContext3.Provider, { value: contextValue, children });
};
var humanReadableVariantMap3 = { "Phone Active": "YrPhUjgyz", "Phone Default": "M0mCzIuez", Active: "iaV1LV90K", Default: "YDzyuzidw" };
var Variants3 = motion3.create(React3.Fragment);
var getProps3 = ({ click, height, id, image, title, width, ...props }) => {
  return { ...props, QmkRMhBLW: title ?? props.QmkRMhBLW ?? "All", StcjRFLig: click ?? props.StcjRFLig, v4ByLbwA7: image ?? props.v4ByLbwA7 ?? { alt: "body of water near mountain", pixelHeight: 3640, pixelWidth: 5464, src: "https://framerusercontent.com/images/WrTwnrLzFrnsy9OTfEznS7tRs.jpg?width=5464&height=3640", srcSet: "https://framerusercontent.com/images/WrTwnrLzFrnsy9OTfEznS7tRs.jpg?scale-down-to=512&width=5464&height=3640 512w,https://framerusercontent.com/images/WrTwnrLzFrnsy9OTfEznS7tRs.jpg?scale-down-to=1024&width=5464&height=3640 1024w,https://framerusercontent.com/images/WrTwnrLzFrnsy9OTfEznS7tRs.jpg?scale-down-to=2048&width=5464&height=3640 2048w,https://framerusercontent.com/images/WrTwnrLzFrnsy9OTfEznS7tRs.jpg?scale-down-to=4096&width=5464&height=3640 4096w,https://framerusercontent.com/images/WrTwnrLzFrnsy9OTfEznS7tRs.jpg?width=5464&height=3640 5464w" }, variant: humanReadableVariantMap3[props.variant] ?? props.variant ?? "YDzyuzidw" };
};
var createLayoutDependency3 = (props, variants) => {
  if (props.layoutDependency)
    return variants.join("-") + props.layoutDependency;
  return variants.join("-");
};
var Component3 = /* @__PURE__ */ React3.forwardRef(function(props, ref) {
  const fallbackRef = useRef3(null);
  const refBinding = ref ?? fallbackRef;
  const defaultLayoutId = React3.useId();
  const { activeLocale, setLocale } = useLocaleInfo3();
  const componentViewport = useComponentViewport3();
  const { style, className: className6, layoutId, variant, v4ByLbwA7, QmkRMhBLW, StcjRFLig, ...restProps } = getProps3(props);
  const { baseVariant, classNames, clearLoadingGesture, gestureHandlers, gestureVariant, isLoading, setGestureState, setVariant, variants } = useVariantState3({ cycleOrder: cycleOrder3, defaultVariant: "YDzyuzidw", enabledGestures: enabledGestures2, ref: refBinding, variant, variantClassNames: variantClassNames3 });
  const layoutDependency = createLayoutDependency3(props, variants);
  const { activeVariantCallback, delay } = useActiveVariantCallback2(baseVariant);
  const onTap1rk3qby = activeVariantCallback(async (...args) => {
    setGestureState({ isPressed: false });
    if (StcjRFLig) {
      const res = await StcjRFLig(...args);
      if (res === false)
        return false;
    }
  });
  const sharedStyleClassNames = [className4, className];
  const scopingClassNames = cx3(serializationHash3, ...sharedStyleClassNames);
  return /* @__PURE__ */ _jsx3(LayoutGroup3, { id: layoutId ?? defaultLayoutId, children: /* @__PURE__ */ _jsx3(Variants3, { animate: variants, initial: false, children: /* @__PURE__ */ _jsx3(Transition3, { value: transition13, children: /* @__PURE__ */ _jsxs3(motion3.div, { ...restProps, ...gestureHandlers, className: cx3(scopingClassNames, "framer-14q5dvy", className6, classNames), "data-framer-name": "Default", "data-highlight": true, layoutDependency, layoutId: "TourCategoryCard__YDzyuzidw", onTap: onTap1rk3qby, ref: refBinding, style: { "--border-bottom-width": "0px", "--border-color": "rgba(0, 0, 0, 0)", "--border-left-width": "0px", "--border-right-width": "0px", "--border-style": "solid", "--border-top-width": "0px", backgroundColor: "var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255))", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, ...style }, variants: { "YDzyuzidw-hover": { "--border-bottom-width": "0px", "--border-left-width": "0px", "--border-right-width": "0px", "--border-top-width": "0px" }, iaV1LV90K: { "--border-bottom-width": "1px", "--border-color": "var(--token-cb2a12ec-6d20-4c11-b2a8-88dcf46b2e32, rgb(204, 204, 204))", "--border-left-width": "1px", "--border-right-width": "1px", "--border-style": "solid", "--border-top-width": "1px", backgroundColor: "var(--token-592aeafc-2735-433b-9485-80219388161e, rgb(250, 248, 240))" }, M0mCzIuez: { "--border-bottom-width": "0px", "--border-left-width": "0px", "--border-right-width": "0px", "--border-top-width": "0px" }, YrPhUjgyz: { "--border-bottom-width": "1px", "--border-color": "var(--token-cb2a12ec-6d20-4c11-b2a8-88dcf46b2e32, rgb(204, 204, 204))", "--border-left-width": "1px", "--border-right-width": "1px", "--border-style": "solid", "--border-top-width": "1px", backgroundColor: "var(--token-592aeafc-2735-433b-9485-80219388161e, rgb(250, 248, 240))" } }, ...addPropertyOverrides3({ "YDzyuzidw-hover": { "data-framer-name": void 0 }, iaV1LV90K: { "data-border": true, "data-framer-name": "Active" }, M0mCzIuez: { "data-framer-name": "Phone Default" }, YrPhUjgyz: { "data-border": true, "data-framer-name": "Phone Active" } }, baseVariant, gestureVariant), children: [/* @__PURE__ */ _jsx3(Image, { as: "figure", background: { alt: "body of water near mountain", fit: "fill", loading: getLoadingLazyAtYPosition2((componentViewport?.y || 0) + 8 + (((componentViewport?.height || 131) - 16 - 115.2) / 2 + 0 + 0)), pixelHeight: 3640, pixelWidth: 5464, sizes: "78px", ...toResponsiveImage2(v4ByLbwA7) }, className: "framer-162o3j9", "data-border": true, layoutDependency, layoutId: "TourCategoryCard__V5YsjFltl", style: { "--border-bottom-width": "2px", "--border-color": "var(--token-acbad6b7-2a19-4836-bd3c-cfb65d18c9f0, rgb(255, 255, 255))", "--border-left-width": "2px", "--border-right-width": "2px", "--border-style": "solid", "--border-top-width": "2px", borderBottomLeftRadius: 100, borderBottomRightRadius: 100, borderTopLeftRadius: 100, borderTopRightRadius: 100, filter: "brightness(0.86)", scale: 1, WebkitFilter: "brightness(0.86)" }, variants: { "YDzyuzidw-hover": { scale: 1.05 } }, ...addPropertyOverrides3({ M0mCzIuez: { background: { alt: "body of water near mountain", fit: "fill", loading: getLoadingLazyAtYPosition2((componentViewport?.y || 0) + 8 + (((componentViewport?.height || 106.5) - 16 - 90.4) / 2 + 0 + 0)), pixelHeight: 3640, pixelWidth: 5464, sizes: "56px", ...toResponsiveImage2(v4ByLbwA7) } }, YrPhUjgyz: { background: { alt: "body of water near mountain", fit: "fill", loading: getLoadingLazyAtYPosition2((componentViewport?.y || 0) + 8 + (((componentViewport?.height || 106.5) - 16 - 90.4) / 2 + 0 + 0)), pixelHeight: 3640, pixelWidth: 5464, sizes: "56px", ...toResponsiveImage2(v4ByLbwA7) } } }, baseVariant, gestureVariant) }), /* @__PURE__ */ _jsx3(motion3.div, { className: "framer-4armil", "data-framer-name": "Title", layoutDependency, layoutId: "TourCategoryCard__dBHm9eeo2", style: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 }, children: /* @__PURE__ */ _jsx3(RichText3, { __fromCanvasComponent: true, children: /* @__PURE__ */ _jsx3(React3.Fragment, { children: /* @__PURE__ */ _jsx3(motion3.h6, { className: "framer-styles-preset-1pzgksg", "data-styles-preset": "KaUjbt5l5", dir: "auto", style: { "--framer-text-alignment": "center", "--framer-text-color": "var(--extracted-1w1cjl5, var(--token-05a8fec1-0047-44dc-9588-f187293b9795, rgba(5, 5, 5, 0.55)))" }, children: "All" }) }), className: "framer-5v4bw1", "data-framer-name": "Title", fonts: ["Inter"], layoutDependency, layoutId: "TourCategoryCard__D2RqHJhXO", style: { "--extracted-1w1cjl5": "var(--token-05a8fec1-0047-44dc-9588-f187293b9795, rgba(5, 5, 5, 0.55))", "--framer-link-text-color": "rgb(0, 153, 255)", "--framer-link-text-decoration": "underline" }, text: QmkRMhBLW, variants: { iaV1LV90K: { "--extracted-1w1cjl5": "var(--token-e15d98be-dc11-48c5-ad2b-3fbf85780d09, rgb(0, 0, 0))" }, M0mCzIuez: { "--extracted-r6o4lv": "var(--token-05a8fec1-0047-44dc-9588-f187293b9795, rgba(5, 5, 5, 0.55))" }, YrPhUjgyz: { "--extracted-r6o4lv": "var(--token-e15d98be-dc11-48c5-ad2b-3fbf85780d09, rgb(0, 0, 0))" } }, verticalAlignment: "top", withExternalLayout: true, ...addPropertyOverrides3({ iaV1LV90K: { children: /* @__PURE__ */ _jsx3(React3.Fragment, { children: /* @__PURE__ */ _jsx3(motion3.h6, { className: "framer-styles-preset-1pzgksg", "data-styles-preset": "KaUjbt5l5", dir: "auto", style: { "--framer-text-alignment": "center", "--framer-text-color": "var(--extracted-1w1cjl5, var(--token-e15d98be-dc11-48c5-ad2b-3fbf85780d09, rgb(0, 0, 0)))" }, children: "All" }) }) }, M0mCzIuez: { children: /* @__PURE__ */ _jsx3(React3.Fragment, { children: /* @__PURE__ */ _jsx3(motion3.p, { className: "framer-styles-preset-1qeu4bo", "data-styles-preset": "TiWSjQ2lc", dir: "auto", style: { "--framer-text-alignment": "center", "--framer-text-color": "var(--extracted-r6o4lv, var(--token-05a8fec1-0047-44dc-9588-f187293b9795, rgba(5, 5, 5, 0.55)))" }, children: "All" }) }) }, YrPhUjgyz: { children: /* @__PURE__ */ _jsx3(React3.Fragment, { children: /* @__PURE__ */ _jsx3(motion3.p, { className: "framer-styles-preset-1qeu4bo", "data-styles-preset": "TiWSjQ2lc", dir: "auto", style: { "--framer-text-alignment": "center", "--framer-text-color": "var(--extracted-r6o4lv, var(--token-e15d98be-dc11-48c5-ad2b-3fbf85780d09, rgb(0, 0, 0)))" }, children: "All" }) }) } }, baseVariant, gestureVariant) }) })] }) }) }) });
});
var css8 = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-YSxHX.framer-54u0z7, .framer-YSxHX .framer-54u0z7 { display: block; }", ".framer-YSxHX.framer-14q5dvy { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 12px; height: min-content; justify-content: center; overflow: visible; padding: 8px 12px 8px 12px; position: relative; width: min-content; }", ".framer-YSxHX .framer-162o3j9 { aspect-ratio: 1 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 78px); overflow: var(--overflow-clip-fallback, clip); position: relative; width: 78px; will-change: var(--framer-will-change-override, transform); }", ".framer-YSxHX .framer-4armil { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: min-content; }", ".framer-YSxHX .framer-5v4bw1 { flex: none; height: auto; position: relative; white-space: pre; width: auto; }", ".framer-YSxHX.framer-v-1u83any .framer-4armil { align-self: stretch; width: auto; }", ".framer-YSxHX.framer-v-7ner59.framer-14q5dvy, .framer-YSxHX.framer-v-h98jee.framer-14q5dvy { padding: 8px; }", ".framer-YSxHX.framer-v-7ner59 .framer-162o3j9, .framer-YSxHX.framer-v-h98jee .framer-162o3j9 { height: var(--framer-aspect-ratio-supported, 56px); width: 56px; }", ...css5, ...css, '.framer-YSxHX[data-border="true"]::after, .framer-YSxHX [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; corner-shape: inherit; pointer-events: none; }'];
var FramerTagKODQtj = withCSS3(Component3, css8, "framer-YSxHX");
var TagKODQtj_default = FramerTagKODQtj;
FramerTagKODQtj.displayName = "Trip Category Button";
FramerTagKODQtj.defaultProps = { height: 131, width: 102 };
addPropertyControls3(FramerTagKODQtj, { variant: { options: ["YDzyuzidw", "iaV1LV90K", "M0mCzIuez", "YrPhUjgyz"], optionTitles: ["Default", "Active", "Phone Default", "Phone Active"], title: "Variant", type: ControlType3.Enum }, v4ByLbwA7: { __defaultAssetReference: "data:framer/asset-reference,WrTwnrLzFrnsy9OTfEznS7tRs.jpg?originalFilename=photo-1551524164-7d2f9ff12c70%3Fcrop%3Dentropy%26cs%3Dsrgb%26fm%3Djpg%26ixid%3DM3wxMzc5NjJ8MHwxfHNlYXJjaHw1fHxERVNUSU5BVElPTnxlbnwwfHx8fDE3Njk0MzQ0MTJ8MA%26ixlib%3Drb-4.1.jpg&width=5464&height=3640", __vekterDefault: { alt: "body of water near mountain", assetReference: "data:framer/asset-reference,WrTwnrLzFrnsy9OTfEznS7tRs.jpg?originalFilename=photo-1551524164-7d2f9ff12c70%3Fcrop%3Dentropy%26cs%3Dsrgb%26fm%3Djpg%26ixid%3DM3wxMzc5NjJ8MHwxfHNlYXJjaHw1fHxERVNUSU5BVElPTnxlbnwwfHx8fDE3Njk0MzQ0MTJ8MA%26ixlib%3Drb-4.1.jpg&width=5464&height=3640" }, title: "Image", type: ControlType3.ResponsiveImage }, QmkRMhBLW: { defaultValue: "All", displayTextArea: false, title: "Title", type: ControlType3.String }, onQmkRMhBLWChange: { changes: "QmkRMhBLW", type: ControlType3.ChangeHandler }, StcjRFLig: { title: "Click", type: ControlType3.EventHandler } });
addFonts3(FramerTagKODQtj, [{ explicitInter: true, fonts: [{ cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F", url: "https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116", url: "https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+1F00-1FFF", url: "https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0370-03FF", url: "https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF", url: "https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD", url: "https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2", weight: "400" }, { cssFamilyName: "Inter", source: "framer", style: "normal", uiFamilyName: "Inter", unicodeRange: "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB", url: "https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2", weight: "400" }] }, ...getFontsFromSharedStyle3(fonts4), ...getFontsFromSharedStyle3(fonts)], { supportsExplicitInterCodegen: true });

// http-url:https://framerusercontent.com/modules/5u066Mg7NSSrwZQp42cB/U3eJp3Xwly9imlp7efk1/Evu3KTFo4.js
var TripCategoryButtonFonts = getFonts(TagKODQtj_default);
var TourPackageCardFonts = getFonts(HZgGFYLHJ_default);
var SmartComponentScopedContainerWithFX = withFX2(SmartComponentScopedContainer);
var LoadMoreFonts = getFonts(eq8nK2pZY_default);
var cycleOrder4 = ["ck_hBWbxe", "X0TJBPlZ4", "CrR6jXdtC", "gsdVrf37z", "yJVNezlDF", "MOiMepZbT", "iKLBa85VN", "wnyTPM89U", "Pwk2UzHno", "makCjcbYk", "V2Dy8ifg2", "qUJo62mry"];
var serializationHash4 = "framer-KPVyM";
var variantClassNames4 = { ck_hBWbxe: "framer-v-1t4bicz", CrR6jXdtC: "framer-v-1pe3z6t", gsdVrf37z: "framer-v-ov3pcv", iKLBa85VN: "framer-v-18l6jkh", makCjcbYk: "framer-v-1jbxtfp", MOiMepZbT: "framer-v-1yn82wu", Pwk2UzHno: "framer-v-11q0kvc", qUJo62mry: "framer-v-vyi7v9", V2Dy8ifg2: "framer-v-1bh0e3t", wnyTPM89U: "framer-v-1svv50v", X0TJBPlZ4: "framer-v-niy2t9", yJVNezlDF: "framer-v-1scohtr" };
function addPropertyOverrides4(overrides, ...variants) {
  const nextOverrides = {};
  variants?.forEach((variant) => variant && Object.assign(nextOverrides, overrides[variant]));
  return nextOverrides;
}
var transition14 = { bounce: 0.2, delay: 0, duration: 0.4, type: "spring" };
var addImageAlt = (image, alt) => {
  if (!image || typeof image !== "object") {
    return;
  }
  return { ...image, alt };
};
var matchVariant = (...args) => {
  for (const arg of args) {
    if (arg && typeof arg === "string")
      return arg;
  }
  return void 0;
};
var animation3 = { opacity: 0, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, skewX: 0, skewY: 0, x: 0, y: 50 };
var transition22 = { delay: 0, duration: 0.6, ease: [0.12, 0.23, 0.5, 1], type: "tween" };
var stagger = (transition, value) => ({ ...transition, delay: (transition.delay ?? 0) + value });
var toResponsiveImage3 = (value) => {
  if (typeof value === "object" && value !== null && typeof value.src === "string") {
    return value;
  }
  return typeof value === "string" ? { src: value } : void 0;
};
var transformTemplate1 = (_3, t5) => `translateX(-50%) ${t5}`;
var loaderVariants = (repeaterState, variants, currentVariant) => {
  if (repeaterState.currentPage >= repeaterState.totalPages)
    return variants.disabled ?? currentVariant;
  if (repeaterState.isLoading)
    return variants.loading ?? currentVariant;
  return currentVariant;
};
var query1 = () => ({ from: { alias: "QGUHvs9z5", data: ofgUd8RAs_default, type: "Collection" }, select: [{ collection: "QGUHvs9z5", name: "cfJPgXq_U", type: "Identifier" }, { collection: "QGUHvs9z5", name: "dOhhE2NhA", type: "Identifier" }, { collection: "QGUHvs9z5", name: "L76jPdbmu", type: "Identifier" }, { collection: "QGUHvs9z5", name: "rrBsiGNOX", type: "Identifier" }, { collection: "QGUHvs9z5", name: "ffrqBkpLP", type: "Identifier" }, { collection: "QGUHvs9z5", name: "id", type: "Identifier" }] });
var query3 = () => ({ from: { alias: "QGUHvs9z5", data: ofgUd8RAs_default, type: "Collection" }, select: [{ collection: "QGUHvs9z5", name: "cfJPgXq_U", type: "Identifier" }, { collection: "QGUHvs9z5", name: "dOhhE2NhA", type: "Identifier" }, { collection: "QGUHvs9z5", name: "L76jPdbmu", type: "Identifier" }, { collection: "QGUHvs9z5", name: "rrBsiGNOX", type: "Identifier" }, { collection: "QGUHvs9z5", name: "ffrqBkpLP", type: "Identifier" }, { collection: "QGUHvs9z5", name: "id", type: "Identifier" }], where: { left: { collection: "QGUHvs9z5", name: "hiaV5ugMo", type: "Identifier" }, operator: "==", right: { type: "LiteralValue", value: "qA5ChX0_j" }, type: "BinaryOperation" } });
var query5 = () => ({ from: { alias: "QGUHvs9z5", data: ofgUd8RAs_default, type: "Collection" }, select: [{ collection: "QGUHvs9z5", name: "cfJPgXq_U", type: "Identifier" }, { collection: "QGUHvs9z5", name: "dOhhE2NhA", type: "Identifier" }, { collection: "QGUHvs9z5", name: "L76jPdbmu", type: "Identifier" }, { collection: "QGUHvs9z5", name: "rrBsiGNOX", type: "Identifier" }, { collection: "QGUHvs9z5", name: "ffrqBkpLP", type: "Identifier" }, { collection: "QGUHvs9z5", name: "id", type: "Identifier" }], where: { left: { collection: "QGUHvs9z5", name: "hiaV5ugMo", type: "Identifier" }, operator: "==", right: { type: "LiteralValue", value: "ZClquX4Sh" }, type: "BinaryOperation" } });
var query7 = () => ({ from: { alias: "QGUHvs9z5", data: ofgUd8RAs_default, type: "Collection" }, select: [{ collection: "QGUHvs9z5", name: "cfJPgXq_U", type: "Identifier" }, { collection: "QGUHvs9z5", name: "dOhhE2NhA", type: "Identifier" }, { collection: "QGUHvs9z5", name: "L76jPdbmu", type: "Identifier" }, { collection: "QGUHvs9z5", name: "rrBsiGNOX", type: "Identifier" }, { collection: "QGUHvs9z5", name: "ffrqBkpLP", type: "Identifier" }, { collection: "QGUHvs9z5", name: "id", type: "Identifier" }], where: { left: { collection: "QGUHvs9z5", name: "hiaV5ugMo", type: "Identifier" }, operator: "==", right: { type: "LiteralValue", value: "PORP5XpN1" }, type: "BinaryOperation" } });
var QueryData = ({ query, pageSize, children }) => {
  const { paginatedQuery, paginationInfo, loadMore } = useLoadMorePaginatedQuery(query, pageSize, "QGUHvs9z5");
  const data = __framer_useQueryData(paginatedQuery);
  return children(data, paginationInfo, loadMore);
};
var Transition4 = ({ value, children }) => {
  const config = React4.useContext(MotionConfigContext4);
  const transition = value ?? config.transition;
  const contextValue = React4.useMemo(() => ({ ...config, transition }), [JSON.stringify(transition)]);
  return /* @__PURE__ */ _jsx4(MotionConfigContext4.Provider, { value: contextValue, children });
};
var humanReadableVariantMap4 = { "Desktop Adventure": "gsdVrf37z", "Desktop All": "ck_hBWbxe", "Desktop Nature": "X0TJBPlZ4", "Desktop Romantic": "CrR6jXdtC", "Phone Adventure": "qUJo62mry", "Phone All": "Pwk2UzHno", "Phone Nature": "makCjcbYk", "Phone Romantic": "V2Dy8ifg2", "Tablet Adventure": "wnyTPM89U", "Tablet All": "yJVNezlDF", "Tablet Nature": "MOiMepZbT", "Tablet Romantic": "iKLBa85VN" };
var Variants4 = motion4.create(React4.Fragment);
var getProps4 = ({ height, id, width, ...props }) => {
  return { ...props, variant: humanReadableVariantMap4[props.variant] ?? props.variant ?? "ck_hBWbxe" };
};
var createLayoutDependency4 = (props, variants) => {
  if (props.layoutDependency)
    return variants.join("-") + props.layoutDependency;
  return variants.join("-");
};
var Component4 = /* @__PURE__ */ React4.forwardRef(function(props, ref) {
  const fallbackRef = useRef4(null);
  const refBinding = ref ?? fallbackRef;
  const defaultLayoutId = React4.useId();
  const { activeLocale, setLocale } = useLocaleInfo4();
  const componentViewport = useComponentViewport4();
  const { style, className: className6, layoutId, variant, ...restProps } = getProps4(props);
  const { baseVariant, classNames, clearLoadingGesture, gestureHandlers, gestureVariant, isLoading, setGestureState, setVariant, variants } = useVariantState4({ cycleOrder: cycleOrder4, defaultVariant: "ck_hBWbxe", ref: refBinding, variant, variantClassNames: variantClassNames4 });
  const layoutDependency = createLayoutDependency4(props, variants);
  const { activeVariantCallback, delay } = useActiveVariantCallback3(baseVariant);
  const StcjRFLig10h4q8h = activeVariantCallback(async (...args) => {
    setVariant("ck_hBWbxe");
  });
  const StcjRFLignujet2 = activeVariantCallback(async (...args) => {
    setVariant("yJVNezlDF");
  });
  const StcjRFLig1viqjlk = activeVariantCallback(async (...args) => {
    setVariant("Pwk2UzHno");
  });
  const StcjRFLig3q7lsw = activeVariantCallback(async (...args) => {
    setVariant("X0TJBPlZ4");
  });
  const StcjRFLig18zm98a = activeVariantCallback(async (...args) => {
    setVariant("MOiMepZbT");
  });
  const StcjRFLigsqzs4i = activeVariantCallback(async (...args) => {
    setVariant("makCjcbYk");
  });
  const StcjRFLig1bspx9w = activeVariantCallback(async (...args) => {
    setVariant("CrR6jXdtC");
  });
  const StcjRFLig1q74wzl = activeVariantCallback(async (...args) => {
    setVariant("iKLBa85VN");
  });
  const StcjRFLig16s1zpz = activeVariantCallback(async (...args) => {
    setVariant("V2Dy8ifg2");
  });
  const StcjRFLigfy05lr = activeVariantCallback(async (...args) => {
    setVariant("gsdVrf37z");
  });
  const StcjRFLig14wz41f = activeVariantCallback(async (...args) => {
    setVariant("wnyTPM89U");
  });
  const StcjRFLig118ys46 = activeVariantCallback(async (...args) => {
    setVariant("qUJo62mry");
  });
  const Wld3NDzSj1x58lqd = ({ loadMore }) => activeVariantCallback(async (...args) => {
    loadMore();
  });
  const sharedStyleClassNames = [];
  const scopingClassNames = cx4(serializationHash4, ...sharedStyleClassNames);
  const router = useRouter();
  return /* @__PURE__ */ _jsx4(LayoutGroup4, { id: layoutId ?? defaultLayoutId, children: /* @__PURE__ */ _jsx4(Variants4, { animate: variants, initial: false, children: /* @__PURE__ */ _jsx4(Transition4, { value: transition14, children: /* @__PURE__ */ _jsxs4(motion4.div, { ...restProps, ...gestureHandlers, className: cx4(scopingClassNames, "framer-1t4bicz", className6, classNames), "data-framer-name": "Desktop All", layoutDependency, layoutId: "TourCategoryCard__ck_hBWbxe", ref: refBinding, style: { ...style }, ...addPropertyOverrides4({ CrR6jXdtC: { "data-framer-name": "Desktop Romantic" }, gsdVrf37z: { "data-framer-name": "Desktop Adventure" }, iKLBa85VN: { "data-framer-name": "Tablet Romantic" }, makCjcbYk: { "data-framer-name": "Phone Nature" }, MOiMepZbT: { "data-framer-name": "Tablet Nature" }, Pwk2UzHno: { "data-framer-name": "Phone All" }, qUJo62mry: { "data-framer-name": "Phone Adventure" }, V2Dy8ifg2: { "data-framer-name": "Phone Romantic" }, wnyTPM89U: { "data-framer-name": "Tablet Adventure" }, X0TJBPlZ4: { "data-framer-name": "Desktop Nature" }, yJVNezlDF: { "data-framer-name": "Tablet All" } }, baseVariant, gestureVariant), children: [/* @__PURE__ */ _jsxs4(motion4.div, { className: "framer-zftapo", "data-framer-name": "Categories", layoutDependency, layoutId: "TourCategoryCard__qUP14msIG", children: [/* @__PURE__ */ _jsx4(ComponentViewportProvider, { height: 131, y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 1072) - 0 - 1795) / 2 + 0 + 0) + 0, ...addPropertyOverrides4({ CrR6jXdtC: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, gsdVrf37z: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, iKLBa85VN: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, makCjcbYk: { y: void 0 }, MOiMepZbT: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, Pwk2UzHno: { y: void 0 }, qUJo62mry: { y: void 0 }, V2Dy8ifg2: { y: void 0 }, wnyTPM89U: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, yJVNezlDF: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 2615) / 2 + 0 + 0) + 0 } }, baseVariant, gestureVariant), children: /* @__PURE__ */ _jsx4(SmartComponentScopedContainer, { className: "framer-1t9dk7x-container", layoutDependency, layoutId: "TourCategoryCard__CvX8aBa91-container", nodeId: "CvX8aBa91", rendersWithMotion: true, scopeId: "Evu3KTFo4", children: /* @__PURE__ */ _jsx4(TagKODQtj_default, { height: "100%", id: "CvX8aBa91", layoutId: "TourCategoryCard__CvX8aBa91", QmkRMhBLW: "T\u1EA5t c\u1EA3", StcjRFLig: StcjRFLig10h4q8h, v4ByLbwA7: addImageAlt({ pixelHeight: 4896, pixelWidth: 3264, src: "https://framerusercontent.com/images/tZHbYNDwipGWQTnarWR0M2x4nA.jpg?width=3264&height=4896", srcSet: "https://framerusercontent.com/images/tZHbYNDwipGWQTnarWR0M2x4nA.jpg?scale-down-to=1024&width=3264&height=4896 682w,https://framerusercontent.com/images/tZHbYNDwipGWQTnarWR0M2x4nA.jpg?scale-down-to=2048&width=3264&height=4896 1365w,https://framerusercontent.com/images/tZHbYNDwipGWQTnarWR0M2x4nA.jpg?scale-down-to=4096&width=3264&height=4896 2730w,https://framerusercontent.com/images/tZHbYNDwipGWQTnarWR0M2x4nA.jpg?width=3264&height=4896 3264w" }, "Burj Al-Arab, Dubai"), variant: matchVariant("iaV1LV90K"), width: "100%", ...addPropertyOverrides4({ CrR6jXdtC: { variant: matchVariant("YDzyuzidw") }, gsdVrf37z: { variant: matchVariant("YDzyuzidw") }, iKLBa85VN: { StcjRFLig: StcjRFLignujet2, variant: matchVariant("YDzyuzidw") }, makCjcbYk: { StcjRFLig: StcjRFLig1viqjlk, variant: matchVariant("M0mCzIuez") }, MOiMepZbT: { StcjRFLig: StcjRFLignujet2, variant: matchVariant("YDzyuzidw") }, Pwk2UzHno: { StcjRFLig: StcjRFLig1viqjlk, variant: matchVariant("YrPhUjgyz") }, qUJo62mry: { StcjRFLig: StcjRFLig1viqjlk, variant: matchVariant("M0mCzIuez") }, V2Dy8ifg2: { StcjRFLig: StcjRFLig1viqjlk, variant: matchVariant("M0mCzIuez") }, wnyTPM89U: { StcjRFLig: StcjRFLignujet2, variant: matchVariant("YDzyuzidw") }, X0TJBPlZ4: { variant: matchVariant("YDzyuzidw") }, yJVNezlDF: { StcjRFLig: StcjRFLignujet2 } }, baseVariant, gestureVariant) }) }) }), /* @__PURE__ */ _jsx4(ComponentViewportProvider, { height: 131, y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 1072) - 0 - 1795) / 2 + 0 + 0) + 0, ...addPropertyOverrides4({ CrR6jXdtC: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, gsdVrf37z: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, iKLBa85VN: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, makCjcbYk: { y: void 0 }, MOiMepZbT: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, Pwk2UzHno: { y: void 0 }, qUJo62mry: { y: void 0 }, V2Dy8ifg2: { y: void 0 }, wnyTPM89U: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, yJVNezlDF: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 2615) / 2 + 0 + 0) + 0 } }, baseVariant, gestureVariant), children: /* @__PURE__ */ _jsx4(SmartComponentScopedContainer, { className: "framer-135iazh-container", layoutDependency, layoutId: "TourCategoryCard__Y1lYcqfpV-container", nodeId: "Y1lYcqfpV", rendersWithMotion: true, scopeId: "Evu3KTFo4", children: /* @__PURE__ */ _jsx4(TagKODQtj_default, { height: "100%", id: "Y1lYcqfpV", layoutId: "TourCategoryCard__Y1lYcqfpV", QmkRMhBLW: "Thi\xEAn nhi\xEAn", StcjRFLig: StcjRFLig3q7lsw, v4ByLbwA7: addImageAlt({ pixelHeight: 3926, pixelWidth: 5484, src: "https://framerusercontent.com/images/dKthAKd7KFl7Tq78pvWiduAQc7s.jpg?width=5484&height=3926", srcSet: "https://framerusercontent.com/images/dKthAKd7KFl7Tq78pvWiduAQc7s.jpg?scale-down-to=512&width=5484&height=3926 512w,https://framerusercontent.com/images/dKthAKd7KFl7Tq78pvWiduAQc7s.jpg?scale-down-to=1024&width=5484&height=3926 1024w,https://framerusercontent.com/images/dKthAKd7KFl7Tq78pvWiduAQc7s.jpg?scale-down-to=2048&width=5484&height=3926 2048w,https://framerusercontent.com/images/dKthAKd7KFl7Tq78pvWiduAQc7s.jpg?scale-down-to=4096&width=5484&height=3926 4096w,https://framerusercontent.com/images/dKthAKd7KFl7Tq78pvWiduAQc7s.jpg?width=5484&height=3926 5484w" }, "scenery of mountain"), variant: matchVariant("YDzyuzidw"), width: "100%", ...addPropertyOverrides4({ iKLBa85VN: { StcjRFLig: StcjRFLig18zm98a }, makCjcbYk: { StcjRFLig: StcjRFLigsqzs4i, variant: matchVariant("YrPhUjgyz") }, MOiMepZbT: { StcjRFLig: StcjRFLig18zm98a, variant: matchVariant("iaV1LV90K") }, Pwk2UzHno: { StcjRFLig: StcjRFLigsqzs4i, variant: matchVariant("M0mCzIuez") }, qUJo62mry: { StcjRFLig: StcjRFLigsqzs4i, variant: matchVariant("M0mCzIuez") }, V2Dy8ifg2: { StcjRFLig: StcjRFLigsqzs4i, variant: matchVariant("M0mCzIuez") }, wnyTPM89U: { StcjRFLig: StcjRFLig18zm98a }, X0TJBPlZ4: { variant: matchVariant("iaV1LV90K") }, yJVNezlDF: { StcjRFLig: StcjRFLig18zm98a } }, baseVariant, gestureVariant) }) }) }), /* @__PURE__ */ _jsx4(ComponentViewportProvider, { height: 131, y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 1072) - 0 - 1795) / 2 + 0 + 0) + 0, ...addPropertyOverrides4({ CrR6jXdtC: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, gsdVrf37z: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, iKLBa85VN: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, makCjcbYk: { y: void 0 }, MOiMepZbT: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, Pwk2UzHno: { y: void 0 }, qUJo62mry: { y: void 0 }, V2Dy8ifg2: { y: void 0 }, wnyTPM89U: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, yJVNezlDF: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 2615) / 2 + 0 + 0) + 0 } }, baseVariant, gestureVariant), children: /* @__PURE__ */ _jsx4(SmartComponentScopedContainer, { className: "framer-gbyh45-container", layoutDependency, layoutId: "TourCategoryCard__HR4mPQArT-container", nodeId: "HR4mPQArT", rendersWithMotion: true, scopeId: "Evu3KTFo4", children: /* @__PURE__ */ _jsx4(TagKODQtj_default, { height: "100%", id: "HR4mPQArT", layoutId: "TourCategoryCard__HR4mPQArT", QmkRMhBLW: "L\xE3ng m\u1EA1n", StcjRFLig: StcjRFLig1bspx9w, v4ByLbwA7: addImageAlt({ pixelHeight: 3925, pixelWidth: 2940, src: "https://framerusercontent.com/images/3sIjD1dJjBqQm78rbODAOUVNF0.jpg?width=2940&height=3925", srcSet: "https://framerusercontent.com/images/3sIjD1dJjBqQm78rbODAOUVNF0.jpg?scale-down-to=1024&width=2940&height=3925 767w,https://framerusercontent.com/images/3sIjD1dJjBqQm78rbODAOUVNF0.jpg?scale-down-to=2048&width=2940&height=3925 1534w,https://framerusercontent.com/images/3sIjD1dJjBqQm78rbODAOUVNF0.jpg?width=2940&height=3925 2940w" }, "eiffel tower in paris france during daytime"), variant: matchVariant("YDzyuzidw"), width: "100%", ...addPropertyOverrides4({ CrR6jXdtC: { variant: matchVariant("iaV1LV90K") }, iKLBa85VN: { StcjRFLig: StcjRFLig1q74wzl, variant: matchVariant("iaV1LV90K") }, makCjcbYk: { StcjRFLig: StcjRFLig16s1zpz, variant: matchVariant("M0mCzIuez") }, MOiMepZbT: { StcjRFLig: StcjRFLig1q74wzl }, Pwk2UzHno: { StcjRFLig: StcjRFLig16s1zpz, variant: matchVariant("M0mCzIuez") }, qUJo62mry: { StcjRFLig: StcjRFLig16s1zpz, variant: matchVariant("M0mCzIuez") }, V2Dy8ifg2: { StcjRFLig: StcjRFLig16s1zpz, variant: matchVariant("YrPhUjgyz") }, wnyTPM89U: { StcjRFLig: StcjRFLig1q74wzl }, yJVNezlDF: { StcjRFLig: StcjRFLig1q74wzl } }, baseVariant, gestureVariant) }) }) }), /* @__PURE__ */ _jsx4(ComponentViewportProvider, { height: 131, y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 1072) - 0 - 1795) / 2 + 0 + 0) + 0, ...addPropertyOverrides4({ CrR6jXdtC: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, gsdVrf37z: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, iKLBa85VN: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, makCjcbYk: { y: void 0 }, MOiMepZbT: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, Pwk2UzHno: { y: void 0 }, qUJo62mry: { y: void 0 }, V2Dy8ifg2: { y: void 0 }, wnyTPM89U: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 0 + 0) + 0 }, yJVNezlDF: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 2615) / 2 + 0 + 0) + 0 } }, baseVariant, gestureVariant), children: /* @__PURE__ */ _jsx4(SmartComponentScopedContainer, { className: "framer-1wi4vu3-container", layoutDependency, layoutId: "TourCategoryCard__ErKUoPxCA-container", nodeId: "ErKUoPxCA", rendersWithMotion: true, scopeId: "Evu3KTFo4", children: /* @__PURE__ */ _jsx4(TagKODQtj_default, { height: "100%", id: "ErKUoPxCA", layoutId: "TourCategoryCard__ErKUoPxCA", QmkRMhBLW: "M\u1EA1o hi\u1EC3m", StcjRFLig: StcjRFLigfy05lr, v4ByLbwA7: addImageAlt({ pixelHeight: 2336, pixelWidth: 3504, src: "https://framerusercontent.com/images/KUNu5rfUNgMH8kF7lbF68xHbWoI.jpg?width=3504&height=2336", srcSet: "https://framerusercontent.com/images/KUNu5rfUNgMH8kF7lbF68xHbWoI.jpg?scale-down-to=512&width=3504&height=2336 512w,https://framerusercontent.com/images/KUNu5rfUNgMH8kF7lbF68xHbWoI.jpg?scale-down-to=1024&width=3504&height=2336 1024w,https://framerusercontent.com/images/KUNu5rfUNgMH8kF7lbF68xHbWoI.jpg?scale-down-to=2048&width=3504&height=2336 2048w,https://framerusercontent.com/images/KUNu5rfUNgMH8kF7lbF68xHbWoI.jpg?width=3504&height=2336 3504w" }, "silhouette of SUV under orange sky"), variant: matchVariant("YDzyuzidw"), width: "100%", ...addPropertyOverrides4({ gsdVrf37z: { variant: matchVariant("iaV1LV90K") }, iKLBa85VN: { StcjRFLig: StcjRFLig14wz41f }, makCjcbYk: { StcjRFLig: StcjRFLig118ys46, variant: matchVariant("M0mCzIuez") }, MOiMepZbT: { StcjRFLig: StcjRFLig14wz41f }, Pwk2UzHno: { StcjRFLig: StcjRFLig118ys46, variant: matchVariant("M0mCzIuez") }, qUJo62mry: { StcjRFLig: StcjRFLig118ys46, variant: matchVariant("YrPhUjgyz") }, V2Dy8ifg2: { StcjRFLig: StcjRFLig118ys46, variant: matchVariant("M0mCzIuez") }, wnyTPM89U: { StcjRFLig: StcjRFLig14wz41f, variant: matchVariant("iaV1LV90K") }, yJVNezlDF: { StcjRFLig: StcjRFLig14wz41f } }, baseVariant, gestureVariant) }) }) })] }), /* @__PURE__ */ _jsx4(motion4.div, { className: "framer-gg4hrg", layoutDependency, layoutId: "TourCategoryCard__QGUHvs9z5", children: /* @__PURE__ */ _jsx4(ChildrenCanSuspend, { children: /* @__PURE__ */ _jsx4(QueryData, { pageSize: 8, query: query1(), ...addPropertyOverrides4({ CrR6jXdtC: { pageSize: 8, query: query5() }, gsdVrf37z: { pageSize: 8, query: query7() }, iKLBa85VN: { pageSize: 8, query: query5() }, makCjcbYk: { pageSize: 8, query: query3() }, MOiMepZbT: { pageSize: 8, query: query3() }, qUJo62mry: { pageSize: 8, query: query7() }, V2Dy8ifg2: { pageSize: 8, query: query5() }, wnyTPM89U: { pageSize: 8, query: query7() }, X0TJBPlZ4: { pageSize: 8, query: query3() } }, baseVariant, gestureVariant), children: (collection, paginationInfo, loadMore) => {
    return /* @__PURE__ */ _jsxs4(_Fragment, { children: [collection?.map(({ cfJPgXq_U: cfJPgXq_UQGUHvs9z5, dOhhE2NhA: dOhhE2NhAQGUHvs9z5, ffrqBkpLP: ffrqBkpLPQGUHvs9z5, id: idQGUHvs9z5, L76jPdbmu: L76jPdbmuQGUHvs9z5, rrBsiGNOX: rrBsiGNOXQGUHvs9z5 }, index) => {
      dOhhE2NhAQGUHvs9z5 ?? (dOhhE2NhAQGUHvs9z5 = "");
      L76jPdbmuQGUHvs9z5 ?? (L76jPdbmuQGUHvs9z5 = "");
      rrBsiGNOXQGUHvs9z5 ?? (rrBsiGNOXQGUHvs9z5 = "");
      ffrqBkpLPQGUHvs9z5 ?? (ffrqBkpLPQGUHvs9z5 = "");
      return /* @__PURE__ */ _jsx4(LayoutGroup4, { id: `QGUHvs9z5-${idQGUHvs9z5}`, children: /* @__PURE__ */ _jsx4(PathVariablesContext.Provider, { value: { ffrqBkpLP: ffrqBkpLPQGUHvs9z5 }, children: /* @__PURE__ */ _jsx4(ResolveLinks, { links: [{ href: { pathVariables: { ffrqBkpLP: ffrqBkpLPQGUHvs9z5 }, webPageId: "NZTsQ8Sfo" }, implicitPathVariables: void 0 }, { href: { pathVariables: { ffrqBkpLP: ffrqBkpLPQGUHvs9z5 }, webPageId: "NZTsQ8Sfo" }, implicitPathVariables: void 0 }, { href: { pathVariables: { ffrqBkpLP: ffrqBkpLPQGUHvs9z5 }, webPageId: "NZTsQ8Sfo" }, implicitPathVariables: void 0 }, { href: { pathVariables: { ffrqBkpLP: ffrqBkpLPQGUHvs9z5 }, webPageId: "NZTsQ8Sfo" }, implicitPathVariables: void 0 }, { href: { pathVariables: { ffrqBkpLP: ffrqBkpLPQGUHvs9z5 }, webPageId: "NZTsQ8Sfo" }, implicitPathVariables: void 0 }, { href: { pathVariables: { ffrqBkpLP: ffrqBkpLPQGUHvs9z5 }, webPageId: "NZTsQ8Sfo" }, implicitPathVariables: void 0 }, { href: { pathVariables: { ffrqBkpLP: ffrqBkpLPQGUHvs9z5 }, webPageId: "NZTsQ8Sfo" }, implicitPathVariables: void 0 }, { href: { pathVariables: { ffrqBkpLP: ffrqBkpLPQGUHvs9z5 }, webPageId: "NZTsQ8Sfo" }, implicitPathVariables: void 0 }, { href: { pathVariables: { ffrqBkpLP: ffrqBkpLPQGUHvs9z5 }, webPageId: "NZTsQ8Sfo" }, implicitPathVariables: void 0 }, { href: { pathVariables: { ffrqBkpLP: ffrqBkpLPQGUHvs9z5 }, webPageId: "NZTsQ8Sfo" }, implicitPathVariables: void 0 }, { href: { pathVariables: { ffrqBkpLP: ffrqBkpLPQGUHvs9z5 }, webPageId: "NZTsQ8Sfo" }, implicitPathVariables: void 0 }, { href: { pathVariables: { ffrqBkpLP: ffrqBkpLPQGUHvs9z5 }, webPageId: "NZTsQ8Sfo" }, implicitPathVariables: void 0 }], children: (resolvedLinks) => /* @__PURE__ */ _jsx4(ComponentViewportProvider, { height: 780, width: `max((${componentViewport?.width || "100vw"} - 72px) / 4, 50px)`, y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 1072) - 0 - 1795) / 2 + 131 + 64) + 0 + 0, ...addPropertyOverrides4({ CrR6jXdtC: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 131 + 64) + 0 + 0 }, gsdVrf37z: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 131 + 64) + 0 + 0 }, iKLBa85VN: { width: `max((${componentViewport?.width || "100vw"} - 48px) / 3, 50px)`, y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 131 + 64) + 0 + 0 }, makCjcbYk: { width: componentViewport?.width || "100vw", y: void 0 }, MOiMepZbT: { width: `max((${componentViewport?.width || "100vw"} - 48px) / 3, 50px)`, y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 131 + 64) + 0 + 0 }, Pwk2UzHno: { width: componentViewport?.width || "100vw", y: void 0 }, qUJo62mry: { width: componentViewport?.width || "100vw", y: void 0 }, V2Dy8ifg2: { width: componentViewport?.width || "100vw", y: void 0 }, wnyTPM89U: { width: `max((${componentViewport?.width || "100vw"} - 48px) / 3, 50px)`, y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 131 + 64) + 0 + 0 }, yJVNezlDF: { width: `max((${componentViewport?.width || "100vw"} - 48px) / 3, 50px)`, y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 2615) / 2 + 131 + 64) + 0 + 0 } }, baseVariant, gestureVariant), children: /* @__PURE__ */ _jsx4(SmartComponentScopedContainerWithFX, { __framer__animate: { transition: stagger(transition22, index % 8 * 0.1) }, __framer__animateOnce: true, __framer__enter: animation3, __framer__styleAppearEffectEnabled: true, __framer__threshold: 0, __perspectiveFX: false, __smartComponentFX: true, __targetOpacity: 1, className: "framer-1opmw07-container", layoutDependency, layoutId: "TourCategoryCard__jUeC5AKtl-container", nodeId: "jUeC5AKtl", rendersWithMotion: true, scopeId: "Evu3KTFo4", children: /* @__PURE__ */ _jsx4(HZgGFYLHJ_default, { EYMgQFvXw: rrBsiGNOXQGUHvs9z5, height: "100%", id: "jUeC5AKtl", layoutId: "TourCategoryCard__jUeC5AKtl", MNSKzlU9q: dOhhE2NhAQGUHvs9z5, style: { width: "100%" }, TYD0ZRJdw: L76jPdbmuQGUHvs9z5, variant: matchVariant("Qs8tpwbzJ"), width: "100%", yv9cnGTFs: resolvedLinks[0], zfXuuYS0f: toResponsiveImage3(cfJPgXq_UQGUHvs9z5), ...addPropertyOverrides4({ CrR6jXdtC: { yv9cnGTFs: resolvedLinks[2] }, gsdVrf37z: { yv9cnGTFs: resolvedLinks[3] }, iKLBa85VN: { yv9cnGTFs: resolvedLinks[6] }, makCjcbYk: { variant: matchVariant("xThOoVjZW"), yv9cnGTFs: resolvedLinks[9] }, MOiMepZbT: { yv9cnGTFs: resolvedLinks[5] }, Pwk2UzHno: { variant: matchVariant("xThOoVjZW"), yv9cnGTFs: resolvedLinks[8] }, qUJo62mry: { variant: matchVariant("xThOoVjZW"), yv9cnGTFs: resolvedLinks[11] }, V2Dy8ifg2: { variant: matchVariant("xThOoVjZW"), yv9cnGTFs: resolvedLinks[10] }, wnyTPM89U: { yv9cnGTFs: resolvedLinks[7] }, X0TJBPlZ4: { yv9cnGTFs: resolvedLinks[1] }, yJVNezlDF: { yv9cnGTFs: resolvedLinks[4] } }, baseVariant, gestureVariant) }) }) }) }) }) }, idQGUHvs9z5);
    }), /* @__PURE__ */ _jsx4(ComponentViewportProvider, { height: 40, y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 1072) - 0 - 1795) / 2 + 131 + 64) + 1600 - -32, ...addPropertyOverrides4({ CrR6jXdtC: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 131 + 64) + 1600 - -32 }, gsdVrf37z: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 131 + 64) + 1600 - -32 }, iKLBa85VN: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 131 + 64) + 1600 - -32 }, makCjcbYk: { y: void 0 }, MOiMepZbT: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 131 + 64) + 1600 - -32 }, Pwk2UzHno: { y: void 0 }, qUJo62mry: { y: void 0 }, V2Dy8ifg2: { y: void 0 }, wnyTPM89U: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 1795) / 2 + 131 + 64) + 1600 - -32 }, yJVNezlDF: { y: (componentViewport?.y || 0) + 0 + (((componentViewport?.height || 200) - 0 - 2615) / 2 + 131 + 64) + 2420 - -32 } }, baseVariant, gestureVariant), children: /* @__PURE__ */ _jsx4(SmartComponentScopedContainer, { className: "framer-167etbk-container", layoutDependency, layoutId: "TourCategoryCard__kdZHDPckM-container", nodeId: "kdZHDPckM", rendersWithMotion: true, scopeId: "Evu3KTFo4", transformTemplate: transformTemplate1, children: /* @__PURE__ */ _jsx4(eq8nK2pZY_default, { height: "100%", id: "kdZHDPckM", layoutId: "TourCategoryCard__kdZHDPckM", variant: loaderVariants(paginationInfo, { disabled: "xNZjJyuDJ", loading: "XM_9Tb_ss" }, matchVariant("GYEiMU0kJ")), width: "100%", Wld3NDzSj: Wld3NDzSj1x58lqd({ loadMore }) }) }) })] });
  } }) }) })] }) }) }) });
});
var css9 = ["@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }", ".framer-KPVyM.framer-hq0e7p, .framer-KPVyM .framer-hq0e7p { display: block; }", ".framer-KPVyM.framer-1t4bicz { align-content: center; align-items: center; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 64px; height: min-content; justify-content: center; max-width: 1200px; overflow: visible; padding: 0px; position: relative; width: 100%; }", ".framer-KPVyM .framer-zftapo { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 24px; height: min-content; justify-content: flex-start; overflow: visible; padding: 0px; position: relative; width: 100%; }", ".framer-KPVyM .framer-1t9dk7x-container, .framer-KPVyM .framer-135iazh-container, .framer-KPVyM .framer-gbyh45-container, .framer-KPVyM .framer-1wi4vu3-container { flex: none; height: auto; position: relative; width: auto; }", ".framer-KPVyM .framer-gg4hrg { display: grid; flex: none; gap: 40px 24px; grid-auto-rows: minmax(0, 1fr); grid-template-columns: repeat(4, minmax(50px, 1fr)); height: min-content; justify-content: center; padding: 0px; position: relative; width: 100%; }", ".framer-KPVyM .framer-1opmw07-container { align-self: start; flex: none; height: auto; justify-self: start; position: relative; width: 100%; }", ".framer-KPVyM .framer-167etbk-container { bottom: -72px; flex: none; height: auto; left: 50%; position: absolute; width: auto; }", ".framer-KPVyM.framer-v-1scohtr .framer-gg4hrg, .framer-KPVyM.framer-v-1yn82wu .framer-gg4hrg, .framer-KPVyM.framer-v-18l6jkh .framer-gg4hrg, .framer-KPVyM.framer-v-1svv50v .framer-gg4hrg { grid-template-columns: repeat(3, minmax(50px, 1fr)); }", ".framer-KPVyM.framer-v-11q0kvc.framer-1t4bicz { width: 100%; }", ".framer-KPVyM.framer-v-11q0kvc .framer-zftapo { align-content: flex-start; align-items: flex-start; flex-wrap: wrap; gap: 20px 10px; }", ".framer-KPVyM.framer-v-11q0kvc .framer-gg4hrg, .framer-KPVyM.framer-v-1jbxtfp .framer-gg4hrg, .framer-KPVyM.framer-v-1bh0e3t .framer-gg4hrg, .framer-KPVyM.framer-v-vyi7v9 .framer-gg4hrg { align-content: flex-start; align-items: flex-start; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 48px 24px; }", ".framer-KPVyM.framer-v-11q0kvc .framer-1opmw07-container, .framer-KPVyM.framer-v-1jbxtfp .framer-1opmw07-container, .framer-KPVyM.framer-v-1bh0e3t .framer-1opmw07-container, .framer-KPVyM.framer-v-vyi7v9 .framer-1opmw07-container { align-self: unset; }", ".framer-KPVyM.framer-v-1jbxtfp.framer-1t4bicz, .framer-KPVyM.framer-v-1bh0e3t.framer-1t4bicz, .framer-KPVyM.framer-v-vyi7v9.framer-1t4bicz { width: 100%; }", ".framer-KPVyM.framer-v-1jbxtfp .framer-zftapo, .framer-KPVyM.framer-v-1bh0e3t .framer-zftapo, .framer-KPVyM.framer-v-vyi7v9 .framer-zftapo { flex-wrap: wrap; gap: 20px 16px; }"];
var FramerEvu3KTFo4 = withCSS4(Component4, css9, "framer-KPVyM");
var Evu3KTFo4_default = FramerEvu3KTFo4;
FramerEvu3KTFo4.displayName = "Tour Category Card";
FramerEvu3KTFo4.defaultProps = { height: 1072, width: 1120 };
addPropertyControls4(FramerEvu3KTFo4, { variant: { options: ["ck_hBWbxe", "X0TJBPlZ4", "CrR6jXdtC", "gsdVrf37z", "yJVNezlDF", "MOiMepZbT", "iKLBa85VN", "wnyTPM89U", "Pwk2UzHno", "makCjcbYk", "V2Dy8ifg2", "qUJo62mry"], optionTitles: ["Desktop All", "Desktop Nature", "Desktop Romantic", "Desktop Adventure", "Tablet All", "Tablet Nature", "Tablet Romantic", "Tablet Adventure", "Phone All", "Phone Nature", "Phone Romantic", "Phone Adventure"], title: "Variant", type: ControlType4.Enum } });
addFonts4(FramerEvu3KTFo4, [{ explicitInter: true, fonts: [] }, ...TripCategoryButtonFonts, ...TourPackageCardFonts, ...LoadMoreFonts], { supportsExplicitInterCodegen: true });
FramerEvu3KTFo4.loader = { load: (props, context) => {
  const locale = context.locale;
  const queryCacheEntry = queryCache.get(query1(), locale);
  const queryCacheEntry1 = queryCache.get(query3(), locale);
  const queryCacheEntry2 = queryCache.get(query5(), locale);
  const queryCacheEntry3 = queryCache.get(query7(), locale);
  return Promise.allSettled([queryCacheEntry.preload(), queryCacheEntry1.preload(), queryCacheEntry2.preload(), queryCacheEntry3.preload(), forwardLoader(TagKODQtj_default, {}, context), (async () => {
    const parentData = await queryCacheEntry.readMaybeAsync() ?? [];
    return Promise.allSettled(parentData.flatMap((item) => [forwardLoader(HZgGFYLHJ_default, {}, context), forwardLoader(eq8nK2pZY_default, {}, context)]));
  })()]);
} };
var __FramerMetadata__ = { "exports": { "Props": { "type": "tsType", "annotations": { "framerContractVersion": "1" } }, "default": { "type": "reactComponent", "name": "FramerEvu3KTFo4", "slots": [], "annotations": { "framerImmutableVariables": "true", "framerAutoSizeImages": "true", "framerCanvasComponentVariantDetails": '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"],"constraints":[null,"1200px",null,null]},"X0TJBPlZ4":{"layout":["fixed","auto"],"constraints":[null,"1200px",null,null]},"CrR6jXdtC":{"layout":["fixed","auto"],"constraints":[null,"1200px",null,null]},"gsdVrf37z":{"layout":["fixed","auto"],"constraints":[null,"1200px",null,null]},"yJVNezlDF":{"layout":["fixed","auto"],"constraints":[null,"1200px",null,null]},"MOiMepZbT":{"layout":["fixed","auto"],"constraints":[null,"1200px",null,null]},"iKLBa85VN":{"layout":["fixed","auto"],"constraints":[null,"1200px",null,null]},"wnyTPM89U":{"layout":["fixed","auto"],"constraints":[null,"1200px",null,null]},"Pwk2UzHno":{"layout":["fixed","auto"],"constraints":[null,"1200px",null,null]},"makCjcbYk":{"layout":["fixed","auto"],"constraints":[null,"1200px",null,null]},"V2Dy8ifg2":{"layout":["fixed","auto"],"constraints":[null,"1200px",null,null]},"qUJo62mry":{"layout":["fixed","auto"],"constraints":[null,"1200px",null,null]}}}', "framerDisplayContentsDiv": "false", "framerIntrinsicHeight": "1072", "framerColorSyntax": "true", "framerContractVersion": "1", "framerComponentViewportWidth": "true", "framerIntrinsicWidth": "1120" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  Evu3KTFo4_default as default
};
