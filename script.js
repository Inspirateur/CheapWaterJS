window.oncontextmenu = function () {
    return false;   // cancel default menu
}

window.onload = function() {
    let width = 5;
    let height = 8;
    canvas = document.getElementById("canvas");
    var app = new App(canvas, width, height);
    canvas.addEventListener('mousedown', function(e) {
        app.on_click(e);
        return false;
    }, false);
    window.onresize = () => app.set_canvas_width(.8*document.body.clientWidth);
    setInterval(() => app.update(), 50);
    app.set_canvas_width(.8*document.body.clientWidth);
}
