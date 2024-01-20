var G = 1;
var viscosity = 0;


class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
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

    water_height(i) {
        let total = 0;
        while (i >= 0 && this.water_levels[i] > 0) {
            total += this.water_levels[i];
            i -= this.width;
        }
        return total;
    }

    get_data(x, y) {
        if (x < 0 || x >= this.width) return { p: 0, h: 0, v: new Vec2(0, 0) };
        if (y < 0 || y >= this.height) return  { p: 0, h: 0, v: new Vec2(0, 0) };
        let i = this.linearize(x, y);
        return {
            p: G*this.water_height(i),
            h: this.water_levels[i],
            v: new Vec2(this.water_speed_x[i], this.water_speed_y[i])
        };
    }

    set_data(x, y, h, vx, vy) {
        let i = this.linearize(x, y);
        this.water_levels[i] = h;
        this.water_speed_x[i] = vx;
        this.water_speed_y[i] = vy;
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

    clone_terrain() {
        return new Blocks(
            this.width, 
            this.height, 
            [...this.blocks], 
            Array(this.width*this.height).fill(0),
            Array(this.width*this.height).fill(0),
            Array(this.width*this.height).fill(0)
        );
    }
}
