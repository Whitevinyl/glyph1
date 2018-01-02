
var params = {
    words: 15,
    wordLength: 11,

    cols: 9,
    rows: 14,
    width: 50,
    height: 70,
    xSpace: 30,
    ySpace: 5,
    orientation: 2,

    cellMin: 10,
    cellMax: 20,

    moveMin: 4,
    moveMax: 8,

    verticalMin: 2,
    verticalMax: 4,
    verticalBezier: 10,
    verticalRepeat: 0,

    diagonalMin: 1,
    diagonalMax: 1,
    diagonalWeight: 10, // orientation
    diagonalBezier: 60,

    arc: 20, //15
    arcRad: 3,

    line: 1.5
}

var gui;
function setupGUI() {
    gui = new dat.GUI({ load: presets });
    gui.remember(params);
    gui.add(params, 'words', 1, 50).step(1);
    gui.add(params, 'wordLength', 1, 50).step(1);

    var f1 = gui.addFolder('Metrics');
    f1.add(params, 'orientation', 1, 2).step(1);
    f1.add(params, 'cols', 1, 50).step(1);
    f1.add(params, 'rows', 1, 50).step(1);
    f1.add(params, 'width', 1, 200).step(1);
    f1.add(params, 'height', 1, 200).step(1);
    f1.add(params, 'xSpace', -20, 100).step(1);
    f1.add(params, 'ySpace', -20, 100).step(1);
    f1.add(params, 'line', 1, 3);

    var f2 = gui.addFolder('Vertical Stroke');
    f2.add(params, 'verticalMin', 0, 10).step(1);
    f2.add(params, 'verticalMax', 0, 10).step(1);
    f2.add(params, 'verticalBezier', 0, 100).step(1);
    f2.add(params, 'verticalRepeat', 0, 100).step(1);

    var f3 = gui.addFolder('Walking Stroke');
    f3.add(params, 'diagonalMin', 0, 10).step(1);
    f3.add(params, 'diagonalMax', 0, 10).step(1);
    f3.add(params, 'cellMin', 1, 100).step(1);
    f3.add(params, 'cellMax', 1, 100).step(1);
    f3.add(params, 'moveMin', 1, 100).step(1);
    f3.add(params, 'moveMax', 1, 100).step(1);
    f3.add(params, 'diagonalBezier', 0, 100).step(1);
    f3.add(params, 'diagonalWeight', 0, 100).step(1);

    var f4 = gui.addFolder('Arc Stroke');
    f4.add(params, 'arc', 0, 100).step(1);
    f4.add(params, 'arcRad', 1, 10).step(1);


    // Iterate over all controllers
  for (var i in gui.__controllers) {
    gui.__controllers[i].onFinishChange(function(){
        glyphUpdate();
    });
  }
  for (var i in f1.__controllers) {
    f1.__controllers[i].onFinishChange(function(){
        glyphUpdate();
    });
  }
  for (var i in f2.__controllers) {
    f2.__controllers[i].onFinishChange(function(){
        glyphUpdate();
    });
  }
  for (var i in f3.__controllers) {
    f3.__controllers[i].onFinishChange(function(){
        glyphUpdate();
    });
  }
  for (var i in f4.__controllers) {
    f4.__controllers[i].onFinishChange(function(){
        glyphUpdate();
    });
  }
}

function glyphUpdate() {
    glyph = new Glyphs(60);
    draw();
}



function Glyphs(y) {
    this.cols = params.cols - 1;
    this.rows = params.rows - 1;
    this.words = [];
    this.chars = [];
    this.ctx = ctx;
    this.y = y;

    this.generate(params.chars);
}
var proto = Glyphs.prototype;

proto.generate = function(n) {
    this.words = [];
    this.chars = [];

    var row = 1 / this.rows;
    var col = 1 / this.cols;

    for (var k=0; k<params.words; k++) {

        // CREATE A WORD //
        var word = [];
        var wm = 0;
        if (k === 0) wm = 2; // minimum length of first word
        var wordLength = tombola.range(wm, params.wordLength);

        for (var i=0; i<wordLength; i++) {
            // CREATE A CHAR //
            var char = [];

            // vertical //
            var xMove = tombola.range(-1,1) / this.cols;
            var yMove = tombola.range(-1,1) / this.rows;
            var vert = tombola.range(params.verticalMin, params.verticalMax);
            for (var j=0; j<vert; j++) {

                if (j > 0 && tombola.percent(params.verticalRepeat)) {
                    var x = lastX;
                    var y = lastY;
                    var h = lastH;
                    char.push( new LinePoint('move', x + xMove, y + yMove));
                    if (lastLine.type==='line') {
                        char.push( new LinePoint('line', x + xMove, y + h + yMove));
                    }
                    else {
                        var p = new LinePoint('bezier', lastLine.x + xMove, lastLine.y + yMove);
                        p.hx = lastLine.hx + xMove;
                        p.hy = lastLine.hy + yMove;
                        p.hx2 = lastLine.hx2 + xMove;
                        p.hy2 = lastLine.hy2 + yMove;
                        char.push( p );
                    }
                    var lastX = x + xMove;
                    var lastY = y + yMove;
                    var lastLine = char[char.length - 1];
                }
                else {
                    var x = tombola.range(0, this.cols) / this.cols;
                    var y = tombola.range(0, this.rows) / this.rows;
                    var h = Math.min(tombola.range(1, (this.rows * 0.75)) / this.rows, 1 - y);
                    char.push( new LinePoint('move', x, y));
                    var lastX = x;
                    var lastY = y;
                    var lastH = h;
                    y += h;

                    if (tombola.percent(params.verticalBezier)) {
                        x = tombola.range(0, this.cols) / this.cols;
                        var p = new LinePoint('bezier', x, y);
                        p.hx = tombola.item([lastX,x]);
                        p.hy = tombola.item([lastY,y]);
                        p.hx2 = tombola.item([lastX,x]);
                        p.hy2 = tombola.item([lastY,y]);
                        char.push( p );
                    }
                    else {
                        char.push( new LinePoint('line', x, y));
                    }
                    var lastLine = char[char.length - 1];
                }

            }


            // diagonal //
            var diag = tombola.range(params.diagonalMin,params.diagonalMax);
            var hw = params.diagonalWeight;
            var ins = 1;
            //if (tombola.percent(33)) diag = tombola.range(1,2);

            for (var j=0; j<diag; j++) {
                var directions = tombola.weightedDeck([0,1,2,3,4,5,6,7], {weights:[1,hw,1,hw,1,hw,1,hw], instances:[1,1,1,1,1,1,1,1]});
                var cells = tombola.range(params.cellMin, params.cellMax); // line length total

                var col = tombola.range(0, this.cols);
                var row = tombola.range(0, this.rows);
                var x = col / this.cols;
                var y = row / this.rows;
                char.push( new LinePoint('move', x, y));

                while (cells > 0) {
                    var dir = directions.draw();
                    if (dir) {
                        var xm = 1;
                        var ym = 1;

                        if (dir > 4) ym = -1;
                        if (dir > 2 && dir < 6) xm = -1;
                        if (dir === 0 || dir === 4) ym = 0;
                        if (dir === 2 || dir === 6) xm = 0;

                        var movement = tombola.range(params.moveMin, params.moveMax);
                        var xNext = col + (movement * xm);
                        var yNext = row + (movement * ym);
                        while (xNext <0 || xNext > this.cols || yNext <0 || yNext > this.rows) {
                            movement -= 1;
                            var xNext = col + (movement * xm);
                            var yNext = row + (movement * ym);
                        }

                        col = xNext;
                        row = yNext;
                        var lastX = x;
                        var lastY = y;
                        x = col / this.cols;
                        y = row / this.rows;
                        cells -= movement;


                        if (tombola.percent(params.diagonalBezier)) {
                            // add instruction to our path //
                            /*var p = new LinePoint('arc', x, y);
                            var radCol = tombola.range(1,4);
                            p.rad = radCol / this.cols;
                            p.start = tombola.item([0,45,90,135,180,225,270,315]);
                            p.end = tombola.item([0,45,90,135,180,225,270,315]);
                            p.direction = (p.end > p.start);
                            char.push( p );*/

                            var p = new LinePoint('bezier', x, y);
                            p.hx = tombola.item([lastX,x]);
                            p.hy = tombola.item([lastY,y]);
                            p.hx2 = tombola.item([lastX,x]);
                            p.hy2 = tombola.item([lastY,y]);
                            char.push( p );
                        }
                        else {
                            char.push( new LinePoint('line', x, y));
                        }

                    }
                    else {
                        //console.log('' + i + ' empty: ' + cells);
                        cells = 0;
                    }
                }
            }


            // arc //
            var arc = 0;
            if (tombola.percent(params.arc)) arc = tombola.range(1, 1);
            for (var j=0; j<arc; j++) {
                var col = tombola.range(0, this.cols);
                var row = tombola.range(0, this.rows);
                var arcX = col / this.cols;
                var arcY = row / this.rows;

                var start = tombola.item([0,90,180,270]);
                var radCol = tombola.range(1,params.arcRad);

                if (start === 0) col += radCol;
                if (start === 90) row += radCol;
                if (start === 180) col -= radCol;
                if (start === 270) row -= radCol;

                var x = col / this.cols;
                var y = row / this.rows;

                char.push( new LinePoint('move', x, y));

                var p = new LinePoint('arc', arcX, arcY);
                p.rad = (radCol * 2) / this.cols;
                p.start = (start / 360) * TAU;
                p.end = (tombola.item([0,90,180,270]) / 360) * TAU;
                p.direction = (p.end > p.start);
                char.push( p );
            }


            word.push(char);
        }
        this.words.push(word);
    }
    console.log(this.words);
};



proto.draw = function() {

    var cx = 60;
    var cy = this.y;
    var w = params.width;
    var h = params.height;
    var xs = params.xSpace;
    var ys = params.ySpace;
    this.ctx.lineWidth = ratio * params.line;
    this.ctx.miterLimit= ratio * params.line;

    // loop through chars, move & draw //
    /*var l = this.chars.length;

    var cols = params.drawCols;
    var rows = Math.ceil(l / cols);

    for (var y=0; y<rows; y++) {
        for (var x=0; x<cols; x++) {
            var n = (y * cols) + x;
            if (n < l) {
                this.ctx.save();
                this.ctx.translate(cx + ((w + xs) * x), cy + ((h + ys) * y));
                this._drawPath(this.chars[n], w, h);
                this.ctx.stroke();
                this.ctx.restore();
            }

        }
    }*/

    if (params.orientation === 2) {
        for (var x=0; x<this.words.length; x++) {
            var word = this.words[x];
            for (var y=0; y<word.length; y++) {
                this.ctx.save();
                this.ctx.translate(cx + ((w + xs) * x), cy + ((h + ys) * y));
                this._drawPath(word[y], w, h);
                this.ctx.stroke();
                this.ctx.restore();
            }
        }
    }
    else {
        for (var y=0; y<this.words.length; y++) {
            var word = this.words[y];
            for (var x=0; x<word.length; x++) {
                this.ctx.save();
                this.ctx.translate(cx + ((w + xs) * x), cy + ((h + ys) * y));
                this._drawPath(word[x], w, h);
                this.ctx.stroke();
                this.ctx.restore();
            }
        }
    }

};



//-------------------------------------------------------------------------------------------
//  PRIVATE METHODS
//-------------------------------------------------------------------------------------------

proto._drawPath = function(char, w, h) {

    this.ctx.beginPath();
    // loop through path instructions list //
    var l2 = char.length;
    for (var j=0; j<l2; j++) {

        this._drawTo(char[j], w, h);
    }

};

proto._drawTo = function(point, w, h) {
    // perform drawing action based on instruction //
    switch (point.type) {
        case 'close':
        this.ctx.closePath();
        break;

        case 'line':
        this.ctx.lineTo(point.x * w, point.y * h);
        break;

        case 'arc':
        this.ctx.arc(point.x * w, point.y * h, point.rad * (w/2), point.start, point.end, point.direction);
        break;

        case 'bezier':
        this.ctx.bezierCurveTo(point.hx * w, point.hy * h, point.hx2 * w, point.hy2 * h, point.x * w, point.y * h);
        break;

        case 'move':
        default:
        this.ctx.moveTo(point.x * w, point.y * h);
        break;
    }
};


//-------------------------------------------------------------------------------------------
//  LINE POINT OBJECT
//-------------------------------------------------------------------------------------------

function LinePoint(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
}
