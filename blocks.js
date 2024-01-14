class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    sum() {
        return Math.abs(this.x) + Math.abs(this.y);
    }

    capped() {
        let len = Math.max(1, this.length());
        return new Vec2(this.x/len, this.y/len);
    }
}

class Blocks {
    blocks; water_levels; water_speed_x; water_speed_y;

    constructor(width, height, _blocks, _water_levels, _water_speed_x, _water_speed_y) {
        this.width = width;
        this.height = height;
        this.blocks = _blocks ?? Array(width*height).fill(0);
        this.water_levels = _water_levels ?? Array(width*height).fill(0);
        this.water_speed_x = _water_speed_x ?? Array(width*height).fill(0);
        this.water_speed_y = _water_speed_y ?? Array(width*height).fill(0);
    }

    linearize(x, y) {
        return x + y*this.width;
    }

    has_block(x, y) {
        if (x < 0 || x >= this.width) return false;
        if (y < 0 || y >= this.height) return false;
        var i = this.linearize(x, y);
        return this.blocks[i] === 1;
    }

    add_water(x, y, amount, speed) {
        if (x < 0 || x >= this.width) return;
        if (y < 0 || y >= this.height) return;
        var i = this.linearize(x, y);
        this.water_levels[i] += amount;
        this.water_speed_x[i] += speed.x*amount;
        this.water_speed_y[i] += speed.y*amount;
    }

    toggle_water(x, y) {
        var i = this.linearize(x, y);
        this.blocks[i] = 0;
        if (this.water_levels[i] > 0) {
            this.water_levels[i] = 0;
        } else {
            this.water_levels[i] = 1;
        }
        this.water_speed_x[i] = 0;
        this.water_speed_y[i] = 0;
    }

    toggle_block(x, y) {
        var i = this.linearize(x, y);
        this.water_levels[i] = 0;
        this.water_speed_x[i] = 0;
        this.water_speed_y[i] = 0;
        this.blocks[i] = 1 - this.blocks[i];
    }

    clone() {
        return new Blocks(
            this.width, 
            this.height, 
            [...this.blocks], 
            [...this.water_levels],
            [...this.water_speed_x],
            [...this.water_speed_y]
        );
    }
}
