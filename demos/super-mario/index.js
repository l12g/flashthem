const { Stage, Sprite, Event, Bitmap, TextField, MovieClip, Rect } = flashthem;

const stage = new Stage(document.querySelector("#canvas"));
const bg = new Bitmap("./assets/world.gif");
bg.pivotX = 0;
bg.pivotY = 0;
stage.addChild(bg);
// bg.on("load", () => {
//   bg.y = stage.height - bg.height;
// });
const hero = new Rect(30, 50, "red");
stage.addChild(hero);
hero.y = 100;

const ctrl = createController({hero});
stage.on("enter-frame", () => {
  ctrl.update();
});

function createController({hero}) {
  const ground=325;
  let vy=0;
  let vx=0;
  let onGround = true;
  const arrowKeys = [];
  document.addEventListener("keydown", (e) => {
    if (/left|right/gi.test(e.key) && !arrowKeys.includes(e.key)) {
      arrowKeys.push(e.key);
    }
    if (/up/gi.test(e.key) && onGround) {
      onGround = false;
      vy=-15;
    }
  });
  document.addEventListener("keyup", (e) => {
    if (/left|right/gi.test(e.key)) {
      const idx = arrowKeys.indexOf(e.key);
      idx >= 0 && arrowKeys.splice(idx, 1);
    }
  });

  const getDir=()=>{
    const last = arrowKeys[arrowKeys.length - 1];
    if (!last) {
      return 0;
    }
    if (/left/gi.test(last)) {
      return -1;
    }
    if (/right/gi.test(last)) {
      return 1;
    }
  }
  return {
    update() {
      const dir =getDir();
      if(dir===0){
        vx*=.9;
      }else{
        vx=dir*10;
      }
      vy+=.98;
      hero.x+=vx;
      hero.y+=vy;

      if(hero.y>=ground){
        hero.y=ground;
        onGround=true;
        isJump=false;
      }
    },
    isJump() {
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] === "ArrowUp") {
          return true;
        }
      }
      return false;
    },
    dir() {
      const last = arrowKeys[arrowKeys.length - 1];
      if (!last) {
        return 0;
      }
      if (/left/gi.test(last)) {
        return -1;
      }
      if (/right/gi.test(last)) {
        return 1;
      }
    },
  };
}
