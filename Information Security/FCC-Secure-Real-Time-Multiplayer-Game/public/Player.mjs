const ctxW = 800;
const ctxH = 480;

class Player {
  static gravity = 1.5;
	constructor({ x, y, w, h, color, score, id }) {
		this.x = x;
		this.y = y;
		this.w = w || 40;
		this.h = h || 40;
		this.color = color;

		this.score = score || 0;
    this.rank = '';
    this.id = id;

		this.dx = 0;
		this.dy = 0;
    this.grounded = false;
    this.canDoubleJump = false;
	}

	checkCollide(target) {
    return (this.x < target.x + target.w && this.x + this.w > target.x &&
      this.y < target.y + target.h && this.h + this.y > target.y); 
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
    } else if (xi >= this.x + this.w) {
      player.x = this.x + this.w;
    }
  }

	calculateRank(arr) {
		let sorted = arr.sort((a, b) => b.score - a.score);
		this.rank = `Rank: ${sorted.findIndex(player => player.id == this.id) + 1}/${arr.length}`;
	}

  jump() {
    if (this.grounded) {
      this.dy = -20;
      this.grounded = false;
    } else if (this.canDoubleJump && this.dy > -10) {
      this.dy = -25;
      this.canDoubleJump = false;
    }
  }

  respawn() {
    this.x = 80 + Math.random() * (ctxW - 160);
    this.y = Math.random() * ctxH - 240;
    this.dx = 0;
    this.dy = 0;
    this.grounded = false;
    this.canDoubleJump = false;
    this.score = Math.max(this.score - 10, 0);
  }
  
	update(entities) {
    if (this.y > 880) this.respawn();
    
    this.grounded = false;
		this.x += this.dx;
    this.y += this.dy; 

    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];
      if (this.checkCollide(entity)) {
        entity.collide(this);
      }
    }
    
    this.dx *= 0.5;
    if (!this.grounded) {
      this.dy += Player.gravity;
    }
	}
}

export default Player;
