


//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------

function setupInteraction(target) {

    // MOUSE //
    app.addEventListener("mousedown", mousePress, false);
    app.addEventListener("mouseup", mouseRelease, false);
    app.addEventListener("mousemove", mouseMove, false);

}




//-------------------------------------------------------------------------------------------
//  MOUSE / TOUCH
//-------------------------------------------------------------------------------------------



function mousePress() {

    mouseIsDown = true;
    rolloverCheck();

    glyphUpdate();
}



function mouseRelease() {
    mouseIsDown = false;
}



function mouseMove(event) {

    var x,y;

    if (touchTakeover==true) {
        x = touch.pageX;
        y = touch.pageY;
    } else {
        x = event.pageX;
        y = event.pageY;
    }

    const ratio = getPixelRatio();
    mouseX = x * ratio;
    mouseY = y * ratio;
    rolloverCheck();


}

function rolloverCheck() {
    var u = units;

    var test = hudCheck(dx-(30*u), dy+(40*u), 60*u, 60*u);

}



// DETERMINE CLICK //
function clickOrTouch(event) {

    var x,y;

    if (touchTakeover==true) {
        x = touch.pageX;
        y = touch.pageY;
    } else {
        x = event.pageX;
        y = event.pageY;
    }

    const ratio = getPixelRatio();
    mouseX = x * ratio;
    mouseY = y * ratio;

    if (mouseIsDown==false) {
        mousePress(event);
    }
}
