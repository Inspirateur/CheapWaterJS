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
				let block = this.blocks.get(x, y);
				if (block.block === 1) {
					ctx.fillStyle = "#000000";
					ctx.fillRect(x*this.rw+.5, y*this.rh+.5, this.rw*0.98, this.rh*0.98);
				} else {
					ctx.fillStyle = "#FFFFFF";
					ctx.fillRect(x*this.rw+.5, y*this.rh+.5, this.rw*0.98, this.rh*0.98);
					let h = Math.min(block.water_level, 1);
					if(h > 0) {
						ctx.fillStyle = "#2266AA";
						// h = Math.floor(res*h)/res;
						ctx.fillRect(x*this.rw+.5, (y+1-h)*this.rh+.5, this.rw*0.98, this.rh*0.98*h);
					}
				}
			}
		}
	}

	update() {
		let new_blocks = this.blocks.clone();
		for(let x=0; x < this.blocks.width; x++) {
			for(let y=0; y < this.blocks.height; y++) {
				let block = this.blocks.get(x, y);
				// TODO: update the block
				
				let down_spill = 0;
				let up_spill = 0;
				let left_spill = 0;
				let right_spill = 0;
				new_blocks.set(x, y, block);
		
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
