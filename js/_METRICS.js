/**
 * Created by luketwyman on 25/11/2015.
 */

//-------------------------------------------------------------------------------------------
//  METRICS
//-------------------------------------------------------------------------------------------



function metrics() {

    width = window.innerWidth;
    height = window.innerHeight;
    ratio = getPixelRatio();


    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    width *= ratio;
    height *= ratio;
    canvas.width  = width;
    canvas.height = height;

    // UNIT SIZES //
    dx = Math.round(width/2);
    dy = Math.round(height/2);

    // DEVICE CHECK //
    if (height>(width*1.05)) {
        device = "mobile";
    } else if (height>(width*0.65)) {
        device = "tablet";
    } else {
        device = "desktop";
    }
    console.log(device);

    var u;

    if (device=="mobile") {

        u = width * 2.6;
        units = (u/700);

        // TEXT SIZES //
        headerType = Math.round(u/32);
        midType = Math.round(u/47);
        bodyType = Math.round(u/62);
        dataType = Math.round(u/100);
        subType = Math.round(u/90);

    } else {

        u = height * 1.8;
        units = (u/800);

        // TEXT SIZES //
        headerType = Math.round(u/22);
        midType = Math.round(u/35);
        bodyType = Math.round(u/50);
        dataType = Math.round(u/85);
        subType = Math.round(u/90);
    }
}


function getPixelRatio() {
    var cntx = ctx;
    var dpr = window.devicePixelRatio || 1;
    var bsr = cntx.webkitBackingStorePixelRatio ||
        cntx.mozBackingStorePixelRatio ||
        cntx.msBackingStorePixelRatio ||
        cntx.oBackingStorePixelRatio ||
        cntx.backingStorePixelRatio || 1;

    return dpr / bsr;
}
