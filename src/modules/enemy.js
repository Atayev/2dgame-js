export default class Enemy {
  constructor(game) {
    this.game = game;
    this.collisionRadius = 30;
    this.speedX = Math.random() * 3 + 0.5;
    this.image = document.getElementById("toads");
    this.spriteWidth = 140;
    this.spriteHeight = 260;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.collisionX =
      this.game.width + this.width + Math.random() * this.game.width * 0.5;
    this.collisionY =
      this.game.topMargin +
      Math.random() * (this.game.height - this.game.topMargin);
    this.spriteX;
    this.spriteY;
    this.frameX = 0;
    this.frameY = Math.floor(Math.random() * 4);
  }
  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.spriteHeight * this.frameY,
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
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 80;
    this.collisionX = this.collisionX - this.speedX;
    if (this.spriteX + this.spriteWidth < 0 && !this.game.gameOver) {
      this.collisionX =
        this.game.width + this.width + Math.random() * this.game.width * 0.5;
      this.collisionY =
        this.game.topMargin +
        Math.random() * (this.game.height - this.game.topMargin);
      this.frameY = Math.floor(Math.random() * 4);
    }
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
  }
}
