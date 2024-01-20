var eps = 0.1;

class App {
	rw; rh;

	constructor(canvas, width, height) {
		this.canvas = canvas;
		this.blocks = new Blocks(width, height);
		this.compute_ratios()
	}

	set_canvas_width(canvas_width) {
		this.canvas.width = canvas_width;
		// if the width is odd
		if(this.canvas.width & 1) {
			this.canvas.width -= 1;
		}
		this.canvas.height = this.canvas.width/2;
		this.compute_ratios()
	}

	compute_ratios() {
		this.rw = this.canvas.width/this.blocks.width;
		this.rh = this.canvas.height/this.blocks.height;
	}

	display() {
		let ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 2;
		for(let x=0; x < this.blocks.width; x++) {
			for(let y=0; y < this.blocks.height; y++) {
				let i = this.blocks.linearize(x, y);
				if (this.blocks.blocks[i] === 1) {
					ctx.fillStyle = "#000000";
					ctx.fillRect(x*this.rw+.5, y*this.rh+.5, this.rw*0.98, this.rh*0.98);
				} else {
					ctx.fillStyle = "#FFFFFF";
					ctx.fillRect(x*this.rw+.5, y*this.rh+.5, this.rw*0.98, this.rh*0.98);
					let h = Math.min(this.blocks.water_levels[i], 1);
					if(h > 0) {
						ctx.fillStyle = "#2266AA";
						ctx.fillRect(x*this.rw+.5, (y+1-h)*this.rh+.5, this.rw*0.98, this.rh*0.98*h);
					}
				}
			}
		}
	}

	update() {
		let new_blocks = this.blocks.clone_terrain();
		for(let x=0; x < this.blocks.width; x++) {
			for(let y=0; y < this.blocks.height; y++) {
				if (this.blocks.has_block(x, y)) continue;
				let self = this.blocks.get_data(x, y);
				let above = this.blocks.get_data(x, y-1);
				if (above.h === 0) {
					above = self;
				}
				let right = this.blocks.has_block(x+1, y) ? self : this.blocks.get_data(x+1, y);
				let under = this.blocks.get_data(x, y+1);
				let left = this.blocks.has_block(x-1, y) ? self : this.blocks.get_data(x-1, y);
				let new_h = self.h - eps*(under.h*under.v.y - above.v.y*above.h + right.v.x*right.h - left.h*left.v.x);
				let new_vx = 0;
				let new_vy = 0;
				if (self.h > 0) {
					// new_vx = self.v.x - eps*(self.v.y*(above.v.x-under.v.x) + self.v.x*(right.v.x-left.v.x)) - eps*(right.p-left.p) + viscosity*eps*(above.v.x-under.v.x);
					new_vx = self.v.x - eps*(right.p - left.p);
					let g = this.blocks.has_block(x, y+1) ? 0 : G;
					// new_vy = self.v.y - eps*(self.v.y*(above.v.y-under.v.y) + self.v.x*(right.v.y-left.v.y)) - eps*(above.p-under.p) + viscosity*eps*(right.v.y-left.v.y) + eps*g;
					new_vy = self.v.y - eps*(under.p - above.p) + eps*g;	
				}
				if (!isFinite(new_vy)) {
					console.log(self);
					console.log(above);
					console.log(right);
					throw new Error("j'ai le seum");
				}
				new_blocks.set_data(x, y, new_h, new_vx, new_vy);
			}
		}
		this.blocks = new_blocks;
		this.display();
	}

	on_click(event) {
		let rect = this.canvas.getBoundingClientRect();
		let x = Math.floor((event.clientX - rect.left)/this.rw);
		let y = Math.floor((event.clientY - rect.top)/this.rh);
		switch (event.which) {
			case 1:
				this.blocks.toggle_water(x, y);
				break;
			case 3:
				this.blocks.toggle_block(x, y);
				break;
		}
		this.display();	
	}
}
