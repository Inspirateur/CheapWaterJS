import { Blocks, Vec2 } from "blocks";

let width = 40;
let height = width/2;
let blocks = new Blocks(width, height);
let canvas, rw, rh;
window.oncontextmenu = function () {
    return false;   // cancel default menu
}
window.onresize = resizeCanvas;


function resizeCanvas() {
    canvas.width = Math.floor(.8*document.body.clientWidth);
    // if the width is odd
    if(canvas.width & 1) {
        canvas.width -= 1;
    }
    canvas.height = canvas.width/2;
    rw = canvas.width/width;
    rh = canvas.height/height;
    display();
}

function display() {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    for(let x=0; x < blocks.width; x++) {
        for(let y=0; y < blocks.height; y++) {
            let block = blocks.get(x, y);
            if (block.block === 1) {
                ctx.fillStyle = "#000000";
                ctx.fillRect(x*rw+.5, y*rh+.5, rw*0.98, rh*0.98);
            } else {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(x*rw+.5, y*rh+.5, rw*0.98, rh*0.98);
                let h = Math.min(block.water_level, 1);
                if(h > 0) {
                    ctx.fillStyle = "#001166";
                    // h = Math.floor(res*h)/res;
                    ctx.fillRect(x*rw+.5, (y+1-h)*rh+.5, rw*0.98, rh*0.98*h);
                }
            }
        }
    }
}

function update() {
    let new_blocks = blocks.clone();
    // spill pass
    // TODO: make the spill left/right symmetric
    for(let x=0; x < width; x++) {
        for(let y=0; y < height; y++) {
            let block = blocks.get(x, y);
            // TODO: update the block
            
            let down_spill = 0;
            let up_spill = 0;
            let left_spill = 0;
            let right_spill = 0;
            new_blocks.set(x, y, block);
    
        }
    }
    blocks = new_blocks;
    display();
}

function onLoad() {
    canvas = document.getElementById("canvas");
    blocks = [];
    _blocks = []
    for(let x=0; x<width; x++) {
        blocks[x] = [];
        _blocks[x] = [];
        for(let y=0; y<height; y++) {
            blocks[x][y] = 0;
            _blocks[x][y] = 0;
        }
    }

    resizeCanvas();
    canvas.addEventListener('mousedown', function(e) {
        onClick(e);
        return false;
    }, false);
    setInterval(update, 100);
}

function onClick(event) {
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((event.clientX - rect.left)/rw);
    let y = Math.floor((event.clientY - rect.top)/rh);
    switch (event.which) {
        case 1:
            if(blocks[x][y] > 0) {
                blocks[x][y] = 0;
            } else {
                blocks[x][y] = 1;
            }
            break;
        case 3:
            if(blocks[x][y] === -1) {
                blocks[x][y] = 0;
            } else {
                blocks[x][y] = -1;
            }
            break;
        default:
            console.debug(blocks[x][y]);
    }
    display();
}
