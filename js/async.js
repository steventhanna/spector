! function(e, t) {
  "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t(e.async = e.async || {})
}(this, function(exports) {
  "use strict";

  function apply(e, t, r) {
    switch (r.length) {
      case 0:
        return e.call(t);
      case 1:
        return e.call(t, r[0]);
      case 2:
        return e.call(t, r[0], r[1]);
      case 3:
        return e.call(t, r[0], r[1], r[2])
    }
    return e.apply(t, r)
  }

  function overRest$1(e, t, r) {
    return t = nativeMax(void 0 === t ? e.length - 1 : t, 0),
      function() {
        for (var n = arguments, o = -1, i = nativeMax(n.length - t, 0), a = Array(i); ++o < i;) a[o] = n[t + o];
        o = -1;
        for (var s = Array(t + 1); ++o < t;) s[o] = n[o];
        return s[t] = r(a), apply(e, this, s)
      }
  }

  function identity(e) {
    return e
  }

  function rest(e, t) {
    return overRest$1(e, t, identity)
  }

  function isObject(e) {
    var t = typeof e;
    return null != e && ("object" == t || "function" == t)
  }

  function asyncify(e) {
    return initialParams(function(t, r) {
      var n;
      try {
        n = e.apply(this, t)
      } catch (e) {
        return r(e)
      }
      isObject(n) && "function" == typeof n.then ? n.then(function(e) {
        r(null, e)
      }, function(e) {
        r(e.message ? e : new Error(e))
      }) : r(null, n)
    })
  }

  function supportsAsync() {
    var supported;
    try {
      supported = isAsync(eval("(async function () {})"))
    } catch (e) {
      supported = !1
    }
    return supported
  }

  function isAsync(e) {
    return supportsSymbol && "AsyncFunction" === e[Symbol.toStringTag]
  }

  function wrapAsync(e) {
    return isAsync(e) ? asyncify(e) : e
  }

  function applyEach$1(e) {
    return rest(function(t, r) {
      var n = initialParams(function(r, n) {
        var o = this;
        return e(t, function(e, t) {
          wrapAsync$1(e).apply(o, r.concat(t))
        }, n)
      });
      return r.length ? n.apply(this, r) : n
    })
  }

  function getRawTag(e) {
    var t = hasOwnProperty.call(e, symToStringTag$1),
      r = e[symToStringTag$1];
    try {
      e[symToStringTag$1] = void 0;
      var n = !0
    } catch (e) {}
    var o = nativeObjectToString.call(e);
    return n && (t ? e[symToStringTag$1] = r : delete e[symToStringTag$1]), o
  }

  function objectToString(e) {
    return nativeObjectToString$1.call(e)
  }

  function baseGetTag(e) {
    return null == e ? void 0 === e ? undefinedTag : nullTag : (e = Object(e), symToStringTag && symToStringTag in e ? getRawTag(e) : objectToString(e))
  }

  function isFunction(e) {
    if (!isObject(e)) return !1;
    var t = baseGetTag(e);
    return t == funcTag || t == genTag || t == asyncTag || t == proxyTag
  }

  function isLength(e) {
    return "number" == typeof e && e > -1 && e % 1 == 0 && e <= MAX_SAFE_INTEGER
  }

  function isArrayLike(e) {
    return null != e && isLength(e.length) && !isFunction(e)
  }

  function noop() {}

  function once(e) {
    return function() {
      if (null !== e) {
        var t = e;
        e = null, t.apply(this, arguments)
      }
    }
  }

  function baseTimes(e, t) {
    for (var r = -1, n = Array(e); ++r < e;) n[r] = t(r);
    return n
  }

  function isObjectLike(e) {
    return null != e && "object" == typeof e
  }

  function baseIsArguments(e) {
    return isObjectLike(e) && baseGetTag(e) == argsTag
  }

  function stubFalse() {
    return !1
  }

  function isIndex(e, t) {
    return t = null == t ? MAX_SAFE_INTEGER$1 : t, !!t && ("number" == typeof e || reIsUint.test(e)) && e > -1 && e % 1 == 0 && e < t
  }

  function baseIsTypedArray(e) {
    return isObjectLike(e) && isLength(e.length) && !!typedArrayTags[baseGetTag(e)]
  }

  function baseUnary(e) {
    return function(t) {
      return e(t)
    }
  }

  function arrayLikeKeys(e, t) {
    var r = isArray(e),
      n = !r && isArguments(e),
      o = !r && !n && isBuffer(e),
      i = !r && !n && !o && isTypedArray(e),
      a = r || n || o || i,
      s = a ? baseTimes(e.length, String) : [],
      c = s.length;
    for (var u in e) !t && !hasOwnProperty$1.call(e, u) || a && ("length" == u || o && ("offset" == u || "parent" == u) || i && ("buffer" == u || "byteLength" == u || "byteOffset" == u) || isIndex(u, c)) || s.push(u);
    return s
  }

  function isPrototype(e) {
    var t = e && e.constructor,
      r = "function" == typeof t && t.prototype || objectProto$5;
    return e === r
  }

  function overArg(e, t) {
    return function(r) {
      return e(t(r))
    }
  }

  function baseKeys(e) {
    if (!isPrototype(e)) return nativeKeys(e);
    var t = [];
    for (var r in Object(e)) hasOwnProperty$3.call(e, r) && "constructor" != r && t.push(r);
    return t
  }

  function keys(e) {
    return isArrayLike(e) ? arrayLikeKeys(e) : baseKeys(e)
  }

  function createArrayIterator(e) {
    var t = -1,
      r = e.length;
    return function() {
      return ++t < r ? {
        value: e[t],
        key: t
      } : null
    }
  }

  function createES2015Iterator(e) {
    var t = -1;
    return function() {
      var r = e.next();
      return r.done ? null : (t++, {
        value: r.value,
        key: t
      })
    }
  }

  function createObjectIterator(e) {
    var t = keys(e),
      r = -1,
      n = t.length;
    return function() {
      var o = t[++r];
      return r < n ? {
        value: e[o],
        key: o
      } : null
    }
  }

  function iterator(e) {
    if (isArrayLike(e)) return createArrayIterator(e);
    var t = getIterator(e);
    return t ? createES2015Iterator(t) : createObjectIterator(e)
  }

  function onlyOnce(e) {
    return function() {
      if (null === e) throw new Error("Callback was already called.");
      var t = e;
      e = null, t.apply(this, arguments)
    }
  }

  function _eachOfLimit(e) {
    return function(t, r, n) {
      function o(e, t) {
        if (c -= 1, e) s = !0, n(e);
        else {
          if (t === breakLoop || s && c <= 0) return s = !0, n(null);
          i()
        }
      }

      function i() {
        for (; c < e && !s;) {
          var t = a();
          if (null === t) return s = !0, void(c <= 0 && n(null));
          c += 1, r(t.value, t.key, onlyOnce(o))
        }
      }
      if (n = once(n || noop), e <= 0 || !t) return n(null);
      var a = iterator(t),
        s = !1,
        c = 0;
      i()
    }
  }

  function eachOfLimit(e, t, r, n) {
    _eachOfLimit(t)(e, wrapAsync$1(r), n)
  }

  function doLimit(e, t) {
    return function(r, n, o) {
      return e(r, t, n, o)
    }
  }

  function eachOfArrayLike(e, t, r) {
    function n(e, t) {
      e ? r(e) : ++i !== a && t !== breakLoop || r(null)
    }
    r = once(r || noop);
    var o = 0,
      i = 0,
      a = e.length;
    for (0 === a && r(null); o < a; o++) t(e[o], o, onlyOnce(n))
  }

  function doParallel(e) {
    return function(t, r, n) {
      return e(eachOf, t, wrapAsync$1(r), n)
    }
  }

  function _asyncMap(e, t, r, n) {
    n = n || noop, t = t || [];
    var o = [],
      i = 0,
      a = wrapAsync$1(r);
    e(t, function(e, t, r) {
      var n = i++;
      a(e, function(e, t) {
        o[n] = t, r(e)
      })
    }, function(e) {
      n(e, o)
    })
  }

  function doParallelLimit(e) {
    return function(t, r, n, o) {
      return e(_eachOfLimit(r), t, wrapAsync$1(n), o)
    }
  }

  function arrayEach(e, t) {
    for (var r = -1, n = null == e ? 0 : e.length; ++r < n && t(e[r], r, e) !== !1;);
    return e
  }

  function createBaseFor(e) {
    return function(t, r, n) {
      for (var o = -1, i = Object(t), a = n(t), s = a.length; s--;) {
        var c = a[e ? s : ++o];
        if (r(i[c], c, i) === !1) break
      }
      return t
    }
  }

  function baseForOwn(e, t) {
    return e && baseFor(e, t, keys)
  }

  function baseFindIndex(e, t, r, n) {
    for (var o = e.length, i = r + (n ? 1 : -1); n ? i-- : ++i < o;)
      if (t(e[i], i, e)) return i;
    return -1
  }

  function baseIsNaN(e) {
    return e !== e
  }

  function strictIndexOf(e, t, r) {
    for (var n = r - 1, o = e.length; ++n < o;)
      if (e[n] === t) return n;
    return -1
  }

  function baseIndexOf(e, t, r) {
    return t === t ? strictIndexOf(e, t, r) : baseFindIndex(e, baseIsNaN, r)
  }

  function arrayMap(e, t) {
    for (var r = -1, n = null == e ? 0 : e.length, o = Array(n); ++r < n;) o[r] = t(e[r], r, e);
    return o
  }

  function isSymbol(e) {
    return "symbol" == typeof e || isObjectLike(e) && baseGetTag(e) == symbolTag
  }

  function baseToString(e) {
    if ("string" == typeof e) return e;
    if (isArray(e)) return arrayMap(e, baseToString) + "";
    if (isSymbol(e)) return symbolToString ? symbolToString.call(e) : "";
    var t = e + "";
    return "0" == t && 1 / e == -INFINITY ? "-0" : t
  }

  function baseSlice(e, t, r) {
    var n = -1,
      o = e.length;
    t < 0 && (t = -t > o ? 0 : o + t), r = r > o ? o : r, r < 0 && (r += o), o = t > r ? 0 : r - t >>> 0, t >>>= 0;
    for (var i = Array(o); ++n < o;) i[n] = e[n + t];
    return i
  }

  function castSlice(e, t, r) {
    var n = e.length;
    return r = void 0 === r ? n : r, !t && r >= n ? e : baseSlice(e, t, r)
  }

  function charsEndIndex(e, t) {
    for (var r = e.length; r-- && baseIndexOf(t, e[r], 0) > -1;);
    return r
  }

  function charsStartIndex(e, t) {
    for (var r = -1, n = e.length; ++r < n && baseIndexOf(t, e[r], 0) > -1;);
    return r
  }

  function asciiToArray(e) {
    return e.split("")
  }

  function hasUnicode(e) {
    return reHasUnicode.test(e)
  }

  function unicodeToArray(e) {
    return e.match(reUnicode) || []
  }

  function stringToArray(e) {
    return hasUnicode(e) ? unicodeToArray(e) : asciiToArray(e)
  }

  function toString(e) {
    return null == e ? "" : baseToString(e)
  }

  function trim(e, t, r) {
    if (e = toString(e), e && (r || void 0 === t)) return e.replace(reTrim, "");
    if (!e || !(t = baseToString(t))) return e;
    var n = stringToArray(e),
      o = stringToArray(t),
      i = charsStartIndex(n, o),
      a = charsEndIndex(n, o) + 1;
    return castSlice(n, i, a).join("")
  }

  function parseParams(e) {
    return e = e.toString().replace(STRIP_COMMENTS, ""), e = e.match(FN_ARGS)[2].replace(" ", ""), e = e ? e.split(FN_ARG_SPLIT) : [], e = e.map(function(e) {
      return trim(e.replace(FN_ARG, ""))
    })
  }

  function autoInject(e, t) {
    var r = {};
    baseForOwn(e, function(e, t) {
      function n(t, r) {
        var n = arrayMap(o, function(e) {
          return t[e]
        });
        n.push(r), wrapAsync$1(e).apply(null, n)
      }
      var o, i = isAsync(e),
        a = !i && 1 === e.length || i && 0 === e.length;
      if (isArray(e)) o = e.slice(0, -1), e = e[e.length - 1], r[t] = o.concat(o.length > 0 ? n : e);
      else if (a) r[t] = e;
      else {
        if (o = parseParams(e), 0 === e.length && !i && 0 === o.length) throw new Error("autoInject task functions require explicit parameters.");
        i || o.pop(), r[t] = o.concat(n)
      }
    }), auto(r, t)
  }

  function fallback(e) {
    setTimeout(e, 0)
  }

  function wrap(e) {
    return rest(function(t, r) {
      e(function() {
        t.apply(null, r)
      })
    })
  }

  function DLL() {
    this.head = this.tail = null, this.length = 0
  }

  function setInitial(e, t) {
    e.length = 1, e.head = e.tail = t
  }

  function queue(e, t, r) {
    function n(e, t, r) {
      if (null != r && "function" != typeof r) throw new Error("task callback must be a function");
      if (u.started = !0, isArray(e) || (e = [e]), 0 === e.length && u.idle()) return setImmediate$1(function() {
        u.drain()
      });
      for (var n = 0, o = e.length; n < o; n++) {
        var i = {
          data: e[n],
          callback: r || noop
        };
        t ? u._tasks.unshift(i) : u._tasks.push(i)
      }
      setImmediate$1(u.process)
    }

    function o(e) {
      return rest(function(t) {
        a -= 1;
        for (var r = 0, n = e.length; r < n; r++) {
          var o = e[r],
            i = baseIndexOf(s, o, 0);
          i >= 0 && s.splice(i), o.callback.apply(o, t), null != t[0] && u.error(t[0], o.data)
        }
        a <= u.concurrency - u.buffer && u.unsaturated(), u.idle() && u.drain(), u.process()
      })
    }
    if (null == t) t = 1;
    else if (0 === t) throw new Error("Concurrency must not be zero");
    var i = wrapAsync$1(e),
      a = 0,
      s = [],
      c = !1,
      u = {
        _tasks: new DLL,
        concurrency: t,
        payload: r,
        saturated: noop,
        unsaturated: noop,
        buffer: t / 4,
        empty: noop,
        drain: noop,
        error: noop,
        started: !1,
        paused: !1,
        push: function(e, t) {
          n(e, !1, t)
        },
        kill: function() {
          u.drain = noop, u._tasks.empty()
        },
        unshift: function(e, t) {
          n(e, !0, t)
        },
        process: function() {
          if (!c) {
            for (c = !0; !u.paused && a < u.concurrency && u._tasks.length;) {
              var e = [],
                t = [],
                r = u._tasks.length;
              u.payload && (r = Math.min(r, u.payload));
              for (var n = 0; n < r; n++) {
                var l = u._tasks.shift();
                e.push(l), t.push(l.data)
              }
              0 === u._tasks.length && u.empty(), a += 1, s.push(e[0]), a === u.concurrency && u.saturated();
              var f = onlyOnce(o(e));
              i(t, f)
            }
            c = !1
          }
        },
        length: function() {
          return u._tasks.length
        },
        running: function() {
          return a
        },
        workersList: function() {
          return s
        },
        idle: function() {
          return u._tasks.length + a === 0
        },
        pause: function() {
          u.paused = !0
        },
        resume: function() {
          u.paused !== !1 && (u.paused = !1, setImmediate$1(u.process))
        }
      };
    return u
  }

  function cargo(e, t) {
    return queue(e, 1, t)
  }

  function reduce(e, t, r, n) {
    n = once(n || noop);
    var o = wrapAsync$1(r);
    eachOfSeries(e, function(e, r, n) {
      o(t, e, function(e, r) {
        t = r, n(e)
      })
    }, function(e) {
      n(e, t)
    })
  }

  function concat$1(e, t, r, n) {
    var o = [];
    e(t, function(e, t, n) {
      r(e, function(e, t) {
        o = o.concat(t || []), n(e)
      })
    }, function(e) {
      n(e, o)
    })
  }

  function doSeries(e) {
    return function(t, r, n) {
      return e(eachOfSeries, t, wrapAsync$1(r), n)
    }
  }

  function _createTester(e, t) {
    return function(r, n, o, i) {
      i = i || noop;
      var a, s = !1;
      r(n, function(r, n, i) {
        o(r, function(n, o) {
          n ? i(n) : e(o) && !a ? (s = !0, a = t(!0, r), i(null, breakLoop)) : i()
        })
      }, function(e) {
        e ? i(e) : i(null, s ? a : t(!1))
      })
    }
  }

  function _findGetResult(e, t) {
    return t
  }

  function consoleFunc(e) {
    return rest(function(t, r) {
      wrapAsync$1(t).apply(null, r.concat(rest(function(t, r) {
        "object" == typeof console && (t ? console.error && console.error(t) : console[e] && arrayEach(r, function(t) {
          console[e](t)
        }))
      })))
    })
  }

  function doDuring(e, t, r) {
    function n(e, t) {
      return e ? r(e) : t ? void o(a) : r(null)
    }
    r = onlyOnce(r || noop);
    var o = wrapAsync$1(e),
      i = wrapAsync$1(t),
      a = rest(function(e, t) {
        return e ? r(e) : (t.push(n), void i.apply(this, t))
      });
    n(null, !0)
  }

  function doWhilst(e, t, r) {
    r = onlyOnce(r || noop);
    var n = wrapAsync$1(e),
      o = rest(function(e, i) {
        return e ? r(e) : t.apply(this, i) ? n(o) : void r.apply(null, [null].concat(i))
      });
    n(o)
  }

  function doUntil(e, t, r) {
    doWhilst(e, function() {
      return !t.apply(this, arguments)
    }, r)
  }

  function during(e, t, r) {
    function n(e) {
      return e ? r(e) : void a(o)
    }

    function o(e, t) {
      return e ? r(e) : t ? void i(n) : r(null)
    }
    r = onlyOnce(r || noop);
    var i = wrapAsync$1(t),
      a = wrapAsync$1(e);
    a(o)
  }

  function _withoutIndex(e) {
    return function(t, r, n) {
      return e(t, n)
    }
  }

  function eachLimit(e, t, r) {
    eachOf(e, _withoutIndex(wrapAsync$1(t)), r)
  }

  function eachLimit$1(e, t, r, n) {
    _eachOfLimit(t)(e, _withoutIndex(wrapAsync$1(r)), n)
  }

  function ensureAsync(e) {
    return isAsync(e) ? e : initialParams(function(t, r) {
      var n = !0;
      t.push(function() {
        var e = arguments;
        n ? setImmediate$1(function() {
          r.apply(null, e)
        }) : r.apply(null, e)
      }), e.apply(this, t), n = !1
    })
  }

  function notId(e) {
    return !e
  }

  function baseProperty(e) {
    return function(t) {
      return null == t ? void 0 : t[e]
    }
  }

  function filterArray(e, t, r, n) {
    var o = new Array(t.length);
    e(t, function(e, t, n) {
      r(e, function(e, r) {
        o[t] = !!r, n(e)
      })
    }, function(e) {
      if (e) return n(e);
      for (var r = [], i = 0; i < t.length; i++) o[i] && r.push(t[i]);
      n(null, r)
    })
  }

  function filterGeneric(e, t, r, n) {
    var o = [];
    e(t, function(e, t, n) {
      r(e, function(r, i) {
        r ? n(r) : (i && o.push({
          index: t,
          value: e
        }), n())
      })
    }, function(e) {
      e ? n(e) : n(null, arrayMap(o.sort(function(e, t) {
        return e.index - t.index
      }), baseProperty("value")))
    })
  }

  function _filter(e, t, r, n) {
    var o = isArrayLike(t) ? filterArray : filterGeneric;
    o(e, t, wrapAsync$1(r), n || noop)
  }

  function forever(e, t) {
    function r(e) {
      return e ? n(e) : void o(r)
    }
    var n = onlyOnce(t || noop),
      o = wrapAsync$1(ensureAsync(e));
    r()
  }

  function mapValuesLimit(e, t, r, n) {
    n = once(n || noop);
    var o = {},
      i = wrapAsync$1(r);
    eachOfLimit(e, t, function(e, t, r) {
      i(e, t, function(e, n) {
        return e ? r(e) : (o[t] = n, void r())
      })
    }, function(e) {
      n(e, o)
    })
  }

  function has(e, t) {
    return t in e
  }

  function memoize(e, t) {
    var r = Object.create(null),
      n = Object.create(null);
    t = t || identity;
    var o = wrapAsync$1(e),
      i = initialParams(function(e, i) {
        var a = t.apply(null, e);
        has(r, a) ? setImmediate$1(function() {
          i.apply(null, r[a])
        }) : has(n, a) ? n[a].push(i) : (n[a] = [i], o.apply(null, e.concat(rest(function(e) {
          r[a] = e;
          var t = n[a];
          delete n[a];
          for (var o = 0, i = t.length; o < i; o++) t[o].apply(null, e)
        }))))
      });
    return i.memo = r, i.unmemoized = e, i
  }

  function _parallel(e, t, r) {
    r = r || noop;
    var n = isArrayLike(t) ? [] : {};
    e(t, function(e, t, r) {
      wrapAsync$1(e)(rest(function(e, o) {
        o.length <= 1 && (o = o[0]), n[t] = o, r(e)
      }))
    }, function(e) {
      r(e, n)
    })
  }

  function parallelLimit(e, t) {
    _parallel(eachOf, e, t)
  }

  function parallelLimit$1(e, t, r) {
    _parallel(_eachOfLimit(t), e, r)
  }

  function race(e, t) {
    if (t = once(t || noop), !isArray(e)) return t(new TypeError("First argument to race must be an array of functions"));
    if (!e.length) return t();
    for (var r = 0, n = e.length; r < n; r++) wrapAsync$1(e[r])(t)
  }

  function reduceRight(e, t, r, n) {
    var o = slice.call(e).reverse();
    reduce(o, t, r, n)
  }

  function reflect(e) {
    var t = wrapAsync$1(e);
    return initialParams(function(e, r) {
      return e.push(rest(function(e, t) {
        if (e) r(null, {
          error: e
        });
        else {
          var n = null;
          1 === t.length ? n = t[0] : t.length > 1 && (n = t), r(null, {
            value: n
          })
        }
      })), t.apply(this, e)
    })
  }

  function reject$1(e, t, r, n) {
    _filter(e, t, function(e, t) {
      r(e, function(e, r) {
        t(e, !r)
      })
    }, n)
  }

  function reflectAll(e) {
    var t;
    return isArray(e) ? t = arrayMap(e, reflect) : (t = {}, baseForOwn(e, function(e, r) {
      t[r] = reflect.call(this, e)
    })), t
  }

  function constant$1(e) {
    return function() {
      return e
    }
  }

  function retry(e, t, r) {
    function n(e, t) {
      if ("object" == typeof t) e.times = +t.times || i, e.intervalFunc = "function" == typeof t.interval ? t.interval : constant$1(+t.interval || a), e.errorFilter = t.errorFilter;
      else {
        if ("number" != typeof t && "string" != typeof t) throw new Error("Invalid arguments for async.retry");
        e.times = +t || i
      }
    }

    function o() {
      c(function(e) {
        e && u++ < s.times && ("function" != typeof s.errorFilter || s.errorFilter(e)) ? setTimeout(o, s.intervalFunc(u)) : r.apply(null, arguments)
      })
    }
    var i = 5,
      a = 0,
      s = {
        times: i,
        intervalFunc: constant$1(a)
      };
    if (arguments.length < 3 && "function" == typeof e ? (r = t || noop, t = e) : (n(s, e), r = r || noop), "function" != typeof t) throw new Error("Invalid arguments for async.retry");
    var c = wrapAsync$1(t),
      u = 1;
    o()
  }

  function series(e, t) {
    _parallel(eachOfSeries, e, t)
  }

  function sortBy(e, t, r) {
    function n(e, t) {
      var r = e.criteria,
        n = t.criteria;
      return r < n ? -1 : r > n ? 1 : 0
    }
    var o = wrapAsync$1(t);
    map(e, function(e, t) {
      o(e, function(r, n) {
        return r ? t(r) : void t(null, {
          value: e,
          criteria: n
        })
      })
    }, function(e, t) {
      return e ? r(e) : void r(null, arrayMap(t.sort(n), baseProperty("value")))
    })
  }

  function timeout(e, t, r) {
    function n() {
      s || (i.apply(null, arguments), clearTimeout(a))
    }

    function o() {
      var t = e.name || "anonymous",
        n = new Error('Callback function "' + t + '" timed out.');
      n.code = "ETIMEDOUT", r && (n.info = r), s = !0, i(n)
    }
    var i, a, s = !1,
      c = wrapAsync$1(e);
    return initialParams(function(e, r) {
      i = r, a = setTimeout(o, t), c.apply(null, e.concat(n))
    })
  }

  function baseRange(e, t, r, n) {
    for (var o = -1, i = nativeMax$1(nativeCeil((t - e) / (r || 1)), 0), a = Array(i); i--;) a[n ? i : ++o] = e, e += r;
    return a
  }

  function timeLimit(e, t, r, n) {
    var o = wrapAsync$1(r);
    mapLimit(baseRange(0, e, 1), t, o, n)
  }

  function transform(e, t, r, n) {
    arguments.length <= 3 && (n = r, r = t, t = isArray(e) ? [] : {}), n = once(n || noop);
    var o = wrapAsync$1(r);
    eachOf(e, function(e, r, n) {
      o(t, e, r, n)
    }, function(e) {
      n(e, t)
    })
  }

  function unmemoize(e) {
    return function() {
      return (e.unmemoized || e).apply(null, arguments)
    }
  }

  function whilst(e, t, r) {
    r = onlyOnce(r || noop);
    var n = wrapAsync$1(t);
    if (!e()) return r(null);
    var o = rest(function(t, i) {
      return t ? r(t) : e() ? n(o) : void r.apply(null, [null].concat(i))
    });
    n(o)
  }

  function until(e, t, r) {
    whilst(function() {
      return !e.apply(this, arguments)
    }, t, r)
  }
  var nativeMax = Math.max,
    initialParams = function(e) {
      return rest(function(t) {
        var r = t.pop();
        e.call(this, t, r)
      })
    },
    supportsSymbol = "function" == typeof Symbol,
    wrapAsync$1 = supportsAsync() ? wrapAsync : identity,
    freeGlobal = "object" == typeof global && global && global.Object === Object && global,
    freeSelf = "object" == typeof self && self && self.Object === Object && self,
    root = freeGlobal || freeSelf || Function("return this")(),
    Symbol$1 = root.Symbol,
    objectProto = Object.prototype,
    hasOwnProperty = objectProto.hasOwnProperty,
    nativeObjectToString = objectProto.toString,
    symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0,
    objectProto$1 = Object.prototype,
    nativeObjectToString$1 = objectProto$1.toString,
    nullTag = "[object Null]",
    undefinedTag = "[object Undefined]",
    symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0,
    asyncTag = "[object AsyncFunction]",
    funcTag = "[object Function]",
    genTag = "[object GeneratorFunction]",
    proxyTag = "[object Proxy]",
    MAX_SAFE_INTEGER = 9007199254740991,
    breakLoop = {},
    iteratorSymbol = "function" == typeof Symbol && Symbol.iterator,
    getIterator = function(e) {
      return iteratorSymbol && e[iteratorSymbol] && e[iteratorSymbol]()
    },
    argsTag = "[object Arguments]",
    objectProto$3 = Object.prototype,
    hasOwnProperty$2 = objectProto$3.hasOwnProperty,
    propertyIsEnumerable = objectProto$3.propertyIsEnumerable,
    isArguments = baseIsArguments(function() {
      return arguments
    }()) ? baseIsArguments : function(e) {
      return isObjectLike(e) && hasOwnProperty$2.call(e, "callee") && !propertyIsEnumerable.call(e, "callee")
    },
    isArray = Array.isArray,
    freeExports = "object" == typeof exports && exports && !exports.nodeType && exports,
    freeModule = freeExports && "object" == typeof module && module && !module.nodeType && module,
    moduleExports = freeModule && freeModule.exports === freeExports,
    Buffer = moduleExports ? root.Buffer : void 0,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0,
    isBuffer = nativeIsBuffer || stubFalse,
    MAX_SAFE_INTEGER$1 = 9007199254740991,
    reIsUint = /^(?:0|[1-9]\d*)$/,
    argsTag$1 = "[object Arguments]",
    arrayTag = "[object Array]",
    boolTag = "[object Boolean]",
    dateTag = "[object Date]",
    errorTag = "[object Error]",
    funcTag$1 = "[object Function]",
    mapTag = "[object Map]",
    numberTag = "[object Number]",
    objectTag = "[object Object]",
    regexpTag = "[object RegExp]",
    setTag = "[object Set]",
    stringTag = "[object String]",
    weakMapTag = "[object WeakMap]",
    arrayBufferTag = "[object ArrayBuffer]",
    dataViewTag = "[object DataView]",
    float32Tag = "[object Float32Array]",
    float64Tag = "[object Float64Array]",
    int8Tag = "[object Int8Array]",
    int16Tag = "[object Int16Array]",
    int32Tag = "[object Int32Array]",
    uint8Tag = "[object Uint8Array]",
    uint8ClampedTag = "[object Uint8ClampedArray]",
    uint16Tag = "[object Uint16Array]",
    uint32Tag = "[object Uint32Array]",
    typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = !0, typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = !1;
  var freeExports$1 = "object" == typeof exports && exports && !exports.nodeType && exports,
    freeModule$1 = freeExports$1 && "object" == typeof module && module && !module.nodeType && module,
    moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1,
    freeProcess = moduleExports$1 && freeGlobal.process,
    nodeUtil = function() {
      try {
        return freeProcess && freeProcess.binding("util")
      } catch (e) {}
    }(),
    nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray,
    isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray,
    objectProto$2 = Object.prototype,
    hasOwnProperty$1 = objectProto$2.hasOwnProperty,
    objectProto$5 = Object.prototype,
    nativeKeys = overArg(Object.keys, Object),
    objectProto$4 = Object.prototype,
    hasOwnProperty$3 = objectProto$4.hasOwnProperty,
    eachOfGeneric = doLimit(eachOfLimit, 1 / 0),
    eachOf = function(e, t, r) {
      var n = isArrayLike(e) ? eachOfArrayLike : eachOfGeneric;
      n(e, wrapAsync$1(t), r)
    },
    map = doParallel(_asyncMap),
    applyEach = applyEach$1(map),
    mapLimit = doParallelLimit(_asyncMap),
    mapSeries = doLimit(mapLimit, 1),
    applyEachSeries = applyEach$1(mapSeries),
    apply$2 = rest(function(e, t) {
      return rest(function(r) {
        return e.apply(null, t.concat(r))
      })
    }),
    baseFor = createBaseFor(),
    auto = function(e, t, r) {
      function n(e, t) {
        g.push(function() {
          s(e, t)
        })
      }

      function o() {
        if (0 === g.length && 0 === y) return r(null, p);
        for (; g.length && y < t;) {
          var e = g.shift();
          e()
        }
      }

      function i(e, t) {
        var r = d[e];
        r || (r = d[e] = []), r.push(t)
      }

      function a(e) {
        var t = d[e] || [];
        arrayEach(t, function(e) {
          e()
        }), o()
      }

      function s(e, t) {
        if (!m) {
          var n = onlyOnce(rest(function(t, n) {
            if (y--, n.length <= 1 && (n = n[0]), t) {
              var o = {};
              baseForOwn(p, function(e, t) {
                o[t] = e
              }), o[e] = n, m = !0, d = Object.create(null), r(t, o)
            } else p[e] = n, a(e)
          }));
          y++;
          var o = wrapAsync$1(t[t.length - 1]);
          t.length > 1 ? o(p, n) : o(n)
        }
      }

      function c() {
        for (var e, t = 0; h.length;) e = h.pop(), t++, arrayEach(u(e), function(e) {
          0 === --b[e] && h.push(e)
        });
        if (t !== f) throw new Error("async.auto cannot execute tasks due to a recursive dependency")
      }

      function u(t) {
        var r = [];
        return baseForOwn(e, function(e, n) {
          isArray(e) && baseIndexOf(e, t, 0) >= 0 && r.push(n)
        }), r
      }
      "function" == typeof t && (r = t, t = null), r = once(r || noop);
      var l = keys(e),
        f = l.length;
      if (!f) return r(null);
      t || (t = f);
      var p = {},
        y = 0,
        m = !1,
        d = Object.create(null),
        g = [],
        h = [],
        b = {};
      baseForOwn(e, function(t, r) {
        if (!isArray(t)) return n(r, [t]), void h.push(r);
        var o = t.slice(0, t.length - 1),
          a = o.length;
        return 0 === a ? (n(r, t), void h.push(r)) : (b[r] = a, void arrayEach(o, function(s) {
          if (!e[s]) throw new Error("async.auto task `" + r + "` has a non-existent dependency `" + s + "` in " + o.join(", "));
          i(s, function() {
            a--, 0 === a && n(r, t)
          })
        }))
      }), c(), o()
    },
    symbolTag = "[object Symbol]",
    INFINITY = 1 / 0,
    symbolProto = Symbol$1 ? Symbol$1.prototype : void 0,
    symbolToString = symbolProto ? symbolProto.toString : void 0,
    rsAstralRange = "\\ud800-\\udfff",
    rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23",
    rsComboSymbolsRange = "\\u20d0-\\u20f0",
    rsVarRange = "\\ufe0e\\ufe0f",
    rsZWJ = "\\u200d",
    reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + "]"),
    rsAstralRange$1 = "\\ud800-\\udfff",
    rsComboMarksRange$1 = "\\u0300-\\u036f\\ufe20-\\ufe23",
    rsComboSymbolsRange$1 = "\\u20d0-\\u20f0",
    rsVarRange$1 = "\\ufe0e\\ufe0f",
    rsAstral = "[" + rsAstralRange$1 + "]",
    rsCombo = "[" + rsComboMarksRange$1 + rsComboSymbolsRange$1 + "]",
    rsFitz = "\\ud83c[\\udffb-\\udfff]",
    rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")",
    rsNonAstral = "[^" + rsAstralRange$1 + "]",
    rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}",
    rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]",
    rsZWJ$1 = "\\u200d",
    reOptMod = rsModifier + "?",
    rsOptVar = "[" + rsVarRange$1 + "]?",
    rsOptJoin = "(?:" + rsZWJ$1 + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*",
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")",
    reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g"),
    reTrim = /^\s+|\s+$/g,
    FN_ARGS = /^(?:async\s+)?(function)?\s*[^\(]*\(\s*([^\)]*)\)/m,
    FN_ARG_SPLIT = /,/,
    FN_ARG = /(=.+)?(\s*)$/,
    STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,
    hasSetImmediate = "function" == typeof setImmediate && setImmediate,
    hasNextTick = "object" == typeof process && "function" == typeof process.nextTick,
    _defer;
  _defer = hasSetImmediate ? setImmediate : hasNextTick ? process.nextTick : fallback;
  var setImmediate$1 = wrap(_defer);
  DLL.prototype.removeLink = function(e) {
    return e.prev ? e.prev.next = e.next : this.head = e.next, e.next ? e.next.prev = e.prev : this.tail = e.prev, e.prev = e.next = null, this.length -= 1, e
  }, DLL.prototype.empty = DLL, DLL.prototype.insertAfter = function(e, t) {
    t.prev = e, t.next = e.next, e.next ? e.next.prev = t : this.tail = t, e.next = t, this.length += 1
  }, DLL.prototype.insertBefore = function(e, t) {
    t.prev = e.prev, t.next = e, e.prev ? e.prev.next = t : this.head = t, e.prev = t, this.length += 1
  }, DLL.prototype.unshift = function(e) {
    this.head ? this.insertBefore(this.head, e) : setInitial(this, e)
  }, DLL.prototype.push = function(e) {
    this.tail ? this.insertAfter(this.tail, e) : setInitial(this, e)
  }, DLL.prototype.shift = function() {
    return this.head && this.removeLink(this.head)
  }, DLL.prototype.pop = function() {
    return this.tail && this.removeLink(this.tail)
  };
  var eachOfSeries = doLimit(eachOfLimit, 1),
    seq$1 = rest(function(e) {
      var t = arrayMap(e, wrapAsync$1);
      return rest(function(e) {
        var r = this,
          n = e[e.length - 1];
        "function" == typeof n ? e.pop() : n = noop, reduce(t, e, function(e, t, n) {
          t.apply(r, e.concat(rest(function(e, t) {
            n(e, t)
          })))
        }, function(e, t) {
          n.apply(r, [e].concat(t))
        })
      })
    }),
    compose = rest(function(e) {
      return seq$1.apply(null, e.reverse())
    }),
    concat = doParallel(concat$1),
    concatSeries = doSeries(concat$1),
    constant = rest(function(e) {
      var t = [null].concat(e);
      return initialParams(function(e, r) {
        return r.apply(this, t)
      })
    }),
    detect = doParallel(_createTester(identity, _findGetResult)),
    detectLimit = doParallelLimit(_createTester(identity, _findGetResult)),
    detectSeries = doLimit(detectLimit, 1),
    dir = consoleFunc("dir"),
    eachSeries = doLimit(eachLimit$1, 1),
    every = doParallel(_createTester(notId, notId)),
    everyLimit = doParallelLimit(_createTester(notId, notId)),
    everySeries = doLimit(everyLimit, 1),
    filter = doParallel(_filter),
    filterLimit = doParallelLimit(_filter),
    filterSeries = doLimit(filterLimit, 1),
    groupByLimit = function(e, t, r, n) {
      n = n || noop;
      var o = wrapAsync$1(r);
      mapLimit(e, t, function(e, t) {
        o(e, function(r, n) {
          return r ? t(r) : t(null, {
            key: n,
            val: e
          })
        })
      }, function(e, t) {
        for (var r = {}, o = Object.prototype.hasOwnProperty, i = 0; i < t.length; i++)
          if (t[i]) {
            var a = t[i].key,
              s = t[i].val;
            o.call(r, a) ? r[a].push(s) : r[a] = [s]
          }
        return n(e, r)
      })
    },
    groupBy = doLimit(groupByLimit, 1 / 0),
    groupBySeries = doLimit(groupByLimit, 1),
    log = consoleFunc("log"),
    mapValues = doLimit(mapValuesLimit, 1 / 0),
    mapValuesSeries = doLimit(mapValuesLimit, 1),
    _defer$1;
  _defer$1 = hasNextTick ? process.nextTick : hasSetImmediate ? setImmediate : fallback;
  var nextTick = wrap(_defer$1),
    queue$1 = function(e, t) {
      var r = wrapAsync$1(e);
      return queue(function(e, t) {
        r(e[0], t)
      }, t, 1)
    },
    priorityQueue = function(e, t) {
      var r = queue$1(e, t);
      return r.push = function(e, t, n) {
        if (null == n && (n = noop), "function" != typeof n) throw new Error("task callback must be a function");
        if (r.started = !0, isArray(e) || (e = [e]), 0 === e.length) return setImmediate$1(function() {
          r.drain()
        });
        t = t || 0;
        for (var o = r._tasks.head; o && t >= o.priority;) o = o.next;
        for (var i = 0, a = e.length; i < a; i++) {
          var s = {
            data: e[i],
            priority: t,
            callback: n
          };
          o ? r._tasks.insertBefore(o, s) : r._tasks.push(s)
        }
        setImmediate$1(r.process)
      }, delete r.unshift, r
    },
    slice = Array.prototype.slice,
    reject = doParallel(reject$1),
    rejectLimit = doParallelLimit(reject$1),
    rejectSeries = doLimit(rejectLimit, 1),
    retryable = function(e, t) {
      t || (t = e, e = null);
      var r = wrapAsync$1(t);
      return initialParams(function(t, n) {
        function o(e) {
          r.apply(null, t.concat(e))
        }
        e ? retry(e, o, n) : retry(o, n)
      })
    },
    some = doParallel(_createTester(Boolean, identity)),
    someLimit = doParallelLimit(_createTester(Boolean, identity)),
    someSeries = doLimit(someLimit, 1),
    nativeCeil = Math.ceil,
    nativeMax$1 = Math.max,
    times = doLimit(timeLimit, 1 / 0),
    timesSeries = doLimit(timeLimit, 1),
    waterfall = function(e, t) {
      function r(o) {
        if (n === e.length) return t.apply(null, [null].concat(o));
        var i = onlyOnce(rest(function(e, n) {
          return e ? t.apply(null, [e].concat(n)) : void r(n)
        }));
        o.push(i);
        var a = wrapAsync$1(e[n++]);
        a.apply(null, o)
      }
      if (t = once(t || noop), !isArray(e)) return t(new Error("First argument to waterfall must be an array of functions"));
      if (!e.length) return t();
      var n = 0;
      r([])
    },
    index = {
      applyEach: applyEach,
      applyEachSeries: applyEachSeries,
      apply: apply$2,
      asyncify: asyncify,
      auto: auto,
      autoInject: autoInject,
      cargo: cargo,
      compose: compose,
      concat: concat,
      concatSeries: concatSeries,
      constant: constant,
      detect: detect,
      detectLimit: detectLimit,
      detectSeries: detectSeries,
      dir: dir,
      doDuring: doDuring,
      doUntil: doUntil,
      doWhilst: doWhilst,
      during: during,
      each: eachLimit,
      eachLimit: eachLimit$1,
      eachOf: eachOf,
      eachOfLimit: eachOfLimit,
      eachOfSeries: eachOfSeries,
      eachSeries: eachSeries,
      ensureAsync: ensureAsync,
      every: every,
      everyLimit: everyLimit,
      everySeries: everySeries,
      filter: filter,
      filterLimit: filterLimit,
      filterSeries: filterSeries,
      forever: forever,
      groupBy: groupBy,
      groupByLimit: groupByLimit,
      groupBySeries: groupBySeries,
      log: log,
      map: map,
      mapLimit: mapLimit,
      mapSeries: mapSeries,
      mapValues: mapValues,
      mapValuesLimit: mapValuesLimit,
      mapValuesSeries: mapValuesSeries,
      memoize: memoize,
      nextTick: nextTick,
      parallel: parallelLimit,
      parallelLimit: parallelLimit$1,
      priorityQueue: priorityQueue,
      queue: queue$1,
      race: race,
      reduce: reduce,
      reduceRight: reduceRight,
      reflect: reflect,
      reflectAll: reflectAll,
      reject: reject,
      rejectLimit: rejectLimit,
      rejectSeries: rejectSeries,
      retry: retry,
      retryable: retryable,
      seq: seq$1,
      series: series,
      setImmediate: setImmediate$1,
      some: some,
      someLimit: someLimit,
      someSeries: someSeries,
      sortBy: sortBy,
      timeout: timeout,
      times: times,
      timesLimit: timeLimit,
      timesSeries: timesSeries,
      transform: transform,
      unmemoize: unmemoize,
      until: until,
      waterfall: waterfall,
      whilst: whilst,
      all: every,
      any: some,
      forEach: eachLimit,
      forEachSeries: eachSeries,
      forEachLimit: eachLimit$1,
      forEachOf: eachOf,
      forEachOfSeries: eachOfSeries,
      forEachOfLimit: eachOfLimit,
      inject: reduce,
      foldl: reduce,
      foldr: reduceRight,
      select: filter,
      selectLimit: filterLimit,
      selectSeries: filterSeries,
      wrapSync: asyncify
    };
  exports.default = index, exports.applyEach = applyEach, exports.applyEachSeries = applyEachSeries, exports.apply = apply$2, exports.asyncify = asyncify, exports.auto = auto, exports.autoInject = autoInject, exports.cargo = cargo, exports.compose = compose, exports.concat = concat, exports.concatSeries = concatSeries, exports.constant = constant, exports.detect = detect, exports.detectLimit = detectLimit, exports.detectSeries = detectSeries, exports.dir = dir, exports.doDuring = doDuring, exports.doUntil = doUntil, exports.doWhilst = doWhilst, exports.during = during, exports.each = eachLimit, exports.eachLimit = eachLimit$1, exports.eachOf = eachOf, exports.eachOfLimit = eachOfLimit, exports.eachOfSeries = eachOfSeries, exports.eachSeries = eachSeries, exports.ensureAsync = ensureAsync, exports.every = every, exports.everyLimit = everyLimit, exports.everySeries = everySeries, exports.filter = filter, exports.filterLimit = filterLimit, exports.filterSeries = filterSeries, exports.forever = forever, exports.groupBy = groupBy, exports.groupByLimit = groupByLimit, exports.groupBySeries = groupBySeries, exports.log = log, exports.map = map, exports.mapLimit = mapLimit, exports.mapSeries = mapSeries, exports.mapValues = mapValues, exports.mapValuesLimit = mapValuesLimit, exports.mapValuesSeries = mapValuesSeries, exports.memoize = memoize, exports.nextTick = nextTick, exports.parallel = parallelLimit, exports.parallelLimit = parallelLimit$1, exports.priorityQueue = priorityQueue, exports.queue = queue$1, exports.race = race, exports.reduce = reduce, exports.reduceRight = reduceRight, exports.reflect = reflect, exports.reflectAll = reflectAll, exports.reject = reject, exports.rejectLimit = rejectLimit, exports.rejectSeries = rejectSeries, exports.retry = retry, exports.retryable = retryable, exports.seq = seq$1, exports.series = series, exports.setImmediate = setImmediate$1, exports.some = some, exports.someLimit = someLimit, exports.someSeries = someSeries, exports.sortBy = sortBy, exports.timeout = timeout, exports.times = times, exports.timesLimit = timeLimit, exports.timesSeries = timesSeries, exports.transform = transform, exports.unmemoize = unmemoize, exports.until = until, exports.waterfall = waterfall, exports.whilst = whilst, exports.all = every, exports.allLimit = everyLimit, exports.allSeries = everySeries, exports.any = some, exports.anyLimit = someLimit, exports.anySeries = someSeries, exports.find = detect, exports.findLimit = detectLimit, exports.findSeries = detectSeries, exports.forEach = eachLimit, exports.forEachSeries = eachSeries, exports.forEachLimit = eachLimit$1, exports.forEachOf = eachOf, exports.forEachOfSeries = eachOfSeries, exports.forEachOfLimit = eachOfLimit, exports.inject = reduce, exports.foldl = reduce, exports.foldr = reduceRight, exports.select = filter, exports.selectLimit = filterLimit, exports.selectSeries = filterSeries, exports.wrapSync = asyncify, Object.defineProperty(exports, "__esModule", {
    value: !0
  })
});
//# sourceMappingURL=async.min.map
