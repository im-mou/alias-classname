(function(a,o){typeof exports=="object"&&typeof module<"u"?module.exports=o():typeof define=="function"&&define.amd?define(o):(a=typeof globalThis<"u"?globalThis:a||self,a["alias-classname"]=o())})(this,function(){"use strict";const a=/\(\w*\)/g,o=/:/g,f=n=>n.trim(),u=(n,e=1)=>n.substring(e,n.length-e),d=n=>n.reduce((e,s)=>({...e,[s]:s}),{}),c=n=>n.filter((e,s)=>typeof e=="string"&&e.trim().length>0&&n.indexOf(e)===s),h=n=>e=>{for(const s in e){if(!Object.prototype.hasOwnProperty.call(e,s))continue;const t=e[s].match(a);if(!(!t||!t.length))for(const l of t){const i=u(l);n[i]&&(e[s]=e[s].replace(l,n[i]))}}},m=n=>{const e=n.match(o);if(!e||e.length>1)return null;const[s,t]=n.split(":").map(f);return!s.length||!t.length||t.includes(`(${s})`)||s.startsWith("(")&&s.endsWith(")")?null:{[s]:t}},g=(n,e)=>s=>{const t=c(s);for(const l of t){const i=m(l);i&&Object.assign(e,i)}n(e)};return(...n)=>{const e={},s={},t=h(e),l=g(t,e);n.length&&l(n);const i=(...p)=>{const r=c(p);return Object.assign(s,d(r)),l(r),t(s),r.map(b=>s[b].split(o).reverse()[0]).join(" ")};return Object.defineProperty(i,"debug",{value:()=>({aliases:e,classes:s}),writable:!1,enumerable:!1,configurable:!1}),i}});