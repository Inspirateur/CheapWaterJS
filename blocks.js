class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Blocks {
    #blocks; #water_levels; #water_speed_x; #water_speed_y;

    constructor(width, height, _blocks, _water_levels, _water_speed_x, _water_speed_y) {
        this.width = width;
        this.height = height;
        this.#blocks = _blocks ?? Array(width*height).fill(0);
        this.#water_levels = _water_levels ?? Array(width*height).fill(0);
        this.#water_speed_x = _water_speed_x ?? Array(width*height).fill(0);
        this.#water_speed_y = _water_speed_y ?? Array(width*height).fill(0);
    }

    linearize(x, y) {
        return x + y*this.width;
    }

    get(x, y) {
        var i = this.linearize(x, y);
        return {
            block: this.#blocks[i],
            water_level: this.#water_levels[i],
            water_speed: new Vec2(this.#water_speed_x[i], this.#water_speed_y[i])
        }
    }

    set(x, y, value) {
        var i = this.linearize(x, y);
        this.#blocks[i] = value.block;
        this.#water_levels[i] = value.water_level;
        this.#water_speed_x[i] = value.water_speed.x;
        this.#water_speed_y[i] = value.water_speed.y;
    }

    toggle_water(x, y) {
        var i = this.linearize(x, y);
        this.#blocks[i] = 0;
        if (this.#water_levels[i] > 0) {
            this.#water_levels[i] = 0;
        } else {
            this.#water_levels[i] = 1;
        }
        this.#water_speed_x[i] = 0;
        this.#water_speed_y[i] = 0;
    }

    toggle_block(x, y) {
        var i = this.linearize(x, y);
        this.#water_levels[i] = 0;
        this.#water_speed_x[i] = 0;
        this.#water_speed_y[i] = 0;
        this.#blocks[i] = 1 - this.#blocks[i];
    }

    clone() {
        return new Blocks(
            this.width, 
            this.height, 
            [...this.#blocks], 
            [...this.#water_levels],
            [...this.#water_speed_x],
            [...this.#water_speed_y]
        );
    }
}