class Player {
  constructor(game) {
    this.game = game;
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.collisionRadius = 30;
    this.speedX = 0;
    this.speedY = 0;
    this.distanceX = 0;
    this.distanceY = 0;
    this.speedModifier = 5;
    this.spriteWidth = 256;
    this.spriteHight = 256;
    this.width = this.spriteWidth * 0.5;
    this.height = this.spriteHight * 0.5;
    this.spriteX;
    this.spriteY;
    this.image = document.getElementById("bull");

    this.frameX = 0;
    this.frameY = 0;
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHight,
      this.spriteWidth,
      this.spriteHight,
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
      context.beginPath();
      context.moveTo(this.collisionX, this.collisionY);
      context.lineTo(this.game.mouse.x, this.game.mouse.y);
      context.stroke();
    }
  }
  update() {
    this.distanceX = this.game.mouse.x - this.collisionX;
    this.distanceY = this.game.mouse.y - this.collisionY;

    const angle = Math.atan2(this.distanceY, this.distanceX);
    if (angle < -2.74 || angle > 2.74) this.frameY = 6;
    else if (angle < -1.96) this.frameY = 7;
    else if (angle < -1.17) this.frameY = 0;
    else if (angle < -0.39) this.frameY = 1;
    else if (angle < 0.39) this.frameY = 2;
    else if (angle < 1.17) this.frameY = 3;
    else if (angle < 1.96) this.frameY = 4;
    else if (angle < 2.74) this.frameY = 5;

    const distance = Math.hypot(this.distanceY, this.distanceX); //(this.distanceX ** 2 + this.distanceY ** 2) ** 0.5;
    if (distance > this.speedModifier) {
      this.speedX = this.distanceX / distance || 0;
      this.speedY = this.distanceY / distance || 0;
    } else {
      this.speedX = 0;
      this.speedY = 0;
    }

    this.collisionX += this.speedX * this.speedModifier;
    this.collisionY += this.speedY * this.speedModifier;

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 50;
    if (this.collisionX < this.collisionRadius)
      this.collisionX = this.collisionRadius;
    else if (this.collisionX > this.game.width - this.collisionRadius)
      if (this.collisionY < this.game.topMargin + this.collisionRadius)
        this.collisionY = this.game.topMargin + this.collisionRadius;
      else if (this.collisionY > this.game.height - this.collisionRadius)
        this.collisionY = this.game.height - this.collisionRadius;
    this.game.obstacles.forEach((obstacle) => {
      // [distance < sumOfRadii, distance, sumOfRadii, dx, dy]
      let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(
        this,
        obstacle
      );
      if (collision) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;

        this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
        this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
      }
    });
  }

  restart() {
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.5 - 50;
  }
}
export default Player;
