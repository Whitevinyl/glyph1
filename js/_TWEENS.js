



function alphaTo(obj,d,t,delay,name) {
    t = t || 1;
    delay = delay || 0;

    var cPos = {a: obj.a };

    if (name===dragTween) {
        TWEEN.remove(dragTween);
    }

    var tween = new TWEEN.Tween(cPos);
    if (name===dragTween) {
        dragTween = tween;
    }
    tween.to({ a: d  }, t*1000);
    tween.delay(delay*1000);
    tween.start();

    tween.onUpdate(function() {
        obj.a = this.a;
    });

    tween.easing( TWEEN.Easing.Quadratic.InOut );
}


function pointTo(point,x,y,t) {
    t = t || 1;

    var cPos = {x: point.x, y: point.y };

    var tween = new TWEEN.Tween(cPos);
    tween.to({ X: x, y: y  }, t*1000);
    tween.start();

    tween.onUpdate(function() {
        point.x = this.x;
        point.y = this.y;
    });

    tween.easing( TWEEN.Easing.Quadratic.InOut );
}



function colorTo(col,r,g,b,a,t) {

    t = t || 1000;

    var cPos = {red: col.R, green: col.G, blue: col.B, alpha: col.A };

    var colTween = new TWEEN.Tween(cPos);
    colTween.to({ red: r, green: g, blue: b, alpha: a  }, t*1000);
    colTween.start();

    colTween.onUpdate(function() {
        col.R = Math.round(this.red);
        col.G = Math.round(this.green);
        col.B = Math.round(this.blue);
        col.A = Math.round(this.alpha);
    });

    colTween.easing( TWEEN.Easing.Quadratic.InOut );
}

function colorToColor(col,col2,t) {

    t = t || 1000;

    var cPos = {red: col.R, green: col.G, blue: col.B, alpha: col.A };

    var colTween = new TWEEN.Tween(cPos);
    colTween.to({ red: col2.R, green: col2.G, blue: col2.B, alpha: col2.A  }, t*1000);
    colTween.start();

    colTween.onUpdate(function() {
        col.R = this.red;
        col.G = this.green;
        col.B = this.blue;
        col.A = this.alpha;
    });

    colTween.easing( TWEEN.Easing.Quadratic.InOut );
}

function paletteTo(pal1,pal2,t) {

    var length = pal1.length;
    if (length > pal2.length) {
        length = pal2.length;
    }
    for (var i=0; i<length; i++) {
        colorToColor(pal1[i],pal2[i],t);
    }
}


