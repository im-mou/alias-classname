const u = /\(\w*\)/g, r = /:/g, d = (t) => t.trim(), g = (t, e = 1) => t.substring(e, t.length - e), h = (t) => t.reduce((e, s) => ({ ...e, [s]: s }), {}), o = (t) => t.filter(
  (e, s) => typeof e == "string" && e.trim().length > 0 && t.indexOf(e) === s
), m = (t) => (e) => {
  for (const s in e) {
    if (!Object.prototype.hasOwnProperty.call(e, s))
      continue;
    const n = e[s].match(u);
    if (!(!n || !n.length))
      for (const a of n) {
        const l = g(a);
        t[l] && (e[s] = e[s].replace(
          a,
          t[l]
        ));
      }
  }
}, b = (t) => {
  const e = t.match(r);
  if (!e || e.length > 1)
    return null;
  const [s, n] = t.split(":").map(d);
  return !s.length || !n.length || n.includes(`(${s})`) || s.startsWith("(") && s.endsWith(")") ? null : { [s]: n };
}, p = (t, e) => (s) => {
  const n = o(s);
  for (const a of n) {
    const l = b(a);
    l && Object.assign(e, l);
  }
  t(e);
}, v = (...t) => {
  const e = {}, s = {}, n = m(e), a = p(n, e);
  t.length && a(t);
  const l = (...c) => {
    const i = o(c);
    return Object.assign(s, h(i)), a(i), n(s), i.map(
      (f) => s[f].split(r).reverse()[0]
    ).join(" ");
  };
  return Object.defineProperty(l, "debug", {
    value: () => ({ aliases: e, classes: s }),
    writable: !1,
    enumerable: !1,
    configurable: !1
  }), l;
};
export {
  v as default
};
