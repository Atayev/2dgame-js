import Game from "./modules/game.js";

window.addEventListener("load", function () {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth; //window.innerWidth;
  canvas.height = 720; //window.innerHeight;
  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";
  ctx.font = "30px Helvetica";
  ctx.textAlign = "center";
  const game = new Game(canvas);
  game.initObstacles();
  console.log(game);

  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx, deltaTime);

    requestAnimationFrame(animate);
  }

  animate(0);
});
