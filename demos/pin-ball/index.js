const stage = new flashthem.Stage('#canvas', 1);
stage.debug = true;
const player = new flashthem.Rect(100, 10, '#fff');
player.useBitmapCache = true;
stage.addChild(player);
player.x = player.y = 10;
player.x = stage.width / 2 - player.width / 2;
player.y = stage.height - player.height;
player.useBitmapCache=true;
const ball = new flashthem.Sprite();
ball.graphics.beginFill('#fff');
ball.graphics.drawCircle(5, 5, 5);
stage.addChild(ball);
ball.x = stage.width / 2;
ball.y = stage.height / 2;

let pressTime = 0;
const keys = {};
let vx = 0;
const min = 4;
let ballVel = { x: Math.random() * 4 - 2, y: 6 };
let ballAcc = 0;
document.addEventListener('keydown', e => {
  keys[e.key] = true;
});
document.addEventListener('keyup', e => {
  keys[e.key] = false;
})

stage.on('enter-frame', e => {
  if (keys.ArrowLeft) {
    vx = -10;
    pressTime++;
  } else if (keys.ArrowRight) {
    vx = 10;
    pressTime++;
  } else {
    vx = 0;
    pressTime = 0;
  }
  player.x += vx;

  ballVel.x += ballAcc;
  ball.x += ballVel.x;
  ball.y += ballVel.y;
  ballAcc *= .9;
  if (ballAcc < .1) ballAcc = 0;
  ballVel.x *= .9;
  if (ballVel.x > 0) {
    ballVel.x = Math.max(min, ballVel.x);
  } else {
    ballVel.x = Math.min(-min, ballVel.x);
  }

  limitBall();
});

function limitBall() {
  if (ball.x >= stage.width || ball.x <= 0) {
    ballVel.x *= -1;
  }
  const isHit = ball.hitTestObject(player);
  player.alpha = isHit ? .5 : 1;
  if (ball.y <= 0 || isHit) {
    ballVel.y *= -1;
  }
  if (isHit) {
    const vel = Math.min(pressTime, 20);
    ballAcc = (vel / 20 * vx / 10) * 10;
    console.log(ballAcc);
  }
  if (ball.y > stage.height) {
    ball.y = 0;
  }
}