// const menu = [
//   {title:'介绍',to:'#intr'},
//   {title:'舞台-Stage',to:'#stage'},
//   {title:'精灵-Sprite',to:'#sprite'},
//   {title:'动画-MoveClip',to:'#moveclip'},
//   {title:'动画-Bitmap',to:'#bitmap'},
// ]

const sections = document.querySelectorAll("section[id]");
const menu = [...sections].map((o) => {
  const sub = [...o.querySelectorAll("h4")];
  return {
    title: o.querySelector("h3").innerText,
    to: `#${o.id}`,
    children: sub.map((so) => {
      return {
        title: so.innerText,
        to: `#${so.id}`,
      };
    }),
  };
});
console.log(menu);

function renderMenu(menu) {
  return menu
    .map((o) => {
      return `<li>
    <a href="${o.to}">${o.title}</a>

    <ul class='menu'>${renderMenu(o.children || [])}</ul>
    </li>`;
    })
    .join("");
}
document.querySelector("nav > ul").innerHTML = renderMenu(menu);
