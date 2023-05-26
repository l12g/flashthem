// var MarkdownIt = require('markdown-it'),

import mdt from "markdown-it";
const md = new mdt("default", {
  html: true,
});
console.log(Object.keys(md.renderer.rules));
const path = require("path");
const fs = require("fs");

const regxp = /\/\/hides[\w\W]+?\/\/hidee/g;

md.use(require("markdown-it-container"), "custom_code", {
  validate(params) {
    const [name, file] = params.trim().split(" ");
    return name === "demo";
  },
  render(tokens, idx) {
    const token = tokens[idx];
    console.log(token);

    if (tokens[idx].nesting === 1) {
      const [, file] = token.info.trim().split(" ");
      const ct = fs.readFileSync(`${process.cwd()}/doc/${file}`, {
        encoding: "utf8",
      });
      const code = ct.replace(regxp, "");

      return `<div class="d-flex demo-block">
      <div class="d-flex__item demo-block-code"><pre><code>${code}</code></pre></div>
      <div><canvas width="400" height="300" id="${path
        .basename(file)
        .replace(path.extname(file), "")}"/></div>
      `;
    } else {
      return "</div>";
    }
  },
});
export default function mdplugin() {
  return {
    name: "mdplugin",
    transform(code, id) {
      if (id.endsWith("md")) {
        id = path.basename(id);
        const html = `\`${md.render(code)}\``;
        return `export default {id:'${id}',html:${html}}`;
      }
      // const dir = path.dirname(id);
      // if(dir.endsWith('demo')){
      //   return code;
      // }
      return null;
    },
  };
}
