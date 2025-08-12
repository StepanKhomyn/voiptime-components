import { createElementBlock as m, openBlock as p, createElementVNode as h, createStaticVNode as Fe, defineComponent as se, computed as M, createBlock as ae, createCommentVNode as P, resolveDynamicComponent as Ze, useSlots as Ue, resolveDirective as Ke, withDirectives as $e, normalizeClass as W, renderSlot as pe, Teleport as ut, normalizeStyle as re, withModifiers as he, toDisplayString as te, watch as me, Fragment as oe, renderList as le, vModelSelect as dt, createVNode as Z, withCtx as Me, createTextVNode as ge, ref as O, createApp as pt, h as ye, onMounted as ve, onUnmounted as Se, nextTick as ht, mergeModels as He, useModel as mt, reactive as vt, provide as ft, unref as K, isMemoSame as _t, inject as gt } from "vue";
const D = (t, e) => {
  const o = t.__vccOpts || t;
  for (const [n, s] of e)
    o[n] = s;
  return o;
}, Ct = {}, wt = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function kt(t, e) {
  return p(), m("svg", wt, e[0] || (e[0] = [
    h("path", {
      d: "M14 8L10 12L6 8",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ]));
}
const bt = /* @__PURE__ */ D(Ct, [["render", kt]]), yt = {}, xt = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Mt(t, e) {
  return p(), m("svg", xt, e[0] || (e[0] = [
    h("path", {
      d: "M6 12L10 8L14 12",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ]));
}
const Lt = /* @__PURE__ */ D(yt, [["render", Mt]]), $t = {}, St = {
  width: "14",
  height: "15",
  viewBox: "0 0 14 15",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function It(t, e) {
  return p(), m("svg", St, e[0] || (e[0] = [
    h("path", {
      d: "M11.8789 4.90517L11.2561 4.20124C10.4045 3.33504 9.28504 2.7626 8.06789 2.5709C6.85074 2.3792 5.60245 2.57874 4.5127 3.13917C3.42296 3.69961 2.55134 4.59032 2.03031 5.67593C1.50928 6.76155 1.36732 7.98272 1.626 9.15387C1.88469 10.325 2.52987 11.3821 3.46351 12.1645C4.39716 12.9469 5.56821 13.4119 6.79871 13.4887C8.02921 13.5655 9.25189 13.25 10.2809 12.5901C11.31 11.9302 12.0891 10.962 12.5 9.83266",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-miterlimit": "10",
      "stroke-linecap": "round"
    }, null, -1),
    h("path", {
      d: "M8.5157 6.5C8.07025 6.5 7.84716 5.96143 8.16215 5.64645L10.3086 3.5L12.455 1.35355C12.77 1.03857 13.3086 1.26165 13.3086 1.70711V6C13.3086 6.27614 13.0847 6.5 12.8086 6.5L8.5157 6.5Z",
      fill: "currentColor"
    }, null, -1)
  ]));
}
const Vt = /* @__PURE__ */ D($t, [["render", It]]), Bt = {}, Rt = {
  width: "21",
  height: "20",
  viewBox: "0 0 21 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Tt(t, e) {
  return p(), m("svg", Rt, e[0] || (e[0] = [
    h("path", {
      d: "M8.60352 6L12.6035 10L8.60352 14",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ]));
}
const Et = /* @__PURE__ */ D(Bt, [["render", Tt]]), zt = {}, Ht = {
  width: "21",
  height: "20",
  viewBox: "0 0 21 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Wt(t, e) {
  return p(), m("svg", Ht, e[0] || (e[0] = [
    h("path", {
      d: "M12.3984 14L8.39844 10L12.3984 6",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ]));
}
const Dt = /* @__PURE__ */ D(zt, [["render", Wt]]), Pt = {}, At = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Ot(t, e) {
  return p(), m("svg", At, e[0] || (e[0] = [
    h("path", {
      d: "M12.5 1.66406L11.1783 2.94156C10.6233 3.47906 10.345 3.7474 10 3.7474C9.655 3.7474 9.37667 3.47906 8.82167 2.94156L7.5 1.66406M14.5833 5.83073C15.7533 5.83073 16.3392 5.83073 16.7592 6.11156C16.9412 6.23319 17.0975 6.3895 17.2192 6.57156C17.5 6.99156 17.5 7.5774 17.5 8.7474V15.4141C17.5 16.5841 17.5 17.1699 17.2192 17.5899C17.0975 17.772 16.9412 17.9283 16.7592 18.0499C16.3392 18.3307 15.7533 18.3307 14.5833 18.3307C13.4133 18.3307 12.8275 18.3307 12.4075 18.0499C12.2254 17.9283 12.0691 17.772 11.9475 17.5899C11.6667 17.1699 11.6667 16.5841 11.6667 15.4141V8.7474C11.6667 7.5774 11.6667 6.99156 11.9475 6.57156C12.0691 6.3895 12.2254 6.23319 12.4075 6.11156C12.8275 5.83073 13.4133 5.83073 14.5833 5.83073ZM5.41667 5.83073C6.58667 5.83073 7.1725 5.83073 7.5925 6.11156C7.77456 6.23319 7.93087 6.3895 8.0525 6.57156C8.33333 6.99156 8.33333 7.5774 8.33333 8.7474V15.4141C8.33333 16.5841 8.33333 17.1699 8.0525 17.5899C7.93087 17.772 7.77456 17.9283 7.5925 18.0499C7.1725 18.3307 6.58667 18.3307 5.41667 18.3307C4.24667 18.3307 3.66083 18.3307 3.24083 18.0499C3.05877 17.9283 2.90246 17.772 2.78083 17.5899C2.5 17.1699 2.5 16.5841 2.5 15.4141V8.7474C2.5 7.5774 2.5 6.99156 2.78083 6.57156C2.90246 6.3895 3.05877 6.23319 3.24083 6.11156C3.66083 5.83073 4.24667 5.83073 5.41667 5.83073Z",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ]));
}
const jt = /* @__PURE__ */ D(Pt, [["render", Ot]]), Nt = {}, Ft = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Zt(t, e) {
  return p(), m("svg", Ft, e[0] || (e[0] = [
    h("path", {
      d: "M8 3V5.2225M8 5.2225V10.7775M8 5.2225L9.875 4.25M8 5.2225L6.125 4.25M8 10.7775V13M8 10.7775L6.125 11.75M8 10.7775L9.875 11.75M13 8H10.7775M10.7775 8H5.2225M10.7775 8L11.75 9.875M10.7775 8L11.75 6.125M5.2225 8H3M5.2225 8L4.25 6.125M5.2225 8L4.25 9.875",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1),
    h("path", {
      d: "M12 14.7143L13.1151 15.6701C13.3268 15.8515 13.646 15.8247 13.8246 15.6105L16 13",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round"
    }, null, -1)
  ]));
}
const Ut = /* @__PURE__ */ D(Nt, [["render", Zt]]), Kt = {}, qt = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Xt(t, e) {
  return p(), m("svg", qt, e[0] || (e[0] = [
    h("path", {
      d: "M8 3V5.2225M8 5.2225V10.7775M8 5.2225L9.875 4.25M8 5.2225L6.125 4.25M8 10.7775V13M8 10.7775L6.125 11.75M8 10.7775L9.875 11.75M13 8H10.7775M10.7775 8H5.2225M10.7775 8L11.75 9.875M10.7775 8L11.75 6.125M5.2225 8H3M5.2225 8L4.25 6.125M5.2225 8L4.25 9.875",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1),
    h("path", {
      d: "M13 16L14.5 14.5M16 13L14.5 14.5M14.5 14.5L13 13M14.5 14.5L16 16",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round"
    }, null, -1)
  ]));
}
const Gt = /* @__PURE__ */ D(Kt, [["render", Xt]]), Yt = {}, Jt = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "60",
  height: "60",
  viewBox: "0 0 60 60",
  fill: "none"
};
function Qt(t, e) {
  return p(), m("svg", Jt, e[0] || (e[0] = [
    h("path", {
      d: "M24.195 7H18.625C17.1332 7 15.7024 7.59263 14.6475 8.64752C13.5926 9.70242 13 11.1332 13 12.625V46.375C13 47.8668 13.5926 49.2976 14.6475 50.3525C15.7024 51.4074 17.1332 52 18.625 52H41.125C42.6168 52 44.0476 51.4074 45.1025 50.3525C46.1574 49.2976 46.75 47.8668 46.75 46.375V29.5M24.195 7C27.3025 7 29.875 9.5175 29.875 12.625V18.25C29.875 19.7418 30.4676 21.1726 31.5225 22.2275C32.5774 23.2824 34.0082 23.875 35.5 23.875H41.125C42.6168 23.875 44.0476 24.4676 45.1025 25.5225C46.1574 26.5774 46.75 28.0082 46.75 29.5M24.195 7C33.42 7 46.75 20.4 46.75 29.5",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ]));
}
const en = /* @__PURE__ */ D(Yt, [["render", Qt]]), tn = {}, nn = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function on(t, e) {
  return p(), m("svg", nn, e[0] || (e[0] = [
    h("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M6.99479 8.75521C6.55276 8.75521 6.12884 8.57961 5.81628 8.26705C5.50372 7.95449 5.32812 7.53057 5.32812 7.08854C5.32812 6.64651 5.50372 6.22259 5.81628 5.91003C6.12884 5.59747 6.55276 5.42187 6.99479 5.42188C7.43682 5.42187 7.86074 5.59747 8.1733 5.91003C8.48586 6.22259 8.66146 6.64651 8.66146 7.08854C8.66146 7.53057 8.48586 7.95449 8.1733 8.26705C7.86074 8.57961 7.43682 8.75521 6.99479 8.75521ZM6.99479 14.5885C6.55276 14.5885 6.12884 14.4129 5.81628 14.1004C5.50372 13.7878 5.32812 13.3639 5.32812 12.9219C5.32812 12.4798 5.50372 12.0559 5.81628 11.7434C6.12884 11.4308 6.55276 11.2552 6.99479 11.2552C7.43682 11.2552 7.86074 11.4308 8.1733 11.7434C8.48586 12.0559 8.66146 12.4798 8.66146 12.9219C8.66146 13.3639 8.48586 13.7878 8.1733 14.1004C7.86074 14.4129 7.43682 14.5885 6.99479 14.5885Z",
      fill: "currentColor"
    }, null, -1),
    h("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M12.9948 8.75521C12.5528 8.75521 12.1288 8.57961 11.8163 8.26705C11.5037 7.95449 11.3281 7.53057 11.3281 7.08854C11.3281 6.64651 11.5037 6.22259 11.8163 5.91003C12.1288 5.59747 12.5528 5.42187 12.9948 5.42188C13.4368 5.42187 13.8607 5.59747 14.1733 5.91003C14.4859 6.22259 14.6615 6.64651 14.6615 7.08854C14.6615 7.53057 14.4859 7.95449 14.1733 8.26705C13.8607 8.57961 13.4368 8.75521 12.9948 8.75521ZM12.9948 14.5885C12.5528 14.5885 12.1288 14.4129 11.8163 14.1004C11.5037 13.7878 11.3281 13.3639 11.3281 12.9219C11.3281 12.4798 11.5037 12.0559 11.8163 11.7434C12.1288 11.4308 12.5528 11.2552 12.9948 11.2552C13.4368 11.2552 13.8607 11.4308 14.1733 11.7434C14.4859 12.0559 14.6615 12.4798 14.6615 12.9219C14.6615 13.3639 14.4859 13.7878 14.1733 14.1004C13.8607 14.4129 13.4368 14.5885 12.9948 14.5885Z",
      fill: "currentColor"
    }, null, -1)
  ]));
}
const ln = /* @__PURE__ */ D(tn, [["render", on]]), sn = {}, rn = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function an(t, e) {
  return p(), m("svg", rn, e[0] || (e[0] = [
    h("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M10.1667 5.83333C9.72464 5.83333 9.30072 5.65774 8.98816 5.34518C8.67559 5.03262 8.5 4.60869 8.5 4.16667C8.5 3.72464 8.67559 3.30072 8.98816 2.98816C9.30072 2.67559 9.72464 2.5 10.1667 2.5C10.6087 2.5 11.0326 2.67559 11.3452 2.98816C11.6577 3.30072 11.8333 3.72464 11.8333 4.16667C11.8333 4.60869 11.6577 5.03262 11.3452 5.34518C11.0326 5.65774 10.6087 5.83333 10.1667 5.83333ZM10.1667 11.6667C9.72464 11.6667 9.30072 11.4911 8.98816 11.1785C8.67559 10.8659 8.5 10.442 8.5 10C8.5 9.55797 8.67559 9.13405 8.98816 8.82149C9.30072 8.50893 9.72464 8.33333 10.1667 8.33333C10.6087 8.33333 11.0326 8.50893 11.3452 8.82149C11.6577 9.13405 11.8333 9.55797 11.8333 10C11.8333 10.442 11.6577 10.8659 11.3452 11.1785C11.0326 11.4911 10.6087 11.6667 10.1667 11.6667ZM10.1667 17.5C9.72464 17.5 9.30072 17.3244 8.98816 17.0118C8.67559 16.6993 8.5 16.2754 8.5 15.8333C8.5 15.3913 8.67559 14.9674 8.98816 14.6548C9.30072 14.3423 9.72464 14.1667 10.1667 14.1667C10.6087 14.1667 11.0326 14.3423 11.3452 14.6548C11.6577 14.9674 11.8333 15.3913 11.8333 15.8333C11.8333 16.2754 11.6577 16.6993 11.3452 17.0118C11.0326 17.3244 10.6087 17.5 10.1667 17.5Z",
      fill: "currentColor"
    }, null, -1)
  ]));
}
const cn = /* @__PURE__ */ D(sn, [["render", an]]), un = {}, dn = {
  width: "21",
  height: "20",
  viewBox: "0 0 21 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function pn(t, e) {
  return p(), m("svg", dn, e[0] || (e[0] = [
    h("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M6.33333 9.83333C6.33333 10.2754 6.15774 10.6993 5.84518 11.0118C5.53262 11.3244 5.10869 11.5 4.66667 11.5C4.22464 11.5 3.80072 11.3244 3.48816 11.0118C3.17559 10.6993 3 10.2754 3 9.83333C3 9.39131 3.17559 8.96738 3.48816 8.65482C3.80072 8.34226 4.22464 8.16667 4.66667 8.16667C5.10869 8.16667 5.53262 8.34226 5.84518 8.65482C6.15774 8.96738 6.33333 9.39131 6.33333 9.83333ZM12.1667 9.83333C12.1667 10.2754 11.9911 10.6993 11.6785 11.0118C11.3659 11.3244 10.942 11.5 10.5 11.5C10.058 11.5 9.63405 11.3244 9.32149 11.0118C9.00893 10.6993 8.83333 10.2754 8.83333 9.83333C8.83333 9.39131 9.00893 8.96738 9.32149 8.65482C9.63405 8.34226 10.058 8.16667 10.5 8.16667C10.942 8.16667 11.3659 8.34226 11.6785 8.65482C11.9911 8.96738 12.1667 9.39131 12.1667 9.83333ZM18 9.83333C18 10.2754 17.8244 10.6993 17.5118 11.0118C17.1993 11.3244 16.7754 11.5 16.3333 11.5C15.8913 11.5 15.4674 11.3244 15.1548 11.0118C14.8423 10.6993 14.6667 10.2754 14.6667 9.83333C14.6667 9.39131 14.8423 8.96738 15.1548 8.65482C15.4674 8.34226 15.8913 8.16667 16.3333 8.16667C16.7754 8.16667 17.1993 8.34226 17.5118 8.65482C17.8244 8.96738 18 9.39131 18 9.83333Z",
      fill: "currentColor"
    }, null, -1)
  ]));
}
const hn = /* @__PURE__ */ D(un, [["render", pn]]), mn = {}, vn = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function fn(t, e) {
  return p(), m("svg", vn, e[0] || (e[0] = [
    h("path", {
      d: "M6 14L10 10M10 10L14 6M10 10L6 6M10 10L14 14",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ]));
}
const _n = /* @__PURE__ */ D(mn, [["render", fn]]), gn = {}, Cn = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function wn(t, e) {
  return p(), m("svg", Cn, e[0] || (e[0] = [
    h("path", {
      d: "M9.31732 16.8976L7.50065 17.5026V10.4193L3.76732 6.3126C3.48852 6.00588 3.33403 5.60627 3.33398 5.19177V3.33594H16.6673V5.14594C16.6672 5.58793 16.4916 6.01178 16.179 6.32427L12.5007 10.0026V12.5026M12.5007 15.8359L14.1673 17.5026L17.5007 14.1693",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ]));
}
const kn = /* @__PURE__ */ D(gn, [["render", wn]]), bn = {}, yn = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function xn(t, e) {
  return p(), m("svg", yn, e[0] || (e[0] = [
    h("path", {
      d: "M11.4657 16.1809L7.50065 17.5026V10.4193L3.76732 6.3126C3.48852 6.00588 3.33403 5.60627 3.33398 5.19177V3.33594H16.6673V5.14594C16.6672 5.58793 16.4916 6.01178 16.179 6.32427L12.5007 10.0026V11.2526M18.334 18.3359L14.1673 14.1693M14.1673 18.3359L18.334 14.1693",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ]));
}
const Mn = /* @__PURE__ */ D(bn, [["render", xn]]), Ln = {}, $n = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Sn(t, e) {
  return p(), m("svg", $n, e[0] || (e[0] = [
    h("path", {
      d: "M9.4676 15.1809L5.5026 16.5026V9.41927L1.76927 5.3126C1.49048 5.00588 1.33598 4.60627 1.33594 4.19177V2.33594H14.6693V4.14594C14.6692 4.58793 14.4935 5.01178 14.1809 5.32427L10.5026 9.0026V10.2526",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1),
    h("path", {
      d: "M15.5 16.6591L13.857 17.9057C13.7756 17.9719 13.6868 18.0032 13.5906 17.9997C13.4944 17.9962 13.4093 17.9685 13.3353 17.9167C13.2613 17.865 13.204 17.7951 13.1635 17.7071C13.1229 17.6192 13.121 17.5236 13.1577 17.4203L13.7904 15.3795L12.1808 14.2433C12.092 14.1844 12.0365 14.1072 12.0143 14.0116C11.9921 13.916 11.9958 13.8277 12.0254 13.7468C12.055 13.6659 12.1068 13.5942 12.1808 13.5315C12.2548 13.4688 12.3436 13.4377 12.4472 13.438H14.4343L15.0782 11.3199C15.1152 11.217 15.1726 11.1378 15.2504 11.0825C15.3283 11.0272 15.4115 10.9997 15.5 11C15.5885 11.0003 15.6718 11.0279 15.75 11.083C15.8281 11.138 15.8854 11.217 15.9218 11.3199L16.5657 13.438H18.5528C18.6564 13.438 18.7452 13.4693 18.8192 13.5319C18.8932 13.5946 18.945 13.6662 18.9746 13.7468C19.0042 13.8274 19.0079 13.9157 18.9857 14.0116C18.9635 14.1075 18.908 14.1847 18.8192 14.2433L17.2096 15.3795L17.8423 17.4203C17.8793 17.5233 17.8775 17.6189 17.837 17.7071C17.7964 17.7954 17.739 17.8653 17.6647 17.9167C17.5904 17.9682 17.5053 17.9959 17.4094 17.9997C17.3135 18.0035 17.2247 17.9722 17.143 17.9057L15.5 16.6591Z",
      stroke: "currentColor",
      "stroke-width": "1.5"
    }, null, -1)
  ]));
}
const In = /* @__PURE__ */ D(Ln, [["render", Sn]]), Vn = {}, Bn = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Rn(t, e) {
  return p(), m("svg", Bn, e[0] || (e[0] = [
    Fe('<path d="M10.5 5.5H17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M10.5 10H17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M10.5 15H17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M3 15.083L4.042 16.125L7.167 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 6.083L4.042 7.125L7.167 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>', 5)
  ]));
}
const Tn = /* @__PURE__ */ D(Vn, [["render", Rn]]), En = {}, zn = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Hn(t, e) {
  return p(), m("svg", zn, e[0] || (e[0] = [
    h("path", {
      d: "M16.6673 5.83594L6.66732 5.83594M16.6673 5.83594L13.7507 8.7526M16.6673 5.83594L13.7507 2.91927M14.1673 14.1693L3.33398 14.1693M3.33398 14.1693L6.25065 17.0859M3.33398 14.1693L6.25065 11.2526",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ]));
}
const Wn = /* @__PURE__ */ D(En, [["render", Hn]]), Dn = {}, Pn = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function An(t, e) {
  return p(), m("svg", Pn, e[0] || (e[0] = [
    h("path", {
      d: "M11.1667 10.9167V9.66667L14.845 5.98833C15.1576 5.67585 15.3332 5.25199 15.3333 4.81V3H2V4.85583C2.00004 5.27033 2.15454 5.66994 2.43333 5.97667L6.16667 10.0833V17.1667C6.16667 17.1667 7.37495 16.7639 8.14917 16.5058",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1),
    h("path", {
      d: "M15.4116 11.3639L11.4924 15.283C11.4138 15.3616 11.3636 15.4642 11.3498 15.5746L11.0994 17.5789C11.059 17.9025 11.3341 18.1776 11.6577 18.1371L13.6622 17.8861C13.7725 17.8722 13.8751 17.8221 13.9537 17.7435L17.8724 13.8248C18.0676 13.6296 18.0676 13.313 17.8724 13.1177L16.1187 11.364C15.9234 11.1687 15.6068 11.1687 15.4116 11.3639Z",
      stroke: "currentColor",
      "stroke-width": "1.5"
    }, null, -1),
    h("path", {
      d: "M14 12L16.4608 14.4608",
      stroke: "currentColor",
      "stroke-width": "1.5"
    }, null, -1)
  ]));
}
const On = /* @__PURE__ */ D(Dn, [["render", An]]), jn = {}, Nn = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Fn(t, e) {
  return p(), m("svg", Nn, e[0] || (e[0] = [
    h("path", {
      d: "M6.2832 15.8359H3.3332C3.11222 15.8359 2.90029 15.7482 2.74404 15.5919C2.58778 15.4356 2.5 15.2237 2.5 15.0027V4.16954C2.49995 4.06009 2.52146 3.9517 2.56331 3.85056C2.60516 3.74943 2.66652 3.65753 2.7439 3.58012C2.82127 3.50271 2.91314 3.4413 3.01426 3.3994C3.11537 3.3575 3.22375 3.33594 3.3332 3.33594H16.6668C16.7763 3.33594 16.8846 3.3575 16.9857 3.3994C17.0869 3.4413 17.1787 3.50271 17.2561 3.58012C17.3335 3.65753 17.3948 3.74943 17.4367 3.85056C17.4785 3.9517 17.5001 4.06009 17.5 4.16954V15.0027C17.5 15.2237 17.4122 15.4356 17.256 15.5919C17.0997 15.7482 16.8878 15.8359 16.6668 15.8359H5.38347",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1),
    h("path", {
      d: "M6.66406 2.5V5M13.3305 2.5V5M8.33046 10.8332L9.16406 11.6668L11.6641 9.1668",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ]));
}
const Zn = /* @__PURE__ */ D(jn, [["render", Fn]]), Un = {}, Kn = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function qn(t, e) {
  return p(), m("svg", Kn, e[0] || (e[0] = [
    Fe('<circle cx="4.5" cy="12.5" r="1.5" stroke="currentColor" stroke-width="1.5"></circle><circle cx="9.5" cy="8.5" r="1.5" transform="rotate(-180 9.5 8.5)" stroke="currentColor" stroke-width="1.5"></circle><circle cx="14.5" cy="12.5" r="1.5" stroke="currentColor" stroke-width="1.5"></circle><path d="M4.55469 10.5V2" stroke="currentColor" stroke-width="1.5"></path><path d="M9.44531 9.5L9.44531 18" stroke="currentColor" stroke-width="1.5"></path><path d="M14.5547 10.5V2" stroke="currentColor" stroke-width="1.5"></path><path d="M4.55469 18V15.5" stroke="currentColor" stroke-width="1.5"></path><path d="M9.44531 2L9.44531 5.5" stroke="currentColor" stroke-width="1.5"></path><path d="M14.5547 18V15.5" stroke="currentColor" stroke-width="1.5"></path>', 9)
  ]));
}
const Xn = /* @__PURE__ */ D(Un, [["render", qn]]), Gn = {}, Yn = {
  width: "20",
  height: "20",
  viewBox: "0 0 20 20",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Jn(t, e) {
  return p(), m("svg", Yn, e[0] || (e[0] = [
    h("path", {
      d: "M9.4676 15.1809L5.5026 16.5026V9.41927L1.76927 5.3126C1.49048 5.00588 1.33598 4.60627 1.33594 4.19177V2.33594H14.6693V4.14594C14.6692 4.58793 14.4935 5.01178 14.1809 5.32427L10.5026 9.0026V10.2526",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1),
    h("path", {
      d: "M16 16.8926V11M13.0537 13.9463H18.9463",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)
  ]));
}
const Qn = /* @__PURE__ */ D(Gn, [["render", Jn]]), eo = {
  // arrow icons
  arrowDown: bt,
  arrowTop: Lt,
  arrowRight: Et,
  arrowLeft: Dt,
  arrowReload: Vt,
  // table icons
  columnInsert: jt,
  freeze: Ut,
  unfreeze: Gt,
  columnsMove: ln,
  empty: en,
  // actions icons
  listBullet: cn,
  listBulletHorizontal: hn,
  close: _n,
  // filter icons
  filterSave: kn,
  filterReset: Mn,
  filterNew: In,
  filterMultiselect: Tn,
  filterExchange: Wn,
  filterEdit: On,
  filterDateCheck: Zn,
  filterAdvanced: Xn,
  filterAdd: Qn
}, Y = /* @__PURE__ */ se({
  __name: "VIcon",
  props: {
    name: {}
  },
  setup(t) {
    const e = t, o = M(() => eo[e.name]);
    return (n, s) => o.value ? (p(), ae(Ze(o.value), { key: 0 })) : P("", !0);
  }
}), to = {}, no = { class: "vt-loader" };
function oo(t, e) {
  return p(), m("span", no);
}
const qe = /* @__PURE__ */ D(to, [["render", oo]]), lo = ["disabled", "type", "data-placement"], so = {
  key: 2,
  class: "vt-button__content"
}, Ce = /* @__PURE__ */ se({
  __name: "VButton",
  props: {
    type: { default: "default" },
    shape: {},
    disabled: { type: Boolean, default: !1 },
    loading: { type: Boolean, default: !1 },
    icon: {},
    tooltip: { type: Boolean, default: !1 },
    tooltipPlacement: { default: "top" },
    htmlType: { default: "button" }
  },
  emits: ["click"],
  setup(t, { emit: e }) {
    const o = t, n = e, s = Ue(), l = M(() => !!(o.icon && o.shape)), a = M(() => {
      var y, L;
      const c = s.default ? s.default({}) : null;
      return ((L = (y = c == null ? void 0 : c[0]) == null ? void 0 : y.children) == null ? void 0 : L.toString()) ?? "";
    }), r = M(() => [
      "vt-button",
      `vt-button--${o.type}`,
      {
        [`vt-button--${o.shape}`]: o.shape,
        "vt-button--icon-only": l.value,
        "vt-button--disabled": o.disabled || o.loading,
        "vt-button--loading": o.loading
      }
    ]), i = M(() => l.value && o.tooltip ? a.value : null), u = (c) => {
      !o.disabled && !o.loading && n("click", c);
    };
    return (c, y) => {
      const L = Ke("tooltip");
      return $e((p(), m("button", {
        class: W(r.value),
        disabled: o.disabled || o.loading,
        type: o.htmlType,
        "data-placement": o.tooltipPlacement,
        onClick: u
      }, [
        o.loading ? (p(), ae(qe, {
          key: 0,
          class: "vt-button__icon"
        })) : o.icon ? (p(), ae(Y, {
          key: 1,
          name: o.icon,
          class: "vt-button__icon"
        }, null, 8, ["name"])) : P("", !0),
        l.value ? P("", !0) : (p(), m("span", so, [
          pe(c.$slots, "default")
        ]))
      ], 10, lo)), [
        [L, i.value]
      ]);
    };
  }
}), ro = {
  key: 0,
  class: "vt-modal__header"
}, io = {
  key: 0,
  class: "vt-modal__title"
}, ao = { class: "vt-modal__content" }, Xe = /* @__PURE__ */ se({
  __name: "VModal",
  props: {
    modelValue: { type: Boolean },
    title: {},
    size: { default: "medium" },
    showCloseButton: { type: Boolean, default: !0 },
    closeOnBackdropClick: { type: Boolean, default: !0 },
    zIndex: { default: 1e3 }
  },
  emits: ["update:modelValue", "close"],
  setup(t, { emit: e }) {
    const o = t, n = e, s = M(() => ["vt-modal__container", `vt-modal__container--${o.size}`]), l = M(() => ({
      zIndex: o.zIndex
    })), a = () => {
      n("update:modelValue", !1), n("close");
    }, r = () => {
      o.closeOnBackdropClick && a();
    };
    return (i, u) => (p(), ae(ut, { to: "body" }, [
      i.modelValue ? (p(), m("div", {
        key: 0,
        class: "vt-modal__backdrop",
        style: re(l.value),
        onClick: r
      }, [
        h("div", {
          class: W(s.value),
          onClick: u[0] || (u[0] = he(() => {
          }, ["stop"]))
        }, [
          i.title || i.showCloseButton ? (p(), m("div", ro, [
            i.title ? (p(), m("h2", io, te(i.title), 1)) : P("", !0),
            i.showCloseButton ? (p(), ae(Y, {
              key: 1,
              name: "close",
              class: "vt-modal__close",
              onClick: a
            })) : P("", !0)
          ])) : P("", !0),
          h("div", ao, [
            pe(i.$slots, "default")
          ])
        ], 2)
      ], 4)) : P("", !0)
    ]));
  }
}), co = { class: "vt-pagination" }, uo = { class: "vt-pagination__info" }, po = { class: "vt-pagination__rows-per-page" }, ho = ["value"], mo = { class: "vt-pagination__navigation" }, vo = ["disabled"], fo = ["onClick"], _o = ["disabled"], go = /* @__PURE__ */ se({
  __name: "VPagination",
  props: {
    totalItems: {},
    pageSize: { default: 10 },
    currentPage: { default: 1 },
    pageSizeOptions: { default: () => [5, 10, 20, 50] },
    maxVisiblePages: { default: 6 }
  },
  emits: ["update:currentPage", "update:pageSize", "pageChange", "reloadData"],
  setup(t, { emit: e }) {
    const o = t, n = e, s = M({
      get: () => o.currentPage,
      set: ($) => n("update:currentPage", $)
    }), l = M({
      get: () => o.pageSize,
      set: ($) => n("update:pageSize", $)
    }), a = M(() => Math.ceil(o.totalItems / l.value)), r = M(() => o.totalItems === 0 ? 0 : (s.value - 1) * l.value + 1), i = M(() => Math.min(s.value * l.value, o.totalItems)), u = M(() => s.value <= 1), c = M(() => s.value >= a.value), y = M(() => {
      const $ = [], E = a.value, R = s.value, X = o.maxVisiblePages;
      if (E <= X)
        for (let x = 1; x <= E; x++)
          $.push(x);
      else {
        $.push(1);
        const x = Math.max(2, R - Math.floor(X / 2)), z = Math.min(E - 1, R + Math.floor(X / 2));
        x > 2 && $.push("...");
        for (let H = x; H <= z; H++)
          $.push(H);
        z < E - 1 && $.push("..."), E > 1 && $.push(E);
      }
      return $;
    }), L = () => {
      n("pageChange", {
        page: s.value,
        pageSize: l.value
      });
    }, q = ($) => {
      typeof $ == "number" && $ !== s.value && (s.value = $, L());
    }, F = () => {
      u.value || (s.value--, L());
    }, J = () => {
      c.value || (s.value++, L());
    }, ee = () => {
      s.value = 1, L();
    }, j = () => {
      n("reloadData", s.value);
    };
    return me(
      () => o.totalItems,
      () => {
        s.value > a.value && a.value > 0 && (s.value = a.value, L());
      }
    ), ($, E) => (p(), m("div", co, [
      h("div", uo, [
        h("div", po, [
          E[1] || (E[1] = h("label", {
            for: "rowsSelect",
            class: "vt-pagination__label"
          }, "Рядків на сторінку:", -1)),
          $e(h("select", {
            id: "rowsSelect",
            "onUpdate:modelValue": E[0] || (E[0] = (R) => l.value = R),
            onChange: ee,
            class: "vt-pagination__select"
          }, [
            (p(!0), m(oe, null, le($.pageSizeOptions, (R) => (p(), m("option", {
              key: R,
              value: R
            }, te(R), 9, ho))), 128))
          ], 544), [
            [dt, l.value]
          ])
        ]),
        h("span", null, te(r.value) + " - " + te(i.value) + " з " + te($.totalItems), 1)
      ]),
      h("div", mo, [
        h("button", {
          onClick: F,
          disabled: u.value,
          class: W({ "vt-pagination__nav-button": !0, "has-items": !u.value })
        }, [
          Z(Y, { name: "arrowLeft" })
        ], 10, vo),
        (p(!0), m(oe, null, le(y.value, (R) => (p(), m("button", {
          key: R,
          onClick: (X) => q(R),
          class: W(["vt-pagination__nav-button", {
            "vt-pagination__nav-button--active": R === s.value
          }])
        }, te(R), 11, fo))), 128)),
        h("button", {
          onClick: J,
          disabled: c.value,
          class: W({ "vt-pagination__nav-button": !0, "has-items": !c.value })
        }, [
          Z(Y, { name: "arrowRight" })
        ], 10, _o)
      ]),
      h("div", null, [
        Z(Ce, {
          icon: "arrowReload",
          shape: "circle",
          tooltip: "",
          tooltipPlacement: "left",
          onClick: j
        }, {
          default: Me(() => E[2] || (E[2] = [
            ge("Оновити дані ", -1)
          ])),
          _: 1,
          __: [2]
        })
      ])
    ]));
  }
}), Co = ["for"], wo = ["id", "name", "value", "checked", "disabled", "required", ".indeterminate"], ue = /* @__PURE__ */ se({
  __name: "VCheckbox",
  props: {
    modelValue: { type: Boolean, default: void 0 },
    checked: { type: Boolean, default: !1 },
    label: {},
    disabled: { type: Boolean, default: !1 },
    id: {},
    name: {},
    value: {},
    indeterminate: { type: Boolean, default: !1 },
    size: { default: "medium" },
    variant: { default: "primary" },
    required: { type: Boolean, default: !1 },
    isDouble: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue", "change", "focus", "blur"],
  setup(t, { emit: e }) {
    const o = t, n = e, s = () => `vt-checkbox-${Math.random().toString(36).substr(2, 9)}`, l = M(() => o.id || s()), a = M(() => o.modelValue ?? o.checked), r = (c) => {
      if (o.disabled) return;
      const L = c.target.checked;
      n("update:modelValue", L), n("change", L, c);
    }, i = (c) => {
      n("focus", c);
    }, u = (c) => {
      n("blur", c);
    };
    return (c, y) => (p(), m("label", {
      class: W([
        "vt-checkbox",
        `vt-checkbox--${c.size}`,
        `vt-checkbox--${c.variant}`,
        {
          "vt-checkbox--disabled": c.disabled,
          "vt-checkbox--double": c.isDouble
        }
      ]),
      for: l.value
    }, [
      h("input", {
        id: l.value,
        name: c.name,
        value: c.value,
        checked: a.value,
        disabled: c.disabled,
        required: c.required,
        ".indeterminate": c.indeterminate,
        type: "checkbox",
        class: "vt-checkbox__input",
        onChange: r,
        onFocus: i,
        onBlur: u
      }, null, 40, wo),
      h("div", {
        class: W([
          "vt-checkbox__box",
          {
            "vt-checkbox__box--checked": a.value && !c.indeterminate && !c.isDouble,
            "vt-checkbox__box--indeterminate": c.indeterminate,
            "vt-checkbox__box--double": c.isDouble && a.value,
            "vt-checkbox__box--disabled": c.disabled
          }
        ])
      }, [
        !c.indeterminate && !c.isDouble ? (p(), m("svg", {
          key: 0,
          class: W([
            "vt-checkbox__checkmark",
            {
              "vt-checkbox__checkmark--checked": a.value
            }
          ]),
          width: "10",
          height: "9",
          viewBox: "0 0 10 9",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        }, y[0] || (y[0] = [
          h("path", {
            d: "M1 5L3.58264 7.58264C3.80112 7.80112 4.16348 7.77113 4.34306 7.51971L9 1",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          }, null, -1)
        ]), 2)) : P("", !0),
        c.isDouble && a.value ? (p(), m("svg", {
          key: 1,
          class: W([
            "vt-checkbox__checkmark",
            {
              "vt-checkbox__checkmark--checked": a.value
            }
          ]),
          width: "13",
          height: "6",
          viewBox: "0 0 13 6",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        }, y[1] || (y[1] = [
          h("path", {
            d: "M6 3L8.25 5L12 1",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, null, -1),
          h("path", {
            d: "M1 3L3.25 5L7 1",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, null, -1)
        ]), 2)) : P("", !0),
        c.indeterminate ? (p(), m("div", {
          key: 2,
          class: W([
            "vt-checkbox__indeterminate-mark",
            {
              "vt-checkbox__indeterminate-mark--visible": c.indeterminate
            }
          ])
        }, null, 2)) : P("", !0)
      ], 2),
      c.label || c.$slots.label || c.$slots.default ? (p(), m("span", {
        key: 0,
        class: W([
          "vt-checkbox__label",
          {
            "vt-checkbox__label--disabled": c.disabled
          }
        ])
      }, [
        pe(c.$slots, "label", {}, () => [
          pe(c.$slots, "default", {}, () => [
            ge(te(c.label), 1)
          ])
        ])
      ], 2)) : P("", !0)
    ], 10, Co));
  }
});
function ko(t) {
  const e = M(() => [...t].sort((s, l) => s.pinnedLeft && !l.pinnedLeft ? -1 : !s.pinnedLeft && l.pinnedLeft || s.pinnedRight && !l.pinnedRight ? 1 : !s.pinnedRight && l.pinnedRight ? -1 : 0)), o = () => {
    const s = e.value.length, l = e.value.filter((c) => c.width || c.minWidth), a = l.reduce((c, y) => c + (y.width || y.minWidth || 0), 0), r = s - l.length;
    if (r === 0) return 150;
    const u = Math.max(800 - a, r * 80);
    return Math.max(Math.floor(u / r), 120);
  };
  return {
    sortedColumns: e,
    getDefaultColumnWidth: o,
    getStickyOffset: (s, l, a = !1) => {
      const r = e.value;
      let i = 0;
      if (s === "left") {
        a && (i += 50);
        for (let u = 0; u < l; u++) {
          const c = r[u];
          c.pinnedLeft && (i += c.width || c.minWidth || o());
        }
      } else
        for (let u = r.length - 1; u > l; u--) {
          const c = r[u];
          c.pinnedRight && (i += c.width || c.minWidth || o());
        }
      return i;
    }
  };
}
function bo(t) {
  const e = () => {
    const l = {};
    return t.maxHeight && (l.maxHeight = `${t.maxHeight}px`), l;
  }, o = (l, a, r, i) => {
    const u = {};
    if (l.width)
      u.width = `${l.width}px`, u.minWidth = `${l.width}px`, u.maxWidth = `${l.width}px`;
    else if (l.minWidth)
      u.minWidth = `${l.minWidth}px`, u.width = `${l.minWidth}px`, u.maxWidth = "none";
    else {
      const c = i();
      u.width = `${c}px`, u.minWidth = "80px", u.maxWidth = "none";
    }
    return l.pinnedLeft ? (u.position = "sticky", u.left = `${r("left", a, t.selectable)}px`, u.zIndex = "10") : l.pinnedRight && (u.position = "sticky", u.right = `${r("right", a, !1)}px`, u.zIndex = "10"), u;
  };
  return {
    getTableWrapperStyle: e,
    getColumnStyle: o,
    getHeaderStyle: (l, a, r, i) => {
      const u = o(l, a, r, i);
      return t.maxHeight && (u.position = "sticky", u.top = "0", l.pinnedLeft || l.pinnedRight ? u.zIndex = "12" : u.zIndex = "11"), u;
    },
    getFooterStyle: (l, a, r, i) => {
      const u = o(l, a, r, i);
      return t.maxHeight && (u.position = "sticky", u.bottom = "0", l.pinnedLeft || l.pinnedRight ? u.zIndex = "12" : u.zIndex = "11"), u;
    }
  };
}
function yo() {
  const t = O({
    resizingCol: null,
    startX: 0,
    startWidth: 0
  }), e = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><path d='M5 13L2 10L5 7' stroke='%23828282' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><path d='M15 7L18 10L15 13' stroke='%23828282' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><path d='M10 3L10 17' stroke='%23828282' stroke-width='3' stroke-linecap='round'/></svg>") 10 10, col-resize`;
  return {
    onMouseDown: (n, s, l, a) => {
      n.preventDefault(), n.stopPropagation(), t.value.resizingCol = s, t.value.startX = n.clientX, t.value.startWidth = s.width || s.minWidth || l(s.prop);
      const r = (u) => {
        const { resizingCol: c, startX: y, startWidth: L } = t.value;
        if (!c) return;
        document.querySelectorAll(`[data-resizer="${c.prop}"]`).forEach((j) => {
          j.classList.add("vt-table__resizer--active");
        });
        const q = u.clientX - y, F = c.minWidth || 50, J = c.maxWidth || 1e3, ee = Math.max(Math.min(L + q, J), F);
        c.width = ee;
      }, i = () => {
        const { resizingCol: u } = t.value;
        document.removeEventListener("mousemove", r), document.removeEventListener("mouseup", i), document.body.style.cursor = "", document.body.style.userSelect = "", document.body.classList.remove("vt-table-resizing"), u && (document.querySelectorAll(`[data-resizer="${u.prop}"]`).forEach((c) => {
          c.classList.remove("vt-table__resizer--active");
        }), a && u.width && a(u.width)), t.value.resizingCol = null;
      };
      document.addEventListener("mousemove", r), document.addEventListener("mouseup", i), document.body.style.cursor = e, document.body.style.userSelect = "none", document.body.classList.add("vt-table-resizing");
    },
    resizeState: t
  };
}
function xo(t, e, o, n) {
  var U;
  const s = t.selectionKey || "id", l = O([]), a = O(null), r = O(!1);
  (U = t.defaultSelection) != null && U.length && (l.value = [...t.defaultSelection]);
  const i = (C) => C[s], u = (C) => r.value ? !0 : l.value.some((w) => i(w) === i(C)), c = M(() => e.value.filter((C) => u(C)).length), y = M(() => e.value.length > 0 && c.value === e.value.length), L = M(() => {
    if (r.value) return !1;
    const C = c.value;
    return C > 0 && C < e.value.length;
  }), q = M(() => r.value ? !0 : y.value && !L.value), F = M(() => r.value), J = (C, w) => {
    const S = i(C), G = l.value.some((f) => i(f) === i(C)), d = w !== void 0 ? w : !G;
    if (r.value && !d) {
      r.value = !1, n != null && n.value && (l.value = n.value.filter((f) => i(f) !== S)), H(C, !1);
      return;
    }
    r.value && d || (d && !G ? l.value.push(C) : !d && G && (l.value = l.value.filter((f) => i(f) !== S)), t.selectOnClickRow && w === void 0 && X(d ? C : null), H(C, d));
  }, ee = () => {
    switch (j()) {
      case "none":
      case "partial":
        $();
        break;
      case "allVisible":
        E();
        break;
      case "absoluteAll":
        R();
        break;
    }
  }, j = () => r.value ? "absoluteAll" : y.value ? "allVisible" : c.value > 0 ? "partial" : "none", $ = () => {
    const C = [], w = new Set(l.value.map((S) => i(S)));
    l.value.forEach((S) => {
      C.push(S);
    }), e.value.forEach((S) => {
      w.has(i(S)) || C.push(S);
    }), l.value = C, r.value = !1, H();
  }, E = () => {
    r.value = !0, n != null && n.value ? l.value = [...n.value] : l.value = [...e.value], H(void 0, void 0, !0);
  }, R = () => {
    l.value = [], r.value = !1, a.value = null, H();
  }, X = (C) => {
    const w = a.value;
    a.value = C, o("current-change", {
      currentRow: a.value,
      oldCurrentRow: w
    });
  }, x = () => [...l.value], z = (C) => {
    l.value = [...C], r.value = !1, H();
  }, H = (C, w, S = !1) => {
    const G = {
      selection: [...l.value],
      row: C,
      selected: w,
      isAllSelected: S || r.value
    };
    o("selection-change", G);
  };
  return me(
    () => t.defaultSelection,
    (C) => {
      C != null && C.length && (l.value = [...C]);
    }
  ), {
    selectedRows: l,
    currentRow: a,
    isRowSelected: u,
    isAllSelected: q,
    isIndeterminate: L,
    isDoubleCheck: F,
    isFullSelection: r,
    toggleRowSelection: J,
    toggleAllSelection: ee,
    clearSelection: R,
    setCurrentRow: X,
    getSelectionRows: x,
    setSelectionRows: z,
    selectAbsolutelyAll: E
  };
}
function Mo(t, e) {
  if (!t)
    return String(e.value ?? "");
  try {
    const o = t(e);
    return o;
  } catch (o) {
    return console.error("Error rendering table slot:", o), String(e.value ?? "");
  }
}
const Lo = (t, e, o = "asc") => {
  if (t == null && e == null) return 0;
  if (t == null) return o === "asc" ? 1 : -1;
  if (e == null) return o === "asc" ? -1 : 1;
  if (t === e) return 0;
  let n = 0;
  const s = Number(t), l = Number(e);
  return !isNaN(s) && !isNaN(l) ? n = s - l : We(t) && We(e) ? n = new Date(t).getTime() - new Date(e).getTime() : typeof t == "boolean" && typeof e == "boolean" ? n = t === e ? 0 : t ? -1 : 1 : n = String(t).localeCompare(String(e), void 0, {
    numeric: !0,
    sensitivity: "base"
  }), o === "desc" ? -n : n;
}, We = (t) => t instanceof Date ? !isNaN(t.getTime()) : typeof t == "string" && /\d{4}-\d{2}-\d{2}|\//.test(t) ? !isNaN(new Date(t).getTime()) : !1, $o = (t, e, o) => {
  t.sortable && o({
    prop: t.prop,
    direction: e
  });
}, De = (t, e) => {
  const o = (e == null ? void 0 : e.prop) === t.prop, n = e == null ? void 0 : e.direction;
  return {
    asc: ["vt-th__sort-icon", o && n === "asc" && "vt-th__sortable-active"].filter(Boolean).join(" "),
    desc: ["vt-th__sort-icon", o && n === "desc" && "vt-th__sortable-active"].filter(Boolean).join(" ")
  };
}, So = (t, e, o) => {
  if (!e) return [...t];
  const n = o.find((l) => l.prop === e.prop);
  if (!(n != null && n.sortable)) return [...t];
  const s = n.sortMethod || Lo;
  return [...t].sort((l, a) => {
    const r = l[n.prop], i = a[n.prop];
    return s(r, i, e.direction);
  });
};
class Io {
  constructor() {
    this.modalStack = [], this.baseZIndex = 1e3;
  }
  open(e = {}) {
    const o = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, n = document.createElement("div");
    n.setAttribute("data-vt-modal", o), document.body.appendChild(n);
    const s = O(!0), l = this.baseZIndex + this.modalStack.length * 10, a = pt({
      setup() {
        const i = () => {
          s.value = !1, setTimeout(() => {
            ie.closeById(o);
          }, 100);
        };
        return () => ye(
          Xe,
          {
            modelValue: s.value,
            "onUpdate:modelValue": i,
            title: e.title,
            size: e.size || "medium",
            showCloseButton: e.showCloseButton !== !1,
            closeOnBackdropClick: e.closeOnBackdropClick !== !1,
            onClose: i,
            zIndex: l
          },
          {
            default: () => e.component ? ye(e.component, e.props || {}) : e.content ? ye("div", { innerHTML: e.content }) : null
          }
        );
      }
    });
    a.mount(n);
    const r = {
      id: o,
      app: a,
      container: n,
      isOpen: s
    };
    return this.modalStack.push(r), o;
  }
  close() {
    if (this.modalStack.length > 0) {
      const e = this.modalStack[this.modalStack.length - 1];
      this.closeById(e.id);
    }
  }
  closeById(e) {
    const o = this.modalStack.findIndex((n) => n.id === e);
    if (o !== -1) {
      const n = this.modalStack[o];
      this.cleanupModal(n), this.modalStack.splice(o, 1), this.recalculateZIndices();
    }
  }
  closeAll() {
    for (; this.modalStack.length > 0; ) {
      const e = this.modalStack.pop();
      e && this.cleanupModal(e);
    }
  }
  getOpenModalsCount() {
    return this.modalStack.length;
  }
  cleanupModal(e) {
    e.app && e.app.unmount(), e.container && e.container.parentNode && document.body.removeChild(e.container);
  }
  recalculateZIndices() {
  }
}
const ie = new Io(), Vo = {
  install(t) {
    t.config.globalProperties.$modal = ie, t.config.globalProperties.$modalStack = {
      closeAll: () => ie.closeAll(),
      getCount: () => ie.getOpenModalsCount(),
      closeById: (e) => ie.closeById(e)
    };
  }
}, Bo = { class: "vt-columns-selector-body" }, Ro = { class: "vt-columns-selector" }, To = { class: "vt-columns-selector__panel" }, Eo = ["draggable", "onDragstart", "onDragover", "onDrop"], zo = {
  key: 0,
  class: "vt-columns-selector__panel-item-pinned"
}, Ho = { class: "vt-columns-selector__available" }, Wo = ["onClick"], Do = {
  key: 0,
  class: "vt-columns-selector__group-columns"
}, Po = {
  key: 0,
  class: "vt-columns-selector__pinned-note"
}, Ao = { class: "vt-modal__content-button" }, Oo = /* @__PURE__ */ se({
  __name: "VTableColumnSelector",
  props: {
    columns: {},
    columnsSelector: { default: () => [] }
  },
  emits: ["update-columns"],
  setup(t, { emit: e }) {
    const o = t, n = e, s = O([]), l = O(/* @__PURE__ */ new Set()), a = O(-1), r = O(-1), i = O("before"), u = M(() => {
      const d = {};
      return o.columnsSelector.forEach((f) => {
        if (f.name === "removed")
          return;
        const g = f.columns.map((V) => V.prop), b = s.value.filter((V) => g.includes(V.prop));
        b.length === 0 ? d[f.name] = { checked: !1, indeterminate: !1 } : b.length === f.columns.length ? d[f.name] = { checked: !0, indeterminate: !1 } : d[f.name] = { checked: !1, indeterminate: !0 };
      }), d;
    }), c = M(() => o.columnsSelector.filter((d) => d.name !== "removed")), y = (d) => d.pinnedLeft || d.pinnedRight, L = (d) => !y(d), q = () => {
      const d = s.value;
      let f = -1;
      for (let b = 0; b < d.length; b++)
        d[b].pinnedLeft && (f = b);
      let g = d.length;
      for (let b = 0; b < d.length; b++)
        if (d[b].pinnedRight) {
          g = b;
          break;
        }
      return {
        minIndex: f + 1,
        maxIndex: g - 1
      };
    }, F = (d) => {
      const f = q();
      return !(d < f.minIndex || d > f.maxIndex + 1);
    }, J = (d, f) => {
      const g = s.value[f];
      if (!L(g)) {
        d.preventDefault();
        return;
      }
      a.value = f, d.dataTransfer && (d.dataTransfer.effectAllowed = "move", d.dataTransfer.setData("text/plain", g.prop)), document.body.style.cursor = "grabbing";
    }, ee = (d, f) => {
      if (a.value === -1) return;
      d.preventDefault();
      const g = d.currentTarget.getBoundingClientRect(), b = d.clientY, V = g.top + g.height / 2;
      let B = f, Q = "before";
      b < V ? (B = f, Q = "before") : (B = f + 1, Q = "after"), a.value < B && B--, F(B) ? (r.value = f, i.value = Q, d.dataTransfer.dropEffect = "move") : (r.value = -1, d.dataTransfer.dropEffect = "none");
    }, j = () => {
      setTimeout(() => {
        a.value === -1 && (r.value = -1);
      }, 50);
    }, $ = (d, f) => {
      if (d.preventDefault(), a.value === -1 || r.value === -1) {
        R();
        return;
      }
      const g = d.currentTarget.getBoundingClientRect(), b = d.clientY, V = g.top + g.height / 2;
      let B = f;
      if (b >= V && (B = f + 1), a.value < B && B--, !F(B) || B === a.value) {
        R();
        return;
      }
      const Q = [...s.value], [we] = Q.splice(a.value, 1);
      Q.splice(B, 0, we), s.value = Q, R();
    }, E = () => {
      R();
    }, R = () => {
      a.value = -1, r.value = -1, i.value = "before", document.body.style.cursor = "";
    }, X = (d) => {
      const f = ["vt-columns-selector__panel-item"];
      return a.value === d && f.push("vt-columns-selector__panel-item--dragging"), r.value === d && i.value === "before" && f.push("vt-columns-selector__panel-item--drop-before"), r.value === d && i.value === "after" && f.push("vt-columns-selector__panel-item--drop-after"), f;
    }, x = () => {
      s.value = [...o.columns.map((d) => ({ ...d }))], o.columnsSelector.forEach((d) => {
        d.name !== "removed" && l.value.add(d.name);
      });
    }, z = (d, f) => {
      if (f)
        s.value.some((g) => g.prop === d.prop) || s.value.push({ ...d });
      else {
        if (y(d))
          return;
        s.value = s.value.filter((g) => g.prop !== d.prop);
      }
    }, H = (d, f) => {
      if (f)
        d.columns.forEach((g) => {
          s.value.some((b) => b.prop === g.prop) || s.value.push({ ...g });
        });
      else {
        const g = [];
        d.columns.forEach((b) => {
          const V = s.value.find((B) => B.prop === b.prop);
          V && !y(V) && g.push(V);
        }), s.value = s.value.filter(
          (b) => !g.some((V) => V.prop === b.prop)
        );
      }
    }, U = (d) => s.value.some((f) => f.prop === d.prop), C = (d) => {
      const f = s.value.find((g) => g.prop === d.prop);
      return !f || !y(f);
    }, w = (d) => {
      l.value.has(d) ? l.value.delete(d) : l.value.add(d);
    }, S = () => {
      n("update-columns", [...s.value]), ie.close();
    }, G = () => {
      ie.close();
    };
    return ve(() => {
      x();
    }), (d, f) => (p(), m("div", Bo, [
      h("div", Ro, [
        h("div", To, [
          (p(!0), m(oe, null, le(s.value, (g, b) => (p(), m("div", {
            key: g.prop,
            class: W(X(b)),
            draggable: L(g),
            onDragstart: (V) => J(V, b),
            onDragover: (V) => ee(V, b),
            onDragleave: j,
            onDrop: (V) => $(V, b),
            onDragend: E
          }, [
            Z(Y, {
              name: L(g) ? "columnsMove" : "freeze",
              class: W(["vt-columns-selector__panel-item-icon", { "vt-columns-selector__panel-item-icon--draggable": L(g) }])
            }, null, 8, ["name", "class"]),
            Z(ue, {
              label: g.label,
              checked: !0,
              disabled: y(g),
              onChange: (V) => z(g, V),
              onClick: f[0] || (f[0] = he(() => {
              }, ["stop"]))
            }, null, 8, ["label", "disabled", "onChange"]),
            y(g) ? (p(), m("span", zo, "pinned")) : P("", !0)
          ], 42, Eo))), 128))
        ]),
        h("div", Ho, [
          (p(!0), m(oe, null, le(c.value, (g) => {
            var b, V;
            return p(), m("div", {
              key: g.name,
              class: "vt-columns-selector__group"
            }, [
              h("div", {
                class: "vt-columns-selector__group-header",
                onClick: (B) => w(g.name)
              }, [
                Z(ue, {
                  label: g.label,
                  checked: ((b = u.value[g.name]) == null ? void 0 : b.checked) || !1,
                  indeterminate: ((V = u.value[g.name]) == null ? void 0 : V.indeterminate) || !1,
                  onChange: (B) => H(g, B),
                  onClick: f[1] || (f[1] = he(() => {
                  }, ["stop"]))
                }, null, 8, ["label", "checked", "indeterminate", "onChange"]),
                g.icon ? (p(), ae(Y, {
                  key: 0,
                  name: g.icon,
                  class: "vt-columns-selector__group-icon"
                }, null, 8, ["name"])) : P("", !0)
              ], 8, Wo),
              l.value.has(g.name) ? (p(), m("div", Do, [
                (p(!0), m(oe, null, le(g.columns, (B) => (p(), m("div", {
                  key: B.prop,
                  class: "vt-columns-selector__group-column"
                }, [
                  Z(ue, {
                    label: B.label,
                    checked: U(B),
                    disabled: !C(B),
                    onChange: (Q) => z(B, Q)
                  }, null, 8, ["label", "checked", "disabled", "onChange"]),
                  C(B) ? P("", !0) : (p(), m("span", Po, " (закріплена) "))
                ]))), 128))
              ])) : P("", !0)
            ]);
          }), 128))
        ])
      ]),
      h("div", Ao, [
        Z(Ce, { onClick: G }, {
          default: Me(() => f[2] || (f[2] = [
            ge("Скасувати", -1)
          ])),
          _: 1,
          __: [2]
        }),
        Z(Ce, {
          type: "primary",
          onClick: S
        }, {
          default: Me(() => f[3] || (f[3] = [
            ge("Зберегти", -1)
          ])),
          _: 1,
          __: [3]
        })
      ])
    ]));
  }
}), jo = /* @__PURE__ */ se({
  __name: "ColumnActions",
  props: {
    column: {},
    allColumns: {},
    columnsSelector: {}
  },
  emits: ["pin", "update-columns"],
  setup(t, { emit: e }) {
    const o = t, n = e, s = O(), l = O(), a = O(), r = O(!1), i = O(!1), u = O([]), c = async () => {
      if (await ht(), !s.value || !l.value) return;
      const x = l.value.getBoundingClientRect(), z = s.value, H = z.offsetWidth, U = x.left + x.width / 2;
      z.style.top = `${x.bottom - 20}px`, z.style.left = `${U - H / 2}px`;
      const C = z.getBoundingClientRect();
      C.right > window.innerWidth && (z.style.left = `${window.innerWidth - H - 8}px`), C.left < 0 && (z.style.left = "8px");
    }, y = (x) => {
      x.stopPropagation(), !i.value && (r.value ? q() : L());
    }, L = () => {
      i.value || (r.value = !0, c(), a.value && (a.value.style.zIndex = "22"));
    }, q = () => {
      i.value = !0, r.value = !1, a.value && a.value.style.removeProperty("z-index"), setTimeout(() => {
        i.value = !1;
      }, 100);
    }, F = (x) => {
      var z, H;
      !((z = l.value) != null && z.contains(x.target)) && !((H = s.value) != null && H.contains(x.target)) && q();
    }, J = () => {
      X() ? (n("pin", o.column, "none"), console.log(`Колонка "${o.column.label}" відкріплена`)) : (n("pin", o.column, "left"), console.log(`Колонка "${o.column.label}" прикріплена зліва`)), q();
    }, ee = (x) => ({
      name: "removed",
      label: "Видалені колонки",
      order: 999,
      // Найвищий порядок, щоб відображались останніми
      columns: x
    }), j = (x) => {
      var w;
      const z = new Set(x.map((S) => S.prop)), H = /* @__PURE__ */ new Set();
      (w = o.columnsSelector) == null || w.forEach((S) => {
        S.columns.forEach((G) => H.add(G.prop));
      }), o.allColumns.forEach((S) => H.add(S.prop));
      const U = [];
      H.forEach((S) => {
        var G;
        if (!z.has(S)) {
          let d;
          (G = o.columnsSelector) == null || G.forEach((f) => {
            const g = f.columns.find((b) => b.prop === S);
            g && (d = g);
          }), d || (d = o.allColumns.find((f) => f.prop === S)), d && U.push(d);
        }
      });
      const C = [...o.columnsSelector || []];
      U.length > 0 && C.push(ee(U)), u.value = C;
    }, $ = () => {
      j(o.allColumns), ie.open({
        component: Oo,
        title: "Управління колонками таблиці",
        props: {
          columns: o.allColumns,
          // Передаємо всі колонки
          columnsSelector: u.value,
          // Передаємо оновлені доступні колонки
          "onUpdate-columns": (x) => {
            console.log("ColumnActions отримав оновлені колонки:", x), n("update-columns", x), j(x);
          }
        },
        size: "large",
        closeOnBackdropClick: !1
      }), q();
    }, E = () => o.column.pinnedLeft, R = () => o.column.pinnedRight, X = () => E() || R();
    return ve(() => {
      document.addEventListener("click", F), l.value && (a.value = l.value.closest("th")), j(o.allColumns);
    }), Se(() => {
      document.removeEventListener("click", F);
    }), (x, z) => (p(), m("div", {
      ref_key: "triggerRef",
      ref: l,
      class: "vt-table-header-actions",
      onClick: y
    }, [
      Z(Y, { name: "listBullet" }),
      r.value ? (p(), m("ul", {
        key: 0,
        ref_key: "menuRef",
        ref: s,
        class: W(["dropdown-menu", "vt-table-dropdown", { visible: r.value }])
      }, [
        h("li", { onClick: J }, [
          Z(Y, {
            name: X() ? "unfreeze" : "freeze"
          }, null, 8, ["name"]),
          h("span", null, te(X() ? "Розморозити" : "Заморозити"), 1)
        ]),
        h("li", { onClick: $ }, [
          Z(Y, { name: "columnInsert" }),
          z[0] || (z[0] = h("span", null, "Колонки", -1))
        ])
      ], 2)) : P("", !0)
    ], 512));
  }
}), No = { class: "vt-table" }, Fo = { class: "vt-th__content" }, Zo = { class: "vt-th__content" }, Uo = { class: "vt-th__label" }, Ko = {
  key: 0,
  class: "vt-th__sortable"
}, qo = ["data-resizer", "onMousedown"], Xo = {
  key: 0,
  class: "vt-table__empty-row"
}, Go = ["colspan"], Yo = { class: "vt-table__empty-content" }, Jo = { class: "vt-table__cell-content" }, Qo = { class: "vt-table__cell-content vt-table__cell-content--ellipsis" }, el = { key: 1 }, tl = ["data-resizer", "onMousedown"], nl = {
  key: 0,
  class: "vt-table__summary"
}, ol = { class: "vt-table__cell-content vt-table__cell-content--summary" }, xe = 50, ll = /* @__PURE__ */ se({
  __name: "VTable",
  props: /* @__PURE__ */ He({
    data: {},
    maxHeight: { default: void 0 },
    rowKey: { default: void 0 },
    defaultSort: {},
    showSummary: { type: Boolean, default: !1 },
    summaryMethod: {},
    columnsSelector: { default: () => [] },
    selectable: { type: Boolean, default: !1 },
    selectionKey: { default: "id" },
    defaultSelection: { default: () => [] },
    selectOnClickRow: { type: Boolean, default: !1 },
    highlightCurrentRow: { type: Boolean, default: !1 },
    allData: { default: void 0 },
    columns: { default: () => [] }
  }, {
    columns: {
      required: !1,
      default: void 0
    },
    columnsModifiers: {}
  }),
  emits: /* @__PURE__ */ He(["sort-change", "selection-change", "current-change", "row-click", "update:columns", "column-pin", "column-resize", "column-visibility", "column-sort", "columns-change", "infinity-scroll"], ["update:columns"]),
  setup(t, { expose: e, emit: o }) {
    const n = t, s = o, l = mt(t, "columns"), a = O({}), r = O(), i = vt([]), u = O(n.defaultSort || null), c = M(() => l.value !== void 0), y = M(() => n.data && n.data.length > 0), L = O(!1), q = O(0);
    let F;
    const J = (v, _) => n.rowKey && v[n.rowKey] != null ? `row_${v[n.rowKey]}` : `row_${_}`, ee = () => {
      c.value && l.value ? i.splice(0, i.length, ...l.value) : n.columns && n.columns.length > 0 && i.splice(0, i.length, ...n.columns);
    };
    me(
      () => l.value,
      (v) => {
        v && c.value && i.splice(0, i.length, ...v);
      },
      { deep: !0 }
    ), me(
      () => n.columns,
      (v) => {
        v && !c.value && i.splice(0, i.length, ...v);
      },
      { deep: !0 }
    ), ft("vt-table-columns", i);
    const { sortedColumns: j, getDefaultColumnWidth: $, getStickyOffset: E } = ko(i), { getTableWrapperStyle: R, getColumnStyle: X, getHeaderStyle: x, getFooterStyle: z } = bo(n), { onMouseDown: H } = yo(), U = M(() => So(n.data, u.value, i)), C = M(() => n.allData || n.data), w = n.selectable ? xo(n, U, s, C) : null, S = () => ({
      width: `${xe}px`,
      minWidth: `${xe}px`,
      maxWidth: `${xe}px`,
      left: "0px",
      position: "sticky",
      zIndex: 10
    }), G = () => {
      const v = S();
      return n.maxHeight ? {
        ...v,
        top: "0px",
        zIndex: 11
        // Вищий z-index для header
      } : v;
    }, d = () => {
      const v = S();
      return n.maxHeight ? {
        ...v,
        bottom: "0px",
        zIndex: 11
        // Вищий z-index для footer
      } : v;
    }, f = () => {
      if (!r.value || L.value) return;
      const v = r.value, _ = v.scrollTop, I = v.scrollHeight, T = v.clientHeight, A = 30;
      F && clearTimeout(F), F = setTimeout(() => {
        const fe = _ - q.value > 1, k = I - _ - T <= A, ne = I - _ - T <= 5;
        q.value = _, fe && (k || ne) && (L.value = !0, s("infinity-scroll"), setTimeout(() => {
          L.value = !1;
        }, 1e3));
      }, 50);
    }, g = () => {
      L.value = !1;
    };
    ve(() => {
      r.value && r.value.addEventListener("scroll", f);
    }), Se(() => {
      F && clearTimeout(F), r.value && r.value.removeEventListener("scroll", f);
    });
    const b = (v, _) => {
      $o(v, _, (I) => {
        var T, A;
        ((T = u.value) == null ? void 0 : T.prop) === v.prop && u.value.direction === _ ? u.value = null : u.value = I, s("sort-change", {
          column: v,
          direction: ((A = u.value) == null ? void 0 : A.direction) || null,
          prop: v.prop,
          sortedData: U.value
        });
      });
    }, V = (v, _) => {
      const I = {
        pinnedLeft: _ === "left",
        pinnedRight: _ === "right"
      };
      Q(v.prop, I), s("column-pin", { column: { ...v, ...I }, position: _ });
    }, B = (v) => {
      i.splice(0, i.length, ...v), c.value && (l.value = [...v]), s("columns-change", [...v]);
    }, Q = (v, _) => {
      const I = i.findIndex((T) => T.prop === v);
      if (I !== -1) {
        if (Object.assign(i[I], _), c.value && l.value) {
          const T = l.value.findIndex((A) => A.prop === v);
          if (T !== -1) {
            const A = [...l.value];
            A[T] = { ...A[T], ..._ }, l.value = A;
          }
        }
        s("columns-change", [...i]);
      } else
        console.error(
          "Колонку не знайдено:",
          v,
          "Доступні колонки:",
          i.map((T) => T.prop)
        );
    }, we = (v, _, I) => {
      s("row-click", { row: v, column: _, event: I }), n.highlightCurrentRow && w && w.setCurrentRow(v);
    }, Ge = (v, _, I) => {
      I.stopPropagation(), w && w.toggleRowSelection(_, v);
    }, Ye = (v, _) => {
      _.stopPropagation(), w && w.toggleAllSelection();
    }, Ie = (v, _) => {
      v && (a.value[_] = v);
    }, Ve = (v, _) => {
      const I = _.width || $();
      H(v, _, $, (T) => {
        Q(_.prop, { width: T }), s("column-resize", {
          column: { ..._, width: T },
          width: T,
          oldWidth: I
        });
      });
    }, Je = (v, _) => X(v, _, E, $), Qe = (v, _) => x(v, _, E, $), et = (v, _) => z(v, _, E, $), tt = (v, _) => {
      if (!_ || !_.prop) return "";
      const I = v[_.prop];
      return I == null ? "" : String(I);
    }, nt = M(() => {
      if (!n.showSummary || !y.value) return {};
      const v = i;
      if (typeof n.summaryMethod == "function") {
        const _ = n.summaryMethod({ columns: v, data: U.value });
        return v.reduce(
          (I, T, A) => (I[T.prop] = _[A], I),
          {}
        );
      }
      return v.reduce(
        (_, I) => {
          const T = U.value.map((A) => A[I.prop]);
          return _[I.prop] = T.every((A) => typeof A == "number") ? T.reduce((A, de) => A + de, 0) : "", _;
        },
        {}
      );
    }), ot = M(() => n.showSummary && y.value), lt = (v, _) => {
      w && w.toggleRowSelection(v, _);
    }, st = () => {
      w && w.toggleAllSelection();
    }, rt = () => {
      w && w.selectAbsolutelyAll();
    }, it = () => {
      w && w.clearSelection();
    }, at = () => w ? w.getSelectionRows() : [], ct = (v) => {
      w && w.setSelectionRows(v);
    };
    return ve(() => {
      ee();
    }), e({
      toggleRowSelection: lt,
      toggleAllSelection: st,
      selectAbsolutelyAll: rt,
      clearSelection: it,
      getSelectionRows: at,
      setSelectionRows: ct,
      resetInfinityScroll: g
      // Додаємо метод для скидання infinity scroll
    }), (v, _) => {
      var T, A, de, fe;
      const I = Ke("tooltip");
      return p(), m("div", {
        ref_key: "tableWrapperRef",
        ref: r,
        class: "vt-table-wrapper",
        style: re(K(R)()),
        onScroll: f
      }, [
        pe(v.$slots, "default"),
        h("table", No, [
          h("thead", null, [
            h("tr", null, [
              n.selectable ? (p(), m("th", {
                key: 0,
                class: W(["vt-table__th vt-table__th--selection", {
                  "vt-table__th--sticky": n.maxHeight,
                  "vt-table__th--pinned-left": !0
                }]),
                style: re(G())
              }, [
                h("div", Fo, [
                  Z(ue, {
                    checked: (T = K(w)) == null ? void 0 : T.isAllSelected.value,
                    indeterminate: (A = K(w)) == null ? void 0 : A.isIndeterminate.value,
                    "is-double": (fe = (de = K(w)) == null ? void 0 : de.isDoubleCheck) == null ? void 0 : fe.value,
                    onChange: Ye
                  }, null, 8, ["checked", "indeterminate", "is-double"])
                ])
              ], 6)) : P("", !0),
              (p(!0), m(oe, null, le(K(j), (k, ne) => (p(), m("th", {
                key: k.prop,
                ref_for: !0,
                ref: (ce) => Ie(ce, k.prop),
                style: re(Qe(k, ne)),
                class: W([
                  "vt-table__th",
                  {
                    "vt-table__th--sticky": n.maxHeight,
                    "vt-table__th--pinned-left": k.pinnedLeft,
                    "vt-table__th--pinned-right": k.pinnedRight,
                    "vt-table__th--sortable": k.sortable
                  }
                ])
              }, [
                h("div", Zo, [
                  h("div", Uo, te(k.label), 1),
                  k.sortable ? (p(), m("div", Ko, [
                    Z(Y, {
                      name: "arrowTop",
                      class: W(K(De)(k, u.value).asc),
                      onClick: he((ce) => b(k, "asc"), ["stop"])
                    }, null, 8, ["class", "onClick"]),
                    Z(Y, {
                      name: "arrowDown",
                      class: W(K(De)(k, u.value).desc),
                      onClick: he((ce) => b(k, "desc"), ["stop"])
                    }, null, 8, ["class", "onClick"])
                  ])) : P("", !0),
                  k.actionColumn ? (p(), ae(jo, {
                    key: 1,
                    column: k,
                    "all-columns": K(j),
                    columnsSelector: n.columnsSelector,
                    onPin: V,
                    onUpdateColumns: B
                  }, null, 8, ["column", "all-columns", "columnsSelector"])) : P("", !0)
                ]),
                h("div", {
                  class: "vt-table__resizer",
                  "data-resizer": k.prop,
                  onMousedown: (ce) => Ve(ce, k)
                }, null, 40, qo)
              ], 6))), 128))
            ])
          ]),
          h("tbody", null, [
            y.value ? (p(!0), m(oe, { key: 1 }, le(U.value, (k, ne, ce, _e) => {
              var Te, Ee, ze;
              const Be = [n.rowKey ? k[n.rowKey] : ne];
              if (_e && _e.key === J(k, ne) && _t(_e, Be)) return _e;
              const Re = (p(), m("tr", {
                key: J(k, ne),
                class: W([
                  "vt-table__row",
                  {
                    "vt-table__row--selected": (Te = K(w)) == null ? void 0 : Te.isRowSelected(k),
                    "vt-table__row--current": ((Ee = K(w)) == null ? void 0 : Ee.currentRow.value) === k,
                    "vt-table__row--clickable": n.selectOnClickRow || n.highlightCurrentRow
                  }
                ]),
                onClick: (N) => we(k, K(j)[0], N)
              }, [
                n.selectable ? (p(), m("td", {
                  key: 0,
                  class: W(["vt-table__td vt-table__td--selection", {
                    "vt-table__td--pinned-left": !0
                  }]),
                  style: re(S())
                }, [
                  h("div", Jo, [
                    Z(ue, {
                      checked: (ze = K(w)) == null ? void 0 : ze.isRowSelected(k),
                      onChange: (N, ke) => Ge(N, k, ke)
                    }, null, 8, ["checked", "onChange"])
                  ])
                ], 4)) : P("", !0),
                (p(!0), m(oe, null, le(K(j), (N, ke) => (p(), m("td", {
                  key: N.prop,
                  ref_for: !0,
                  ref: (be) => Ie(be, N.prop),
                  style: re(Je(N, ke)),
                  class: W([
                    "vt-table__td",
                    {
                      "vt-table__td--pinned-left": N.pinnedLeft,
                      "vt-table__td--pinned-right": N.pinnedRight
                    }
                  ])
                }, [
                  $e((p(), m("div", Qo, [
                    N.renderSlot ? (p(), ae(Ze(() => K(Mo)(N.renderSlot, { row: k, column: N, value: k[N.prop], index: ne })), { key: 0 })) : (p(), m("span", el, te(k[N.prop]), 1))
                  ])), [
                    [I, N.showOverflowTooltip ? tt(k, N) : null]
                  ]),
                  h("div", {
                    class: "vt-table__resizer",
                    "data-resizer": N.prop,
                    onMousedown: (be) => Ve(be, N)
                  }, null, 40, tl)
                ], 6))), 128))
              ], 10, ["onClick"]));
              return Re.memo = Be, Re;
            }, _, 0), 128)) : (p(), m("tr", Xo, [
              h("td", {
                colspan: K(j).length + (n.selectable ? 1 : 0),
                class: "vt-table__empty-cell"
              }, [
                h("div", Yo, [
                  Z(Y, {
                    name: "empty",
                    class: "vt-table__empty-icon"
                  }),
                  _[2] || (_[2] = h("span", { class: "vt-table__empty-text" }, "Немає даних!", -1))
                ])
              ], 8, Go)
            ]))
          ]),
          ot.value ? (p(), m("tfoot", nl, [
            h("tr", null, [
              n.selectable ? (p(), m("td", {
                key: 0,
                class: W(["vt-table__td", {
                  "vt-table__td--pinned-left": !0
                }]),
                style: re(d())
              }, _[3] || (_[3] = [
                h("div", { class: "vt-table__cell-content vt-table__cell-content--summary" }, null, -1)
              ]), 4)) : P("", !0),
              (p(!0), m(oe, null, le(K(j), (k, ne) => (p(), m("td", {
                key: k.prop,
                style: re(et(k, ne)),
                class: W([
                  "vt-table__td",
                  {
                    "vt-table__td--pinned-left": k.pinnedLeft,
                    "vt-table__td--pinned-right": k.pinnedRight
                  }
                ])
              }, [
                h("div", ol, te(nt.value[k.prop]), 1)
              ], 6))), 128))
            ])
          ])) : P("", !0)
        ])
      ], 36);
    };
  }
}), sl = /* @__PURE__ */ se({
  __name: "VTableColumn",
  props: {
    prop: {},
    label: {},
    width: {},
    minWidth: {},
    maxWidth: {},
    sortable: { type: Boolean, default: !0 },
    pinnedLeft: { type: Boolean, default: !1 },
    pinnedRight: { type: Boolean, default: !1 },
    actionColumn: { type: Boolean, default: !0 },
    showOverflowTooltip: { type: Boolean, default: !0 },
    selectable: { type: Boolean, default: !0 },
    renderSlot: {},
    sortMethod: {}
  },
  setup(t) {
    const e = t, o = Ue(), n = gt("vt-table-columns");
    n || console.error(
      "VTableColumn: не знайдено контекст таблиці. Переконайтеся, що компонент використовується всередині VTable."
    );
    const s = () => ({
      prop: e.prop,
      label: e.label,
      width: e.width,
      minWidth: e.minWidth,
      maxWidth: e.maxWidth,
      sortable: e.sortable,
      pinnedLeft: e.pinnedLeft,
      pinnedRight: e.pinnedRight,
      actionColumn: e.actionColumn,
      showOverflowTooltip: e.showOverflowTooltip,
      selectable: e.selectable,
      // Зберігаємо слот - пріоритет: назва колонки -> default -> slot
      renderSlot: o[e.prop] ?? o.default ?? o.slot
    });
    let l = -1;
    return ve(() => {
      if (n) {
        const a = s();
        n.push(a), l = n.length - 1;
      }
    }), me(
      () => [
        e.width,
        e.minWidth,
        e.maxWidth,
        e.sortable,
        e.pinnedLeft,
        e.pinnedRight,
        e.actionColumn,
        e.showOverflowTooltip,
        e.selectable,
        e.label
      ],
      () => {
        if (n && l !== -1) {
          const a = n.findIndex((r) => r.prop === e.prop);
          if (a !== -1) {
            const r = n[a], i = {
              ...s(),
              renderSlot: r.renderSlot
              // Зберігаємо існуючий renderSlot
            };
            n[a] = i;
          }
        }
      },
      { deep: !0 }
    ), Se(() => {
      if (n) {
        const a = n.findIndex((r) => r.prop === e.prop);
        a > -1 && n.splice(a, 1);
      }
    }), (a, r) => null;
  }
}), Pe = (t, e) => {
  const o = document.createElement("div");
  o.className = `vt-tooltip vt-tooltip--${e}`, o.innerText = t, Object.assign(o.style, {
    position: "absolute",
    background: "rgba(0, 0, 0, 0.8)",
    color: "white",
    padding: "8px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    lineHeight: "1.4",
    zIndex: "9999",
    pointerEvents: "none",
    visibility: "hidden",
    opacity: "0",
    transition: "opacity 0.2s ease, visibility 0.2s ease",
    maxWidth: "300px",
    minWidth: "max-content",
    wordWrap: "break-word",
    whiteSpace: "normal",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
  }), t.length < 50 && (o.style.whiteSpace = "nowrap");
  const n = document.createElement("div");
  switch (n.className = "vt-tooltip__arrow", Object.assign(n.style, {
    position: "absolute",
    width: "0",
    height: "0",
    borderStyle: "solid"
  }), e) {
    case "top":
      Object.assign(n.style, {
        top: "100%",
        left: "50%",
        marginLeft: "-5px",
        borderWidth: "5px 5px 0 5px",
        borderColor: "rgba(0, 0, 0, 0.8) transparent transparent transparent"
      });
      break;
    case "bottom":
      Object.assign(n.style, {
        bottom: "100%",
        left: "50%",
        marginLeft: "-5px",
        borderWidth: "0 5px 5px 5px",
        borderColor: "transparent transparent rgba(0, 0, 0, 0.8) transparent"
      });
      break;
    case "left":
      Object.assign(n.style, {
        top: "50%",
        left: "100%",
        marginTop: "-5px",
        borderWidth: "5px 0 5px 5px",
        borderColor: "transparent transparent transparent rgba(0, 0, 0, 0.8)"
      });
      break;
    case "right":
      Object.assign(n.style, {
        top: "50%",
        right: "100%",
        marginTop: "-5px",
        borderWidth: "5px 5px 5px 0",
        borderColor: "transparent rgba(0, 0, 0, 0.8) transparent transparent"
      });
      break;
  }
  return o.appendChild(n), o;
}, Le = (t, e, o) => {
  const n = e.getBoundingClientRect(), s = t.getBoundingClientRect(), l = window.pageXOffset || document.documentElement.scrollLeft, a = window.pageYOffset || document.documentElement.scrollTop;
  let r = 0, i = 0;
  switch (o) {
    case "top":
      r = n.top + a - s.height - 8, i = n.left + l + (n.width - s.width) / 2;
      break;
    case "bottom":
      r = n.bottom + a + 8, i = n.left + l + (n.width - s.width) / 2;
      break;
    case "left":
      r = n.top + a + (n.height - s.height) / 2, i = n.left + l - s.width - 8;
      break;
    case "right":
      r = n.top + a + (n.height - s.height) / 2, i = n.right + l + 8;
      break;
  }
  const u = window.innerWidth, c = window.innerHeight;
  i < 8 ? i = 8 : i + s.width > u - 8 && (i = u - s.width - 8), r < a + 8 ? o === "top" ? r = n.bottom + a + 8 : r = a + 8 : r + s.height > a + c - 8 && (o === "bottom" ? r = n.top + a - s.height - 8 : r = a + c - s.height - 8), t.style.top = `${r}px`, t.style.left = `${i}px`;
}, Ae = (t, e, o) => {
  t.parentElement || document.body.appendChild(t), t.style.visibility = "visible", Le(t, e, o), requestAnimationFrame(() => {
    t.style.opacity = "1";
  });
}, Oe = (t) => {
  t.style.opacity = "0", t.style.visibility = "hidden";
}, je = (t) => t.scrollWidth > t.clientWidth || t.scrollHeight > t.clientHeight, Ne = (t) => !!t.closest(".vt-table, table"), rl = {
  mounted(t, e) {
    var i;
    const o = (i = e.value) == null ? void 0 : i.trim();
    if (!o) return;
    const n = t.dataset.placement || "top", s = Pe(o, n);
    t.__tooltipEl = s;
    const l = () => {
      (Ne(t) ? je(t) : !0) && Ae(s, t, n);
    }, a = () => {
      Oe(s);
    }, r = () => {
      s.style.opacity === "1" && Le(s, t, n);
    };
    t.__mouseenterHandler = l, t.__mouseleaveHandler = a, t.__scrollHandler = r, t.addEventListener("mouseenter", l), t.addEventListener("mouseleave", a), window.addEventListener("scroll", r, !0), window.addEventListener("resize", r);
  },
  updated(t, e) {
    var n;
    const o = (n = e.value) == null ? void 0 : n.trim();
    if (t.__tooltipEl)
      o ? t.__tooltipEl.firstChild.textContent = o : (t.__tooltipEl.parentElement && t.__tooltipEl.parentElement.removeChild(t.__tooltipEl), delete t.__tooltipEl);
    else if (o) {
      const s = t.dataset.placement || "top", l = Pe(o, s);
      t.__tooltipEl = l;
      const a = () => {
        (Ne(t) ? je(t) : !0) && Ae(l, t, s);
      }, r = () => {
        Oe(l);
      }, i = () => {
        l.style.opacity === "1" && Le(l, t, s);
      };
      t.__mouseenterHandler = a, t.__mouseleaveHandler = r, t.__scrollHandler = i, t.addEventListener("mouseenter", a), t.addEventListener("mouseleave", r), window.addEventListener("scroll", i, !0), window.addEventListener("resize", i);
    }
  },
  beforeUnmount(t) {
    t.__tooltipEl && t.__tooltipEl.parentElement && (t.__tooltipEl.parentElement.removeChild(t.__tooltipEl), delete t.__tooltipEl), t.__mouseenterHandler && (t.removeEventListener("mouseenter", t.__mouseenterHandler), delete t.__mouseenterHandler), t.__mouseleaveHandler && (t.removeEventListener("mouseleave", t.__mouseleaveHandler), delete t.__mouseleaveHandler), t.__scrollHandler && (window.removeEventListener("scroll", t.__scrollHandler, !0), window.removeEventListener("resize", t.__scrollHandler), delete t.__scrollHandler);
  }
}, cl = {
  sortable: !0,
  actionColumn: !1,
  showOverflowTooltip: !0,
  visible: !0,
  pinnedLeft: !1,
  pinnedRight: !1
}, il = {
  install(t, e = {}) {
    const { prefix: o = "V", modal: n = !0 } = e;
    t.component(`${o}Button`, Ce), t.component(`${o}Icon`, Y), t.component(`${o}Loader`, qe), t.component(`${o}Modal`, Xe), t.component(`${o}Pagination`, go), t.component(`${o}Checkbox`, ue), t.component(`${o}Table`, ll), t.component(`${o}TableColumn`, sl), t.directive("tooltip", rl), n && t.use(Vo);
  }
}, ul = il.install;
export {
  cl as DEFAULT_COLUMN_CONFIG,
  Ce as VButton,
  ue as VCheckbox,
  Y as VIcon,
  qe as VLoader,
  Xe as VModal,
  Vo as VModalPlugin,
  go as VPagination,
  ll as VTable,
  sl as VTableColumn,
  il as default,
  ul as install,
  ie as modalManager,
  rl as tooltipDirective
};
