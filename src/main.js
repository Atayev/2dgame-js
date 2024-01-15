import Game from "./modules/game.js";

window.addEventListener("load", function () {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 768; //window.innerWidth;
  canvas.height = 384; //window.innerHeight;
  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";

  const game = new Game(canvas);
  console.log(game);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestAnimationFrame(animate);
  }

  animate();
});
