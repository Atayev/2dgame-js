export default class Obstacle {
  constructor(game) {
    this.game = game;
    this.collisionX = this.game.width * Math.random();
    this.collisionY = this.game.height * Math.random();
    this.collisionRadius = 50;

    this.image = document.getElementById("obstacles");
    this.spriteWidth = 250;
    this.spriteHight = 250;
    this.width = this.spriteWidth;
    this.height = this.spriteHight;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spirteY = this.collisionY - this.height * 0.5 - 70;

    this.frameX = Math.floor(Math.random() * 3);
    this.frameY = Math.floor(Math.random() * 3);
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHight,
      this.spriteWidth,
      this.spriteHight,
      this.spriteX,
      this.spirteY,
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

  update() {}
}
