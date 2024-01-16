import Egg from "./egg.js";
import Obstacle from "./obstacle.js";
import Player from "./player.js";
class Game {
  constructor(canvas) {
    this.debug = true;
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.topMargin = 260;
    this.player = new Player(this);
    this.obstacles = [];
    this.numberOfObstacles = 3;
    this.eggTimer = 0;
    this.eggInterval = 500;
    this.eggs = [];
    this.maxEggs = 10;
    this.fps = 75;
    this.timer = 0;
    this.interval = 1000 / this.fps;
    this.mouse = {
      x: this.width * 0.5,
      y: this.height * 0.5,
      pressed: false,
    };

    this.gameObjects = [];

    canvas.addEventListener("mousedown", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.mouse.pressed = true;
    });
    canvas.addEventListener("mouseup", (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.mouse.pressed = false;
    });
    canvas.addEventListener("mousemove", (e) => {
      if (this.mouse.pressed) {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
      }
    });
    window.addEventListener("keydown", (e) => {
      if (e.key == "d") this.debug = !this.debug;

      console.log(this.debug);
    });
  }

  render(context, deltaTime) {
    if (this.timer > this.interval) {
      context.clearRect(0, 0, this.width, this.height);
      // this.obstacles.forEach((obstacle) => obstacle.draw(context));
      // this.player.draw(context);
      // this.player.update();
      // also egss array

      //mix them in one array
      this.gameObjects = [...this.eggs, ...this.obstacles, this.player];
      // sort by y position
      this.gameObjects.sort((a, b) => a.collisionY - b.collisionY);

      this.gameObjects.forEach((object) => {
        object.draw(context);
        object.update && object.update();
      });

      //animate next frame
      this.timer = 0;
    }
    this.timer += deltaTime;

    // add egss periodicaly

    if (this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs) {
      this.addEgg();
      this.eggTimer = 0;
    } else {
      this.eggTimer += deltaTime;
    }
  }

  checkCollision(a, b) {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distance = Math.hypot(dx, dy);

    const sumOfRadii = a.collisionRadius + b.collisionRadius;

    return [distance < sumOfRadii, distance, sumOfRadii, dx, dy];
  }
  initObstacles() {
    let attempts = 0;
    while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
      let testObst = new Obstacle(this);
      let overlap = false;
      this.obstacles.forEach((obstacle) => {
        const dx = testObst.collisionX - obstacle.collisionX;
        const dy = testObst.collisionY - obstacle.collisionY;

        const distance = Math.hypot(dx, dy);
        const distanceBuffer = 250;
        const sumOfRadii =
          testObst.collisionRadius + obstacle.collisionRadius + distanceBuffer;

        if (distance < sumOfRadii) {
          overlap = true;
        }
      });
      const margin = testObst.collisionRadius * 3;
      if (
        !overlap &&
        testObst.spriteX > 0 &&
        testObst.spriteX < this.width - testObst.width &&
        testObst.collisionY > this.topMargin + margin &&
        testObst.collisionY < this.height - margin
      )
        this.obstacles.push(testObst);

      attempts++;
    }
  }

  addEgg() {
    this.eggs.push(new Egg(this));
  }
}
export default Game;
