// import './code';
// import "./demos/basic";
// import "./demos/bitmap";
// import "./demos/mc";
// import "./demos/sprite";
// import "./nav";
import hlt from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import "./styles/index.scss";

import renderNav from "./nav";
import basic from "./sections/basic.md";
import demos from "./sections/demos.md";
import intr from "./sections/intr.md";

const wrap = document.querySelector("#app-content");

wrap.innerHTML = [intr, basic, demos]
  .map((o) => `<section id="${o.id}">${o.html}</section>`)
  .join("");

setTimeout(renderNav, 0);

hlt.highlightAll();

import("./demos/basic");
import("./demos/text");
import("./demos/bitmap");
import("./demos/mc");
import("./demos/int");
