var eps = 0.1;
var d = 2;

function clamp(a, min, max) {
	if (a < min) return min;
	if (a > max) return max;
	return a;
}

function max(a, b) {
	if (a < b) return b;
	return a;
}

function min(a, b) {
	if (a < b) return a;
	return b;
}

function flux(h1, h2, v) {
	return clamp(
		(h1+h2)*v/2, 
		max(h1-1, -h2)/(2*d*eps), min(h1, 1-h2)/(2*d*eps)
	);
}

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

	update() {
		let new_blocks = this.blocks.clone_terrain();
		for(let x=0; x < this.blocks.width; x++) {
			for(let y=0; y < this.blocks.height; y++) {
				if (this.blocks.has_block(x, y)) continue;
				let self = this.blocks.get_data(x, y);
				let above = this.blocks.get_data(x, y+1);
				let above_left = this.blocks.get_data(x-1, y+1);
				let right = this.blocks.get_data(x+1, y);
				let under = this.blocks.get_data(x, y-1);
				let under_right = this.blocks.get_data(x+1, y-1);
				let left = this.blocks.get_data(x-1, y);
				let new_h = self.h + eps*(
					flux(left.h, self.h, self.v.x) - flux(self.h, right.h, right.v.x) 
					+ flux(under.h, self.h, self.v.y) - flux(self.h, above.h, above.v.y)
				);
				let new_vx = 0;
				let new_vy = 0;
				if (self.solid === 0) {
					if (left.solid === 0 && self.h + left.h > 0) {
						new_vx = self.v.x - eps*(self.p - left.p)
						+ viscosity*eps*(
							right.v.x + left.v.x
							+ above.v.x + under.v.x
							- 4*self.v.x
						) 
						- eps*(
							self.v.x*(right.v.x - left.v.x) 
							+ (self.v.y+above.v.y+above_left.v.y+left.v.y)*(
								above.v.x - under.v.x
							)/4
						)/2;
					}
					if (under.solid === 0 && self.h + under.h > 0) {
						new_vy = self.v.y - eps*G*(self.p - under.p) - eps*G
						+ viscosity*eps*(
							right.v.y + left.v.y
							+ above.v.y + under.v.y
							- 4*self.v.y
						) 
						- eps*(
							(self.v.x+right.v.x+under_right.v.x+under.v.x)*(
								right.v.y - left.v.y
							)/4 
							+ self.v.y*(above.v.y - under.v.y)
						)/2;
					}
				}

				new_blocks.set_data(x, y, new_h, new_vx, new_vy);
			}
		}
		this.blocks = new_blocks;
		this.display();
	}

	display() {
		let ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 2;
		for(let x=0; x < this.blocks.width; x++) {
			for(let y=0; y < this.blocks.height; y++) {
				let i = this.blocks.linearize(x, y);
				let y_display = this.blocks.height-y-1;
				if (this.blocks.blocks[i] === 1) {
					ctx.fillStyle = "#000000";
					ctx.fillRect(x*this.rw+.5, y_display*this.rh+.5, this.rw*0.98, this.rh*0.98);
				} else {
					ctx.fillStyle = "#FFFFFF";
					ctx.fillRect(x*this.rw+.5, y_display*this.rh+.5, this.rw*0.98, this.rh*0.98);
					let h = Math.min(this.blocks.water_levels[i], 1);

					if(h > 0) {
						ctx.fillStyle = "#2266AA";
					} else {
						h = -h;
						ctx.fillStyle = "#AA6622";
					}
					ctx.fillRect(x*this.rw+.5, (y_display+1-h)*this.rh+.5, this.rw*0.98, this.rh*0.98*h);
				}
			}
		}
	}

	on_click(event) {
		let rect = this.canvas.getBoundingClientRect();
		let x = Math.floor((event.clientX - rect.left)/this.rw);
		let y_display = Math.floor((event.clientY - rect.top)/this.rh);
		let y = this.blocks.height - y_display - 1;
		switch (event.which) {
			case 1:
				this.blocks.fill_water(x, y);
				break;
			case 3:
				this.blocks.toggle_block(x, y);
				break;
		}
		this.display();	
	}
}
