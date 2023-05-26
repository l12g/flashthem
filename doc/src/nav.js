function renderMenu(menu, p) {
  return menu
    .map((o) => {
      const ps = [p, o.to].filter(Boolean).join("_");
      return `<li data-path="${ps}">
    <a href="${o.to}">${o.title}</a>

    <ul class='menu'>${renderMenu(o.children || [], o.to)}</ul>
    </li>`;
    })
    .join("");
}

export default function () {
  const sections = document.querySelectorAll("section[id]");
  const menu = [...sections].map((o) => {
    const sub = [...o.querySelectorAll("h4")];
    return {
      title: o.querySelector("h2").innerText,
      to: `#${o.id}`,
      children: sub.map((so) => {
        return {
          title: so.innerText,
          to: `#${so.id}`,
        };
      }),
    };
  });
  document.querySelector("nav > ul").innerHTML = renderMenu(menu);

  window.addEventListener("hashchange", (ev) => {
    const lis = [...document.querySelectorAll(".menu li")];
    lis.forEach((o) => o.classList.remove("active"));

    const alis = [
      ...document.querySelectorAll(`[data-path*='${location.hash}']`),
    ];
    alis.forEach((o) => {
      o.classList.add("active");
    });
  });
}
