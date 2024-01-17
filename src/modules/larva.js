import { Firefly, Spark } from "./particle.js";

export default class Larva {
  constructor(game, x, y) {
    this.game = game;
    this.collisionX = x;
    this.collisionY = y;
    this.collisionRadius = 40;

    this.image = document.getElementById("larva");
    this.spriteWidth = 150;
    this.spriteHeight = 150;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;

    this.spriteX;
    this.spriteY;

    this.speedY = 1 + Math.random();
    this.frameX = 0;
    this.frameY = Math.floor(Math.random() * 2);
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );
    if (this.game.debug) {
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        2 * Math.PI
      );
      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
    }
  }
  update() {
    this.collisionY -= this.speedY;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 30;

    //move to safety

    if (this.collisionY < this.game.topMargin) {
      this.markedForDeletion = true;
      this.game.removeGameObject();
      if (!this.game.gameOver) this.game.score++;
      for (let i = 0; i < 3; i++) {
        this.game.particles.push(
          new Firefly(this.game, this.collisionX, this.collisionY, "blue")
        );
      }
    }

    // collision
    let collisionObjects = [this.game.player, ...this.game.obstacles];
    collisionObjects.forEach((object) => {
      let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(
        this,
        object
      );

      if (collision) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;

        this.collisionX = object.collisionX + unit_x * (sumOfRadii + 1);
        this.collisionY = object.collisionY + unit_y * (sumOfRadii + 1);
      }
    });

    this.game.enemies.forEach((enemy) => {
      if (this.game.checkCollision(this, enemy)[0] && !this.game.gameOver) {
        this.markedForDeletion = true;
        this.game.removeGameObject();
        enemy.markedForDeletion = true;
        this.game.removeGameObject();
        this.game.lostHatchlings += 1;
        for (let i = 0; i < 5; i++) {
          this.game.particles.push(
            new Spark(this.game, this.collisionX, this.collisionY, "red")
          );
        }
      }
    });
  }
}
