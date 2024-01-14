export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Blocks {
    #blocks; #water_levels; #water_speed_x; #water_speed_y;

    constructor(width, height, _blocks, _water_levels, _water_speed_x, _water_speed_y) {
        this.width = width;
        this.height = height;
        this.#blocks = _blocks ?? Array(width*height);
        this.#water_levels = _water_levels ?? Array(width*height);
        this.#water_speed_x = _water_speed_x ?? Array(width*height);
        this.#water_speed_y = _water_speed_y ?? Array(width*height);
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