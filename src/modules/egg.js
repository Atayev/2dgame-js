export default class Egg {
  constructor(game) {
    this.game = game;
    this.collisionRadius = 40;
    this.margin = this.collisionRadius * 2;
    this.collisionX =
      this.margin + Math.random() * this.game.width - this.margin * 2;
    this.collisionY =
      this.game.topMargin +
      (this.game.height - this.game.topMargin - this.margin) * Math.random();

    this.image = document.getElementById("egg");

    this.spriteWidth = 110;
    this.spriteHight = 135;
    this.height = this.spriteHight * 0.5;
    this.width = this.spriteWidth * 0.5;
    this.spriteX;
    this.spriteY;
  }

  draw(context) {
    context.drawImage(this.image, this.spriteX, this.spriteY);
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
    this.spriteX = this.collisionX - this.width * 0.5 - 30;
    this.spriteY = this.collisionY - this.height * 0.5 - 50;
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
