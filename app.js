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
		let new_blocks = this.blocks.clone();
		// gravity pass
		for(let i=0; i < new_blocks.water_speed_y.length; i++) {
			if (new_blocks.water_levels[i] === 0) continue;
			new_blocks.water_speed_y[i] += 1;
		}
		for(let x=0; x < this.blocks.width; x++) {
			for(let y=0; y < this.blocks.height; y++) {
				let i = this.blocks.linearize(x, y);
				if (this.blocks.water_levels[i] === 0) continue;
				let dirs = [
					new Vec2(-1, 0), 
					new Vec2(1, 0), 
					new Vec2(0, -1), 
					new Vec2(0, 1)
				].filter((dir) => !this.blocks.has_block(x+dir.x, y+dir.y));
				let speed = new Vec2(this.blocks.water_speed_x[i], this.blocks.water_speed_y[i]);
				// spill pass
				if (this.blocks.water_levels[i] > 1) {
					let spill = (this.blocks.water_levels[i]-1)/dirs.length;
					for(let dir of dirs) {
						new_blocks.add_water(x+dir.x, y+dir.y, spill, speed);
					}
					new_blocks.water_levels[i] = 1;
				}
				// motion pass
				let water_amount = new_blocks.water_levels[i];
				let momentum = speed.sum();
				let capped_sum = Math.max(momentum, 1);
				let capped_speed = new Vec2(speed.x/capped_sum, speed.y/capped_sum);
				for(let dir of dirs) {
					let ratio = dir.x*capped_speed.x + dir.y*capped_speed.y;
					if (ratio <= 0) continue;
					momentum -= ratio;
					let amount = water_amount*ratio;
					new_blocks.add_water(x+dir.x, y+dir.y, ratio*amount, speed);
					new_blocks.water_levels[i] -= amount;
				}				
			}
		}
		// friction pass
		for(let i=0; i < new_blocks.water_speed_y.length; i++) {
			if (new_blocks.water_levels[i] === 0) continue;
			new_blocks.water_speed_y[i] *= 0.8;
			new_blocks.water_speed_x[i] *= 0.8;
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
