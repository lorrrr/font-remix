// create fonts and canvases
  var font = new opentype.Font({
    familyName: 'OpenTypeSans',
    styleName: 'Medium',
    unitsPerEm: 1000,
    ascender: 800,
    descender: -200,
    glyphs: glyphArray});


  var buffer = font.toArrayBuffer();
  var font2 = opentype.parse(buffer);
  //document.getElementById('fontFamilyName').innerHTML = font2.names.fontFamily.en;
  for (var i = 0; i < font2.glyphs.length; i++) {
      var glyph = font2.glyphs.get(i);
      var ctx = createGlyphCanvas(glyph, 150);
      var x = 50;
      var y = 120;
      var fontSize = 72;
     glyph.draw(ctx, x, y, fontSize);
       glyph.drawPoints(ctx, x, y, fontSize);
       glyph.drawMetrics(ctx, x, y, fontSize);
  }

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





  ////////////////////////////


  plumin.paper.setup('hidden-canvas');

  var _URL = window.URL || window.webkitURL,
    lastBuffer,
    lastSubset,
    pluminSource,
    lightBuffer,
    heavyBuffer,
    worker,
    // this font will be used for its addToFonts method
    font = new plumin.Font({
      familyName: 'Demo'
    });

  _get('dist/plumin.js', 'text', function(response) {
    pluminSource = response;
    if ( pluminSource && lightBuffer && heavyBuffer ) {
      _initWorker();
    }
  });

  _get('fonts/CoelacLight.otf', 'arraybuffer', function(response) {
    lightBuffer = response;
    if ( pluminSource && lightBuffer && heavyBuffer ) {
      _initWorker();
    }
  });

  _get('fonts/CoelacHeavy.otf', 'arraybuffer', function(response) {
    heavyBuffer = response;
    if ( pluminSource && lightBuffer && heavyBuffer ) {
      _initWorker();
    }
  });

  function _get(url, type, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = type;
    xhr.onload = function () {
      if ( this.status === 200 ) {
        cb( this.response );
      }
    };
    xhr.send();
  }

  function _initWorker() {
    // Create a worker using the inline script tag below
    // (only to avoid adding one more file to the project)
    worker = new Worker(
      _URL.createObjectURL( new Blob(
        [document.getElementById('workerscript')
          .textContent
          .replace('PLUMINSOURCE', pluminSource)],
        {type: "text/javascript"}
      ))
    );

    worker.postMessage(
      // message
      [lightBuffer, heavyBuffer],
      // transfer list
      [lightBuffer, heavyBuffer]
    );

    // send initial subset
    worker.postMessage(
      lastSubset = _subsetFromText(
        document.getElementById('result').value
      )
    );

    worker.onmessage = function(e) {
      console.log(e);
      lastBuffer = e.data;
      font.addToFonts( lastBuffer );
    };
  }

  function _subsetFromText( text ) {
    return text.split('')
      .filter(function(e, i, arr) {
        return arr.lastIndexOf(e) === i;
      })
      .sort()
      .join('');
  }

  // TODO: throttle calls
  function _interpolate( value ) {
    if ( !worker ) {
      return;
    }

    worker.postMessage( +value );
  }

  // TODO: throttle calls
  function _subset( value ) {
    var tmp = _subsetFromText( value );

    if ( tmp !== lastSubset ) {
      worker.postMessage( lastSubset = tmp );
    }
  }

  function _download() {
    return lastBuffer ?
      font.download( lastBuffer ):
      window.font
        .updateOTCommands()
        .download();
  }
</script>

<script id="workerscript" type="text/workerscript">
  var otFont,
    otFont0,
    otFont1,
    font,
    font0,
    font1,
    coef = 0;

  // importScripts doesn't work with inline worker.
  // The following placeholder will be replaced with plumin source.
  // You wouldn't use inline workers and this trick in prod, though.
  PLUMINSOURCE

  plumin.paper.install(this);
  plumin.paper.setup({
    width: 1024,
    height: 1024
  });

  // Overwrite addToFonts to send the buffer over to the UI
  plumin.paper.Font.prototype.addToFonts = function() {
    var buffer = this.ot.toArrayBuffer();
    postMessage( buffer, [buffer] );
  };

  onmessage = function( message ) {
    var data = message.data;

    switch ( typeof data ) {
    // parse incoming .otf ArrayBuffers
    case 'object':
      if ( !data[0] || data[0].constructor !== ArrayBuffer ) {
        return;
      }

      otFont = plumin.opentype.parse( data[0] );
      otFont0 = plumin.opentype.parse( data[0] );
      otFont1 = plumin.opentype.parse( data[1] );

      font = new plumin.paper.Font();
      // save default encoding
      var encoding = font.ot.encoding;
      font.importOT( otFont );
      font.ot.familyName = 'Demo';
      font.ot.encoding = encoding;

      font0 = new plumin.paper.Font();
      font0.importOT( otFont0 );
      font0.ot.familyName = 'font0';

      font1 = new plumin.paper.Font();
      font1.importOT( otFont1 );
      font1.ot.familyName = 'font1';
      break;

    // parse incoming subset
    case 'string':
      // TODO: optimize to only interpolate new glyphs added to the subset
      font.subset = data;
      font.interpolate(font0, font1, coef);
      font.updateOTCommands();
      font.addToFonts();
      break;

    // parse incoming interpolation coef
    case 'number':
      coef = data;
      font.interpolate(font0, font1, coef);
      font.updateOTCommands();
      font.addToFonts();
      break;
    }
  };
