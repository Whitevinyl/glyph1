

// INIT //
var canvas;
var ctx;
var TWEEN;
var fonts;


// METRICS //
var width;
var height;
var ratio;
var units;
var dx;
var dy;
var headerType = 0;
var midType = 0;
var dataType = 0;
var bodyType = 0;
var subType = 0;
var device = "desktop";

var TAU = 2 * Math.PI;


// INTERACTION //
var mouseX = 0;
var mouseY = 0;
var touchTakeover = false;
var touch;
var mouseIsDown = false;





// COLORS //
var bgCols = [new RGBA(255,255,255,1),new RGBA(255,236,88,1)];
var textCol = new RGBA(5,5,5,1);
bgCols = [new RGBA(5,5,5,1),new RGBA(255,236,88,1)];
textCol = new RGBA(255,255,255,1);

var app;
var glyph;

//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------


function init() {

    // SETUP CANVAS //
    app = document.getElementById('app');
    canvas = document.getElementById("main");
    ctx = canvas.getContext("2d");
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;



    // SET CANVAS & DRAWING POSITIONS //
    metrics();

    // INITIALISE THINGS //
    setupInteraction(canvas);

    setupGUI();
    glyph = new Glyphs(60);

    // DONE //


    setupDrawing();
    loop();

}




//-------------------------------------------------------------------------------------------
//  MAIN LOOP
//-------------------------------------------------------------------------------------------


function loop() {
    update();
    draw();
    //requestAnimationFrame(loop);
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------


function update() {
    if (TWEEN) {
        TWEEN.update();
    }

}

function draw() {
    drawBG();

    color.stroke(ctx,textCol);

    glyph.draw();
}
