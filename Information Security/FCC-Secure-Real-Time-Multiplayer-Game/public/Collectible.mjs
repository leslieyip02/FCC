class Collectible {
  constructor({ x, y, w, h, color, value }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.value = value;
    this.collected = false;
  }

  collide(player) {
    player.score += this.value;
    this.collected = true;
  }
}

export default Collectible;
