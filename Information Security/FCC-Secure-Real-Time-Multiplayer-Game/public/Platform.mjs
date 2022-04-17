import Player from './Player.mjs';

class Platform {
  constructor({ x, y, w, h, color, timer }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.timer = timer || null;
  }

  collide(player) {
    // reset position
    // initial coordinates
    let xi = player.x - player.dx;
    let yi = player.y - player.dy;

    if (yi + player.h <= this.y) {
      player.y = this.y - player.h;
      player.dy = 0;
      player.grounded = true;
      player.canDoubleJump = true;
    } else if (xi + player.w <= this.x) {
      player.x = this.x - player.w;
      player.canDoubleJump = true;
      player.dy -= Player.gravity;
    } else if (xi >= this.x + this.w) {
      player.x = this.x + this.w;
      player.canDoubleJump = true;
      player.dy -= Player.gravity;
    }
  }
}

export default Platform;