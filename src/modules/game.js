import Egg from "./egg.js";
import Enemy from "./enemy.js";
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
    this.numberOfObstacles = 10;
    this.eggTimer = 0;
    this.eggInterval = 500;
    this.eggs = [];
    this.maxEggs = 5;
    this.maxEnemy = 5;
    this.enemies = [];
    this.hatchLings = [];
    this.particles = [];
    this.score = 0;
    this.winningScore = 10;
    this.gameOver = false;
    this.lostHatchlings = 0;
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
      if (e.key == "r") this.restart();
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
      this.gameObjects = [
        this.player,
        ...this.eggs,
        ...this.obstacles,
        ...this.enemies,
        ...this.hatchLings,
        ...this.particles,
      ];
      // sort by y position
      this.gameObjects.sort((a, b) => a.collisionY - b.collisionY);

      this.gameObjects.forEach((object) => {
        object.draw(context);
        object.update && object.update(deltaTime);
      });

      //animate next frame
      this.timer = 0;
    }
    this.timer += deltaTime;

    // add egss periodicaly

    if (
      this.eggTimer > this.eggInterval &&
      this.eggs.length < this.maxEggs &&
      !this.gameOver
    ) {
      this.addEgg();
      this.eggTimer = 0;
    } else {
      this.eggTimer += deltaTime;
    }

    // draw status text
    context.save();
    context.textAlign = "left";
    context.fillText(`Score: ${this.score}`, 25, 50);
    context.fillText(`Lost: ${this.lostHatchlings}`, 25, 100);
    if (this.debug) {
      context.fillText(`FPS: ${Math.round(1000 / deltaTime)}`, 25, 75);
    }
    context.restore();

    // check for win

    if (this.score >= this.winningScore) {
      this.gameOver = true;
      context.save();
      context.fillStyle = "rgba(0,0,0,0.5)";
      context.fillRect(0, 0, this.width, this.height);
      context.fillStyle = "white";
      context.textAlign = "center";
      let message1 = "";
      let message2 = "";
      if (this.lostHatchlings <= 5) {
        message1 = "You Win!";
        message2 = "You are a good mother!";
      } else {
        message1 = "You lose!";
        message2 = `${this.lostHatchlings} were eaten!`;
      }
      context.font = "130px Helvetica";
      context.fillText(message1, this.width * 0.5, this.height * 0.5);
      context.font = "40px Helvetica";
      context.fillText(message2, this.width * 0.5, this.height * 0.5 + 50);
      context.fillText(
        `Final score: ${this.score}. Press R to restart`,
        this.width * 0.5,
        this.height * 0.5 + 100
      );
      context.restore();
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
    for (let i = 0; i < this.maxEnemy; i++) {
      this.addEnemy();
    }
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
  addEnemy() {
    this.enemies.push(new Enemy(this));
  }
  removeGameObject() {
    this.eggs = this.eggs.filter((egg) => !egg.markedForDeletion); // if false it will delete
    this.hatchLings = this.hatchLings.filter((ling) => !ling.markedForDeletion);
    this.particles = this.particles.filter((part) => !part.markedForDeletion);
  }

  restart() {
    this.player.restart();
    this.obstacles = [];
    this.eggs = [];
    this.enemies = [];
    this.hatchLings = [];
    this.particles = [];
    this.lostHatchlings = 0;
    this.score = 0;
    this.gameOver = false;
    this.mouse = {
      x: this.width * 0.5,
      y: this.height * 0.5,
    };
    this.initObstacles();
  }
}

export default Game;
