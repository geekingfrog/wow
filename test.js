(function() {
  'use strict';

  var container = $('#experiment')[0];
  var elWidth = 70;
  var elHeight = 100;
  var elMargin = 40;

  var components = [];

  // transition duration in ms
  var duration = 2000;

  // populate the DOM
  for(var i=-7; i<7; ++i) {
    for(var j=-7; j<7; ++j) {
      var div = document.createElement('div');
      div.classList.add('block', 'x'+i, 'y'+j);
      div.id = String(i)+'-'+String(j);
      if(Math.random() < .5) {
        $(div).append('黑');
      } else {
        $(div).append('瓜');
      }
      container.appendChild(div);
      components.push({
        x: i,
        y: j,
        z: 0,
        el: $(div),
        isMoving: false
      });
    }
  }

  var r = /\s*translate3d\((-?\d+)\w*,\s*(-?\d+)\w*,\s*(-?\d+)\w*\)/;
  var getCurrentTranslate = function(el) {
    el = $(el);
    var transform = $(el).css('transform');
    transform = transform || $(el).css('-moz-transform');
    transform = transform || $(el).css('-webkit-transform');
    var matches = transform.match(r);
    if(matches) {
      var coord = matches.slice(1).map(function(m) {
        return parseInt(m)
      });
      return {
        x: coord[0],
        y: coord[1],
        z: coord[2]
      }
    } else {
      return {x:0, y:0, z:0};
    }
  }

  // random int in [from, to)
  function randomInt(from, to) {
    if(to<from) { // swap them
      to += from;
      from = to - from;
      to = to-from;
    }
    return Math.floor(Math.random()*(to-from+1))+from;
  }

  window.randomInt = randomInt;
  // chose a random timing function
  var timingFunctions = [
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'linear'
  ];


  function move(component, x, y, z, cb) {
    // console.log('move(%d,%d,%d)', x, y, z);
    var el = $(component.el);
    var blockSize = elWidth + elMargin/2;
    x = x*blockSize || 0;
    y = y*blockSize || 0;
    z = z*50 || 0;

    var originalTranslate = getCurrentTranslate(el);
    x+=originalTranslate.x;
    y+=originalTranslate.y;
    z+=originalTranslate.z;

    // don't go too far
    if(x>7) { x-=14; }
    if(x<-7) { x+= 14; }
    if(y>7) { y-=14; }
    if(y<-7) { y+= 14; }
    if(z>4) { z-=4; }
    if(z<-4) { z+= 4; }

    var timingFunction = timingFunctions[randomInt(0, timingFunctions.length)];

    cb = cb || function(){};
    el.animate({
      translate3d: ''+x+'px,'+y+'px,'+z+'px'
    }, duration, timingFunction, cb);
  }

  window.move = move;

  var moveX = function(el, x, cb) { move(el, x, 0, 0, cb); };
  var moveY = function(el, y, cb) { move(el, 0, y, 0, cb); };
  var moveZ = function(el, z, cb) { move(el, 0, 0, z, cb); };

  var oneTransition = [[moveX], [moveY], [moveZ]];
  var twoTransitions = [
    [moveX, moveY],
    [moveX, moveZ],
    [moveY, moveX],
    [moveY, moveZ],
    [moveZ, moveX],
    [moveZ, moveY]
  ];

  var threeTransitions = [
    [moveX, moveY, moveZ],
    [moveX, moveZ, moveY],
    [moveY, moveX, moveZ],
    [moveY, moveZ, moveX],
    [moveZ, moveY, moveX],
    [moveZ, moveX, moveY]
  ];

  var transitions = [oneTransition, twoTransitions, threeTransitions];

  window.moveC = function(component) {
    // number of transitions
    var n = Math.floor(Math.random()*3);

    // random transition
    var t = Math.floor(Math.random()*transitions[n].length);

    var chosenTransitions = transitions[n][t];

    // console.log('n: %d, t:%d',n, t);

    if(chosenTransitions.length == 1) {
      chosenTransitions[0](component, randomInt(-5, 5));
    } else if(chosenTransitions.length == 2) {
      chosenTransitions[0](component, randomInt(-5, 5), function() {
        chosenTransitions[1](component, randomInt(-5, 5));
      });
    } else {
      chosenTransitions[0](component, randomInt(-5, 5), function() {
        chosenTransitions[1](component, randomInt(-5, 5), function() {
          chosenTransitions[2](component, randomInt(-5, 5));
        });
      });
    }
  }

  function moveEverything() {
    components.forEach(function(c) {
      if(Math.random()>.3) { moveC(c); }
    });
  };

  moveEverything();
  setInterval(moveEverything, duration*3);


  /////////////////////////////////
  // zoom handlers below
  /////////////////////////////////

  var scene = {
    el: $('#experiment'),
    rotateX: '',
    rotateY: '-15deg',
    rotateZ: '',
    depth: 0,
    isMoving: false,
    zoomDuration: 500
  }

  // scene.el.css('-webkit-transform', 'rotateY
  scene.el.animate({rotateY: scene.rotateY}, 700);

  // experiment.animate({rotateY: '-15deg'}, 300);
  function zoomIn() {
    if(scene.isMoving) { return; }
    console.log('zooming in');
    scene.isMoving = true;
    scene.depth += 40;
    scene.el.animate({
      rotateY: '-15deg',
      translateZ: scene.depth+'px'
    }, scene.zoomDuration, 'linear', function() {
      scene.isMoving = false;
    });
  }

  function zoomOut() {
    if(scene.isMoving) { return; }
    scene.isMoving = true;
    scene.depth -= 40;
    scene.el.animate({
      rotateY: '-15deg',
      translateZ: scene.depth+'px'
    }, scene.zoomDuration, 'linear', function() {
      scene.isMoving = false;
    });
  }

  window.zi = zoomIn;
  window.zo = zoomOut;

  var zoomInInterval;
  KeyboardJS.on('up', function() {
    if(!zoomInInterval) {
      zoomInInterval = setInterval(zoomIn, scene.zoomDuration);
    }
    zoomIn();
  }, function() {
    console.log('clear zoomin');
    clearInterval(zoomInInterval);
  });

  var zoomOutInterval;
  KeyboardJS.on('down', function() {
    if(!zoomOutInterval) {
      zoomOutInterval = setInterval(zoomOut, scene.zoomDuration);
    }
    zoomOut();
  }, function() {
    clearInterval(zoomOutInterval);
  });

})();
