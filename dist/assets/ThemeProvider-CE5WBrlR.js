import{A as f,r as o}from"./index-BEj3f1Zo.js";var c={exports:{}};/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/(function(s){(function(){var i={}.hasOwnProperty;function r(){for(var t="",n=0;n<arguments.length;n++){var e=arguments[n];e&&(t=u(t,p(e)))}return t}function p(t){if(typeof t=="string"||typeof t=="number")return t;if(typeof t!="object")return"";if(Array.isArray(t))return r.apply(null,t);if(t.toString!==Object.prototype.toString&&!t.toString.toString().includes("[native code]"))return t.toString();var n="";for(var e in t)i.call(t,e)&&t[e]&&(n=u(n,e));return n}function u(t,n){return n?t?t+" "+n:t+n:t}s.exports?(r.default=r,s.exports=r):window.classNames=r})()})(c);var x=c.exports;const A=f(x),l=["xxl","xl","lg","md","sm","xs"],m="xs",a=o.createContext({prefixes:{},breakpoints:l,minBreakpoint:m});function E(s,i){const{prefixes:r}=o.useContext(a);return s||r[i]||i}function b(){const{breakpoints:s}=o.useContext(a);return s}function d(){const{minBreakpoint:s}=o.useContext(a);return s}function v(){const{dir:s}=o.useContext(a);return s==="rtl"}export{v as a,b,A as c,d,E as u};
