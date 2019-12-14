window.onload = function() {
  paper.setup(document.getElementById('seudoCanvas'));





  var glyphArray = [];


  var font;
  opentype.load('fonts/Poppins-Medium.ttf', function(err, font1) {
    opentype.load('fonts/Minipax-Regular.ttf', function(err, font2) {

      console.log(font1);
      console.log(font2);

      var newPath = new opentype.Path();

      var font1Glyph = font1.charToGlyph("D");
      var font1Bbox = font1Glyph.getBoundingBox();

      /*font1*/
      //font 1: opentype <-> paperjs conversion
      // var font1Path=font1Glyph.getPath(font1Glyph.xMin, font1Glyph.yMax, 1000);
      var font1Path = font1Glyph.path;
      var font1PathData = font1Path.toPathData();
      var font1SVG = font1Path.toSVG();
      var font1PprPath = new paper.CompoundPath();
      font1PprPath.importSVG(font1SVG);
      //  font1PprPath.strokeColor = 'black';
      console.log(font1PprPath);
      var from = new paper.Point(font1Bbox.x1, font1Bbox.y1);
      var to = new paper.Point(font1Bbox.x2 / 2, font1Bbox.y2);
      console.log(font1Bbox.x2 / 2, font1Bbox.y2);
      var path_left = new paper.Path.Rectangle(from, to);
      //  path_left.strokeColor = 'black';
      newPath = path_left.intersect(font1PprPath);
    //  newPath.fillColor = 'black';

      /*font2*/

      var font2Glyph = font2.charToGlyph("D");
      var font2Bbox = font2Glyph.getBoundingBox();
      //font 2: opentype <-> paperjs conversion
      // var font2Path=font2Glyph.getPath(font2Glyph.xMin, font2Glyph.yMax, 1000);
      var font2Path = font2Glyph.path;
      var font2PathData = font2Path.toPathData();
      var font2SVG = font2Path.toSVG();
      var font2PprPath = new paper.CompoundPath();
      font2PprPath.importSVG(font2SVG);
      //  font1PprPath.strokeColor = 'black';
      console.log(font2PprPath);
      var from = new paper.Point(font1Bbox.x2 / 2, font2Bbox.y1); //use font1bbox to avoid gao
      var to = new paper.Point(font2Bbox.x2, font2Bbox.y2);
      console.log(font2Bbox.x2 / 2, font2Bbox.y2);
      var path_right = new paper.Path.Rectangle(from, to);
      //  path_left.strokeColor = 'black';
      var newPath1 = path_right.intersect(font2PprPath);
      newPath = newPath.unite(newPath1);
      newPath.scale(0.3);
      newPath.position=new paper.Point(120,12]vh c[..................  0);
      newPath.fillColor = 'black';




      console.log(newPath);



      // var newglyph = new opentype.Glyph({
      //   name: 'B',
      //   unicode: 66,
      //   advanceWidth: 650,
      //   path: glyphArray
      // });

      // intersect(path[, options])
      //  font=font1;



      /* convert to glyph*/ //thanks to someone named sepher?

      var fragments = newPath.segments;
      console.log(fragments);


      // var glyphName = fragments.children[i].name;
      //
      // if (glyphName.indexOf('0x') > -1) {
      //   var unicode = String.fromCharCode(parseInt(glyphName, 16));
      //   glyphName = 'uni' + glyphName.charCodeAt(0);
      // } else {
      //   var unicode = glyphName.charCodeAt(0);
      // }


      var letterScale=1;
      var letterPosCorrectionX=0;
      var letterPosCorrectionY=0;



      var glyphPath = new opentype.Path();
      var w = 0;

      //Going through the array with the segments of the paper.js Path
      for (var i2 = 0; i2 < fragments.length; i2++) {

        if (i2 === 0) {
          // if its the first segment use move to
          glyphPath.moveTo(x, y);
        } else   if (i2 + 1 == fragments.length) {
            glyphPath.close();
          }else{

          // handle In
          var x1 = fragments[i2 - 1].handleOut.x * letterScale;
          var y1 = fragments[i2 - 1].handleOut.y  * letterScale;
          // handle Out
          var x2 = fragments[i2].handleIn.x * letterScale;
          var y2 = fragments[i2].handleIn.y * letterScale;

          // Point
          var x = fragments[i2].point.x;
          var y = fragments[i2].point.y;


          if (x1 == 0 && y1 == 0 && x2 == 0 && y2 == 0) {
          // if there is no curve use line to
          glyphPath.lineTo(x, y);
        } else {
          // use curve if its a curve

          var lastX = fragments[i2 - 1].point.x * letterScale - letterPosCorrectionX;
          var lastY = fragments[i2 - 1].point.y  * letterScale - letterPosCorrectionY;
          glyphPath.curveTo(x1 + lastX, y1 + lastY, x2 + x, y2 + y, x, y);

        }


      }

      if(x>w){ w=x;}

      }
    //w=Math.max(font1Bbox.x2,font2Bbox.x2);
      console.log(w);


      var glyph = new opentype.Glyph({
        name: "D",
        unicode:6,
        advanceWidth: (w + 1),
        path: glyphPath
      });

      glyphArray.push(glyph);


      //create fonts and canvases
      var font = new opentype.Font({
        familyName: 'Something',
        styleName: 'Medium',
        unitsPerEm: 1000,
        ascender: 800,
        descender: -200,
        glyphs: glyphArray
      });

  console.log(glyphArray);


      var buffer = font.toArrayBuffer();
      var font3 = opentype.parse(buffer);

      //document.getElementById('fontFamilyName').innerHTML = font2.names.fontFamily.en;
      for (var i = 0; i < font3.glyphs.length; i++) {
        var glyph = font.glyphs.get(i);
        var ctx = createGlyphCanvas(glyph, 150);
        var x = 50;
        var y = 120;
        var fontSize = 72;
        glyph.draw(ctx, x, y, fontSize);
        // glyph.drawPoints(ctx, x, y, fontSize);
        // glyph.drawMetrics(ctx, x, y, fontSize);
      }
      font.download();

      function createGlyphCanvas(glyph, size) {
        var canvasId, html, glyphsDiv, wrap, canvas, ctx;
        canvasId = 'c' + glyph.index;
        html = '<div class="wrapper" style="width:' + size + 'px"><canvas id="' + canvasId + '" width="' + size + '" height="' + size + '"></canvas><span>' + glyph.index + '</span></div>';
        glyphsDiv = document.getElementById('glyphs');
        wrap = document.createElement('div');
        wrap.innerHTML = html;
        glyphsDiv.appendChild(wrap);
        canvas = document.getElementById(canvasId);
        ctx = canvas.getContext('2d');
        return ctx;
      }



      //font.download();
    });

  });


}
