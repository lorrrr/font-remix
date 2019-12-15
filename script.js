window.onload = function() {
  paper.setup(document.getElementById('seudoCanvas'));

  $("head").append("<style type=\"text/css\">" +
    "@font-face {\n" +
    "\tfont-family: \"font1\";\n" +
    "\tsrc: local('☺'), url(\"fonts/Solide_Mirage-Etroit.ttf\");\n" +
    "}\n" +
    "\t#font1test {\n" +
    "\tfont-family: font1 !important;\n" +
    "}\n" +
    "</style>");

  $("head").append("<style type=\"text/css\">" +
    "@font-face {\n" +
    "\tfont-family: \"font2\";\n" +
    "\tsrc: local('☺'), url(\"fonts/Archivo-Regular.ttf\");\n" +
    "}\n" +
    "\t#font2test {\n" +
    "\tfont-family: font2 !important;\n" +
    "}\n" +
    "</style>");
  draw("fonts/" + $("#dropdown1").html(), "fonts/" + $("#dropdown2").html(), type);
  $("h1").html($("#dropdown1").html().substring(0, 3) + $("#dropdown2").html().substring(0, 3).toLowerCase() + "-" + type + ".otf");

}




function draw(font1, font2, type) {

  var glyphArray = [];

  var rect = new paper.Path.Rectangle({
    point: [-1, -1],
    size: [paper.view.size.width + 3, paper.view.size.height + 3],

    fillColor: 'white',
    selected: true
  });
  rect.bringToFront();

  var font;
  opentype.load(font1, function(err, font1) {
    opentype.load(font2, function(err, font2) {


      console.log(font1);
      console.log(font2);
      for (var i = 65; i <= 90; i++) {
        makeGlyph(i);
      }
      for (var i = 48; i <= 57; i++) {
        makeGlyph(i);
      }

      function makeGlyph(ascii) {
        var newPath = new opentype.Path();

        var font1Glyph = font1.charToGlyph(String.fromCharCode(ascii));

        var font1Bbox = font1Glyph.getBoundingBox();
        switch (type) {
          case "vHalfFold":
            vHalfFold();
            break;
          case "hHalfFold":
            hHalfFold();
            break;
          case "diagAHalfFold":
            diagHalfFoldA();
            break;
          case "diagBHalfFold":
            diagHalfFoldB();
            break;
          case "triFold":
            triFold();
            break;
          case "quadFold":
            quadFold();
            break;

          case "checker":
            checker();
            break;

          default:
            vHalfFold();
        }



        newPath.scale(0.13);
        if (ascii > 60) {
          newPath.position = new paper.Point((ascii - 65) % 10 * 123 + 60, Math.floor((ascii - 65) / 10) * 130 + 100);
        } else {
          newPath.position = new paper.Point((ascii - 18) % 10 * 110 + 60, Math.floor((ascii - 18) / 10) * 130 + 100);
          //console.log(font1Bbox.y2,font1Path._position.y);
        }
        newPath.fillColor = 'black';

        /*instances*/
        function vHalfFold() {

          /*font1*/
          //font 1: opentype <-> paperjs conversion
          // var font1Path=font1Glyph.getPath(font1Glyph.xMin, font1Glyph.yMax, 1000);
          var font1Path = font1Glyph.path;
          var font1PathData = font1Path.toPathData();
          var font1SVG = font1Path.toSVG();
          var font1PprPath = new paper.CompoundPath();
          font1PprPath.importSVG(font1SVG);
          //  font1PprPath.strokeColor = 'black';


          /*font2*/

          var font2Glyph = font2.charToGlyph(String.fromCharCode(ascii));
          var font2Bbox = font2Glyph.getBoundingBox();
          //font 2: opentype <-> paperjs conversion
          // var font2Path=font2Glyph.getPath(font2Glyph.xMin, font2Glyph.yMax, 1000);
          var font2Path = font2Glyph.path;
          var font2PathData = font2Path.toPathData();
          var font2SVG = font2Path.toSVG();
          var font2PprPath = new paper.CompoundPath();
          font2PprPath.importSVG(font2SVG);
          //  font1PprPath.strokeColor = 'black';


          var mid = Math.max(font1Bbox.x2, font2Bbox.x2) / 2;

          /*path_left*/
          var from = new paper.Point(font1Bbox.x1 - 1, font1Bbox.y1 - 1);
          var to = new paper.Point(mid, font1Bbox.y2 + 1);
          var path_left = new paper.Path.Rectangle(from, to);
          //  path_left.strokeColor = 'black';
          newPath = path_left.intersect(font1PprPath);
          //  newPath.fillColor = 'black';

          /*path_right*/

          var from = new paper.Point(mid, font2Bbox.y1 - 1); //use font1bbox to avoid gaps
          var to = new paper.Point(font2Bbox.x2 + 1, font2Bbox.y2 + 1);
          var path_right = new paper.Path.Rectangle(from, to);
          //  path_left.strokeColor = 'black';
          var newPath1 = path_right.intersect(font2PprPath);
          newPath = newPath.unite(newPath1);
        }

        function hHalfFold() {

          /*font1*/
          //font 1: opentype <-> paperjs conversion
          // var font1Path=font1Glyph.getPath(font1Glyph.xMin, font1Glyph.yMax, 1000);
          var font1Path = font1Glyph.path;
          var font1PathData = font1Path.toPathData();
          var font1SVG = font1Path.toSVG();
          var font1PprPath = new paper.CompoundPath();
          font1PprPath.importSVG(font1SVG);
          //  font1PprPath.strokeColor = 'black';


          /*font2*/

          var font2Glyph = font2.charToGlyph(String.fromCharCode(ascii));
          var font2Bbox = font2Glyph.getBoundingBox();
          //font 2: opentype <-> paperjs conversion
          // var font2Path=font2Glyph.getPath(font2Glyph.xMin, font2Glyph.yMax, 1000);
          var font2Path = font2Glyph.path;
          var font2PathData = font2Path.toPathData();
          var font2SVG = font2Path.toSVG();
          var font2PprPath = new paper.CompoundPath();
          font2PprPath.importSVG(font2SVG);
          //  font1PprPath.strokeColor = 'black';


          //  var mid = font1Bbox.y2 / 2;
          var mid = 360;
          console.log(mid);

          var from = new paper.Point(font1Bbox.x1 - 1, font1Bbox.y1 + 1);
          var to = new paper.Point(font1Bbox.x2 + 1, mid);
          var path_left = new paper.Path.Rectangle(from, to);
          //  path_left.strokeColor = 'black';
          newPath = path_left.intersect(font1PprPath);
          //  newPath.fillColor = 'black';


          var from = new paper.Point(font2Bbox.x1 - 1, mid);
          var to = new paper.Point(font2Bbox.x2 + 1, font2Bbox.y2 + 1);

          var path_right = new paper.Path.Rectangle(from, to);
          //  path_left.strokeColor = 'black';
          var newPath1 = path_right.intersect(font2PprPath);
          newPath = newPath.unite(newPath1);
        }

        function diagHalfFoldA() {


          var font1w = font1.charToGlyph("A");
          var font1wBbox =font1w.getBoundingBox();
          var font2w = font2.charToGlyph("A");
          var font2wBbox =font2w.getBoundingBox();

          var font1q = font1.charToGlyph("Q");
          var font1qBbox =font1q.getBoundingBox();
          var font2q = font2.charToGlyph("Q");
          var font2qBbox =font2q.getBoundingBox();

          var xMax=Math.max(font1wBbox.x2,font2wBbox.x2,font1qBbox.x2,font2qBbox.x2)+20;
          var yMax=Math.max(font1wBbox.y2,font2wBbox.y2,font1qBbox.y2,font2qBbox.y2)+20;
          var xMin=Math.min(font1wBbox.x1,font2wBbox.x1,font1qBbox.x1,font2qBbox.x1)-20;
          var yMin=Math.min(font1wBbox.y1,font2wBbox.y1,font1qBbox.y1,font2qBbox.y1)-20;


            /*font1*/
            //font 1: opentype <-> paperjs conversion
            // var font1Path=font1Glyph.getPath(font1Glyph.xMin, font1Glyph.yMax, 1000);
          var font1Path = font1Glyph.path;
          var font1PathData = font1Path.toPathData();
          var font1SVG = font1Path.toSVG();
          var font1PprPath = new paper.CompoundPath();
          font1PprPath.importSVG(font1SVG);
          //  font1PprPath.strokeColor = 'black';


          /*font2*/

          var font2Glyph = font2.charToGlyph(String.fromCharCode(ascii));
          var font2Bbox = font2Glyph.getBoundingBox();
          //font 2: opentype <-> paperjs conversion
          // var font2Path=font2Glyph.getPath(font2Glyph.xMin, font2Glyph.yMax, 1000);
          var font2Path = font2Glyph.path;
          var font2PathData = font2Path.toPathData();
          var font2SVG = font2Path.toSVG();
          var font2PprPath = new paper.CompoundPath();
          font2PprPath.importSVG(font2SVG);
          //  font1PprPath.strokeColor = 'black';



          var from = new paper.Point(xMax,yMax);
          var to = new paper.Point(xMin,yMin);


          var corner = new paper.Point(xMin,yMax);

          var path_left = new paper.Path();
          path_left.add(from, to, corner);
          //  path_left.strokeColor = 'black';
          newPath = path_left.intersect(font1PprPath);
          //  newPath.fillColor = 'black';



          var corner = new paper.Point(xMax,yMin);

          var path_right = new paper.Path();
          path_right.add(from, to, corner);
          //  path_left.strokeColor = 'black';
          var newPath1 = path_right.intersect(font2PprPath);
          newPath = newPath.unite(newPath1);
        }


        function diagHalfFoldB() {


          var font1w = font1.charToGlyph("X");
          var font1wBbox =font1w.getBoundingBox();
          var font2w = font2.charToGlyph("X");
          var font2wBbox =font2w.getBoundingBox();

          var font1q = font1.charToGlyph("Q");
          var font1qBbox =font1q.getBoundingBox();
          var font2q = font2.charToGlyph("Q");
          var font2qBbox =font2q.getBoundingBox();

          var xMax=Math.max(font1wBbox.x2,font2wBbox.x2,font1qBbox.x2,font2qBbox.x2)+20;
          var yMax=Math.max(font1wBbox.y2,font2wBbox.y2,font1qBbox.y2,font2qBbox.y2)+20;
          var xMin=Math.min(font1wBbox.x1,font2wBbox.x1,font1qBbox.x1,font2qBbox.x1)-20;
          var yMin=Math.min(font1wBbox.y1,font2wBbox.y1,font1qBbox.y1,font2qBbox.y1)-20;

            /*font1*/
            //font 1: opentype <-> paperjs conversion
            // var font1Path=font1Glyph.getPath(font1Glyph.xMin, font1Glyph.yMax, 1000);
          var font1Path = font1Glyph.path;
          var font1PathData = font1Path.toPathData();
          var font1SVG = font1Path.toSVG();
          var font1PprPath = new paper.CompoundPath();
          font1PprPath.importSVG(font1SVG);
          //  font1PprPath.strokeColor = 'black';


          /*font2*/

          var font2Glyph = font2.charToGlyph(String.fromCharCode(ascii));
          var font2Bbox = font2Glyph.getBoundingBox();
          //font 2: opentype <-> paperjs conversion
          // var font2Path=font2Glyph.getPath(font2Glyph.xMin, font2Glyph.yMax, 1000);
          var font2Path = font2Glyph.path;
          var font2PathData = font2Path.toPathData();
          var font2SVG = font2Path.toSVG();
          var font2PprPath = new paper.CompoundPath();
          font2PprPath.importSVG(font2SVG);
          //  font1PprPath.strokeColor = 'black';




          var from = new paper.Point(xMax,yMin);
          var to = new paper.Point(xMin,yMax);


          var corner = new paper.Point(xMin,yMin);

          var path_left = new paper.Path();
          path_left.add(from, to, corner);
          //  path_left.strokeColor = 'black';
          newPath = path_left.intersect(font1PprPath);
          //  newPath.fillColor = 'black';



          var corner = new paper.Point(xMax,yMax);

          var path_right = new paper.Path();
          path_right.add(from, to, corner);
          //  path_left.strokeColor = 'black';
          var newPath1 = path_right.intersect(font2PprPath);
          newPath = newPath.unite(newPath1);
        }


        function triFold() {

          /*font1*/
          //font 1: opentype <-> paperjs conversion
          // var font1Path=font1Glyph.getPath(font1Glyph.xMin, font1Glyph.yMax, 1000);
          var font1Path = font1Glyph.path;
          var font1PathData = font1Path.toPathData();
          var font1SVG = font1Path.toSVG();
          var font1PprPath = new paper.CompoundPath();
          font1PprPath.importSVG(font1SVG);
          //  font1PprPath.strokeColor = 'black';

          /*font2*/

          var font2Glyph = font2.charToGlyph(String.fromCharCode(ascii));
          var font2Bbox = font2Glyph.getBoundingBox();
          //font 2: opentype <-> paperjs conversion
          // var font2Path=font2Glyph.getPath(font2Glyph.xMin, font2Glyph.yMax, 1000);
          var font2Path = font2Glyph.path;
          var font2PathData = font2Path.toPathData();
          var font2SVG = font2Path.toSVG();
          var font2PprPath = new paper.CompoundPath();
          font2PprPath.importSVG(font2SVG);


          //var mid = font1Bbox.y2 / 2;
          var mid1 = 240;
          var mid2 = 480;
          console.log(mid1);

          var from = new paper.Point(font1Bbox.x1 - 1, font1Bbox.y1 - 1);
          var to = new paper.Point(font1Bbox.x2 + 1, mid1);
          var path_top = new paper.Path.Rectangle(from, to);
          //  path_left.strokeColor = 'black';
          newPath = path_top.intersect(font1PprPath);
          //  newPath.fillColor = 'black';

          from = new paper.Point(font2Bbox.x1 - 1, mid1);
          to = new paper.Point(font2Bbox.x2 + 1, mid2);
          var path_mid = new paper.Path.Rectangle(from, to);
          var newPath1 = path_mid.intersect(font2PprPath);
          newPath = newPath.unite(newPath1);

          from = new paper.Point(font1Bbox.x1 - 1, mid2);
          to = new paper.Point(font1Bbox.x2 + 1, font1Bbox.y2 + 1);

          var path_bottom = new paper.Path.Rectangle(from, to);
          //  path_left.strokeColor = 'black';
          var newPath2 = path_bottom.intersect(font1PprPath);
          newPath = newPath.unite(newPath2);
        }

        function quadFold() {

          /*font1*/
          //font 1: opentype <-> paperjs conversion
          // var font1Path=font1Glyph.getPath(font1Glyph.xMin, font1Glyph.yMax, 1000);
          var font1Path = font1Glyph.path;
          var font1PathData = font1Path.toPathData();
          var font1SVG = font1Path.toSVG();
          var font1PprPath = new paper.CompoundPath();
          font1PprPath.importSVG(font1SVG);
          //  font1PprPath.strokeColor = 'black';

          /*font2*/

          var font2Glyph = font2.charToGlyph(String.fromCharCode(ascii));
          var font2Bbox = font2Glyph.getBoundingBox();
          //font 2: opentype <-> paperjs conversion
          // var font2Path=font2Glyph.getPath(font2Glyph.xMin, font2Glyph.yMax, 1000);
          var font2Path = font2Glyph.path;
          var font2PathData = font2Path.toPathData();
          var font2SVG = font2Path.toSVG();
          var font2PprPath = new paper.CompoundPath();
          font2PprPath.importSVG(font2SVG);


          //var mid = font1Bbox.y2 / 2;
          var mid = 180;
          var mid1 = 360;
          var mid2 = 540;

          var from = new paper.Point(font1Bbox.x1 - 1, font1Bbox.y1 - 1);
          var to = new paper.Point(font1Bbox.x2 + 1, mid);
          var path_top = new paper.Path.Rectangle(from, to);
          //  path_left.strokeColor = 'black';
          newPath = path_top.intersect(font1PprPath);

          from = new paper.Point(font2Bbox.x1 - 1, mid);
          to = new paper.Point(font2Bbox.x2 + 1, mid1);
          path_mid0 = new paper.Path.Rectangle(from, to);
          //  path_left.strokeColor = 'black';
          var newPath0 = path_mid0.intersect(font2PprPath);
          newPath = newPath.unite(newPath0);


          from = new paper.Point(font1Bbox.x1 - 1, mid1);
          to = new paper.Point(font1Bbox.x2 + 1, mid2);
          var path_mid = new paper.Path.Rectangle(from, to);
          var newPath1 = path_mid.intersect(font1PprPath);
          newPath = newPath.unite(newPath1);

          from = new paper.Point(font2Bbox.x1 - 1, mid2);
          to = new paper.Point(font2Bbox.x2 + 1, font2Bbox.y2 + 1);

          var path_bottom = new paper.Path.Rectangle(from, to);
          //  path_left.strokeColor = 'black';
          var newPath2 = path_bottom.intersect(font2PprPath);
          newPath = newPath.unite(newPath2);
        }

        function checker() {

          /*font1*/
          //font 1: opentype <-> paperjs conversion
          // var font1Path=font1Glyph.getPath(font1Glyph.xMin, font1Glyph.yMax, 1000);
          var font1Path = font1Glyph.path;
          var font1PathData = font1Path.toPathData();
          var font1SVG = font1Path.toSVG();
          var font1PprPath = new paper.CompoundPath();
          font1PprPath.importSVG(font1SVG);
          //  font1PprPath.strokeColor = 'black';

          /*font2*/

          var font2Glyph = font2.charToGlyph(String.fromCharCode(ascii));
          var font2Bbox = font2Glyph.getBoundingBox();
          //font 2: opentype <-> paperjs conversion
          // var font2Path=font2Glyph.getPath(font2Glyph.xMin, font2Glyph.yMax, 1000);
          var font2Path = font2Glyph.path;
          var font2PathData = font2Path.toPathData();
          var font2SVG = font2Path.toSVG();
          var font2PprPath = new paper.CompoundPath();
          font2PprPath.importSVG(font2SVG);


          //var mid = font1Bbox.y2 / 2;
          var midh = Math.max(font1Bbox.x2, font2Bbox.x2) / 2;
          var midv = 360;


          var from = new paper.Point(font1Bbox.x1 - 1, font1Bbox.y1 - 1);
          var to = new paper.Point(midh, midv);
          var path_top = new paper.Path.Rectangle(from, to);
          //  path_left.strokeColor = 'black';
          newPath = path_top.intersect(font1PprPath);

          from = new paper.Point(midh, font2Bbox.y1 - 1);
          to = new paper.Point(font2Bbox.x2 + 1, midv);
          path_mid0 = new paper.Path.Rectangle(from, to);
          //  path_left.strokeColor = 'black';

          var newPath0 = path_mid0.intersect(font2PprPath);
          newPath = newPath.unite(newPath0);


          from = new paper.Point(font2Bbox.x1 - 1, midv);
          to = new paper.Point(midh, font2Bbox.y2 + 1);
          var path_mid = new paper.Path.Rectangle(from, to);
          var newPath1 = path_mid.intersect(font2PprPath);
          newPath = newPath.unite(newPath1);

          from = new paper.Point(midh, midv);
          to = new paper.Point(font1Bbox.x2 + 1, font1Bbox.y2 + 1);

          var path_bottom = new paper.Path.Rectangle(from, to);
          //  path_left.strokeColor = 'black';
          var newPath2 = path_bottom.intersect(font1PprPath);
          newPath = newPath.unite(newPath2);
        }

        // var newglyph = new opentype.Glyph({
        //   name: 'B',
        //   unicode: 66,
        //   advanceWidth: 650,
        //   path: glyphArray
        // });

        // intersect(path[, options])
        //  font=font1;


        //
        //   /* convert to glyph*/
        //
        //   var fragments = newPath.segments;
        //   console.log(newPath.segments);
        //
        //
        //
        //
        //   var letterScale=1;
        //   var letterPosCorrectionX=0;
        //   var letterPosCorrectionY=0;
        //
        //
        //
        //   var glyphPath = new opentype.Path();
        //   var w = 0;
        //
        //   //Going through the array with the segments of the paper.js Path
        //   for (var i2 = 0; i2 < fragments.length; i2++) {
        //
        //     if (i2 === 0) {
        //       // if its the first segment use move to
        //       glyphPath.moveTo(x, y);
        //     } else   if (i2 + 1 == fragments.length) {
        //         glyphPath.close();
        //       }else{
        //
        //       // handle In
        //       var x1 = fragments[i2 - 1].handleOut.x * letterScale;
        //       var y1 = fragments[i2 - 1].handleOut.y  * letterScale;
        //       // handle Out
        //       var x2 = fragments[i2].handleIn.x * letterScale;
        //       var y2 = fragments[i2].handleIn.y * letterScale;
        //
        //       // Point
        //       var x = fragments[i2].point.x;
        //       var y = fragments[i2].point.y;
        //
        //
        //       if (x1 == 0 && y1 == 0 && x2 == 0 && y2 == 0) {
        //       // if there is no curve use line to
        //       glyphPath.lineTo(x, y);
        //     } else {
        //       // use curve if its a curve
        //
        //       var lastX = fragments[i2 - 1].point.x * letterScale - letterPosCorrectionX;
        //       var lastY = fragments[i2 - 1].point.y  * letterScale - letterPosCorrectionY;
        //       glyphPath.curveTo(x1 + lastX, y1 + lastY, x2 + x, y2 + y, x, y);
        //
        //     }
        //
        //
        //   }
        //
        //   if(x>w){ w=x;}
        //
        //   }
        // //w=Math.max(font1Bbox.x2,font2Bbox.x2);
        //   console.log(w);
        //
        //
        //   var glyph = new opentype.Glyph({
        //     name: String.fromCharCode(ascii),
        //     unicode:ascii,
        //     advanceWidth: (w + 1),
        //     path: glyphPath
        //   });
        //
        //   glyphArray.push(glyph);
        //   console.log(  glyphArray);

      } //end of makeGlyph



      //create fonts and canvases
      var font = new opentype.Font({
        familyName: 'Something',
        styleName: 'Medium',
        unitsPerEm: 1000,
        ascender: 800,
        descender: -200,
        glyphs: glyphArray
      });



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
      //font.download();

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
