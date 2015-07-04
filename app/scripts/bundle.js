/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// @version 0.7.5
window.WebComponents = window.WebComponents || {}, function (e) {
    var t = e.flags || {}, n = "webcomponents-lite.js", r = document.querySelector('script[src*="' + n + '"]');
    if (!t.noOpts) {
        if (location.search.slice(1).split("&").forEach(function (e) {
                var n, r = e.split("=");
                r[0] && (n = r[0].match(/wc-(.+)/)) && (t[n[1]] = r[1] || !0)
            }), r)for (var o, i = 0; o = r.attributes[i]; i++)"src" !== o.name && (t[o.name] = o.value || !0);
        if (t.log) {
            var a = t.log.split(",");
            t.log = {}, a.forEach(function (e) {
                t.log[e] = !0
            })
        } else t.log = {}
    }
    t.shadow = t.shadow || t.shadowdom || t.polyfill, t.shadow = "native" === t.shadow ? !1 : t.shadow || !HTMLElement.prototype.createShadowRoot, t.register && (window.CustomElements = window.CustomElements || {flags: {}}, window.CustomElements.flags.register = t.register), e.flags = t
}(window.WebComponents), function (e) {
    "use strict";
    function t(e) {
        return void 0 !== h[e]
    }

    function n() {
        s.call(this), this._isInvalid = !0
    }

    function r(e) {
        return "" == e && n.call(this), e.toLowerCase()
    }

    function o(e) {
        var t = e.charCodeAt(0);
        return t > 32 && 127 > t && -1 == [34, 35, 60, 62, 63, 96].indexOf(t) ? e : encodeURIComponent(e)
    }

    function i(e) {
        var t = e.charCodeAt(0);
        return t > 32 && 127 > t && -1 == [34, 35, 60, 62, 96].indexOf(t) ? e : encodeURIComponent(e)
    }

    function a(e, a, s) {
        function c(e) {
            b.push(e)
        }

        var d = a || "scheme start", u = 0, l = "", _ = !1, w = !1, b = [];
        e:for (; (e[u - 1] != f || 0 == u) && !this._isInvalid;) {
            var g = e[u];
            switch (d) {
                case"scheme start":
                    if (!g || !m.test(g)) {
                        if (a) {
                            c("Invalid scheme.");
                            break e
                        }
                        l = "", d = "no scheme";
                        continue
                    }
                    l += g.toLowerCase(), d = "scheme";
                    break;
                case"scheme":
                    if (g && v.test(g))l += g.toLowerCase(); else {
                        if (":" != g) {
                            if (a) {
                                if (f == g)break e;
                                c("Code point not allowed in scheme: " + g);
                                break e
                            }
                            l = "", u = 0, d = "no scheme";
                            continue
                        }
                        if (this._scheme = l, l = "", a)break e;
                        t(this._scheme) && (this._isRelative = !0), d = "file" == this._scheme ? "relative" : this._isRelative && s && s._scheme == this._scheme ? "relative or authority" : this._isRelative ? "authority first slash" : "scheme data"
                    }
                    break;
                case"scheme data":
                    "?" == g ? (this._query = "?", d = "query") : "#" == g ? (this._fragment = "#", d = "fragment") : f != g && "	" != g && "\n" != g && "\r" != g && (this._schemeData += o(g));
                    break;
                case"no scheme":
                    if (s && t(s._scheme)) {
                        d = "relative";
                        continue
                    }
                    c("Missing scheme."), n.call(this);
                    break;
                case"relative or authority":
                    if ("/" != g || "/" != e[u + 1]) {
                        c("Expected /, got: " + g), d = "relative";
                        continue
                    }
                    d = "authority ignore slashes";
                    break;
                case"relative":
                    if (this._isRelative = !0, "file" != this._scheme && (this._scheme = s._scheme), f == g) {
                        this._host = s._host, this._port = s._port, this._path = s._path.slice(), this._query = s._query, this._username = s._username, this._password = s._password;
                        break e
                    }
                    if ("/" == g || "\\" == g)"\\" == g && c("\\ is an invalid code point."), d = "relative slash"; else if ("?" == g)this._host = s._host, this._port = s._port, this._path = s._path.slice(), this._query = "?", this._username = s._username, this._password = s._password, d = "query"; else {
                        if ("#" != g) {
                            var y = e[u + 1], E = e[u + 2];
                            ("file" != this._scheme || !m.test(g) || ":" != y && "|" != y || f != E && "/" != E && "\\" != E && "?" != E && "#" != E) && (this._host = s._host, this._port = s._port, this._username = s._username, this._password = s._password, this._path = s._path.slice(), this._path.pop()), d = "relative path";
                            continue
                        }
                        this._host = s._host, this._port = s._port, this._path = s._path.slice(), this._query = s._query, this._fragment = "#", this._username = s._username, this._password = s._password, d = "fragment"
                    }
                    break;
                case"relative slash":
                    if ("/" != g && "\\" != g) {
                        "file" != this._scheme && (this._host = s._host, this._port = s._port, this._username = s._username, this._password = s._password), d = "relative path";
                        continue
                    }
                    "\\" == g && c("\\ is an invalid code point."), d = "file" == this._scheme ? "file host" : "authority ignore slashes";
                    break;
                case"authority first slash":
                    if ("/" != g) {
                        c("Expected '/', got: " + g), d = "authority ignore slashes";
                        continue
                    }
                    d = "authority second slash";
                    break;
                case"authority second slash":
                    if (d = "authority ignore slashes", "/" != g) {
                        c("Expected '/', got: " + g);
                        continue
                    }
                    break;
                case"authority ignore slashes":
                    if ("/" != g && "\\" != g) {
                        d = "authority";
                        continue
                    }
                    c("Expected authority, got: " + g);
                    break;
                case"authority":
                    if ("@" == g) {
                        _ && (c("@ already seen."), l += "%40"), _ = !0;
                        for (var L = 0; L < l.length; L++) {
                            var M = l[L];
                            if ("	" != M && "\n" != M && "\r" != M)if (":" != M || null !== this._password) {
                                var T = o(M);
                                null !== this._password ? this._password += T : this._username += T
                            } else this._password = ""; else c("Invalid whitespace in authority.")
                        }
                        l = ""
                    } else {
                        if (f == g || "/" == g || "\\" == g || "?" == g || "#" == g) {
                            u -= l.length, l = "", d = "host";
                            continue
                        }
                        l += g
                    }
                    break;
                case"file host":
                    if (f == g || "/" == g || "\\" == g || "?" == g || "#" == g) {
                        2 != l.length || !m.test(l[0]) || ":" != l[1] && "|" != l[1] ? 0 == l.length ? d = "relative path start" : (this._host = r.call(this, l), l = "", d = "relative path start") : d = "relative path";
                        continue
                    }
                    "	" == g || "\n" == g || "\r" == g ? c("Invalid whitespace in file host.") : l += g;
                    break;
                case"host":
                case"hostname":
                    if (":" != g || w) {
                        if (f == g || "/" == g || "\\" == g || "?" == g || "#" == g) {
                            if (this._host = r.call(this, l), l = "", d = "relative path start", a)break e;
                            continue
                        }
                        "	" != g && "\n" != g && "\r" != g ? ("[" == g ? w = !0 : "]" == g && (w = !1), l += g) : c("Invalid code point in host/hostname: " + g)
                    } else if (this._host = r.call(this, l), l = "", d = "port", "hostname" == a)break e;
                    break;
                case"port":
                    if (/[0-9]/.test(g))l += g; else {
                        if (f == g || "/" == g || "\\" == g || "?" == g || "#" == g || a) {
                            if ("" != l) {
                                var N = parseInt(l, 10);
                                N != h[this._scheme] && (this._port = N + ""), l = ""
                            }
                            if (a)break e;
                            d = "relative path start";
                            continue
                        }
                        "	" == g || "\n" == g || "\r" == g ? c("Invalid code point in port: " + g) : n.call(this)
                    }
                    break;
                case"relative path start":
                    if ("\\" == g && c("'\\' not allowed in path."), d = "relative path", "/" != g && "\\" != g)continue;
                    break;
                case"relative path":
                    if (f != g && "/" != g && "\\" != g && (a || "?" != g && "#" != g))"	" != g && "\n" != g && "\r" != g && (l += o(g)); else {
                        "\\" == g && c("\\ not allowed in relative path.");
                        var O;
                        (O = p[l.toLowerCase()]) && (l = O), ".." == l ? (this._path.pop(), "/" != g && "\\" != g && this._path.push("")) : "." == l && "/" != g && "\\" != g ? this._path.push("") : "." != l && ("file" == this._scheme && 0 == this._path.length && 2 == l.length && m.test(l[0]) && "|" == l[1] && (l = l[0] + ":"), this._path.push(l)), l = "", "?" == g ? (this._query = "?", d = "query") : "#" == g && (this._fragment = "#", d = "fragment")
                    }
                    break;
                case"query":
                    a || "#" != g ? f != g && "	" != g && "\n" != g && "\r" != g && (this._query += i(g)) : (this._fragment = "#", d = "fragment");
                    break;
                case"fragment":
                    f != g && "	" != g && "\n" != g && "\r" != g && (this._fragment += g)
            }
            u++
        }
    }

    function s() {
        this._scheme = "", this._schemeData = "", this._username = "", this._password = null, this._host = "", this._port = "", this._path = [], this._query = "", this._fragment = "", this._isInvalid = !1, this._isRelative = !1
    }

    function c(e, t) {
        void 0 === t || t instanceof c || (t = new c(String(t))), this._url = e, s.call(this);
        var n = e.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, "");
        a.call(this, n, null, t)
    }

    var d = !1;
    if (!e.forceJURL)try {
        var u = new URL("b", "http://a");
        u.pathname = "c%20d", d = "http://a/c%20d" === u.href
    } catch (l) {
    }
    if (!d) {
        var h = Object.create(null);
        h.ftp = 21, h.file = 0, h.gopher = 70, h.http = 80, h.https = 443, h.ws = 80, h.wss = 443;
        var p = Object.create(null);
        p["%2e"] = ".", p[".%2e"] = "..", p["%2e."] = "..", p["%2e%2e"] = "..";
        var f = void 0, m = /[a-zA-Z]/, v = /[a-zA-Z0-9\+\-\.]/;
        c.prototype = {
            toString: function () {
                return this.href
            }, get href() {
                if (this._isInvalid)return this._url;
                var e = "";
                return ("" != this._username || null != this._password) && (e = this._username + (null != this._password ? ":" + this._password : "") + "@"), this.protocol + (this._isRelative ? "//" + e + this.host : "") + this.pathname + this._query + this._fragment
            }, set href(e) {
                s.call(this), a.call(this, e)
            }, get protocol() {
                return this._scheme + ":"
            }, set protocol(e) {
                this._isInvalid || a.call(this, e + ":", "scheme start")
            }, get host() {
                return this._isInvalid ? "" : this._port ? this._host + ":" + this._port : this._host
            }, set host(e) {
                !this._isInvalid && this._isRelative && a.call(this, e, "host")
            }, get hostname() {
                return this._host
            }, set hostname(e) {
                !this._isInvalid && this._isRelative && a.call(this, e, "hostname")
            }, get port() {
                return this._port
            }, set port(e) {
                !this._isInvalid && this._isRelative && a.call(this, e, "port")
            }, get pathname() {
                return this._isInvalid ? "" : this._isRelative ? "/" + this._path.join("/") : this._schemeData
            }, set pathname(e) {
                !this._isInvalid && this._isRelative && (this._path = [], a.call(this, e, "relative path start"))
            }, get search() {
                return this._isInvalid || !this._query || "?" == this._query ? "" : this._query
            }, set search(e) {
                !this._isInvalid && this._isRelative && (this._query = "?", "?" == e[0] && (e = e.slice(1)), a.call(this, e, "query"))
            }, get hash() {
                return this._isInvalid || !this._fragment || "#" == this._fragment ? "" : this._fragment
            }, set hash(e) {
                this._isInvalid || (this._fragment = "#", "#" == e[0] && (e = e.slice(1)), a.call(this, e, "fragment"))
            }, get origin() {
                var e;
                if (this._isInvalid || !this._scheme)return "";
                switch (this._scheme) {
                    case"data":
                    case"file":
                    case"javascript":
                    case"mailto":
                        return "null"
                }
                return e = this.host, e ? this._scheme + "://" + e : ""
            }
        };
        var _ = e.URL;
        _ && (c.createObjectURL = function (e) {
            return _.createObjectURL.apply(_, arguments)
        }, c.revokeObjectURL = function (e) {
            _.revokeObjectURL(e)
        }), e.URL = c
    }
}(this), "undefined" == typeof WeakMap && !function () {
    var e = Object.defineProperty, t = Date.now() % 1e9, n = function () {
        this.name = "__st" + (1e9 * Math.random() >>> 0) + (t++ + "__")
    };
    n.prototype = {
        set: function (t, n) {
            var r = t[this.name];
            return r && r[0] === t ? r[1] = n : e(t, this.name, {value: [t, n], writable: !0}), this
        }, get: function (e) {
            var t;
            return (t = e[this.name]) && t[0] === e ? t[1] : void 0
        }, "delete": function (e) {
            var t = e[this.name];
            return t && t[0] === e ? (t[0] = t[1] = void 0, !0) : !1
        }, has: function (e) {
            var t = e[this.name];
            return t ? t[0] === e : !1
        }
    }, window.WeakMap = n
}(), function (e) {
    function t(e) {
        g.push(e), b || (b = !0, m(r))
    }

    function n(e) {
        return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(e) || e
    }

    function r() {
        b = !1;
        var e = g;
        g = [], e.sort(function (e, t) {
            return e.uid_ - t.uid_
        });
        var t = !1;
        e.forEach(function (e) {
            var n = e.takeRecords();
            o(e), n.length && (e.callback_(n, e), t = !0)
        }), t && r()
    }

    function o(e) {
        e.nodes_.forEach(function (t) {
            var n = v.get(t);
            n && n.forEach(function (t) {
                t.observer === e && t.removeTransientObservers()
            })
        })
    }

    function i(e, t) {
        for (var n = e; n; n = n.parentNode) {
            var r = v.get(n);
            if (r)for (var o = 0; o < r.length; o++) {
                var i = r[o], a = i.options;
                if (n === e || a.subtree) {
                    var s = t(a);
                    s && i.enqueue(s)
                }
            }
        }
    }

    function a(e) {
        this.callback_ = e, this.nodes_ = [], this.records_ = [], this.uid_ = ++y
    }

    function s(e, t) {
        this.type = e, this.target = t, this.addedNodes = [], this.removedNodes = [], this.previousSibling = null, this.nextSibling = null, this.attributeName = null, this.attributeNamespace = null, this.oldValue = null
    }

    function c(e) {
        var t = new s(e.type, e.target);
        return t.addedNodes = e.addedNodes.slice(), t.removedNodes = e.removedNodes.slice(), t.previousSibling = e.previousSibling, t.nextSibling = e.nextSibling, t.attributeName = e.attributeName, t.attributeNamespace = e.attributeNamespace, t.oldValue = e.oldValue, t
    }

    function d(e, t) {
        return E = new s(e, t)
    }

    function u(e) {
        return L ? L : (L = c(E), L.oldValue = e, L)
    }

    function l() {
        E = L = void 0
    }

    function h(e) {
        return e === L || e === E
    }

    function p(e, t) {
        return e === t ? e : L && h(e) ? L : null
    }

    function f(e, t, n) {
        this.observer = e, this.target = t, this.options = n, this.transientObservedNodes = []
    }

    var m, v = new WeakMap;
    if (/Trident|Edge/.test(navigator.userAgent))m = setTimeout; else if (window.setImmediate)m = window.setImmediate; else {
        var _ = [], w = String(Math.random());
        window.addEventListener("message", function (e) {
            if (e.data === w) {
                var t = _;
                _ = [], t.forEach(function (e) {
                    e()
                })
            }
        }), m = function (e) {
            _.push(e), window.postMessage(w, "*")
        }
    }
    var b = !1, g = [], y = 0;
    a.prototype = {
        observe: function (e, t) {
            if (e = n(e), !t.childList && !t.attributes && !t.characterData || t.attributeOldValue && !t.attributes || t.attributeFilter && t.attributeFilter.length && !t.attributes || t.characterDataOldValue && !t.characterData)throw new SyntaxError;
            var r = v.get(e);
            r || v.set(e, r = []);
            for (var o, i = 0; i < r.length; i++)if (r[i].observer === this) {
                o = r[i], o.removeListeners(), o.options = t;
                break
            }
            o || (o = new f(this, e, t), r.push(o), this.nodes_.push(e)), o.addListeners()
        }, disconnect: function () {
            this.nodes_.forEach(function (e) {
                for (var t = v.get(e), n = 0; n < t.length; n++) {
                    var r = t[n];
                    if (r.observer === this) {
                        r.removeListeners(), t.splice(n, 1);
                        break
                    }
                }
            }, this), this.records_ = []
        }, takeRecords: function () {
            var e = this.records_;
            return this.records_ = [], e
        }
    };
    var E, L;
    f.prototype = {
        enqueue: function (e) {
            var n = this.observer.records_, r = n.length;
            if (n.length > 0) {
                var o = n[r - 1], i = p(o, e);
                if (i)return void(n[r - 1] = i)
            } else t(this.observer);
            n[r] = e
        }, addListeners: function () {
            this.addListeners_(this.target)
        }, addListeners_: function (e) {
            var t = this.options;
            t.attributes && e.addEventListener("DOMAttrModified", this, !0), t.characterData && e.addEventListener("DOMCharacterDataModified", this, !0), t.childList && e.addEventListener("DOMNodeInserted", this, !0), (t.childList || t.subtree) && e.addEventListener("DOMNodeRemoved", this, !0)
        }, removeListeners: function () {
            this.removeListeners_(this.target)
        }, removeListeners_: function (e) {
            var t = this.options;
            t.attributes && e.removeEventListener("DOMAttrModified", this, !0), t.characterData && e.removeEventListener("DOMCharacterDataModified", this, !0), t.childList && e.removeEventListener("DOMNodeInserted", this, !0), (t.childList || t.subtree) && e.removeEventListener("DOMNodeRemoved", this, !0)
        }, addTransientObserver: function (e) {
            if (e !== this.target) {
                this.addListeners_(e), this.transientObservedNodes.push(e);
                var t = v.get(e);
                t || v.set(e, t = []), t.push(this)
            }
        }, removeTransientObservers: function () {
            var e = this.transientObservedNodes;
            this.transientObservedNodes = [], e.forEach(function (e) {
                this.removeListeners_(e);
                for (var t = v.get(e), n = 0; n < t.length; n++)if (t[n] === this) {
                    t.splice(n, 1);
                    break
                }
            }, this)
        }, handleEvent: function (e) {
            switch (e.stopImmediatePropagation(), e.type) {
                case"DOMAttrModified":
                    var t = e.attrName, n = e.relatedNode.namespaceURI, r = e.target, o = new d("attributes", r);
                    o.attributeName = t, o.attributeNamespace = n;
                    var a = e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;
                    i(r, function (e) {
                        return !e.attributes || e.attributeFilter && e.attributeFilter.length && -1 === e.attributeFilter.indexOf(t) && -1 === e.attributeFilter.indexOf(n) ? void 0 : e.attributeOldValue ? u(a) : o
                    });
                    break;
                case"DOMCharacterDataModified":
                    var r = e.target, o = d("characterData", r), a = e.prevValue;
                    i(r, function (e) {
                        return e.characterData ? e.characterDataOldValue ? u(a) : o : void 0
                    });
                    break;
                case"DOMNodeRemoved":
                    this.addTransientObserver(e.target);
                case"DOMNodeInserted":
                    var s, c, h = e.target;
                    "DOMNodeInserted" === e.type ? (s = [h], c = []) : (s = [], c = [h]);
                    var p = h.previousSibling, f = h.nextSibling, o = d("childList", e.target.parentNode);
                    o.addedNodes = s, o.removedNodes = c, o.previousSibling = p, o.nextSibling = f, i(e.relatedNode, function (e) {
                        return e.childList ? o : void 0
                    })
            }
            l()
        }
    }, e.JsMutationObserver = a, e.MutationObserver || (e.MutationObserver = a)
}(this), window.HTMLImports = window.HTMLImports || {flags: {}}, function (e) {
    function t(e, t) {
        t = t || f, r(function () {
            i(e, t)
        }, t)
    }

    function n(e) {
        return "complete" === e.readyState || e.readyState === _
    }

    function r(e, t) {
        if (n(t))e && e(); else {
            var o = function () {
                ("complete" === t.readyState || t.readyState === _) && (t.removeEventListener(w, o), r(e, t))
            };
            t.addEventListener(w, o)
        }
    }

    function o(e) {
        e.target.__loaded = !0
    }

    function i(e, t) {
        function n() {
            c == d && e && e({allImports: s, loadedImports: u, errorImports: l})
        }

        function r(e) {
            o(e), u.push(this), c++, n()
        }

        function i(e) {
            l.push(this), c++, n()
        }

        var s = t.querySelectorAll("link[rel=import]"), c = 0, d = s.length, u = [], l = [];
        if (d)for (var h, p = 0; d > p && (h = s[p]); p++)a(h) ? (c++, n()) : (h.addEventListener("load", r), h.addEventListener("error", i)); else n()
    }

    function a(e) {
        return l ? e.__loaded || e["import"] && "loading" !== e["import"].readyState : e.__importParsed
    }

    function s(e) {
        for (var t, n = 0, r = e.length; r > n && (t = e[n]); n++)c(t) && d(t)
    }

    function c(e) {
        return "link" === e.localName && "import" === e.rel
    }

    function d(e) {
        var t = e["import"];
        t ? o({target: e}) : (e.addEventListener("load", o), e.addEventListener("error", o))
    }

    var u = "import", l = Boolean(u in document.createElement("link")), h = Boolean(window.ShadowDOMPolyfill), p = function (e) {
        return h ? window.ShadowDOMPolyfill.wrapIfNeeded(e) : e
    }, f = p(document), m = {
        get: function () {
            var e = window.HTMLImports.currentScript || document.currentScript || ("complete" !== document.readyState ? document.scripts[document.scripts.length - 1] : null);
            return p(e)
        }, configurable: !0
    };
    Object.defineProperty(document, "_currentScript", m), Object.defineProperty(f, "_currentScript", m);
    var v = /Trident/.test(navigator.userAgent), _ = v ? "complete" : "interactive", w = "readystatechange";
    l && (new MutationObserver(function (e) {
        for (var t, n = 0, r = e.length; r > n && (t = e[n]); n++)t.addedNodes && s(t.addedNodes)
    }).observe(document.head, {childList: !0}), function () {
        if ("loading" === document.readyState)for (var e, t = document.querySelectorAll("link[rel=import]"), n = 0, r = t.length; r > n && (e = t[n]); n++)d(e)
    }()), t(function (e) {
        window.HTMLImports.ready = !0, window.HTMLImports.readyTime = (new Date).getTime();
        var t = f.createEvent("CustomEvent");
        t.initCustomEvent("HTMLImportsLoaded", !0, !0, e), f.dispatchEvent(t)
    }), e.IMPORT_LINK_TYPE = u, e.useNative = l, e.rootDocument = f, e.whenReady = t, e.isIE = v
}(window.HTMLImports), function (e) {
    var t = [], n = function (e) {
        t.push(e)
    }, r = function () {
        t.forEach(function (t) {
            t(e)
        })
    };
    e.addModule = n, e.initializeModules = r
}(window.HTMLImports), window.HTMLImports.addModule(function (e) {
    var t = /(url\()([^)]*)(\))/g, n = /(@import[\s]+(?!url\())([^;]*)(;)/g, r = {
        resolveUrlsInStyle: function (e, t) {
            var n = e.ownerDocument, r = n.createElement("a");
            return e.textContent = this.resolveUrlsInCssText(e.textContent, t, r), e
        }, resolveUrlsInCssText: function (e, r, o) {
            var i = this.replaceUrls(e, o, r, t);
            return i = this.replaceUrls(i, o, r, n)
        }, replaceUrls: function (e, t, n, r) {
            return e.replace(r, function (e, r, o, i) {
                var a = o.replace(/["']/g, "");
                return n && (a = new URL(a, n).href), t.href = a, a = t.href, r + "'" + a + "'" + i
            })
        }
    };
    e.path = r
}), window.HTMLImports.addModule(function (e) {
    var t = {
        async: !0, ok: function (e) {
            return e.status >= 200 && e.status < 300 || 304 === e.status || 0 === e.status
        }, load: function (n, r, o) {
            var i = new XMLHttpRequest;
            return (e.flags.debug || e.flags.bust) && (n += "?" + Math.random()), i.open("GET", n, t.async), i.addEventListener("readystatechange", function (e) {
                if (4 === i.readyState) {
                    var n = i.getResponseHeader("Location"), a = null;
                    if (n)var a = "/" === n.substr(0, 1) ? location.origin + n : n;
                    r.call(o, !t.ok(i) && i, i.response || i.responseText, a)
                }
            }), i.send(), i
        }, loadDocument: function (e, t, n) {
            this.load(e, t, n).responseType = "document"
        }
    };
    e.xhr = t
}), window.HTMLImports.addModule(function (e) {
    var t = e.xhr, n = e.flags, r = function (e, t) {
        this.cache = {}, this.onload = e, this.oncomplete = t, this.inflight = 0, this.pending = {}
    };
    r.prototype = {
        addNodes: function (e) {
            this.inflight += e.length;
            for (var t, n = 0, r = e.length; r > n && (t = e[n]); n++)this.require(t);
            this.checkDone()
        }, addNode: function (e) {
            this.inflight++, this.require(e), this.checkDone()
        }, require: function (e) {
            var t = e.src || e.href;
            e.__nodeUrl = t, this.dedupe(t, e) || this.fetch(t, e)
        }, dedupe: function (e, t) {
            if (this.pending[e])return this.pending[e].push(t), !0;
            return this.cache[e] ? (this.onload(e, t, this.cache[e]), this.tail(), !0) : (this.pending[e] = [t], !1)
        }, fetch: function (e, r) {
            if (n.load && console.log("fetch", e, r), e)if (e.match(/^data:/)) {
                var o = e.split(","), i = o[0], a = o[1];
                a = i.indexOf(";base64") > -1 ? atob(a) : decodeURIComponent(a), setTimeout(function () {
                    this.receive(e, r, null, a)
                }.bind(this), 0)
            } else {
                var s = function (t, n, o) {
                    this.receive(e, r, t, n, o)
                }.bind(this);
                t.load(e, s)
            } else setTimeout(function () {
                this.receive(e, r, {error: "href must be specified"}, null)
            }.bind(this), 0)
        }, receive: function (e, t, n, r, o) {
            this.cache[e] = r;
            for (var i, a = this.pending[e], s = 0, c = a.length; c > s && (i = a[s]); s++)this.onload(e, i, r, n, o), this.tail();
            this.pending[e] = null
        }, tail: function () {
            --this.inflight, this.checkDone()
        }, checkDone: function () {
            this.inflight || this.oncomplete()
        }
    }, e.Loader = r
}), window.HTMLImports.addModule(function (e) {
    var t = function (e) {
        this.addCallback = e, this.mo = new MutationObserver(this.handler.bind(this))
    };
    t.prototype = {
        handler: function (e) {
            for (var t, n = 0, r = e.length; r > n && (t = e[n]); n++)"childList" === t.type && t.addedNodes.length && this.addedNodes(t.addedNodes)
        }, addedNodes: function (e) {
            this.addCallback && this.addCallback(e);
            for (var t, n = 0, r = e.length; r > n && (t = e[n]); n++)t.children && t.children.length && this.addedNodes(t.children)
        }, observe: function (e) {
            this.mo.observe(e, {childList: !0, subtree: !0})
        }
    }, e.Observer = t
}), window.HTMLImports.addModule(function (e) {
    function t(e) {
        return "link" === e.localName && e.rel === u
    }

    function n(e) {
        var t = r(e);
        return "data:text/javascript;charset=utf-8," + encodeURIComponent(t)
    }

    function r(e) {
        return e.textContent + o(e)
    }

    function o(e) {
        var t = e.ownerDocument;
        t.__importedScripts = t.__importedScripts || 0;
        var n = e.ownerDocument.baseURI, r = t.__importedScripts ? "-" + t.__importedScripts : "";
        return t.__importedScripts++, "\n//# sourceURL=" + n + r + ".js\n"
    }

    function i(e) {
        var t = e.ownerDocument.createElement("style");
        return t.textContent = e.textContent, a.resolveUrlsInStyle(t), t
    }

    var a = e.path, s = e.rootDocument, c = e.flags, d = e.isIE, u = e.IMPORT_LINK_TYPE, l = "link[rel=" + u + "]", h = {
        documentSelectors: l,
        importsSelectors: [l, "link[rel=stylesheet]", "style", "script:not([type])", 'script[type="application/javascript"]', 'script[type="text/javascript"]'].join(","),
        map: {link: "parseLink", script: "parseScript", style: "parseStyle"},
        dynamicElements: [],
        parseNext: function () {
            var e = this.nextToParse();
            e && this.parse(e)
        },
        parse: function (e) {
            if (this.isParsed(e))return void(c.parse && console.log("[%s] is already parsed", e.localName));
            var t = this[this.map[e.localName]];
            t && (this.markParsing(e), t.call(this, e))
        },
        parseDynamic: function (e, t) {
            this.dynamicElements.push(e), t || this.parseNext()
        },
        markParsing: function (e) {
            c.parse && console.log("parsing", e), this.parsingElement = e
        },
        markParsingComplete: function (e) {
            e.__importParsed = !0, this.markDynamicParsingComplete(e), e.__importElement && (e.__importElement.__importParsed = !0, this.markDynamicParsingComplete(e.__importElement)), this.parsingElement = null, c.parse && console.log("completed", e)
        },
        markDynamicParsingComplete: function (e) {
            var t = this.dynamicElements.indexOf(e);
            t >= 0 && this.dynamicElements.splice(t, 1)
        },
        parseImport: function (e) {
            if (window.HTMLImports.__importsParsingHook && window.HTMLImports.__importsParsingHook(e), e["import"] && (e["import"].__importParsed = !0), this.markParsingComplete(e), e.dispatchEvent(e.__resource && !e.__error ? new CustomEvent("load", {bubbles: !1}) : new CustomEvent("error", {bubbles: !1})), e.__pending)for (var t; e.__pending.length;)t = e.__pending.shift(), t && t({target: e});
            this.parseNext()
        },
        parseLink: function (e) {
            t(e) ? this.parseImport(e) : (e.href = e.href, this.parseGeneric(e))
        },
        parseStyle: function (e) {
            var t = e;
            e = i(e), t.__appliedElement = e, e.__importElement = t, this.parseGeneric(e)
        },
        parseGeneric: function (e) {
            this.trackElement(e), this.addElementToDocument(e)
        },
        rootImportForElement: function (e) {
            for (var t = e; t.ownerDocument.__importLink;)t = t.ownerDocument.__importLink;
            return t
        },
        addElementToDocument: function (e) {
            var t = this.rootImportForElement(e.__importElement || e);
            t.parentNode.insertBefore(e, t)
        },
        trackElement: function (e, t) {
            var n = this, r = function (r) {
                t && t(r), n.markParsingComplete(e), n.parseNext()
            };
            if (e.addEventListener("load", r), e.addEventListener("error", r), d && "style" === e.localName) {
                var o = !1;
                if (-1 == e.textContent.indexOf("@import"))o = !0; else if (e.sheet) {
                    o = !0;
                    for (var i, a = e.sheet.cssRules, s = a ? a.length : 0, c = 0; s > c && (i = a[c]); c++)i.type === CSSRule.IMPORT_RULE && (o = o && Boolean(i.styleSheet))
                }
                o && setTimeout(function () {
                    e.dispatchEvent(new CustomEvent("load", {bubbles: !1}))
                })
            }
        },
        parseScript: function (t) {
            var r = document.createElement("script");
            r.__importElement = t, r.src = t.src ? t.src : n(t), e.currentScript = t, this.trackElement(r, function (t) {
                r.parentNode.removeChild(r), e.currentScript = null
            }), this.addElementToDocument(r)
        },
        nextToParse: function () {
            return this._mayParse = [], !this.parsingElement && (this.nextToParseInDoc(s) || this.nextToParseDynamic())
        },
        nextToParseInDoc: function (e, n) {
            if (e && this._mayParse.indexOf(e) < 0) {
                this._mayParse.push(e);
                for (var r, o = e.querySelectorAll(this.parseSelectorsForNode(e)), i = 0, a = o.length; a > i && (r = o[i]); i++)if (!this.isParsed(r))return this.hasResource(r) ? t(r) ? this.nextToParseInDoc(r["import"], r) : r : void 0
            }
            return n
        },
        nextToParseDynamic: function () {
            return this.dynamicElements[0]
        },
        parseSelectorsForNode: function (e) {
            var t = e.ownerDocument || e;
            return t === s ? this.documentSelectors : this.importsSelectors
        },
        isParsed: function (e) {
            return e.__importParsed
        },
        needsDynamicParsing: function (e) {
            return this.dynamicElements.indexOf(e) >= 0
        },
        hasResource: function (e) {
            return t(e) && void 0 === e["import"] ? !1 : !0
        }
    };
    e.parser = h, e.IMPORT_SELECTOR = l
}), window.HTMLImports.addModule(function (e) {
    function t(e) {
        return n(e, a)
    }

    function n(e, t) {
        return "link" === e.localName && e.getAttribute("rel") === t
    }

    function r(e) {
        return !!Object.getOwnPropertyDescriptor(e, "baseURI")
    }

    function o(e, t) {
        var n = document.implementation.createHTMLDocument(a);
        n._URL = t;
        var o = n.createElement("base");
        o.setAttribute("href", t), n.baseURI || r(n) || Object.defineProperty(n, "baseURI", {value: t});
        var i = n.createElement("meta");
        return i.setAttribute("charset", "utf-8"), n.head.appendChild(i), n.head.appendChild(o), n.body.innerHTML = e, window.HTMLTemplateElement && HTMLTemplateElement.bootstrap && HTMLTemplateElement.bootstrap(n), n
    }

    var i = e.flags, a = e.IMPORT_LINK_TYPE, s = e.IMPORT_SELECTOR, c = e.rootDocument, d = e.Loader, u = e.Observer, l = e.parser, h = {
        documents: {},
        documentPreloadSelectors: s,
        importsPreloadSelectors: [s].join(","),
        loadNode: function (e) {
            p.addNode(e)
        },
        loadSubtree: function (e) {
            var t = this.marshalNodes(e);
            p.addNodes(t)
        },
        marshalNodes: function (e) {
            return e.querySelectorAll(this.loadSelectorsForNode(e))
        },
        loadSelectorsForNode: function (e) {
            var t = e.ownerDocument || e;
            return t === c ? this.documentPreloadSelectors : this.importsPreloadSelectors
        },
        loaded: function (e, n, r, a, s) {
            if (i.load && console.log("loaded", e, n), n.__resource = r, n.__error = a, t(n)) {
                var c = this.documents[e];
                void 0 === c && (c = a ? null : o(r, s || e), c && (c.__importLink = n, this.bootDocument(c)), this.documents[e] = c), n["import"] = c
            }
            l.parseNext()
        },
        bootDocument: function (e) {
            this.loadSubtree(e), this.observer.observe(e), l.parseNext()
        },
        loadedAll: function () {
            l.parseNext()
        }
    }, p = new d(h.loaded.bind(h), h.loadedAll.bind(h));
    if (h.observer = new u, !document.baseURI) {
        var f = {
            get: function () {
                var e = document.querySelector("base");
                return e ? e.href : window.location.href
            }, configurable: !0
        };
        Object.defineProperty(document, "baseURI", f), Object.defineProperty(c, "baseURI", f)
    }
    e.importer = h, e.importLoader = p
}), window.HTMLImports.addModule(function (e) {
    var t = e.parser, n = e.importer, r = {
        added: function (e) {
            for (var r, o, i, a, s = 0, c = e.length; c > s && (a = e[s]); s++)r || (r = a.ownerDocument, o = t.isParsed(r)), i = this.shouldLoadNode(a), i && n.loadNode(a), this.shouldParseNode(a) && o && t.parseDynamic(a, i)
        }, shouldLoadNode: function (e) {
            return 1 === e.nodeType && o.call(e, n.loadSelectorsForNode(e))
        }, shouldParseNode: function (e) {
            return 1 === e.nodeType && o.call(e, t.parseSelectorsForNode(e))
        }
    };
    n.observer.addCallback = r.added.bind(r);
    var o = HTMLElement.prototype.matches || HTMLElement.prototype.matchesSelector || HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector || HTMLElement.prototype.msMatchesSelector
}), function (e) {
    function t() {
        window.HTMLImports.importer.bootDocument(o)
    }

    var n = e.initializeModules, r = e.isIE;
    if (!e.useNative) {
        r && "function" != typeof window.CustomEvent && (window.CustomEvent = function (e, t) {
            t = t || {};
            var n = document.createEvent("CustomEvent");
            return n.initCustomEvent(e, Boolean(t.bubbles), Boolean(t.cancelable), t.detail), n.preventDefault = function () {
                Object.defineProperty(this, "defaultPrevented", {
                    get: function () {
                        return !0
                    }
                })
            }, n
        }, window.CustomEvent.prototype = window.Event.prototype), n();
        var o = e.rootDocument;
        "complete" === document.readyState || "interactive" === document.readyState && !window.attachEvent ? t() : document.addEventListener("DOMContentLoaded", t)
    }
}(window.HTMLImports), window.CustomElements = window.CustomElements || {flags: {}}, function (e) {
    var t = e.flags, n = [], r = function (e) {
        n.push(e)
    }, o = function () {
        n.forEach(function (t) {
            t(e)
        })
    };
    e.addModule = r, e.initializeModules = o, e.hasNative = Boolean(document.registerElement), e.useNative = !t.register && e.hasNative && !window.ShadowDOMPolyfill && (!window.HTMLImports || window.HTMLImports.useNative)
}(window.CustomElements), window.CustomElements.addModule(function (e) {
    function t(e, t) {
        n(e, function (e) {
            return t(e) ? !0 : void r(e, t)
        }), r(e, t)
    }

    function n(e, t, r) {
        var o = e.firstElementChild;
        if (!o)for (o = e.firstChild; o && o.nodeType !== Node.ELEMENT_NODE;)o = o.nextSibling;
        for (; o;)t(o, r) !== !0 && n(o, t, r), o = o.nextElementSibling;
        return null
    }

    function r(e, n) {
        for (var r = e.shadowRoot; r;)t(r, n), r = r.olderShadowRoot
    }

    function o(e, t) {
        i(e, t, [])
    }

    function i(e, t, n) {
        if (e = window.wrap(e), !(n.indexOf(e) >= 0)) {
            n.push(e);
            for (var r, o = e.querySelectorAll("link[rel=" + a + "]"), s = 0, c = o.length; c > s && (r = o[s]); s++)r["import"] && i(r["import"], t, n);
            t(e)
        }
    }

    var a = window.HTMLImports ? window.HTMLImports.IMPORT_LINK_TYPE : "none";
    e.forDocumentTree = o, e.forSubtree = t
}), window.CustomElements.addModule(function (e) {
    function t(e) {
        return n(e) || r(e)
    }

    function n(t) {
        return e.upgrade(t) ? !0 : void s(t)
    }

    function r(e) {
        g(e, function (e) {
            return n(e) ? !0 : void 0
        })
    }

    function o(e) {
        s(e), h(e) && g(e, function (e) {
            s(e)
        })
    }

    function i(e) {
        M.push(e), L || (L = !0, setTimeout(a))
    }

    function a() {
        L = !1;
        for (var e, t = M, n = 0, r = t.length; r > n && (e = t[n]); n++)e();
        M = []
    }

    function s(e) {
        E ? i(function () {
            c(e)
        }) : c(e)
    }

    function c(e) {
        e.__upgraded__ && (e.attachedCallback || e.detachedCallback) && !e.__attached && h(e) && (e.__attached = !0, e.attachedCallback && e.attachedCallback())
    }

    function d(e) {
        u(e), g(e, function (e) {
            u(e)
        })
    }

    function u(e) {
        E ? i(function () {
            l(e)
        }) : l(e)
    }

    function l(e) {
        e.__upgraded__ && (e.attachedCallback || e.detachedCallback) && e.__attached && !h(e) && (e.__attached = !1, e.detachedCallback && e.detachedCallback())
    }

    function h(e) {
        for (var t = e, n = wrap(document); t;) {
            if (t == n)return !0;
            t = t.parentNode || t.nodeType === Node.DOCUMENT_FRAGMENT_NODE && t.host
        }
    }

    function p(e) {
        if (e.shadowRoot && !e.shadowRoot.__watched) {
            b.dom && console.log("watching shadow-root for: ", e.localName);
            for (var t = e.shadowRoot; t;)v(t), t = t.olderShadowRoot
        }
    }

    function f(e) {
        if (b.dom) {
            var n = e[0];
            if (n && "childList" === n.type && n.addedNodes && n.addedNodes) {
                for (var r = n.addedNodes[0]; r && r !== document && !r.host;)r = r.parentNode;
                var o = r && (r.URL || r._URL || r.host && r.host.localName) || "";
                o = o.split("/?").shift().split("/").pop()
            }
            console.group("mutations (%d) [%s]", e.length, o || "")
        }
        e.forEach(function (e) {
            "childList" === e.type && (T(e.addedNodes, function (e) {
                e.localName && t(e)
            }), T(e.removedNodes, function (e) {
                e.localName && d(e)
            }))
        }), b.dom && console.groupEnd()
    }

    function m(e) {
        for (e = window.wrap(e), e || (e = window.wrap(document)); e.parentNode;)e = e.parentNode;
        var t = e.__observer;
        t && (f(t.takeRecords()), a())
    }

    function v(e) {
        if (!e.__observer) {
            var t = new MutationObserver(f);
            t.observe(e, {childList: !0, subtree: !0}), e.__observer = t
        }
    }

    function _(e) {
        e = window.wrap(e), b.dom && console.group("upgradeDocument: ", e.baseURI.split("/").pop()), t(e), v(e), b.dom && console.groupEnd()
    }

    function w(e) {
        y(e, _)
    }

    var b = e.flags, g = e.forSubtree, y = e.forDocumentTree, E = !window.MutationObserver || window.MutationObserver === window.JsMutationObserver;
    e.hasPolyfillMutations = E;
    var L = !1, M = [], T = Array.prototype.forEach.call.bind(Array.prototype.forEach), N = Element.prototype.createShadowRoot;
    N && (Element.prototype.createShadowRoot = function () {
        var e = N.call(this);
        return window.CustomElements.watchShadow(this), e
    }), e.watchShadow = p, e.upgradeDocumentTree = w, e.upgradeSubtree = r, e.upgradeAll = t, e.attachedNode = o, e.takeRecords = m
}), window.CustomElements.addModule(function (e) {
    function t(t) {
        if (!t.__upgraded__ && t.nodeType === Node.ELEMENT_NODE) {
            var r = t.getAttribute("is"), o = e.getRegisteredDefinition(r || t.localName);
            if (o) {
                if (r && o.tag == t.localName)return n(t, o);
                if (!r && !o["extends"])return n(t, o)
            }
        }
    }

    function n(t, n) {
        return a.upgrade && console.group("upgrade:", t.localName), n.is && t.setAttribute("is", n.is), r(t, n), t.__upgraded__ = !0, i(t), e.attachedNode(t), e.upgradeSubtree(t), a.upgrade && console.groupEnd(), t
    }

    function r(e, t) {
        Object.__proto__ ? e.__proto__ = t.prototype : (o(e, t.prototype, t["native"]), e.__proto__ = t.prototype)
    }

    function o(e, t, n) {
        for (var r = {}, o = t; o !== n && o !== HTMLElement.prototype;) {
            for (var i, a = Object.getOwnPropertyNames(o), s = 0; i = a[s]; s++)r[i] || (Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(o, i)), r[i] = 1);
            o = Object.getPrototypeOf(o)
        }
    }

    function i(e) {
        e.createdCallback && e.createdCallback()
    }

    var a = e.flags;
    e.upgrade = t, e.upgradeWithDefinition = n, e.implementPrototype = r
}), window.CustomElements.addModule(function (e) {
    function t(t, r) {
        var c = r || {};
        if (!t)throw new Error("document.registerElement: first argument `name` must not be empty");
        if (t.indexOf("-") < 0)throw new Error("document.registerElement: first argument ('name') must contain a dash ('-'). Argument provided was '" + String(t) + "'.");
        if (o(t))throw new Error("Failed to execute 'registerElement' on 'Document': Registration failed for type '" + String(t) + "'. The type name is invalid.");
        if (d(t))throw new Error("DuplicateDefinitionError: a type with name '" + String(t) + "' is already registered");
        return c.prototype || (c.prototype = Object.create(HTMLElement.prototype)), c.__name = t.toLowerCase(), c.lifecycle = c.lifecycle || {}, c.ancestry = i(c["extends"]), a(c), s(c), n(c.prototype), u(c.__name, c), c.ctor = l(c), c.ctor.prototype = c.prototype, c.prototype.constructor = c.ctor, e.ready && _(document), c.ctor
    }

    function n(e) {
        if (!e.setAttribute._polyfilled) {
            var t = e.setAttribute;
            e.setAttribute = function (e, n) {
                r.call(this, e, n, t)
            };
            var n = e.removeAttribute;
            e.removeAttribute = function (e) {
                r.call(this, e, null, n);

            }, e.setAttribute._polyfilled = !0
        }
    }

    function r(e, t, n) {
        e = e.toLowerCase();
        var r = this.getAttribute(e);
        n.apply(this, arguments);
        var o = this.getAttribute(e);
        this.attributeChangedCallback && o !== r && this.attributeChangedCallback(e, r, o)
    }

    function o(e) {
        for (var t = 0; t < E.length; t++)if (e === E[t])return !0
    }

    function i(e) {
        var t = d(e);
        return t ? i(t["extends"]).concat([t]) : []
    }

    function a(e) {
        for (var t, n = e["extends"], r = 0; t = e.ancestry[r]; r++)n = t.is && t.tag;
        e.tag = n || e.__name, n && (e.is = e.__name)
    }

    function s(e) {
        if (!Object.__proto__) {
            var t = HTMLElement.prototype;
            if (e.is) {
                var n = document.createElement(e.tag), r = Object.getPrototypeOf(n);
                r === e.prototype && (t = r)
            }
            for (var o, i = e.prototype; i && i !== t;)o = Object.getPrototypeOf(i), i.__proto__ = o, i = o;
            e["native"] = t
        }
    }

    function c(e) {
        return b(T(e.tag), e)
    }

    function d(e) {
        return e ? L[e.toLowerCase()] : void 0
    }

    function u(e, t) {
        L[e] = t
    }

    function l(e) {
        return function () {
            return c(e)
        }
    }

    function h(e, t, n) {
        return e === M ? p(t, n) : N(e, t)
    }

    function p(e, t) {
        e && (e = e.toLowerCase()), t && (t = t.toLowerCase());
        var n = d(t || e);
        if (n) {
            if (e == n.tag && t == n.is)return new n.ctor;
            if (!t && !n.is)return new n.ctor
        }
        var r;
        return t ? (r = p(e), r.setAttribute("is", t), r) : (r = T(e), e.indexOf("-") >= 0 && g(r, HTMLElement), r)
    }

    function f(e, t) {
        var n = e[t];
        e[t] = function () {
            var e = n.apply(this, arguments);
            return w(e), e
        }
    }

    var m, v = e.isIE11OrOlder, _ = e.upgradeDocumentTree, w = e.upgradeAll, b = e.upgradeWithDefinition, g = e.implementPrototype, y = e.useNative, E = ["annotation-xml", "color-profile", "font-face", "font-face-src", "font-face-uri", "font-face-format", "font-face-name", "missing-glyph"], L = {}, M = "http://www.w3.org/1999/xhtml", T = document.createElement.bind(document), N = document.createElementNS.bind(document);
    m = Object.__proto__ || y ? function (e, t) {
        return e instanceof t
    } : function (e, t) {
        for (var n = e; n;) {
            if (n === t.prototype)return !0;
            n = n.__proto__
        }
        return !1
    }, f(Node.prototype, "cloneNode"), f(document, "importNode"), v && !function () {
        var e = document.importNode;
        document.importNode = function () {
            var t = e.apply(document, arguments);
            if (t.nodeType == t.DOCUMENT_FRAGMENT_NODE) {
                var n = document.createDocumentFragment();
                return n.appendChild(t), n
            }
            return t
        }
    }(), document.registerElement = t, document.createElement = p, document.createElementNS = h, e.registry = L, e["instanceof"] = m, e.reservedTagList = E, e.getRegisteredDefinition = d, document.register = document.registerElement
}), function (e) {
    function t() {
        a(window.wrap(document)), window.HTMLImports && (window.HTMLImports.__importsParsingHook = function (e) {
            a(wrap(e["import"]))
        }), window.CustomElements.ready = !0, setTimeout(function () {
            window.CustomElements.readyTime = Date.now(), window.HTMLImports && (window.CustomElements.elapsed = window.CustomElements.readyTime - window.HTMLImports.readyTime), document.dispatchEvent(new CustomEvent("WebComponentsReady", {bubbles: !0}))
        })
    }

    var n = e.useNative, r = e.initializeModules, o = /Trident/.test(navigator.userAgent);
    if (n) {
        var i = function () {
        };
        e.watchShadow = i, e.upgrade = i, e.upgradeAll = i, e.upgradeDocumentTree = i, e.upgradeSubtree = i, e.takeRecords = i, e["instanceof"] = function (e, t) {
            return e instanceof t
        }
    } else r();
    var a = e.upgradeDocumentTree;
    if (window.wrap || (window.ShadowDOMPolyfill ? (window.wrap = window.ShadowDOMPolyfill.wrapIfNeeded, window.unwrap = window.ShadowDOMPolyfill.unwrapIfNeeded) : window.wrap = window.unwrap = function (e) {
            return e
        }), o && "function" != typeof window.CustomEvent && (window.CustomEvent = function (e, t) {
            t = t || {};
            var n = document.createEvent("CustomEvent");
            return n.initCustomEvent(e, Boolean(t.bubbles), Boolean(t.cancelable), t.detail), n.preventDefault = function () {
                Object.defineProperty(this, "defaultPrevented", {
                    get: function () {
                        return !0
                    }
                })
            }, n
        }, window.CustomEvent.prototype = window.Event.prototype), "complete" === document.readyState || e.flags.eager)t(); else if ("interactive" !== document.readyState || window.attachEvent || window.HTMLImports && !window.HTMLImports.ready) {
        var s = window.HTMLImports && !window.HTMLImports.ready ? "HTMLImportsLoaded" : "DOMContentLoaded";
        window.addEventListener(s, t)
    } else t();
    e.isIE11OrOlder = o
}(window.CustomElements), "undefined" == typeof HTMLTemplateElement && !function () {
    var e = "template";
    HTMLTemplateElement = function () {
    }, HTMLTemplateElement.prototype = Object.create(HTMLElement.prototype), HTMLTemplateElement.decorate = function (e) {
        e.content || (e.content = e.ownerDocument.createDocumentFragment());
        for (var t; t = e.firstChild;)e.content.appendChild(t)
    }, HTMLTemplateElement.bootstrap = function (t) {
        for (var n, r = t.querySelectorAll(e), o = 0, i = r.length; i > o && (n = r[o]); o++)HTMLTemplateElement.decorate(n)
    }, window.addEventListener("DOMContentLoaded", function () {
        HTMLTemplateElement.bootstrap(document)
    });
    var t = document.createElement;
    document.createElement = function () {
        "use strict";
        var e = t.apply(document, arguments);
        return "template" == e.localName && HTMLTemplateElement.decorate(e), e
    }
}(), function (e) {
    var t = document.createElement("style");
    t.textContent = "body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; position: relative; } \n";
    var n = document.querySelector("head");
    n.insertBefore(t, n.firstChild)
}(window.WebComponents);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYmNvbXBvbmVudHMtbGl0ZS5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IChjKSAyMDE0IFRoZSBQb2x5bWVyIFByb2plY3QgQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFRoaXMgY29kZSBtYXkgb25seSBiZSB1c2VkIHVuZGVyIHRoZSBCU0Qgc3R5bGUgbGljZW5zZSBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vTElDRU5TRS50eHRcbiAqIFRoZSBjb21wbGV0ZSBzZXQgb2YgYXV0aG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0FVVEhPUlMudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0NPTlRSSUJVVE9SUy50eHRcbiAqIENvZGUgZGlzdHJpYnV0ZWQgYnkgR29vZ2xlIGFzIHBhcnQgb2YgdGhlIHBvbHltZXIgcHJvamVjdCBpcyBhbHNvXG4gKiBzdWJqZWN0IHRvIGFuIGFkZGl0aW9uYWwgSVAgcmlnaHRzIGdyYW50IGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9QQVRFTlRTLnR4dFxuICovXG4vLyBAdmVyc2lvbiAwLjcuNVxud2luZG93LldlYkNvbXBvbmVudHM9d2luZG93LldlYkNvbXBvbmVudHN8fHt9LGZ1bmN0aW9uKGUpe3ZhciB0PWUuZmxhZ3N8fHt9LG49XCJ3ZWJjb21wb25lbnRzLWxpdGUuanNcIixyPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFtzcmMqPVwiJytuKydcIl0nKTtpZighdC5ub09wdHMpe2lmKGxvY2F0aW9uLnNlYXJjaC5zbGljZSgxKS5zcGxpdChcIiZcIikuZm9yRWFjaChmdW5jdGlvbihlKXt2YXIgbixyPWUuc3BsaXQoXCI9XCIpO3JbMF0mJihuPXJbMF0ubWF0Y2goL3djLSguKykvKSkmJih0W25bMV1dPXJbMV18fCEwKX0pLHIpZm9yKHZhciBvLGk9MDtvPXIuYXR0cmlidXRlc1tpXTtpKyspXCJzcmNcIiE9PW8ubmFtZSYmKHRbby5uYW1lXT1vLnZhbHVlfHwhMCk7aWYodC5sb2cpe3ZhciBhPXQubG9nLnNwbGl0KFwiLFwiKTt0LmxvZz17fSxhLmZvckVhY2goZnVuY3Rpb24oZSl7dC5sb2dbZV09ITB9KX1lbHNlIHQubG9nPXt9fXQuc2hhZG93PXQuc2hhZG93fHx0LnNoYWRvd2RvbXx8dC5wb2x5ZmlsbCx0LnNoYWRvdz1cIm5hdGl2ZVwiPT09dC5zaGFkb3c/ITE6dC5zaGFkb3d8fCFIVE1MRWxlbWVudC5wcm90b3R5cGUuY3JlYXRlU2hhZG93Um9vdCx0LnJlZ2lzdGVyJiYod2luZG93LkN1c3RvbUVsZW1lbnRzPXdpbmRvdy5DdXN0b21FbGVtZW50c3x8e2ZsYWdzOnt9fSx3aW5kb3cuQ3VzdG9tRWxlbWVudHMuZmxhZ3MucmVnaXN0ZXI9dC5yZWdpc3RlciksZS5mbGFncz10fSh3aW5kb3cuV2ViQ29tcG9uZW50cyksZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlKXtyZXR1cm4gdm9pZCAwIT09aFtlXX1mdW5jdGlvbiBuKCl7cy5jYWxsKHRoaXMpLHRoaXMuX2lzSW52YWxpZD0hMH1mdW5jdGlvbiByKGUpe3JldHVyblwiXCI9PWUmJm4uY2FsbCh0aGlzKSxlLnRvTG93ZXJDYXNlKCl9ZnVuY3Rpb24gbyhlKXt2YXIgdD1lLmNoYXJDb2RlQXQoMCk7cmV0dXJuIHQ+MzImJjEyNz50JiYtMT09WzM0LDM1LDYwLDYyLDYzLDk2XS5pbmRleE9mKHQpP2U6ZW5jb2RlVVJJQ29tcG9uZW50KGUpfWZ1bmN0aW9uIGkoZSl7dmFyIHQ9ZS5jaGFyQ29kZUF0KDApO3JldHVybiB0PjMyJiYxMjc+dCYmLTE9PVszNCwzNSw2MCw2Miw5Nl0uaW5kZXhPZih0KT9lOmVuY29kZVVSSUNvbXBvbmVudChlKX1mdW5jdGlvbiBhKGUsYSxzKXtmdW5jdGlvbiBjKGUpe2IucHVzaChlKX12YXIgZD1hfHxcInNjaGVtZSBzdGFydFwiLHU9MCxsPVwiXCIsXz0hMSx3PSExLGI9W107ZTpmb3IoOyhlW3UtMV0hPWZ8fDA9PXUpJiYhdGhpcy5faXNJbnZhbGlkOyl7dmFyIGc9ZVt1XTtzd2l0Y2goZCl7Y2FzZVwic2NoZW1lIHN0YXJ0XCI6aWYoIWd8fCFtLnRlc3QoZykpe2lmKGEpe2MoXCJJbnZhbGlkIHNjaGVtZS5cIik7YnJlYWsgZX1sPVwiXCIsZD1cIm5vIHNjaGVtZVwiO2NvbnRpbnVlfWwrPWcudG9Mb3dlckNhc2UoKSxkPVwic2NoZW1lXCI7YnJlYWs7Y2FzZVwic2NoZW1lXCI6aWYoZyYmdi50ZXN0KGcpKWwrPWcudG9Mb3dlckNhc2UoKTtlbHNle2lmKFwiOlwiIT1nKXtpZihhKXtpZihmPT1nKWJyZWFrIGU7YyhcIkNvZGUgcG9pbnQgbm90IGFsbG93ZWQgaW4gc2NoZW1lOiBcIitnKTticmVhayBlfWw9XCJcIix1PTAsZD1cIm5vIHNjaGVtZVwiO2NvbnRpbnVlfWlmKHRoaXMuX3NjaGVtZT1sLGw9XCJcIixhKWJyZWFrIGU7dCh0aGlzLl9zY2hlbWUpJiYodGhpcy5faXNSZWxhdGl2ZT0hMCksZD1cImZpbGVcIj09dGhpcy5fc2NoZW1lP1wicmVsYXRpdmVcIjp0aGlzLl9pc1JlbGF0aXZlJiZzJiZzLl9zY2hlbWU9PXRoaXMuX3NjaGVtZT9cInJlbGF0aXZlIG9yIGF1dGhvcml0eVwiOnRoaXMuX2lzUmVsYXRpdmU/XCJhdXRob3JpdHkgZmlyc3Qgc2xhc2hcIjpcInNjaGVtZSBkYXRhXCJ9YnJlYWs7Y2FzZVwic2NoZW1lIGRhdGFcIjpcIj9cIj09Zz8odGhpcy5fcXVlcnk9XCI/XCIsZD1cInF1ZXJ5XCIpOlwiI1wiPT1nPyh0aGlzLl9mcmFnbWVudD1cIiNcIixkPVwiZnJhZ21lbnRcIik6ZiE9ZyYmXCJcdFwiIT1nJiZcIlxcblwiIT1nJiZcIlxcclwiIT1nJiYodGhpcy5fc2NoZW1lRGF0YSs9byhnKSk7YnJlYWs7Y2FzZVwibm8gc2NoZW1lXCI6aWYocyYmdChzLl9zY2hlbWUpKXtkPVwicmVsYXRpdmVcIjtjb250aW51ZX1jKFwiTWlzc2luZyBzY2hlbWUuXCIpLG4uY2FsbCh0aGlzKTticmVhaztjYXNlXCJyZWxhdGl2ZSBvciBhdXRob3JpdHlcIjppZihcIi9cIiE9Z3x8XCIvXCIhPWVbdSsxXSl7YyhcIkV4cGVjdGVkIC8sIGdvdDogXCIrZyksZD1cInJlbGF0aXZlXCI7Y29udGludWV9ZD1cImF1dGhvcml0eSBpZ25vcmUgc2xhc2hlc1wiO2JyZWFrO2Nhc2VcInJlbGF0aXZlXCI6aWYodGhpcy5faXNSZWxhdGl2ZT0hMCxcImZpbGVcIiE9dGhpcy5fc2NoZW1lJiYodGhpcy5fc2NoZW1lPXMuX3NjaGVtZSksZj09Zyl7dGhpcy5faG9zdD1zLl9ob3N0LHRoaXMuX3BvcnQ9cy5fcG9ydCx0aGlzLl9wYXRoPXMuX3BhdGguc2xpY2UoKSx0aGlzLl9xdWVyeT1zLl9xdWVyeSx0aGlzLl91c2VybmFtZT1zLl91c2VybmFtZSx0aGlzLl9wYXNzd29yZD1zLl9wYXNzd29yZDticmVhayBlfWlmKFwiL1wiPT1nfHxcIlxcXFxcIj09ZylcIlxcXFxcIj09ZyYmYyhcIlxcXFwgaXMgYW4gaW52YWxpZCBjb2RlIHBvaW50LlwiKSxkPVwicmVsYXRpdmUgc2xhc2hcIjtlbHNlIGlmKFwiP1wiPT1nKXRoaXMuX2hvc3Q9cy5faG9zdCx0aGlzLl9wb3J0PXMuX3BvcnQsdGhpcy5fcGF0aD1zLl9wYXRoLnNsaWNlKCksdGhpcy5fcXVlcnk9XCI/XCIsdGhpcy5fdXNlcm5hbWU9cy5fdXNlcm5hbWUsdGhpcy5fcGFzc3dvcmQ9cy5fcGFzc3dvcmQsZD1cInF1ZXJ5XCI7ZWxzZXtpZihcIiNcIiE9Zyl7dmFyIHk9ZVt1KzFdLEU9ZVt1KzJdOyhcImZpbGVcIiE9dGhpcy5fc2NoZW1lfHwhbS50ZXN0KGcpfHxcIjpcIiE9eSYmXCJ8XCIhPXl8fGYhPUUmJlwiL1wiIT1FJiZcIlxcXFxcIiE9RSYmXCI/XCIhPUUmJlwiI1wiIT1FKSYmKHRoaXMuX2hvc3Q9cy5faG9zdCx0aGlzLl9wb3J0PXMuX3BvcnQsdGhpcy5fdXNlcm5hbWU9cy5fdXNlcm5hbWUsdGhpcy5fcGFzc3dvcmQ9cy5fcGFzc3dvcmQsdGhpcy5fcGF0aD1zLl9wYXRoLnNsaWNlKCksdGhpcy5fcGF0aC5wb3AoKSksZD1cInJlbGF0aXZlIHBhdGhcIjtjb250aW51ZX10aGlzLl9ob3N0PXMuX2hvc3QsdGhpcy5fcG9ydD1zLl9wb3J0LHRoaXMuX3BhdGg9cy5fcGF0aC5zbGljZSgpLHRoaXMuX3F1ZXJ5PXMuX3F1ZXJ5LHRoaXMuX2ZyYWdtZW50PVwiI1wiLHRoaXMuX3VzZXJuYW1lPXMuX3VzZXJuYW1lLHRoaXMuX3Bhc3N3b3JkPXMuX3Bhc3N3b3JkLGQ9XCJmcmFnbWVudFwifWJyZWFrO2Nhc2VcInJlbGF0aXZlIHNsYXNoXCI6aWYoXCIvXCIhPWcmJlwiXFxcXFwiIT1nKXtcImZpbGVcIiE9dGhpcy5fc2NoZW1lJiYodGhpcy5faG9zdD1zLl9ob3N0LHRoaXMuX3BvcnQ9cy5fcG9ydCx0aGlzLl91c2VybmFtZT1zLl91c2VybmFtZSx0aGlzLl9wYXNzd29yZD1zLl9wYXNzd29yZCksZD1cInJlbGF0aXZlIHBhdGhcIjtjb250aW51ZX1cIlxcXFxcIj09ZyYmYyhcIlxcXFwgaXMgYW4gaW52YWxpZCBjb2RlIHBvaW50LlwiKSxkPVwiZmlsZVwiPT10aGlzLl9zY2hlbWU/XCJmaWxlIGhvc3RcIjpcImF1dGhvcml0eSBpZ25vcmUgc2xhc2hlc1wiO2JyZWFrO2Nhc2VcImF1dGhvcml0eSBmaXJzdCBzbGFzaFwiOmlmKFwiL1wiIT1nKXtjKFwiRXhwZWN0ZWQgJy8nLCBnb3Q6IFwiK2cpLGQ9XCJhdXRob3JpdHkgaWdub3JlIHNsYXNoZXNcIjtjb250aW51ZX1kPVwiYXV0aG9yaXR5IHNlY29uZCBzbGFzaFwiO2JyZWFrO2Nhc2VcImF1dGhvcml0eSBzZWNvbmQgc2xhc2hcIjppZihkPVwiYXV0aG9yaXR5IGlnbm9yZSBzbGFzaGVzXCIsXCIvXCIhPWcpe2MoXCJFeHBlY3RlZCAnLycsIGdvdDogXCIrZyk7Y29udGludWV9YnJlYWs7Y2FzZVwiYXV0aG9yaXR5IGlnbm9yZSBzbGFzaGVzXCI6aWYoXCIvXCIhPWcmJlwiXFxcXFwiIT1nKXtkPVwiYXV0aG9yaXR5XCI7Y29udGludWV9YyhcIkV4cGVjdGVkIGF1dGhvcml0eSwgZ290OiBcIitnKTticmVhaztjYXNlXCJhdXRob3JpdHlcIjppZihcIkBcIj09Zyl7XyYmKGMoXCJAIGFscmVhZHkgc2Vlbi5cIiksbCs9XCIlNDBcIiksXz0hMDtmb3IodmFyIEw9MDtMPGwubGVuZ3RoO0wrKyl7dmFyIE09bFtMXTtpZihcIlx0XCIhPU0mJlwiXFxuXCIhPU0mJlwiXFxyXCIhPU0paWYoXCI6XCIhPU18fG51bGwhPT10aGlzLl9wYXNzd29yZCl7dmFyIFQ9byhNKTtudWxsIT09dGhpcy5fcGFzc3dvcmQ/dGhpcy5fcGFzc3dvcmQrPVQ6dGhpcy5fdXNlcm5hbWUrPVR9ZWxzZSB0aGlzLl9wYXNzd29yZD1cIlwiO2Vsc2UgYyhcIkludmFsaWQgd2hpdGVzcGFjZSBpbiBhdXRob3JpdHkuXCIpfWw9XCJcIn1lbHNle2lmKGY9PWd8fFwiL1wiPT1nfHxcIlxcXFxcIj09Z3x8XCI/XCI9PWd8fFwiI1wiPT1nKXt1LT1sLmxlbmd0aCxsPVwiXCIsZD1cImhvc3RcIjtjb250aW51ZX1sKz1nfWJyZWFrO2Nhc2VcImZpbGUgaG9zdFwiOmlmKGY9PWd8fFwiL1wiPT1nfHxcIlxcXFxcIj09Z3x8XCI/XCI9PWd8fFwiI1wiPT1nKXsyIT1sLmxlbmd0aHx8IW0udGVzdChsWzBdKXx8XCI6XCIhPWxbMV0mJlwifFwiIT1sWzFdPzA9PWwubGVuZ3RoP2Q9XCJyZWxhdGl2ZSBwYXRoIHN0YXJ0XCI6KHRoaXMuX2hvc3Q9ci5jYWxsKHRoaXMsbCksbD1cIlwiLGQ9XCJyZWxhdGl2ZSBwYXRoIHN0YXJ0XCIpOmQ9XCJyZWxhdGl2ZSBwYXRoXCI7Y29udGludWV9XCJcdFwiPT1nfHxcIlxcblwiPT1nfHxcIlxcclwiPT1nP2MoXCJJbnZhbGlkIHdoaXRlc3BhY2UgaW4gZmlsZSBob3N0LlwiKTpsKz1nO2JyZWFrO2Nhc2VcImhvc3RcIjpjYXNlXCJob3N0bmFtZVwiOmlmKFwiOlwiIT1nfHx3KXtpZihmPT1nfHxcIi9cIj09Z3x8XCJcXFxcXCI9PWd8fFwiP1wiPT1nfHxcIiNcIj09Zyl7aWYodGhpcy5faG9zdD1yLmNhbGwodGhpcyxsKSxsPVwiXCIsZD1cInJlbGF0aXZlIHBhdGggc3RhcnRcIixhKWJyZWFrIGU7Y29udGludWV9XCJcdFwiIT1nJiZcIlxcblwiIT1nJiZcIlxcclwiIT1nPyhcIltcIj09Zz93PSEwOlwiXVwiPT1nJiYodz0hMSksbCs9Zyk6YyhcIkludmFsaWQgY29kZSBwb2ludCBpbiBob3N0L2hvc3RuYW1lOiBcIitnKX1lbHNlIGlmKHRoaXMuX2hvc3Q9ci5jYWxsKHRoaXMsbCksbD1cIlwiLGQ9XCJwb3J0XCIsXCJob3N0bmFtZVwiPT1hKWJyZWFrIGU7YnJlYWs7Y2FzZVwicG9ydFwiOmlmKC9bMC05XS8udGVzdChnKSlsKz1nO2Vsc2V7aWYoZj09Z3x8XCIvXCI9PWd8fFwiXFxcXFwiPT1nfHxcIj9cIj09Z3x8XCIjXCI9PWd8fGEpe2lmKFwiXCIhPWwpe3ZhciBOPXBhcnNlSW50KGwsMTApO04hPWhbdGhpcy5fc2NoZW1lXSYmKHRoaXMuX3BvcnQ9TitcIlwiKSxsPVwiXCJ9aWYoYSlicmVhayBlO2Q9XCJyZWxhdGl2ZSBwYXRoIHN0YXJ0XCI7Y29udGludWV9XCJcdFwiPT1nfHxcIlxcblwiPT1nfHxcIlxcclwiPT1nP2MoXCJJbnZhbGlkIGNvZGUgcG9pbnQgaW4gcG9ydDogXCIrZyk6bi5jYWxsKHRoaXMpfWJyZWFrO2Nhc2VcInJlbGF0aXZlIHBhdGggc3RhcnRcIjppZihcIlxcXFxcIj09ZyYmYyhcIidcXFxcJyBub3QgYWxsb3dlZCBpbiBwYXRoLlwiKSxkPVwicmVsYXRpdmUgcGF0aFwiLFwiL1wiIT1nJiZcIlxcXFxcIiE9Zyljb250aW51ZTticmVhaztjYXNlXCJyZWxhdGl2ZSBwYXRoXCI6aWYoZiE9ZyYmXCIvXCIhPWcmJlwiXFxcXFwiIT1nJiYoYXx8XCI/XCIhPWcmJlwiI1wiIT1nKSlcIlx0XCIhPWcmJlwiXFxuXCIhPWcmJlwiXFxyXCIhPWcmJihsKz1vKGcpKTtlbHNle1wiXFxcXFwiPT1nJiZjKFwiXFxcXCBub3QgYWxsb3dlZCBpbiByZWxhdGl2ZSBwYXRoLlwiKTt2YXIgTzsoTz1wW2wudG9Mb3dlckNhc2UoKV0pJiYobD1PKSxcIi4uXCI9PWw/KHRoaXMuX3BhdGgucG9wKCksXCIvXCIhPWcmJlwiXFxcXFwiIT1nJiZ0aGlzLl9wYXRoLnB1c2goXCJcIikpOlwiLlwiPT1sJiZcIi9cIiE9ZyYmXCJcXFxcXCIhPWc/dGhpcy5fcGF0aC5wdXNoKFwiXCIpOlwiLlwiIT1sJiYoXCJmaWxlXCI9PXRoaXMuX3NjaGVtZSYmMD09dGhpcy5fcGF0aC5sZW5ndGgmJjI9PWwubGVuZ3RoJiZtLnRlc3QobFswXSkmJlwifFwiPT1sWzFdJiYobD1sWzBdK1wiOlwiKSx0aGlzLl9wYXRoLnB1c2gobCkpLGw9XCJcIixcIj9cIj09Zz8odGhpcy5fcXVlcnk9XCI/XCIsZD1cInF1ZXJ5XCIpOlwiI1wiPT1nJiYodGhpcy5fZnJhZ21lbnQ9XCIjXCIsZD1cImZyYWdtZW50XCIpfWJyZWFrO2Nhc2VcInF1ZXJ5XCI6YXx8XCIjXCIhPWc/ZiE9ZyYmXCJcdFwiIT1nJiZcIlxcblwiIT1nJiZcIlxcclwiIT1nJiYodGhpcy5fcXVlcnkrPWkoZykpOih0aGlzLl9mcmFnbWVudD1cIiNcIixkPVwiZnJhZ21lbnRcIik7YnJlYWs7Y2FzZVwiZnJhZ21lbnRcIjpmIT1nJiZcIlx0XCIhPWcmJlwiXFxuXCIhPWcmJlwiXFxyXCIhPWcmJih0aGlzLl9mcmFnbWVudCs9Zyl9dSsrfX1mdW5jdGlvbiBzKCl7dGhpcy5fc2NoZW1lPVwiXCIsdGhpcy5fc2NoZW1lRGF0YT1cIlwiLHRoaXMuX3VzZXJuYW1lPVwiXCIsdGhpcy5fcGFzc3dvcmQ9bnVsbCx0aGlzLl9ob3N0PVwiXCIsdGhpcy5fcG9ydD1cIlwiLHRoaXMuX3BhdGg9W10sdGhpcy5fcXVlcnk9XCJcIix0aGlzLl9mcmFnbWVudD1cIlwiLHRoaXMuX2lzSW52YWxpZD0hMSx0aGlzLl9pc1JlbGF0aXZlPSExfWZ1bmN0aW9uIGMoZSx0KXt2b2lkIDA9PT10fHx0IGluc3RhbmNlb2YgY3x8KHQ9bmV3IGMoU3RyaW5nKHQpKSksdGhpcy5fdXJsPWUscy5jYWxsKHRoaXMpO3ZhciBuPWUucmVwbGFjZSgvXlsgXFx0XFxyXFxuXFxmXSt8WyBcXHRcXHJcXG5cXGZdKyQvZyxcIlwiKTthLmNhbGwodGhpcyxuLG51bGwsdCl9dmFyIGQ9ITE7aWYoIWUuZm9yY2VKVVJMKXRyeXt2YXIgdT1uZXcgVVJMKFwiYlwiLFwiaHR0cDovL2FcIik7dS5wYXRobmFtZT1cImMlMjBkXCIsZD1cImh0dHA6Ly9hL2MlMjBkXCI9PT11LmhyZWZ9Y2F0Y2gobCl7fWlmKCFkKXt2YXIgaD1PYmplY3QuY3JlYXRlKG51bGwpO2guZnRwPTIxLGguZmlsZT0wLGguZ29waGVyPTcwLGguaHR0cD04MCxoLmh0dHBzPTQ0MyxoLndzPTgwLGgud3NzPTQ0Mzt2YXIgcD1PYmplY3QuY3JlYXRlKG51bGwpO3BbXCIlMmVcIl09XCIuXCIscFtcIi4lMmVcIl09XCIuLlwiLHBbXCIlMmUuXCJdPVwiLi5cIixwW1wiJTJlJTJlXCJdPVwiLi5cIjt2YXIgZj12b2lkIDAsbT0vW2EtekEtWl0vLHY9L1thLXpBLVowLTlcXCtcXC1cXC5dLztjLnByb3RvdHlwZT17dG9TdHJpbmc6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ocmVmfSxnZXQgaHJlZigpe2lmKHRoaXMuX2lzSW52YWxpZClyZXR1cm4gdGhpcy5fdXJsO3ZhciBlPVwiXCI7cmV0dXJuKFwiXCIhPXRoaXMuX3VzZXJuYW1lfHxudWxsIT10aGlzLl9wYXNzd29yZCkmJihlPXRoaXMuX3VzZXJuYW1lKyhudWxsIT10aGlzLl9wYXNzd29yZD9cIjpcIit0aGlzLl9wYXNzd29yZDpcIlwiKStcIkBcIiksdGhpcy5wcm90b2NvbCsodGhpcy5faXNSZWxhdGl2ZT9cIi8vXCIrZSt0aGlzLmhvc3Q6XCJcIikrdGhpcy5wYXRobmFtZSt0aGlzLl9xdWVyeSt0aGlzLl9mcmFnbWVudH0sc2V0IGhyZWYoZSl7cy5jYWxsKHRoaXMpLGEuY2FsbCh0aGlzLGUpfSxnZXQgcHJvdG9jb2woKXtyZXR1cm4gdGhpcy5fc2NoZW1lK1wiOlwifSxzZXQgcHJvdG9jb2woZSl7dGhpcy5faXNJbnZhbGlkfHxhLmNhbGwodGhpcyxlK1wiOlwiLFwic2NoZW1lIHN0YXJ0XCIpfSxnZXQgaG9zdCgpe3JldHVybiB0aGlzLl9pc0ludmFsaWQ/XCJcIjp0aGlzLl9wb3J0P3RoaXMuX2hvc3QrXCI6XCIrdGhpcy5fcG9ydDp0aGlzLl9ob3N0fSxzZXQgaG9zdChlKXshdGhpcy5faXNJbnZhbGlkJiZ0aGlzLl9pc1JlbGF0aXZlJiZhLmNhbGwodGhpcyxlLFwiaG9zdFwiKX0sZ2V0IGhvc3RuYW1lKCl7cmV0dXJuIHRoaXMuX2hvc3R9LHNldCBob3N0bmFtZShlKXshdGhpcy5faXNJbnZhbGlkJiZ0aGlzLl9pc1JlbGF0aXZlJiZhLmNhbGwodGhpcyxlLFwiaG9zdG5hbWVcIil9LGdldCBwb3J0KCl7cmV0dXJuIHRoaXMuX3BvcnR9LHNldCBwb3J0KGUpeyF0aGlzLl9pc0ludmFsaWQmJnRoaXMuX2lzUmVsYXRpdmUmJmEuY2FsbCh0aGlzLGUsXCJwb3J0XCIpfSxnZXQgcGF0aG5hbWUoKXtyZXR1cm4gdGhpcy5faXNJbnZhbGlkP1wiXCI6dGhpcy5faXNSZWxhdGl2ZT9cIi9cIit0aGlzLl9wYXRoLmpvaW4oXCIvXCIpOnRoaXMuX3NjaGVtZURhdGF9LHNldCBwYXRobmFtZShlKXshdGhpcy5faXNJbnZhbGlkJiZ0aGlzLl9pc1JlbGF0aXZlJiYodGhpcy5fcGF0aD1bXSxhLmNhbGwodGhpcyxlLFwicmVsYXRpdmUgcGF0aCBzdGFydFwiKSl9LGdldCBzZWFyY2goKXtyZXR1cm4gdGhpcy5faXNJbnZhbGlkfHwhdGhpcy5fcXVlcnl8fFwiP1wiPT10aGlzLl9xdWVyeT9cIlwiOnRoaXMuX3F1ZXJ5fSxzZXQgc2VhcmNoKGUpeyF0aGlzLl9pc0ludmFsaWQmJnRoaXMuX2lzUmVsYXRpdmUmJih0aGlzLl9xdWVyeT1cIj9cIixcIj9cIj09ZVswXSYmKGU9ZS5zbGljZSgxKSksYS5jYWxsKHRoaXMsZSxcInF1ZXJ5XCIpKX0sZ2V0IGhhc2goKXtyZXR1cm4gdGhpcy5faXNJbnZhbGlkfHwhdGhpcy5fZnJhZ21lbnR8fFwiI1wiPT10aGlzLl9mcmFnbWVudD9cIlwiOnRoaXMuX2ZyYWdtZW50fSxzZXQgaGFzaChlKXt0aGlzLl9pc0ludmFsaWR8fCh0aGlzLl9mcmFnbWVudD1cIiNcIixcIiNcIj09ZVswXSYmKGU9ZS5zbGljZSgxKSksYS5jYWxsKHRoaXMsZSxcImZyYWdtZW50XCIpKX0sZ2V0IG9yaWdpbigpe3ZhciBlO2lmKHRoaXMuX2lzSW52YWxpZHx8IXRoaXMuX3NjaGVtZSlyZXR1cm5cIlwiO3N3aXRjaCh0aGlzLl9zY2hlbWUpe2Nhc2VcImRhdGFcIjpjYXNlXCJmaWxlXCI6Y2FzZVwiamF2YXNjcmlwdFwiOmNhc2VcIm1haWx0b1wiOnJldHVyblwibnVsbFwifXJldHVybiBlPXRoaXMuaG9zdCxlP3RoaXMuX3NjaGVtZStcIjovL1wiK2U6XCJcIn19O3ZhciBfPWUuVVJMO18mJihjLmNyZWF0ZU9iamVjdFVSTD1mdW5jdGlvbihlKXtyZXR1cm4gXy5jcmVhdGVPYmplY3RVUkwuYXBwbHkoXyxhcmd1bWVudHMpfSxjLnJldm9rZU9iamVjdFVSTD1mdW5jdGlvbihlKXtfLnJldm9rZU9iamVjdFVSTChlKX0pLGUuVVJMPWN9fSh0aGlzKSxcInVuZGVmaW5lZFwiPT10eXBlb2YgV2Vha01hcCYmIWZ1bmN0aW9uKCl7dmFyIGU9T2JqZWN0LmRlZmluZVByb3BlcnR5LHQ9RGF0ZS5ub3coKSUxZTksbj1mdW5jdGlvbigpe3RoaXMubmFtZT1cIl9fc3RcIisoMWU5Kk1hdGgucmFuZG9tKCk+Pj4wKSsodCsrICtcIl9fXCIpfTtuLnByb3RvdHlwZT17c2V0OmZ1bmN0aW9uKHQsbil7dmFyIHI9dFt0aGlzLm5hbWVdO3JldHVybiByJiZyWzBdPT09dD9yWzFdPW46ZSh0LHRoaXMubmFtZSx7dmFsdWU6W3Qsbl0sd3JpdGFibGU6ITB9KSx0aGlzfSxnZXQ6ZnVuY3Rpb24oZSl7dmFyIHQ7cmV0dXJuKHQ9ZVt0aGlzLm5hbWVdKSYmdFswXT09PWU/dFsxXTp2b2lkIDB9LFwiZGVsZXRlXCI6ZnVuY3Rpb24oZSl7dmFyIHQ9ZVt0aGlzLm5hbWVdO3JldHVybiB0JiZ0WzBdPT09ZT8odFswXT10WzFdPXZvaWQgMCwhMCk6ITF9LGhhczpmdW5jdGlvbihlKXt2YXIgdD1lW3RoaXMubmFtZV07cmV0dXJuIHQ/dFswXT09PWU6ITF9fSx3aW5kb3cuV2Vha01hcD1ufSgpLGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQoZSl7Zy5wdXNoKGUpLGJ8fChiPSEwLG0ocikpfWZ1bmN0aW9uIG4oZSl7cmV0dXJuIHdpbmRvdy5TaGFkb3dET01Qb2x5ZmlsbCYmd2luZG93LlNoYWRvd0RPTVBvbHlmaWxsLndyYXBJZk5lZWRlZChlKXx8ZX1mdW5jdGlvbiByKCl7Yj0hMTt2YXIgZT1nO2c9W10sZS5zb3J0KGZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUudWlkXy10LnVpZF99KTt2YXIgdD0hMTtlLmZvckVhY2goZnVuY3Rpb24oZSl7dmFyIG49ZS50YWtlUmVjb3JkcygpO28oZSksbi5sZW5ndGgmJihlLmNhbGxiYWNrXyhuLGUpLHQ9ITApfSksdCYmcigpfWZ1bmN0aW9uIG8oZSl7ZS5ub2Rlc18uZm9yRWFjaChmdW5jdGlvbih0KXt2YXIgbj12LmdldCh0KTtuJiZuLmZvckVhY2goZnVuY3Rpb24odCl7dC5vYnNlcnZlcj09PWUmJnQucmVtb3ZlVHJhbnNpZW50T2JzZXJ2ZXJzKCl9KX0pfWZ1bmN0aW9uIGkoZSx0KXtmb3IodmFyIG49ZTtuO249bi5wYXJlbnROb2RlKXt2YXIgcj12LmdldChuKTtpZihyKWZvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXt2YXIgaT1yW29dLGE9aS5vcHRpb25zO2lmKG49PT1lfHxhLnN1YnRyZWUpe3ZhciBzPXQoYSk7cyYmaS5lbnF1ZXVlKHMpfX19fWZ1bmN0aW9uIGEoZSl7dGhpcy5jYWxsYmFja189ZSx0aGlzLm5vZGVzXz1bXSx0aGlzLnJlY29yZHNfPVtdLHRoaXMudWlkXz0rK3l9ZnVuY3Rpb24gcyhlLHQpe3RoaXMudHlwZT1lLHRoaXMudGFyZ2V0PXQsdGhpcy5hZGRlZE5vZGVzPVtdLHRoaXMucmVtb3ZlZE5vZGVzPVtdLHRoaXMucHJldmlvdXNTaWJsaW5nPW51bGwsdGhpcy5uZXh0U2libGluZz1udWxsLHRoaXMuYXR0cmlidXRlTmFtZT1udWxsLHRoaXMuYXR0cmlidXRlTmFtZXNwYWNlPW51bGwsdGhpcy5vbGRWYWx1ZT1udWxsfWZ1bmN0aW9uIGMoZSl7dmFyIHQ9bmV3IHMoZS50eXBlLGUudGFyZ2V0KTtyZXR1cm4gdC5hZGRlZE5vZGVzPWUuYWRkZWROb2Rlcy5zbGljZSgpLHQucmVtb3ZlZE5vZGVzPWUucmVtb3ZlZE5vZGVzLnNsaWNlKCksdC5wcmV2aW91c1NpYmxpbmc9ZS5wcmV2aW91c1NpYmxpbmcsdC5uZXh0U2libGluZz1lLm5leHRTaWJsaW5nLHQuYXR0cmlidXRlTmFtZT1lLmF0dHJpYnV0ZU5hbWUsdC5hdHRyaWJ1dGVOYW1lc3BhY2U9ZS5hdHRyaWJ1dGVOYW1lc3BhY2UsdC5vbGRWYWx1ZT1lLm9sZFZhbHVlLHR9ZnVuY3Rpb24gZChlLHQpe3JldHVybiBFPW5ldyBzKGUsdCl9ZnVuY3Rpb24gdShlKXtyZXR1cm4gTD9MOihMPWMoRSksTC5vbGRWYWx1ZT1lLEwpfWZ1bmN0aW9uIGwoKXtFPUw9dm9pZCAwfWZ1bmN0aW9uIGgoZSl7cmV0dXJuIGU9PT1MfHxlPT09RX1mdW5jdGlvbiBwKGUsdCl7cmV0dXJuIGU9PT10P2U6TCYmaChlKT9MOm51bGx9ZnVuY3Rpb24gZihlLHQsbil7dGhpcy5vYnNlcnZlcj1lLHRoaXMudGFyZ2V0PXQsdGhpcy5vcHRpb25zPW4sdGhpcy50cmFuc2llbnRPYnNlcnZlZE5vZGVzPVtdfXZhciBtLHY9bmV3IFdlYWtNYXA7aWYoL1RyaWRlbnR8RWRnZS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSltPXNldFRpbWVvdXQ7ZWxzZSBpZih3aW5kb3cuc2V0SW1tZWRpYXRlKW09d2luZG93LnNldEltbWVkaWF0ZTtlbHNle3ZhciBfPVtdLHc9U3RyaW5nKE1hdGgucmFuZG9tKCkpO3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLGZ1bmN0aW9uKGUpe2lmKGUuZGF0YT09PXcpe3ZhciB0PV87Xz1bXSx0LmZvckVhY2goZnVuY3Rpb24oZSl7ZSgpfSl9fSksbT1mdW5jdGlvbihlKXtfLnB1c2goZSksd2luZG93LnBvc3RNZXNzYWdlKHcsXCIqXCIpfX12YXIgYj0hMSxnPVtdLHk9MDthLnByb3RvdHlwZT17b2JzZXJ2ZTpmdW5jdGlvbihlLHQpe2lmKGU9bihlKSwhdC5jaGlsZExpc3QmJiF0LmF0dHJpYnV0ZXMmJiF0LmNoYXJhY3RlckRhdGF8fHQuYXR0cmlidXRlT2xkVmFsdWUmJiF0LmF0dHJpYnV0ZXN8fHQuYXR0cmlidXRlRmlsdGVyJiZ0LmF0dHJpYnV0ZUZpbHRlci5sZW5ndGgmJiF0LmF0dHJpYnV0ZXN8fHQuY2hhcmFjdGVyRGF0YU9sZFZhbHVlJiYhdC5jaGFyYWN0ZXJEYXRhKXRocm93IG5ldyBTeW50YXhFcnJvcjt2YXIgcj12LmdldChlKTtyfHx2LnNldChlLHI9W10pO2Zvcih2YXIgbyxpPTA7aTxyLmxlbmd0aDtpKyspaWYocltpXS5vYnNlcnZlcj09PXRoaXMpe289cltpXSxvLnJlbW92ZUxpc3RlbmVycygpLG8ub3B0aW9ucz10O2JyZWFrfW98fChvPW5ldyBmKHRoaXMsZSx0KSxyLnB1c2gobyksdGhpcy5ub2Rlc18ucHVzaChlKSksby5hZGRMaXN0ZW5lcnMoKX0sZGlzY29ubmVjdDpmdW5jdGlvbigpe3RoaXMubm9kZXNfLmZvckVhY2goZnVuY3Rpb24oZSl7Zm9yKHZhciB0PXYuZ2V0KGUpLG49MDtuPHQubGVuZ3RoO24rKyl7dmFyIHI9dFtuXTtpZihyLm9ic2VydmVyPT09dGhpcyl7ci5yZW1vdmVMaXN0ZW5lcnMoKSx0LnNwbGljZShuLDEpO2JyZWFrfX19LHRoaXMpLHRoaXMucmVjb3Jkc189W119LHRha2VSZWNvcmRzOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5yZWNvcmRzXztyZXR1cm4gdGhpcy5yZWNvcmRzXz1bXSxlfX07dmFyIEUsTDtmLnByb3RvdHlwZT17ZW5xdWV1ZTpmdW5jdGlvbihlKXt2YXIgbj10aGlzLm9ic2VydmVyLnJlY29yZHNfLHI9bi5sZW5ndGg7aWYobi5sZW5ndGg+MCl7dmFyIG89bltyLTFdLGk9cChvLGUpO2lmKGkpcmV0dXJuIHZvaWQobltyLTFdPWkpfWVsc2UgdCh0aGlzLm9ic2VydmVyKTtuW3JdPWV9LGFkZExpc3RlbmVyczpmdW5jdGlvbigpe3RoaXMuYWRkTGlzdGVuZXJzXyh0aGlzLnRhcmdldCl9LGFkZExpc3RlbmVyc186ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5vcHRpb25zO3QuYXR0cmlidXRlcyYmZS5hZGRFdmVudExpc3RlbmVyKFwiRE9NQXR0ck1vZGlmaWVkXCIsdGhpcywhMCksdC5jaGFyYWN0ZXJEYXRhJiZlLmFkZEV2ZW50TGlzdGVuZXIoXCJET01DaGFyYWN0ZXJEYXRhTW9kaWZpZWRcIix0aGlzLCEwKSx0LmNoaWxkTGlzdCYmZS5hZGRFdmVudExpc3RlbmVyKFwiRE9NTm9kZUluc2VydGVkXCIsdGhpcywhMCksKHQuY2hpbGRMaXN0fHx0LnN1YnRyZWUpJiZlLmFkZEV2ZW50TGlzdGVuZXIoXCJET01Ob2RlUmVtb3ZlZFwiLHRoaXMsITApfSxyZW1vdmVMaXN0ZW5lcnM6ZnVuY3Rpb24oKXt0aGlzLnJlbW92ZUxpc3RlbmVyc18odGhpcy50YXJnZXQpfSxyZW1vdmVMaXN0ZW5lcnNfOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMub3B0aW9uczt0LmF0dHJpYnV0ZXMmJmUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUF0dHJNb2RpZmllZFwiLHRoaXMsITApLHQuY2hhcmFjdGVyRGF0YSYmZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ2hhcmFjdGVyRGF0YU1vZGlmaWVkXCIsdGhpcywhMCksdC5jaGlsZExpc3QmJmUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTU5vZGVJbnNlcnRlZFwiLHRoaXMsITApLCh0LmNoaWxkTGlzdHx8dC5zdWJ0cmVlKSYmZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NTm9kZVJlbW92ZWRcIix0aGlzLCEwKX0sYWRkVHJhbnNpZW50T2JzZXJ2ZXI6ZnVuY3Rpb24oZSl7aWYoZSE9PXRoaXMudGFyZ2V0KXt0aGlzLmFkZExpc3RlbmVyc18oZSksdGhpcy50cmFuc2llbnRPYnNlcnZlZE5vZGVzLnB1c2goZSk7dmFyIHQ9di5nZXQoZSk7dHx8di5zZXQoZSx0PVtdKSx0LnB1c2godGhpcyl9fSxyZW1vdmVUcmFuc2llbnRPYnNlcnZlcnM6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLnRyYW5zaWVudE9ic2VydmVkTm9kZXM7dGhpcy50cmFuc2llbnRPYnNlcnZlZE5vZGVzPVtdLGUuZm9yRWFjaChmdW5jdGlvbihlKXt0aGlzLnJlbW92ZUxpc3RlbmVyc18oZSk7Zm9yKHZhciB0PXYuZ2V0KGUpLG49MDtuPHQubGVuZ3RoO24rKylpZih0W25dPT09dGhpcyl7dC5zcGxpY2UobiwxKTticmVha319LHRoaXMpfSxoYW5kbGVFdmVudDpmdW5jdGlvbihlKXtzd2l0Y2goZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSxlLnR5cGUpe2Nhc2VcIkRPTUF0dHJNb2RpZmllZFwiOnZhciB0PWUuYXR0ck5hbWUsbj1lLnJlbGF0ZWROb2RlLm5hbWVzcGFjZVVSSSxyPWUudGFyZ2V0LG89bmV3IGQoXCJhdHRyaWJ1dGVzXCIscik7by5hdHRyaWJ1dGVOYW1lPXQsby5hdHRyaWJ1dGVOYW1lc3BhY2U9bjt2YXIgYT1lLmF0dHJDaGFuZ2U9PT1NdXRhdGlvbkV2ZW50LkFERElUSU9OP251bGw6ZS5wcmV2VmFsdWU7aShyLGZ1bmN0aW9uKGUpe3JldHVybiFlLmF0dHJpYnV0ZXN8fGUuYXR0cmlidXRlRmlsdGVyJiZlLmF0dHJpYnV0ZUZpbHRlci5sZW5ndGgmJi0xPT09ZS5hdHRyaWJ1dGVGaWx0ZXIuaW5kZXhPZih0KSYmLTE9PT1lLmF0dHJpYnV0ZUZpbHRlci5pbmRleE9mKG4pP3ZvaWQgMDplLmF0dHJpYnV0ZU9sZFZhbHVlP3UoYSk6b30pO2JyZWFrO2Nhc2VcIkRPTUNoYXJhY3RlckRhdGFNb2RpZmllZFwiOnZhciByPWUudGFyZ2V0LG89ZChcImNoYXJhY3RlckRhdGFcIixyKSxhPWUucHJldlZhbHVlO2kocixmdW5jdGlvbihlKXtyZXR1cm4gZS5jaGFyYWN0ZXJEYXRhP2UuY2hhcmFjdGVyRGF0YU9sZFZhbHVlP3UoYSk6bzp2b2lkIDB9KTticmVhaztjYXNlXCJET01Ob2RlUmVtb3ZlZFwiOnRoaXMuYWRkVHJhbnNpZW50T2JzZXJ2ZXIoZS50YXJnZXQpO2Nhc2VcIkRPTU5vZGVJbnNlcnRlZFwiOnZhciBzLGMsaD1lLnRhcmdldDtcIkRPTU5vZGVJbnNlcnRlZFwiPT09ZS50eXBlPyhzPVtoXSxjPVtdKToocz1bXSxjPVtoXSk7dmFyIHA9aC5wcmV2aW91c1NpYmxpbmcsZj1oLm5leHRTaWJsaW5nLG89ZChcImNoaWxkTGlzdFwiLGUudGFyZ2V0LnBhcmVudE5vZGUpO28uYWRkZWROb2Rlcz1zLG8ucmVtb3ZlZE5vZGVzPWMsby5wcmV2aW91c1NpYmxpbmc9cCxvLm5leHRTaWJsaW5nPWYsaShlLnJlbGF0ZWROb2RlLGZ1bmN0aW9uKGUpe3JldHVybiBlLmNoaWxkTGlzdD9vOnZvaWQgMH0pfWwoKX19LGUuSnNNdXRhdGlvbk9ic2VydmVyPWEsZS5NdXRhdGlvbk9ic2VydmVyfHwoZS5NdXRhdGlvbk9ic2VydmVyPWEpfSh0aGlzKSx3aW5kb3cuSFRNTEltcG9ydHM9d2luZG93LkhUTUxJbXBvcnRzfHx7ZmxhZ3M6e319LGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQoZSx0KXt0PXR8fGYscihmdW5jdGlvbigpe2koZSx0KX0sdCl9ZnVuY3Rpb24gbihlKXtyZXR1cm5cImNvbXBsZXRlXCI9PT1lLnJlYWR5U3RhdGV8fGUucmVhZHlTdGF0ZT09PV99ZnVuY3Rpb24gcihlLHQpe2lmKG4odCkpZSYmZSgpO2Vsc2V7dmFyIG89ZnVuY3Rpb24oKXsoXCJjb21wbGV0ZVwiPT09dC5yZWFkeVN0YXRlfHx0LnJlYWR5U3RhdGU9PT1fKSYmKHQucmVtb3ZlRXZlbnRMaXN0ZW5lcih3LG8pLHIoZSx0KSl9O3QuYWRkRXZlbnRMaXN0ZW5lcih3LG8pfX1mdW5jdGlvbiBvKGUpe2UudGFyZ2V0Ll9fbG9hZGVkPSEwfWZ1bmN0aW9uIGkoZSx0KXtmdW5jdGlvbiBuKCl7Yz09ZCYmZSYmZSh7YWxsSW1wb3J0czpzLGxvYWRlZEltcG9ydHM6dSxlcnJvckltcG9ydHM6bH0pfWZ1bmN0aW9uIHIoZSl7byhlKSx1LnB1c2godGhpcyksYysrLG4oKX1mdW5jdGlvbiBpKGUpe2wucHVzaCh0aGlzKSxjKyssbigpfXZhciBzPXQucXVlcnlTZWxlY3RvckFsbChcImxpbmtbcmVsPWltcG9ydF1cIiksYz0wLGQ9cy5sZW5ndGgsdT1bXSxsPVtdO2lmKGQpZm9yKHZhciBoLHA9MDtkPnAmJihoPXNbcF0pO3ArKylhKGgpPyhjKyssbigpKTooaC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLHIpLGguYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsaSkpO2Vsc2UgbigpfWZ1bmN0aW9uIGEoZSl7cmV0dXJuIGw/ZS5fX2xvYWRlZHx8ZVtcImltcG9ydFwiXSYmXCJsb2FkaW5nXCIhPT1lW1wiaW1wb3J0XCJdLnJlYWR5U3RhdGU6ZS5fX2ltcG9ydFBhcnNlZH1mdW5jdGlvbiBzKGUpe2Zvcih2YXIgdCxuPTAscj1lLmxlbmd0aDtyPm4mJih0PWVbbl0pO24rKyljKHQpJiZkKHQpfWZ1bmN0aW9uIGMoZSl7cmV0dXJuXCJsaW5rXCI9PT1lLmxvY2FsTmFtZSYmXCJpbXBvcnRcIj09PWUucmVsfWZ1bmN0aW9uIGQoZSl7dmFyIHQ9ZVtcImltcG9ydFwiXTt0P28oe3RhcmdldDplfSk6KGUuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixvKSxlLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLG8pKX12YXIgdT1cImltcG9ydFwiLGw9Qm9vbGVhbih1IGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpKSxoPUJvb2xlYW4od2luZG93LlNoYWRvd0RPTVBvbHlmaWxsKSxwPWZ1bmN0aW9uKGUpe3JldHVybiBoP3dpbmRvdy5TaGFkb3dET01Qb2x5ZmlsbC53cmFwSWZOZWVkZWQoZSk6ZX0sZj1wKGRvY3VtZW50KSxtPXtnZXQ6ZnVuY3Rpb24oKXt2YXIgZT13aW5kb3cuSFRNTEltcG9ydHMuY3VycmVudFNjcmlwdHx8ZG9jdW1lbnQuY3VycmVudFNjcmlwdHx8KFwiY29tcGxldGVcIiE9PWRvY3VtZW50LnJlYWR5U3RhdGU/ZG9jdW1lbnQuc2NyaXB0c1tkb2N1bWVudC5zY3JpcHRzLmxlbmd0aC0xXTpudWxsKTtyZXR1cm4gcChlKX0sY29uZmlndXJhYmxlOiEwfTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZG9jdW1lbnQsXCJfY3VycmVudFNjcmlwdFwiLG0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmLFwiX2N1cnJlbnRTY3JpcHRcIixtKTt2YXIgdj0vVHJpZGVudC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxfPXY/XCJjb21wbGV0ZVwiOlwiaW50ZXJhY3RpdmVcIix3PVwicmVhZHlzdGF0ZWNoYW5nZVwiO2wmJihuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbihlKXtmb3IodmFyIHQsbj0wLHI9ZS5sZW5ndGg7cj5uJiYodD1lW25dKTtuKyspdC5hZGRlZE5vZGVzJiZzKHQuYWRkZWROb2Rlcyl9KS5vYnNlcnZlKGRvY3VtZW50LmhlYWQse2NoaWxkTGlzdDohMH0pLGZ1bmN0aW9uKCl7aWYoXCJsb2FkaW5nXCI9PT1kb2N1bWVudC5yZWFkeVN0YXRlKWZvcih2YXIgZSx0PWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaW5rW3JlbD1pbXBvcnRdXCIpLG49MCxyPXQubGVuZ3RoO3I+biYmKGU9dFtuXSk7bisrKWQoZSl9KCkpLHQoZnVuY3Rpb24oZSl7d2luZG93LkhUTUxJbXBvcnRzLnJlYWR5PSEwLHdpbmRvdy5IVE1MSW1wb3J0cy5yZWFkeVRpbWU9KG5ldyBEYXRlKS5nZXRUaW1lKCk7dmFyIHQ9Zi5jcmVhdGVFdmVudChcIkN1c3RvbUV2ZW50XCIpO3QuaW5pdEN1c3RvbUV2ZW50KFwiSFRNTEltcG9ydHNMb2FkZWRcIiwhMCwhMCxlKSxmLmRpc3BhdGNoRXZlbnQodCl9KSxlLklNUE9SVF9MSU5LX1RZUEU9dSxlLnVzZU5hdGl2ZT1sLGUucm9vdERvY3VtZW50PWYsZS53aGVuUmVhZHk9dCxlLmlzSUU9dn0od2luZG93LkhUTUxJbXBvcnRzKSxmdW5jdGlvbihlKXt2YXIgdD1bXSxuPWZ1bmN0aW9uKGUpe3QucHVzaChlKX0scj1mdW5jdGlvbigpe3QuZm9yRWFjaChmdW5jdGlvbih0KXt0KGUpfSl9O2UuYWRkTW9kdWxlPW4sZS5pbml0aWFsaXplTW9kdWxlcz1yfSh3aW5kb3cuSFRNTEltcG9ydHMpLHdpbmRvdy5IVE1MSW1wb3J0cy5hZGRNb2R1bGUoZnVuY3Rpb24oZSl7dmFyIHQ9Lyh1cmxcXCgpKFteKV0qKShcXCkpL2csbj0vKEBpbXBvcnRbXFxzXSsoPyF1cmxcXCgpKShbXjtdKikoOykvZyxyPXtyZXNvbHZlVXJsc0luU3R5bGU6ZnVuY3Rpb24oZSx0KXt2YXIgbj1lLm93bmVyRG9jdW1lbnQscj1uLmNyZWF0ZUVsZW1lbnQoXCJhXCIpO3JldHVybiBlLnRleHRDb250ZW50PXRoaXMucmVzb2x2ZVVybHNJbkNzc1RleHQoZS50ZXh0Q29udGVudCx0LHIpLGV9LHJlc29sdmVVcmxzSW5Dc3NUZXh0OmZ1bmN0aW9uKGUscixvKXt2YXIgaT10aGlzLnJlcGxhY2VVcmxzKGUsbyxyLHQpO3JldHVybiBpPXRoaXMucmVwbGFjZVVybHMoaSxvLHIsbil9LHJlcGxhY2VVcmxzOmZ1bmN0aW9uKGUsdCxuLHIpe3JldHVybiBlLnJlcGxhY2UocixmdW5jdGlvbihlLHIsbyxpKXt2YXIgYT1vLnJlcGxhY2UoL1tcIiddL2csXCJcIik7cmV0dXJuIG4mJihhPW5ldyBVUkwoYSxuKS5ocmVmKSx0LmhyZWY9YSxhPXQuaHJlZixyK1wiJ1wiK2ErXCInXCIraX0pfX07ZS5wYXRoPXJ9KSx3aW5kb3cuSFRNTEltcG9ydHMuYWRkTW9kdWxlKGZ1bmN0aW9uKGUpe3ZhciB0PXthc3luYzohMCxvazpmdW5jdGlvbihlKXtyZXR1cm4gZS5zdGF0dXM+PTIwMCYmZS5zdGF0dXM8MzAwfHwzMDQ9PT1lLnN0YXR1c3x8MD09PWUuc3RhdHVzfSxsb2FkOmZ1bmN0aW9uKG4scixvKXt2YXIgaT1uZXcgWE1MSHR0cFJlcXVlc3Q7cmV0dXJuKGUuZmxhZ3MuZGVidWd8fGUuZmxhZ3MuYnVzdCkmJihuKz1cIj9cIitNYXRoLnJhbmRvbSgpKSxpLm9wZW4oXCJHRVRcIixuLHQuYXN5bmMpLGkuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIixmdW5jdGlvbihlKXtpZig0PT09aS5yZWFkeVN0YXRlKXt2YXIgbj1pLmdldFJlc3BvbnNlSGVhZGVyKFwiTG9jYXRpb25cIiksYT1udWxsO2lmKG4pdmFyIGE9XCIvXCI9PT1uLnN1YnN0cigwLDEpP2xvY2F0aW9uLm9yaWdpbituOm47ci5jYWxsKG8sIXQub2soaSkmJmksaS5yZXNwb25zZXx8aS5yZXNwb25zZVRleHQsYSl9fSksaS5zZW5kKCksaX0sbG9hZERvY3VtZW50OmZ1bmN0aW9uKGUsdCxuKXt0aGlzLmxvYWQoZSx0LG4pLnJlc3BvbnNlVHlwZT1cImRvY3VtZW50XCJ9fTtlLnhocj10fSksd2luZG93LkhUTUxJbXBvcnRzLmFkZE1vZHVsZShmdW5jdGlvbihlKXt2YXIgdD1lLnhocixuPWUuZmxhZ3Mscj1mdW5jdGlvbihlLHQpe3RoaXMuY2FjaGU9e30sdGhpcy5vbmxvYWQ9ZSx0aGlzLm9uY29tcGxldGU9dCx0aGlzLmluZmxpZ2h0PTAsdGhpcy5wZW5kaW5nPXt9fTtyLnByb3RvdHlwZT17YWRkTm9kZXM6ZnVuY3Rpb24oZSl7dGhpcy5pbmZsaWdodCs9ZS5sZW5ndGg7Zm9yKHZhciB0LG49MCxyPWUubGVuZ3RoO3I+biYmKHQ9ZVtuXSk7bisrKXRoaXMucmVxdWlyZSh0KTt0aGlzLmNoZWNrRG9uZSgpfSxhZGROb2RlOmZ1bmN0aW9uKGUpe3RoaXMuaW5mbGlnaHQrKyx0aGlzLnJlcXVpcmUoZSksdGhpcy5jaGVja0RvbmUoKX0scmVxdWlyZTpmdW5jdGlvbihlKXt2YXIgdD1lLnNyY3x8ZS5ocmVmO2UuX19ub2RlVXJsPXQsdGhpcy5kZWR1cGUodCxlKXx8dGhpcy5mZXRjaCh0LGUpfSxkZWR1cGU6ZnVuY3Rpb24oZSx0KXtpZih0aGlzLnBlbmRpbmdbZV0pcmV0dXJuIHRoaXMucGVuZGluZ1tlXS5wdXNoKHQpLCEwO3JldHVybiB0aGlzLmNhY2hlW2VdPyh0aGlzLm9ubG9hZChlLHQsdGhpcy5jYWNoZVtlXSksdGhpcy50YWlsKCksITApOih0aGlzLnBlbmRpbmdbZV09W3RdLCExKX0sZmV0Y2g6ZnVuY3Rpb24oZSxyKXtpZihuLmxvYWQmJmNvbnNvbGUubG9nKFwiZmV0Y2hcIixlLHIpLGUpaWYoZS5tYXRjaCgvXmRhdGE6Lykpe3ZhciBvPWUuc3BsaXQoXCIsXCIpLGk9b1swXSxhPW9bMV07YT1pLmluZGV4T2YoXCI7YmFzZTY0XCIpPi0xP2F0b2IoYSk6ZGVjb2RlVVJJQ29tcG9uZW50KGEpLHNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aGlzLnJlY2VpdmUoZSxyLG51bGwsYSl9LmJpbmQodGhpcyksMCl9ZWxzZXt2YXIgcz1mdW5jdGlvbih0LG4sbyl7dGhpcy5yZWNlaXZlKGUscix0LG4sbyl9LmJpbmQodGhpcyk7dC5sb2FkKGUscyl9ZWxzZSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhpcy5yZWNlaXZlKGUscix7ZXJyb3I6XCJocmVmIG11c3QgYmUgc3BlY2lmaWVkXCJ9LG51bGwpfS5iaW5kKHRoaXMpLDApfSxyZWNlaXZlOmZ1bmN0aW9uKGUsdCxuLHIsbyl7dGhpcy5jYWNoZVtlXT1yO2Zvcih2YXIgaSxhPXRoaXMucGVuZGluZ1tlXSxzPTAsYz1hLmxlbmd0aDtjPnMmJihpPWFbc10pO3MrKyl0aGlzLm9ubG9hZChlLGkscixuLG8pLHRoaXMudGFpbCgpO3RoaXMucGVuZGluZ1tlXT1udWxsfSx0YWlsOmZ1bmN0aW9uKCl7LS10aGlzLmluZmxpZ2h0LHRoaXMuY2hlY2tEb25lKCl9LGNoZWNrRG9uZTpmdW5jdGlvbigpe3RoaXMuaW5mbGlnaHR8fHRoaXMub25jb21wbGV0ZSgpfX0sZS5Mb2FkZXI9cn0pLHdpbmRvdy5IVE1MSW1wb3J0cy5hZGRNb2R1bGUoZnVuY3Rpb24oZSl7dmFyIHQ9ZnVuY3Rpb24oZSl7dGhpcy5hZGRDYWxsYmFjaz1lLHRoaXMubW89bmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5oYW5kbGVyLmJpbmQodGhpcykpfTt0LnByb3RvdHlwZT17aGFuZGxlcjpmdW5jdGlvbihlKXtmb3IodmFyIHQsbj0wLHI9ZS5sZW5ndGg7cj5uJiYodD1lW25dKTtuKyspXCJjaGlsZExpc3RcIj09PXQudHlwZSYmdC5hZGRlZE5vZGVzLmxlbmd0aCYmdGhpcy5hZGRlZE5vZGVzKHQuYWRkZWROb2Rlcyl9LGFkZGVkTm9kZXM6ZnVuY3Rpb24oZSl7dGhpcy5hZGRDYWxsYmFjayYmdGhpcy5hZGRDYWxsYmFjayhlKTtmb3IodmFyIHQsbj0wLHI9ZS5sZW5ndGg7cj5uJiYodD1lW25dKTtuKyspdC5jaGlsZHJlbiYmdC5jaGlsZHJlbi5sZW5ndGgmJnRoaXMuYWRkZWROb2Rlcyh0LmNoaWxkcmVuKX0sb2JzZXJ2ZTpmdW5jdGlvbihlKXt0aGlzLm1vLm9ic2VydmUoZSx7Y2hpbGRMaXN0OiEwLHN1YnRyZWU6ITB9KX19LGUuT2JzZXJ2ZXI9dH0pLHdpbmRvdy5IVE1MSW1wb3J0cy5hZGRNb2R1bGUoZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdChlKXtyZXR1cm5cImxpbmtcIj09PWUubG9jYWxOYW1lJiZlLnJlbD09PXV9ZnVuY3Rpb24gbihlKXt2YXIgdD1yKGUpO3JldHVyblwiZGF0YTp0ZXh0L2phdmFzY3JpcHQ7Y2hhcnNldD11dGYtOCxcIitlbmNvZGVVUklDb21wb25lbnQodCl9ZnVuY3Rpb24gcihlKXtyZXR1cm4gZS50ZXh0Q29udGVudCtvKGUpfWZ1bmN0aW9uIG8oZSl7dmFyIHQ9ZS5vd25lckRvY3VtZW50O3QuX19pbXBvcnRlZFNjcmlwdHM9dC5fX2ltcG9ydGVkU2NyaXB0c3x8MDt2YXIgbj1lLm93bmVyRG9jdW1lbnQuYmFzZVVSSSxyPXQuX19pbXBvcnRlZFNjcmlwdHM/XCItXCIrdC5fX2ltcG9ydGVkU2NyaXB0czpcIlwiO3JldHVybiB0Ll9faW1wb3J0ZWRTY3JpcHRzKyssXCJcXG4vLyMgc291cmNlVVJMPVwiK24rcitcIi5qc1xcblwifWZ1bmN0aW9uIGkoZSl7dmFyIHQ9ZS5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtyZXR1cm4gdC50ZXh0Q29udGVudD1lLnRleHRDb250ZW50LGEucmVzb2x2ZVVybHNJblN0eWxlKHQpLHR9dmFyIGE9ZS5wYXRoLHM9ZS5yb290RG9jdW1lbnQsYz1lLmZsYWdzLGQ9ZS5pc0lFLHU9ZS5JTVBPUlRfTElOS19UWVBFLGw9XCJsaW5rW3JlbD1cIit1K1wiXVwiLGg9e2RvY3VtZW50U2VsZWN0b3JzOmwsaW1wb3J0c1NlbGVjdG9yczpbbCxcImxpbmtbcmVsPXN0eWxlc2hlZXRdXCIsXCJzdHlsZVwiLFwic2NyaXB0Om5vdChbdHlwZV0pXCIsJ3NjcmlwdFt0eXBlPVwiYXBwbGljYXRpb24vamF2YXNjcmlwdFwiXScsJ3NjcmlwdFt0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCJdJ10uam9pbihcIixcIiksbWFwOntsaW5rOlwicGFyc2VMaW5rXCIsc2NyaXB0OlwicGFyc2VTY3JpcHRcIixzdHlsZTpcInBhcnNlU3R5bGVcIn0sZHluYW1pY0VsZW1lbnRzOltdLHBhcnNlTmV4dDpmdW5jdGlvbigpe3ZhciBlPXRoaXMubmV4dFRvUGFyc2UoKTtlJiZ0aGlzLnBhcnNlKGUpfSxwYXJzZTpmdW5jdGlvbihlKXtpZih0aGlzLmlzUGFyc2VkKGUpKXJldHVybiB2b2lkKGMucGFyc2UmJmNvbnNvbGUubG9nKFwiWyVzXSBpcyBhbHJlYWR5IHBhcnNlZFwiLGUubG9jYWxOYW1lKSk7dmFyIHQ9dGhpc1t0aGlzLm1hcFtlLmxvY2FsTmFtZV1dO3QmJih0aGlzLm1hcmtQYXJzaW5nKGUpLHQuY2FsbCh0aGlzLGUpKX0scGFyc2VEeW5hbWljOmZ1bmN0aW9uKGUsdCl7dGhpcy5keW5hbWljRWxlbWVudHMucHVzaChlKSx0fHx0aGlzLnBhcnNlTmV4dCgpfSxtYXJrUGFyc2luZzpmdW5jdGlvbihlKXtjLnBhcnNlJiZjb25zb2xlLmxvZyhcInBhcnNpbmdcIixlKSx0aGlzLnBhcnNpbmdFbGVtZW50PWV9LG1hcmtQYXJzaW5nQ29tcGxldGU6ZnVuY3Rpb24oZSl7ZS5fX2ltcG9ydFBhcnNlZD0hMCx0aGlzLm1hcmtEeW5hbWljUGFyc2luZ0NvbXBsZXRlKGUpLGUuX19pbXBvcnRFbGVtZW50JiYoZS5fX2ltcG9ydEVsZW1lbnQuX19pbXBvcnRQYXJzZWQ9ITAsdGhpcy5tYXJrRHluYW1pY1BhcnNpbmdDb21wbGV0ZShlLl9faW1wb3J0RWxlbWVudCkpLHRoaXMucGFyc2luZ0VsZW1lbnQ9bnVsbCxjLnBhcnNlJiZjb25zb2xlLmxvZyhcImNvbXBsZXRlZFwiLGUpfSxtYXJrRHluYW1pY1BhcnNpbmdDb21wbGV0ZTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLmR5bmFtaWNFbGVtZW50cy5pbmRleE9mKGUpO3Q+PTAmJnRoaXMuZHluYW1pY0VsZW1lbnRzLnNwbGljZSh0LDEpfSxwYXJzZUltcG9ydDpmdW5jdGlvbihlKXtpZih3aW5kb3cuSFRNTEltcG9ydHMuX19pbXBvcnRzUGFyc2luZ0hvb2smJndpbmRvdy5IVE1MSW1wb3J0cy5fX2ltcG9ydHNQYXJzaW5nSG9vayhlKSxlW1wiaW1wb3J0XCJdJiYoZVtcImltcG9ydFwiXS5fX2ltcG9ydFBhcnNlZD0hMCksdGhpcy5tYXJrUGFyc2luZ0NvbXBsZXRlKGUpLGUuZGlzcGF0Y2hFdmVudChlLl9fcmVzb3VyY2UmJiFlLl9fZXJyb3I/bmV3IEN1c3RvbUV2ZW50KFwibG9hZFwiLHtidWJibGVzOiExfSk6bmV3IEN1c3RvbUV2ZW50KFwiZXJyb3JcIix7YnViYmxlczohMX0pKSxlLl9fcGVuZGluZylmb3IodmFyIHQ7ZS5fX3BlbmRpbmcubGVuZ3RoOyl0PWUuX19wZW5kaW5nLnNoaWZ0KCksdCYmdCh7dGFyZ2V0OmV9KTt0aGlzLnBhcnNlTmV4dCgpfSxwYXJzZUxpbms6ZnVuY3Rpb24oZSl7dChlKT90aGlzLnBhcnNlSW1wb3J0KGUpOihlLmhyZWY9ZS5ocmVmLHRoaXMucGFyc2VHZW5lcmljKGUpKX0scGFyc2VTdHlsZTpmdW5jdGlvbihlKXt2YXIgdD1lO2U9aShlKSx0Ll9fYXBwbGllZEVsZW1lbnQ9ZSxlLl9faW1wb3J0RWxlbWVudD10LHRoaXMucGFyc2VHZW5lcmljKGUpfSxwYXJzZUdlbmVyaWM6ZnVuY3Rpb24oZSl7dGhpcy50cmFja0VsZW1lbnQoZSksdGhpcy5hZGRFbGVtZW50VG9Eb2N1bWVudChlKX0scm9vdEltcG9ydEZvckVsZW1lbnQ6ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PWU7dC5vd25lckRvY3VtZW50Ll9faW1wb3J0TGluazspdD10Lm93bmVyRG9jdW1lbnQuX19pbXBvcnRMaW5rO3JldHVybiB0fSxhZGRFbGVtZW50VG9Eb2N1bWVudDpmdW5jdGlvbihlKXt2YXIgdD10aGlzLnJvb3RJbXBvcnRGb3JFbGVtZW50KGUuX19pbXBvcnRFbGVtZW50fHxlKTt0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGUsdCl9LHRyYWNrRWxlbWVudDpmdW5jdGlvbihlLHQpe3ZhciBuPXRoaXMscj1mdW5jdGlvbihyKXt0JiZ0KHIpLG4ubWFya1BhcnNpbmdDb21wbGV0ZShlKSxuLnBhcnNlTmV4dCgpfTtpZihlLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsciksZS5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIixyKSxkJiZcInN0eWxlXCI9PT1lLmxvY2FsTmFtZSl7dmFyIG89ITE7aWYoLTE9PWUudGV4dENvbnRlbnQuaW5kZXhPZihcIkBpbXBvcnRcIikpbz0hMDtlbHNlIGlmKGUuc2hlZXQpe289ITA7Zm9yKHZhciBpLGE9ZS5zaGVldC5jc3NSdWxlcyxzPWE/YS5sZW5ndGg6MCxjPTA7cz5jJiYoaT1hW2NdKTtjKyspaS50eXBlPT09Q1NTUnVsZS5JTVBPUlRfUlVMRSYmKG89byYmQm9vbGVhbihpLnN0eWxlU2hlZXQpKX1vJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcImxvYWRcIix7YnViYmxlczohMX0pKX0pfX0scGFyc2VTY3JpcHQ6ZnVuY3Rpb24odCl7dmFyIHI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtyLl9faW1wb3J0RWxlbWVudD10LHIuc3JjPXQuc3JjP3Quc3JjOm4odCksZS5jdXJyZW50U2NyaXB0PXQsdGhpcy50cmFja0VsZW1lbnQocixmdW5jdGlvbih0KXtyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQociksZS5jdXJyZW50U2NyaXB0PW51bGx9KSx0aGlzLmFkZEVsZW1lbnRUb0RvY3VtZW50KHIpfSxuZXh0VG9QYXJzZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9tYXlQYXJzZT1bXSwhdGhpcy5wYXJzaW5nRWxlbWVudCYmKHRoaXMubmV4dFRvUGFyc2VJbkRvYyhzKXx8dGhpcy5uZXh0VG9QYXJzZUR5bmFtaWMoKSl9LG5leHRUb1BhcnNlSW5Eb2M6ZnVuY3Rpb24oZSxuKXtpZihlJiZ0aGlzLl9tYXlQYXJzZS5pbmRleE9mKGUpPDApe3RoaXMuX21heVBhcnNlLnB1c2goZSk7Zm9yKHZhciByLG89ZS5xdWVyeVNlbGVjdG9yQWxsKHRoaXMucGFyc2VTZWxlY3RvcnNGb3JOb2RlKGUpKSxpPTAsYT1vLmxlbmd0aDthPmkmJihyPW9baV0pO2krKylpZighdGhpcy5pc1BhcnNlZChyKSlyZXR1cm4gdGhpcy5oYXNSZXNvdXJjZShyKT90KHIpP3RoaXMubmV4dFRvUGFyc2VJbkRvYyhyW1wiaW1wb3J0XCJdLHIpOnI6dm9pZCAwfXJldHVybiBufSxuZXh0VG9QYXJzZUR5bmFtaWM6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5keW5hbWljRWxlbWVudHNbMF19LHBhcnNlU2VsZWN0b3JzRm9yTm9kZTpmdW5jdGlvbihlKXt2YXIgdD1lLm93bmVyRG9jdW1lbnR8fGU7cmV0dXJuIHQ9PT1zP3RoaXMuZG9jdW1lbnRTZWxlY3RvcnM6dGhpcy5pbXBvcnRzU2VsZWN0b3JzfSxpc1BhcnNlZDpmdW5jdGlvbihlKXtyZXR1cm4gZS5fX2ltcG9ydFBhcnNlZH0sbmVlZHNEeW5hbWljUGFyc2luZzpmdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5keW5hbWljRWxlbWVudHMuaW5kZXhPZihlKT49MH0saGFzUmVzb3VyY2U6ZnVuY3Rpb24oZSl7cmV0dXJuIHQoZSkmJnZvaWQgMD09PWVbXCJpbXBvcnRcIl0/ITE6ITB9fTtlLnBhcnNlcj1oLGUuSU1QT1JUX1NFTEVDVE9SPWx9KSx3aW5kb3cuSFRNTEltcG9ydHMuYWRkTW9kdWxlKGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQoZSl7cmV0dXJuIG4oZSxhKX1mdW5jdGlvbiBuKGUsdCl7cmV0dXJuXCJsaW5rXCI9PT1lLmxvY2FsTmFtZSYmZS5nZXRBdHRyaWJ1dGUoXCJyZWxcIik9PT10fWZ1bmN0aW9uIHIoZSl7cmV0dXJuISFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGUsXCJiYXNlVVJJXCIpfWZ1bmN0aW9uIG8oZSx0KXt2YXIgbj1kb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoYSk7bi5fVVJMPXQ7dmFyIG89bi5jcmVhdGVFbGVtZW50KFwiYmFzZVwiKTtvLnNldEF0dHJpYnV0ZShcImhyZWZcIix0KSxuLmJhc2VVUkl8fHIobil8fE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiYmFzZVVSSVwiLHt2YWx1ZTp0fSk7dmFyIGk9bi5jcmVhdGVFbGVtZW50KFwibWV0YVwiKTtyZXR1cm4gaS5zZXRBdHRyaWJ1dGUoXCJjaGFyc2V0XCIsXCJ1dGYtOFwiKSxuLmhlYWQuYXBwZW5kQ2hpbGQoaSksbi5oZWFkLmFwcGVuZENoaWxkKG8pLG4uYm9keS5pbm5lckhUTUw9ZSx3aW5kb3cuSFRNTFRlbXBsYXRlRWxlbWVudCYmSFRNTFRlbXBsYXRlRWxlbWVudC5ib290c3RyYXAmJkhUTUxUZW1wbGF0ZUVsZW1lbnQuYm9vdHN0cmFwKG4pLG59dmFyIGk9ZS5mbGFncyxhPWUuSU1QT1JUX0xJTktfVFlQRSxzPWUuSU1QT1JUX1NFTEVDVE9SLGM9ZS5yb290RG9jdW1lbnQsZD1lLkxvYWRlcix1PWUuT2JzZXJ2ZXIsbD1lLnBhcnNlcixoPXtkb2N1bWVudHM6e30sZG9jdW1lbnRQcmVsb2FkU2VsZWN0b3JzOnMsaW1wb3J0c1ByZWxvYWRTZWxlY3RvcnM6W3NdLmpvaW4oXCIsXCIpLGxvYWROb2RlOmZ1bmN0aW9uKGUpe3AuYWRkTm9kZShlKX0sbG9hZFN1YnRyZWU6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5tYXJzaGFsTm9kZXMoZSk7cC5hZGROb2Rlcyh0KX0sbWFyc2hhbE5vZGVzOmZ1bmN0aW9uKGUpe3JldHVybiBlLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5sb2FkU2VsZWN0b3JzRm9yTm9kZShlKSl9LGxvYWRTZWxlY3RvcnNGb3JOb2RlOmZ1bmN0aW9uKGUpe3ZhciB0PWUub3duZXJEb2N1bWVudHx8ZTtyZXR1cm4gdD09PWM/dGhpcy5kb2N1bWVudFByZWxvYWRTZWxlY3RvcnM6dGhpcy5pbXBvcnRzUHJlbG9hZFNlbGVjdG9yc30sbG9hZGVkOmZ1bmN0aW9uKGUsbixyLGEscyl7aWYoaS5sb2FkJiZjb25zb2xlLmxvZyhcImxvYWRlZFwiLGUsbiksbi5fX3Jlc291cmNlPXIsbi5fX2Vycm9yPWEsdChuKSl7dmFyIGM9dGhpcy5kb2N1bWVudHNbZV07dm9pZCAwPT09YyYmKGM9YT9udWxsOm8ocixzfHxlKSxjJiYoYy5fX2ltcG9ydExpbms9bix0aGlzLmJvb3REb2N1bWVudChjKSksdGhpcy5kb2N1bWVudHNbZV09YyksbltcImltcG9ydFwiXT1jfWwucGFyc2VOZXh0KCl9LGJvb3REb2N1bWVudDpmdW5jdGlvbihlKXt0aGlzLmxvYWRTdWJ0cmVlKGUpLHRoaXMub2JzZXJ2ZXIub2JzZXJ2ZShlKSxsLnBhcnNlTmV4dCgpfSxsb2FkZWRBbGw6ZnVuY3Rpb24oKXtsLnBhcnNlTmV4dCgpfX0scD1uZXcgZChoLmxvYWRlZC5iaW5kKGgpLGgubG9hZGVkQWxsLmJpbmQoaCkpO2lmKGgub2JzZXJ2ZXI9bmV3IHUsIWRvY3VtZW50LmJhc2VVUkkpe3ZhciBmPXtnZXQ6ZnVuY3Rpb24oKXt2YXIgZT1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYmFzZVwiKTtyZXR1cm4gZT9lLmhyZWY6d2luZG93LmxvY2F0aW9uLmhyZWZ9LGNvbmZpZ3VyYWJsZTohMH07T2JqZWN0LmRlZmluZVByb3BlcnR5KGRvY3VtZW50LFwiYmFzZVVSSVwiLGYpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjLFwiYmFzZVVSSVwiLGYpfWUuaW1wb3J0ZXI9aCxlLmltcG9ydExvYWRlcj1wfSksd2luZG93LkhUTUxJbXBvcnRzLmFkZE1vZHVsZShmdW5jdGlvbihlKXt2YXIgdD1lLnBhcnNlcixuPWUuaW1wb3J0ZXIscj17YWRkZWQ6ZnVuY3Rpb24oZSl7Zm9yKHZhciByLG8saSxhLHM9MCxjPWUubGVuZ3RoO2M+cyYmKGE9ZVtzXSk7cysrKXJ8fChyPWEub3duZXJEb2N1bWVudCxvPXQuaXNQYXJzZWQocikpLGk9dGhpcy5zaG91bGRMb2FkTm9kZShhKSxpJiZuLmxvYWROb2RlKGEpLHRoaXMuc2hvdWxkUGFyc2VOb2RlKGEpJiZvJiZ0LnBhcnNlRHluYW1pYyhhLGkpfSxzaG91bGRMb2FkTm9kZTpmdW5jdGlvbihlKXtyZXR1cm4gMT09PWUubm9kZVR5cGUmJm8uY2FsbChlLG4ubG9hZFNlbGVjdG9yc0Zvck5vZGUoZSkpfSxzaG91bGRQYXJzZU5vZGU6ZnVuY3Rpb24oZSl7cmV0dXJuIDE9PT1lLm5vZGVUeXBlJiZvLmNhbGwoZSx0LnBhcnNlU2VsZWN0b3JzRm9yTm9kZShlKSl9fTtuLm9ic2VydmVyLmFkZENhbGxiYWNrPXIuYWRkZWQuYmluZChyKTt2YXIgbz1IVE1MRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlc3x8SFRNTEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXNTZWxlY3Rvcnx8SFRNTEVsZW1lbnQucHJvdG90eXBlLndlYmtpdE1hdGNoZXNTZWxlY3Rvcnx8SFRNTEVsZW1lbnQucHJvdG90eXBlLm1vek1hdGNoZXNTZWxlY3Rvcnx8SFRNTEVsZW1lbnQucHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yfSksZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCgpe3dpbmRvdy5IVE1MSW1wb3J0cy5pbXBvcnRlci5ib290RG9jdW1lbnQobyl9dmFyIG49ZS5pbml0aWFsaXplTW9kdWxlcyxyPWUuaXNJRTtpZighZS51c2VOYXRpdmUpe3ImJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCYmKHdpbmRvdy5DdXN0b21FdmVudD1mdW5jdGlvbihlLHQpe3Q9dHx8e307dmFyIG49ZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJDdXN0b21FdmVudFwiKTtyZXR1cm4gbi5pbml0Q3VzdG9tRXZlbnQoZSxCb29sZWFuKHQuYnViYmxlcyksQm9vbGVhbih0LmNhbmNlbGFibGUpLHQuZGV0YWlsKSxuLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKCl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsXCJkZWZhdWx0UHJldmVudGVkXCIse2dldDpmdW5jdGlvbigpe3JldHVybiEwfX0pfSxufSx3aW5kb3cuQ3VzdG9tRXZlbnQucHJvdG90eXBlPXdpbmRvdy5FdmVudC5wcm90b3R5cGUpLG4oKTt2YXIgbz1lLnJvb3REb2N1bWVudDtcImNvbXBsZXRlXCI9PT1kb2N1bWVudC5yZWFkeVN0YXRlfHxcImludGVyYWN0aXZlXCI9PT1kb2N1bWVudC5yZWFkeVN0YXRlJiYhd2luZG93LmF0dGFjaEV2ZW50P3QoKTpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLHQpfX0od2luZG93LkhUTUxJbXBvcnRzKSx3aW5kb3cuQ3VzdG9tRWxlbWVudHM9d2luZG93LkN1c3RvbUVsZW1lbnRzfHx7ZmxhZ3M6e319LGZ1bmN0aW9uKGUpe3ZhciB0PWUuZmxhZ3Msbj1bXSxyPWZ1bmN0aW9uKGUpe24ucHVzaChlKX0sbz1mdW5jdGlvbigpe24uZm9yRWFjaChmdW5jdGlvbih0KXt0KGUpfSl9O2UuYWRkTW9kdWxlPXIsZS5pbml0aWFsaXplTW9kdWxlcz1vLGUuaGFzTmF0aXZlPUJvb2xlYW4oZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KSxlLnVzZU5hdGl2ZT0hdC5yZWdpc3RlciYmZS5oYXNOYXRpdmUmJiF3aW5kb3cuU2hhZG93RE9NUG9seWZpbGwmJighd2luZG93LkhUTUxJbXBvcnRzfHx3aW5kb3cuSFRNTEltcG9ydHMudXNlTmF0aXZlKX0od2luZG93LkN1c3RvbUVsZW1lbnRzKSx3aW5kb3cuQ3VzdG9tRWxlbWVudHMuYWRkTW9kdWxlKGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQoZSx0KXtuKGUsZnVuY3Rpb24oZSl7cmV0dXJuIHQoZSk/ITA6dm9pZCByKGUsdCl9KSxyKGUsdCl9ZnVuY3Rpb24gbihlLHQscil7dmFyIG89ZS5maXJzdEVsZW1lbnRDaGlsZDtpZighbylmb3Iobz1lLmZpcnN0Q2hpbGQ7byYmby5ub2RlVHlwZSE9PU5vZGUuRUxFTUVOVF9OT0RFOylvPW8ubmV4dFNpYmxpbmc7Zm9yKDtvOyl0KG8scikhPT0hMCYmbihvLHQsciksbz1vLm5leHRFbGVtZW50U2libGluZztyZXR1cm4gbnVsbH1mdW5jdGlvbiByKGUsbil7Zm9yKHZhciByPWUuc2hhZG93Um9vdDtyOyl0KHIsbikscj1yLm9sZGVyU2hhZG93Um9vdH1mdW5jdGlvbiBvKGUsdCl7aShlLHQsW10pfWZ1bmN0aW9uIGkoZSx0LG4pe2lmKGU9d2luZG93LndyYXAoZSksIShuLmluZGV4T2YoZSk+PTApKXtuLnB1c2goZSk7Zm9yKHZhciByLG89ZS5xdWVyeVNlbGVjdG9yQWxsKFwibGlua1tyZWw9XCIrYStcIl1cIikscz0wLGM9by5sZW5ndGg7Yz5zJiYocj1vW3NdKTtzKyspcltcImltcG9ydFwiXSYmaShyW1wiaW1wb3J0XCJdLHQsbik7dChlKX19dmFyIGE9d2luZG93LkhUTUxJbXBvcnRzP3dpbmRvdy5IVE1MSW1wb3J0cy5JTVBPUlRfTElOS19UWVBFOlwibm9uZVwiO2UuZm9yRG9jdW1lbnRUcmVlPW8sZS5mb3JTdWJ0cmVlPXR9KSx3aW5kb3cuQ3VzdG9tRWxlbWVudHMuYWRkTW9kdWxlKGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQoZSl7cmV0dXJuIG4oZSl8fHIoZSl9ZnVuY3Rpb24gbih0KXtyZXR1cm4gZS51cGdyYWRlKHQpPyEwOnZvaWQgcyh0KX1mdW5jdGlvbiByKGUpe2coZSxmdW5jdGlvbihlKXtyZXR1cm4gbihlKT8hMDp2b2lkIDB9KX1mdW5jdGlvbiBvKGUpe3MoZSksaChlKSYmZyhlLGZ1bmN0aW9uKGUpe3MoZSl9KX1mdW5jdGlvbiBpKGUpe00ucHVzaChlKSxMfHwoTD0hMCxzZXRUaW1lb3V0KGEpKX1mdW5jdGlvbiBhKCl7TD0hMTtmb3IodmFyIGUsdD1NLG49MCxyPXQubGVuZ3RoO3I+biYmKGU9dFtuXSk7bisrKWUoKTtNPVtdfWZ1bmN0aW9uIHMoZSl7RT9pKGZ1bmN0aW9uKCl7YyhlKX0pOmMoZSl9ZnVuY3Rpb24gYyhlKXtlLl9fdXBncmFkZWRfXyYmKGUuYXR0YWNoZWRDYWxsYmFja3x8ZS5kZXRhY2hlZENhbGxiYWNrKSYmIWUuX19hdHRhY2hlZCYmaChlKSYmKGUuX19hdHRhY2hlZD0hMCxlLmF0dGFjaGVkQ2FsbGJhY2smJmUuYXR0YWNoZWRDYWxsYmFjaygpKX1mdW5jdGlvbiBkKGUpe3UoZSksZyhlLGZ1bmN0aW9uKGUpe3UoZSl9KX1mdW5jdGlvbiB1KGUpe0U/aShmdW5jdGlvbigpe2woZSl9KTpsKGUpfWZ1bmN0aW9uIGwoZSl7ZS5fX3VwZ3JhZGVkX18mJihlLmF0dGFjaGVkQ2FsbGJhY2t8fGUuZGV0YWNoZWRDYWxsYmFjaykmJmUuX19hdHRhY2hlZCYmIWgoZSkmJihlLl9fYXR0YWNoZWQ9ITEsZS5kZXRhY2hlZENhbGxiYWNrJiZlLmRldGFjaGVkQ2FsbGJhY2soKSl9ZnVuY3Rpb24gaChlKXtmb3IodmFyIHQ9ZSxuPXdyYXAoZG9jdW1lbnQpO3Q7KXtpZih0PT1uKXJldHVybiEwO3Q9dC5wYXJlbnROb2RlfHx0Lm5vZGVUeXBlPT09Tm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFJiZ0Lmhvc3R9fWZ1bmN0aW9uIHAoZSl7aWYoZS5zaGFkb3dSb290JiYhZS5zaGFkb3dSb290Ll9fd2F0Y2hlZCl7Yi5kb20mJmNvbnNvbGUubG9nKFwid2F0Y2hpbmcgc2hhZG93LXJvb3QgZm9yOiBcIixlLmxvY2FsTmFtZSk7Zm9yKHZhciB0PWUuc2hhZG93Um9vdDt0Oyl2KHQpLHQ9dC5vbGRlclNoYWRvd1Jvb3R9fWZ1bmN0aW9uIGYoZSl7aWYoYi5kb20pe3ZhciBuPWVbMF07aWYobiYmXCJjaGlsZExpc3RcIj09PW4udHlwZSYmbi5hZGRlZE5vZGVzJiZuLmFkZGVkTm9kZXMpe2Zvcih2YXIgcj1uLmFkZGVkTm9kZXNbMF07ciYmciE9PWRvY3VtZW50JiYhci5ob3N0OylyPXIucGFyZW50Tm9kZTt2YXIgbz1yJiYoci5VUkx8fHIuX1VSTHx8ci5ob3N0JiZyLmhvc3QubG9jYWxOYW1lKXx8XCJcIjtvPW8uc3BsaXQoXCIvP1wiKS5zaGlmdCgpLnNwbGl0KFwiL1wiKS5wb3AoKX1jb25zb2xlLmdyb3VwKFwibXV0YXRpb25zICglZCkgWyVzXVwiLGUubGVuZ3RoLG98fFwiXCIpfWUuZm9yRWFjaChmdW5jdGlvbihlKXtcImNoaWxkTGlzdFwiPT09ZS50eXBlJiYoVChlLmFkZGVkTm9kZXMsZnVuY3Rpb24oZSl7ZS5sb2NhbE5hbWUmJnQoZSl9KSxUKGUucmVtb3ZlZE5vZGVzLGZ1bmN0aW9uKGUpe2UubG9jYWxOYW1lJiZkKGUpfSkpfSksYi5kb20mJmNvbnNvbGUuZ3JvdXBFbmQoKX1mdW5jdGlvbiBtKGUpe2ZvcihlPXdpbmRvdy53cmFwKGUpLGV8fChlPXdpbmRvdy53cmFwKGRvY3VtZW50KSk7ZS5wYXJlbnROb2RlOyllPWUucGFyZW50Tm9kZTt2YXIgdD1lLl9fb2JzZXJ2ZXI7dCYmKGYodC50YWtlUmVjb3JkcygpKSxhKCkpfWZ1bmN0aW9uIHYoZSl7aWYoIWUuX19vYnNlcnZlcil7dmFyIHQ9bmV3IE11dGF0aW9uT2JzZXJ2ZXIoZik7dC5vYnNlcnZlKGUse2NoaWxkTGlzdDohMCxzdWJ0cmVlOiEwfSksZS5fX29ic2VydmVyPXR9fWZ1bmN0aW9uIF8oZSl7ZT13aW5kb3cud3JhcChlKSxiLmRvbSYmY29uc29sZS5ncm91cChcInVwZ3JhZGVEb2N1bWVudDogXCIsZS5iYXNlVVJJLnNwbGl0KFwiL1wiKS5wb3AoKSksdChlKSx2KGUpLGIuZG9tJiZjb25zb2xlLmdyb3VwRW5kKCl9ZnVuY3Rpb24gdyhlKXt5KGUsXyl9dmFyIGI9ZS5mbGFncyxnPWUuZm9yU3VidHJlZSx5PWUuZm9yRG9jdW1lbnRUcmVlLEU9IXdpbmRvdy5NdXRhdGlvbk9ic2VydmVyfHx3aW5kb3cuTXV0YXRpb25PYnNlcnZlcj09PXdpbmRvdy5Kc011dGF0aW9uT2JzZXJ2ZXI7ZS5oYXNQb2x5ZmlsbE11dGF0aW9ucz1FO3ZhciBMPSExLE09W10sVD1BcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsLmJpbmQoQXJyYXkucHJvdG90eXBlLmZvckVhY2gpLE49RWxlbWVudC5wcm90b3R5cGUuY3JlYXRlU2hhZG93Um9vdDtOJiYoRWxlbWVudC5wcm90b3R5cGUuY3JlYXRlU2hhZG93Um9vdD1mdW5jdGlvbigpe3ZhciBlPU4uY2FsbCh0aGlzKTtyZXR1cm4gd2luZG93LkN1c3RvbUVsZW1lbnRzLndhdGNoU2hhZG93KHRoaXMpLGV9KSxlLndhdGNoU2hhZG93PXAsZS51cGdyYWRlRG9jdW1lbnRUcmVlPXcsZS51cGdyYWRlU3VidHJlZT1yLGUudXBncmFkZUFsbD10LGUuYXR0YWNoZWROb2RlPW8sZS50YWtlUmVjb3Jkcz1tfSksd2luZG93LkN1c3RvbUVsZW1lbnRzLmFkZE1vZHVsZShmdW5jdGlvbihlKXtmdW5jdGlvbiB0KHQpe2lmKCF0Ll9fdXBncmFkZWRfXyYmdC5ub2RlVHlwZT09PU5vZGUuRUxFTUVOVF9OT0RFKXt2YXIgcj10LmdldEF0dHJpYnV0ZShcImlzXCIpLG89ZS5nZXRSZWdpc3RlcmVkRGVmaW5pdGlvbihyfHx0LmxvY2FsTmFtZSk7aWYobyl7aWYociYmby50YWc9PXQubG9jYWxOYW1lKXJldHVybiBuKHQsbyk7aWYoIXImJiFvW1wiZXh0ZW5kc1wiXSlyZXR1cm4gbih0LG8pfX19ZnVuY3Rpb24gbih0LG4pe3JldHVybiBhLnVwZ3JhZGUmJmNvbnNvbGUuZ3JvdXAoXCJ1cGdyYWRlOlwiLHQubG9jYWxOYW1lKSxuLmlzJiZ0LnNldEF0dHJpYnV0ZShcImlzXCIsbi5pcykscih0LG4pLHQuX191cGdyYWRlZF9fPSEwLGkodCksZS5hdHRhY2hlZE5vZGUodCksZS51cGdyYWRlU3VidHJlZSh0KSxhLnVwZ3JhZGUmJmNvbnNvbGUuZ3JvdXBFbmQoKSx0fWZ1bmN0aW9uIHIoZSx0KXtPYmplY3QuX19wcm90b19fP2UuX19wcm90b19fPXQucHJvdG90eXBlOihvKGUsdC5wcm90b3R5cGUsdFtcIm5hdGl2ZVwiXSksZS5fX3Byb3RvX189dC5wcm90b3R5cGUpfWZ1bmN0aW9uIG8oZSx0LG4pe2Zvcih2YXIgcj17fSxvPXQ7byE9PW4mJm8hPT1IVE1MRWxlbWVudC5wcm90b3R5cGU7KXtmb3IodmFyIGksYT1PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvKSxzPTA7aT1hW3NdO3MrKylyW2ldfHwoT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsaSxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG8saSkpLHJbaV09MSk7bz1PYmplY3QuZ2V0UHJvdG90eXBlT2Yobyl9fWZ1bmN0aW9uIGkoZSl7ZS5jcmVhdGVkQ2FsbGJhY2smJmUuY3JlYXRlZENhbGxiYWNrKCl9dmFyIGE9ZS5mbGFncztlLnVwZ3JhZGU9dCxlLnVwZ3JhZGVXaXRoRGVmaW5pdGlvbj1uLGUuaW1wbGVtZW50UHJvdG90eXBlPXJ9KSx3aW5kb3cuQ3VzdG9tRWxlbWVudHMuYWRkTW9kdWxlKGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQodCxyKXt2YXIgYz1yfHx7fTtpZighdCl0aHJvdyBuZXcgRXJyb3IoXCJkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQ6IGZpcnN0IGFyZ3VtZW50IGBuYW1lYCBtdXN0IG5vdCBiZSBlbXB0eVwiKTtpZih0LmluZGV4T2YoXCItXCIpPDApdGhyb3cgbmV3IEVycm9yKFwiZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50OiBmaXJzdCBhcmd1bWVudCAoJ25hbWUnKSBtdXN0IGNvbnRhaW4gYSBkYXNoICgnLScpLiBBcmd1bWVudCBwcm92aWRlZCB3YXMgJ1wiK1N0cmluZyh0KStcIicuXCIpO2lmKG8odCkpdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGV4ZWN1dGUgJ3JlZ2lzdGVyRWxlbWVudCcgb24gJ0RvY3VtZW50JzogUmVnaXN0cmF0aW9uIGZhaWxlZCBmb3IgdHlwZSAnXCIrU3RyaW5nKHQpK1wiJy4gVGhlIHR5cGUgbmFtZSBpcyBpbnZhbGlkLlwiKTtpZihkKHQpKXRocm93IG5ldyBFcnJvcihcIkR1cGxpY2F0ZURlZmluaXRpb25FcnJvcjogYSB0eXBlIHdpdGggbmFtZSAnXCIrU3RyaW5nKHQpK1wiJyBpcyBhbHJlYWR5IHJlZ2lzdGVyZWRcIik7cmV0dXJuIGMucHJvdG90eXBlfHwoYy5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUpKSxjLl9fbmFtZT10LnRvTG93ZXJDYXNlKCksYy5saWZlY3ljbGU9Yy5saWZlY3ljbGV8fHt9LGMuYW5jZXN0cnk9aShjW1wiZXh0ZW5kc1wiXSksYShjKSxzKGMpLG4oYy5wcm90b3R5cGUpLHUoYy5fX25hbWUsYyksYy5jdG9yPWwoYyksYy5jdG9yLnByb3RvdHlwZT1jLnByb3RvdHlwZSxjLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1jLmN0b3IsZS5yZWFkeSYmXyhkb2N1bWVudCksYy5jdG9yfWZ1bmN0aW9uIG4oZSl7aWYoIWUuc2V0QXR0cmlidXRlLl9wb2x5ZmlsbGVkKXt2YXIgdD1lLnNldEF0dHJpYnV0ZTtlLnNldEF0dHJpYnV0ZT1mdW5jdGlvbihlLG4pe3IuY2FsbCh0aGlzLGUsbix0KX07dmFyIG49ZS5yZW1vdmVBdHRyaWJ1dGU7ZS5yZW1vdmVBdHRyaWJ1dGU9ZnVuY3Rpb24oZSl7ci5jYWxsKHRoaXMsZSxudWxsLG4pO1xuXG59LGUuc2V0QXR0cmlidXRlLl9wb2x5ZmlsbGVkPSEwfX1mdW5jdGlvbiByKGUsdCxuKXtlPWUudG9Mb3dlckNhc2UoKTt2YXIgcj10aGlzLmdldEF0dHJpYnV0ZShlKTtuLmFwcGx5KHRoaXMsYXJndW1lbnRzKTt2YXIgbz10aGlzLmdldEF0dHJpYnV0ZShlKTt0aGlzLmF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayYmbyE9PXImJnRoaXMuYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGUscixvKX1mdW5jdGlvbiBvKGUpe2Zvcih2YXIgdD0wO3Q8RS5sZW5ndGg7dCsrKWlmKGU9PT1FW3RdKXJldHVybiEwfWZ1bmN0aW9uIGkoZSl7dmFyIHQ9ZChlKTtyZXR1cm4gdD9pKHRbXCJleHRlbmRzXCJdKS5jb25jYXQoW3RdKTpbXX1mdW5jdGlvbiBhKGUpe2Zvcih2YXIgdCxuPWVbXCJleHRlbmRzXCJdLHI9MDt0PWUuYW5jZXN0cnlbcl07cisrKW49dC5pcyYmdC50YWc7ZS50YWc9bnx8ZS5fX25hbWUsbiYmKGUuaXM9ZS5fX25hbWUpfWZ1bmN0aW9uIHMoZSl7aWYoIU9iamVjdC5fX3Byb3RvX18pe3ZhciB0PUhUTUxFbGVtZW50LnByb3RvdHlwZTtpZihlLmlzKXt2YXIgbj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KGUudGFnKSxyPU9iamVjdC5nZXRQcm90b3R5cGVPZihuKTtyPT09ZS5wcm90b3R5cGUmJih0PXIpfWZvcih2YXIgbyxpPWUucHJvdG90eXBlO2kmJmkhPT10OylvPU9iamVjdC5nZXRQcm90b3R5cGVPZihpKSxpLl9fcHJvdG9fXz1vLGk9bztlW1wibmF0aXZlXCJdPXR9fWZ1bmN0aW9uIGMoZSl7cmV0dXJuIGIoVChlLnRhZyksZSl9ZnVuY3Rpb24gZChlKXtyZXR1cm4gZT9MW2UudG9Mb3dlckNhc2UoKV06dm9pZCAwfWZ1bmN0aW9uIHUoZSx0KXtMW2VdPXR9ZnVuY3Rpb24gbChlKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYyhlKX19ZnVuY3Rpb24gaChlLHQsbil7cmV0dXJuIGU9PT1NP3AodCxuKTpOKGUsdCl9ZnVuY3Rpb24gcChlLHQpe2UmJihlPWUudG9Mb3dlckNhc2UoKSksdCYmKHQ9dC50b0xvd2VyQ2FzZSgpKTt2YXIgbj1kKHR8fGUpO2lmKG4pe2lmKGU9PW4udGFnJiZ0PT1uLmlzKXJldHVybiBuZXcgbi5jdG9yO2lmKCF0JiYhbi5pcylyZXR1cm4gbmV3IG4uY3Rvcn12YXIgcjtyZXR1cm4gdD8ocj1wKGUpLHIuc2V0QXR0cmlidXRlKFwiaXNcIix0KSxyKToocj1UKGUpLGUuaW5kZXhPZihcIi1cIik+PTAmJmcocixIVE1MRWxlbWVudCkscil9ZnVuY3Rpb24gZihlLHQpe3ZhciBuPWVbdF07ZVt0XT1mdW5jdGlvbigpe3ZhciBlPW4uYXBwbHkodGhpcyxhcmd1bWVudHMpO3JldHVybiB3KGUpLGV9fXZhciBtLHY9ZS5pc0lFMTFPck9sZGVyLF89ZS51cGdyYWRlRG9jdW1lbnRUcmVlLHc9ZS51cGdyYWRlQWxsLGI9ZS51cGdyYWRlV2l0aERlZmluaXRpb24sZz1lLmltcGxlbWVudFByb3RvdHlwZSx5PWUudXNlTmF0aXZlLEU9W1wiYW5ub3RhdGlvbi14bWxcIixcImNvbG9yLXByb2ZpbGVcIixcImZvbnQtZmFjZVwiLFwiZm9udC1mYWNlLXNyY1wiLFwiZm9udC1mYWNlLXVyaVwiLFwiZm9udC1mYWNlLWZvcm1hdFwiLFwiZm9udC1mYWNlLW5hbWVcIixcIm1pc3NpbmctZ2x5cGhcIl0sTD17fSxNPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiLFQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudC5iaW5kKGRvY3VtZW50KSxOPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUy5iaW5kKGRvY3VtZW50KTttPU9iamVjdC5fX3Byb3RvX198fHk/ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZSBpbnN0YW5jZW9mIHR9OmZ1bmN0aW9uKGUsdCl7Zm9yKHZhciBuPWU7bjspe2lmKG49PT10LnByb3RvdHlwZSlyZXR1cm4hMDtuPW4uX19wcm90b19ffXJldHVybiExfSxmKE5vZGUucHJvdG90eXBlLFwiY2xvbmVOb2RlXCIpLGYoZG9jdW1lbnQsXCJpbXBvcnROb2RlXCIpLHYmJiFmdW5jdGlvbigpe3ZhciBlPWRvY3VtZW50LmltcG9ydE5vZGU7ZG9jdW1lbnQuaW1wb3J0Tm9kZT1mdW5jdGlvbigpe3ZhciB0PWUuYXBwbHkoZG9jdW1lbnQsYXJndW1lbnRzKTtpZih0Lm5vZGVUeXBlPT10LkRPQ1VNRU5UX0ZSQUdNRU5UX05PREUpe3ZhciBuPWRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtyZXR1cm4gbi5hcHBlbmRDaGlsZCh0KSxufXJldHVybiB0fX0oKSxkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQ9dCxkb2N1bWVudC5jcmVhdGVFbGVtZW50PXAsZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TPWgsZS5yZWdpc3RyeT1MLGVbXCJpbnN0YW5jZW9mXCJdPW0sZS5yZXNlcnZlZFRhZ0xpc3Q9RSxlLmdldFJlZ2lzdGVyZWREZWZpbml0aW9uPWQsZG9jdW1lbnQucmVnaXN0ZXI9ZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50fSksZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdCgpe2Eod2luZG93LndyYXAoZG9jdW1lbnQpKSx3aW5kb3cuSFRNTEltcG9ydHMmJih3aW5kb3cuSFRNTEltcG9ydHMuX19pbXBvcnRzUGFyc2luZ0hvb2s9ZnVuY3Rpb24oZSl7YSh3cmFwKGVbXCJpbXBvcnRcIl0pKX0pLHdpbmRvdy5DdXN0b21FbGVtZW50cy5yZWFkeT0hMCxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7d2luZG93LkN1c3RvbUVsZW1lbnRzLnJlYWR5VGltZT1EYXRlLm5vdygpLHdpbmRvdy5IVE1MSW1wb3J0cyYmKHdpbmRvdy5DdXN0b21FbGVtZW50cy5lbGFwc2VkPXdpbmRvdy5DdXN0b21FbGVtZW50cy5yZWFkeVRpbWUtd2luZG93LkhUTUxJbXBvcnRzLnJlYWR5VGltZSksZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJXZWJDb21wb25lbnRzUmVhZHlcIix7YnViYmxlczohMH0pKX0pfXZhciBuPWUudXNlTmF0aXZlLHI9ZS5pbml0aWFsaXplTW9kdWxlcyxvPS9UcmlkZW50Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO2lmKG4pe3ZhciBpPWZ1bmN0aW9uKCl7fTtlLndhdGNoU2hhZG93PWksZS51cGdyYWRlPWksZS51cGdyYWRlQWxsPWksZS51cGdyYWRlRG9jdW1lbnRUcmVlPWksZS51cGdyYWRlU3VidHJlZT1pLGUudGFrZVJlY29yZHM9aSxlW1wiaW5zdGFuY2VvZlwiXT1mdW5jdGlvbihlLHQpe3JldHVybiBlIGluc3RhbmNlb2YgdH19ZWxzZSByKCk7dmFyIGE9ZS51cGdyYWRlRG9jdW1lbnRUcmVlO2lmKHdpbmRvdy53cmFwfHwod2luZG93LlNoYWRvd0RPTVBvbHlmaWxsPyh3aW5kb3cud3JhcD13aW5kb3cuU2hhZG93RE9NUG9seWZpbGwud3JhcElmTmVlZGVkLHdpbmRvdy51bndyYXA9d2luZG93LlNoYWRvd0RPTVBvbHlmaWxsLnVud3JhcElmTmVlZGVkKTp3aW5kb3cud3JhcD13aW5kb3cudW53cmFwPWZ1bmN0aW9uKGUpe3JldHVybiBlfSksbyYmXCJmdW5jdGlvblwiIT10eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50JiYod2luZG93LkN1c3RvbUV2ZW50PWZ1bmN0aW9uKGUsdCl7dD10fHx7fTt2YXIgbj1kb2N1bWVudC5jcmVhdGVFdmVudChcIkN1c3RvbUV2ZW50XCIpO3JldHVybiBuLmluaXRDdXN0b21FdmVudChlLEJvb2xlYW4odC5idWJibGVzKSxCb29sZWFuKHQuY2FuY2VsYWJsZSksdC5kZXRhaWwpLG4ucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oKXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcImRlZmF1bHRQcmV2ZW50ZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuITB9fSl9LG59LHdpbmRvdy5DdXN0b21FdmVudC5wcm90b3R5cGU9d2luZG93LkV2ZW50LnByb3RvdHlwZSksXCJjb21wbGV0ZVwiPT09ZG9jdW1lbnQucmVhZHlTdGF0ZXx8ZS5mbGFncy5lYWdlcil0KCk7ZWxzZSBpZihcImludGVyYWN0aXZlXCIhPT1kb2N1bWVudC5yZWFkeVN0YXRlfHx3aW5kb3cuYXR0YWNoRXZlbnR8fHdpbmRvdy5IVE1MSW1wb3J0cyYmIXdpbmRvdy5IVE1MSW1wb3J0cy5yZWFkeSl7dmFyIHM9d2luZG93LkhUTUxJbXBvcnRzJiYhd2luZG93LkhUTUxJbXBvcnRzLnJlYWR5P1wiSFRNTEltcG9ydHNMb2FkZWRcIjpcIkRPTUNvbnRlbnRMb2FkZWRcIjt3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihzLHQpfWVsc2UgdCgpO2UuaXNJRTExT3JPbGRlcj1vfSh3aW5kb3cuQ3VzdG9tRWxlbWVudHMpLFwidW5kZWZpbmVkXCI9PXR5cGVvZiBIVE1MVGVtcGxhdGVFbGVtZW50JiYhZnVuY3Rpb24oKXt2YXIgZT1cInRlbXBsYXRlXCI7SFRNTFRlbXBsYXRlRWxlbWVudD1mdW5jdGlvbigpe30sSFRNTFRlbXBsYXRlRWxlbWVudC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUpLEhUTUxUZW1wbGF0ZUVsZW1lbnQuZGVjb3JhdGU9ZnVuY3Rpb24oZSl7ZS5jb250ZW50fHwoZS5jb250ZW50PWUub3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkpO2Zvcih2YXIgdDt0PWUuZmlyc3RDaGlsZDspZS5jb250ZW50LmFwcGVuZENoaWxkKHQpfSxIVE1MVGVtcGxhdGVFbGVtZW50LmJvb3RzdHJhcD1mdW5jdGlvbih0KXtmb3IodmFyIG4scj10LnF1ZXJ5U2VsZWN0b3JBbGwoZSksbz0wLGk9ci5sZW5ndGg7aT5vJiYobj1yW29dKTtvKyspSFRNTFRlbXBsYXRlRWxlbWVudC5kZWNvcmF0ZShuKX0sd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24oKXtIVE1MVGVtcGxhdGVFbGVtZW50LmJvb3RzdHJhcChkb2N1bWVudCl9KTt2YXIgdD1kb2N1bWVudC5jcmVhdGVFbGVtZW50O2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQ9ZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjt2YXIgZT10LmFwcGx5KGRvY3VtZW50LGFyZ3VtZW50cyk7cmV0dXJuXCJ0ZW1wbGF0ZVwiPT1lLmxvY2FsTmFtZSYmSFRNTFRlbXBsYXRlRWxlbWVudC5kZWNvcmF0ZShlKSxlfX0oKSxmdW5jdGlvbihlKXt2YXIgdD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7dC50ZXh0Q29udGVudD1cImJvZHkge3RyYW5zaXRpb246IG9wYWNpdHkgZWFzZS1pbiAwLjJzOyB9IFxcbmJvZHlbdW5yZXNvbHZlZF0ge29wYWNpdHk6IDA7IGRpc3BsYXk6IGJsb2NrOyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7IH0gXFxuXCI7dmFyIG49ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImhlYWRcIik7bi5pbnNlcnRCZWZvcmUodCxuLmZpcnN0Q2hpbGQpfSh3aW5kb3cuV2ViQ29tcG9uZW50cyk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
