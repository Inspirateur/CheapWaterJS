let width = 20;
let height = width/2;
let res = 8;
let canvas, blocks, _water, rw, rh;
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
    for(let x=0; x<width; x++) {
        for(let y=0; y<height; y++) {
            if(blocks[x][y] === -1) {
                ctx.fillStyle = "#000000";
                ctx.fillRect(x*rw+.5, y*rh+.5, rw*0.98, rh*0.98);
            } else {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(x*rw+.5, y*rh+.5, rw*0.98, rh*0.98);
                if(blocks[x][y] > 0) {
                    ctx.fillStyle = "#001166";
                    let h = blocks[x][y];
                    // h = Math.floor(res*h)/res;
                    ctx.fillRect(x*rw+.5, (y+1-h)*rh+.5, rw*0.98, rh*0.98*h);
                }
            }
        }
    }
}

function update() {
    for(let x=0; x<width; x++) {
        for(let y=0; y<height; y++) {
            _water[x][y] = blocks[x][y];
        }
    }
    // spill pass
    // TODO: make the spill left/right symmetric
    for(let x=0; x<width; x++) {
        for(let y=0; y<height; y++) {
            if (blocks[x][y] > 0 && (y+1 >= height || Math.abs(blocks[x][y+1]) === 1)) {
                if (x+1 < width && blocks[x+1][y] >= 0 && blocks[x][y] > blocks[x+1][y]) {
                    let avg = (blocks[x][y] + blocks[x+1][y])/2;
                    _water[x][y] -= blocks[x][y]-avg;
                    _water[x+1][y] += avg-blocks[x+1][y];
                }
                if (x-1 >= 0 && blocks[x-1][y] >= 0 && blocks[x][y] > blocks[x-1][y]) {
                    let avg = (blocks[x][y] + blocks[x-1][y])/2;
                    _water[x][y] -= blocks[x][y]-avg;
                    _water[x-1][y] += avg-blocks[x-1][y];
                }
            }
        }
    }
    // gravity pass
    for(let x=0; x<width; x++) {
        for(let y=height-1; y>=0; y--) {
            if (_water[x][y] > 0 && !(y+1 >= height || _water[x][y+1] === -1)) {
                _water[x][y+1] = _water[x][y+1]+_water[x][y];
                _water[x][y] = 0;
                if(_water[x][y+1] > 1) {
                    _water[x][y] = _water[x][y+1]-1;
                    _water[x][y+1] = 1;
                }
            }
        }
    }
    for(let x=0; x<width; x++) {
        for(let y=0; y<height; y++) {
            blocks[x][y] = _water[x][y];
        }
    }
    display();
}

function onLoad() {
    canvas = document.getElementById("canvas");
    blocks = [];
    _water = []
    for(let x=0; x<width; x++) {
        blocks[x] = [];
        _water[x] = [];
        for(let y=0; y<height; y++) {
            blocks[x][y] = 0;
            _water[x][y] = 0;
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
