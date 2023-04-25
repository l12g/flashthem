const menu = [
  {title:'介绍',to:'#intr'},
  {title:'舞台-Stage',to:'#stage'},
  {title:'精灵-Sprite',to:'#sprite'},
  {title:'动画-MoveClip',to:'#moveclip'},
  {title:'动画-Bitmap',to:'#bitmap'},
]

const navMenu = document.querySelector('nav ul');
navMenu.innerHTML = menu.map(o=>{
  return `<li><a href="${o.to}">${o.title}</a></li>`
}).join('')