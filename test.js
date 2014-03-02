(function() {
  'use strict';

  var container = $('#experiment')[0];
  var elWidth = 100;
  var elHeight = 100;
  var elMargin = 40;

  var components = [];

  // transition duration in ms
  var duration = 2500;

  // populate the DOM
  for(var i=-5; i<5; ++i) {
    for(var j=-5; j<5; ++j) {
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

  window.getCurrentTranslate = getCurrentTranslate;

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

  function move(el, x, y, z, cb) {
    // console.log('move(%d,%d,%d)', x, y, z);
    var blockSize = elWidth + elMargin/2;
    x = x*blockSize || 0;
    y = y*blockSize || 0;
    z = z*100 || 0;

    var originalTranslate = getCurrentTranslate(el);
    x+=originalTranslate.x;
    y+=originalTranslate.y;
    z+=originalTranslate.z;

    cb = cb || function(){};
    el.animate({
      translate3d: ''+x+'px,'+y+'px,'+z+'px'
    }, duration, 'ease-in-out', cb);
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

  window.moveC = function(el) {
    var randomIdx = randomInt(0, components.length);
    var c = components[randomIdx];
    // number of transitions
    var n = Math.floor(Math.random()*3);

    // random transition
    var t = Math.floor(Math.random()*transitions[n].length);

    var chosenTransitions = transitions[n][t];

    console.log('n: %d, t:%d',n, t);

    if(chosenTransitions.length == 1) {
      chosenTransitions[0](el, randomInt(-3, 3));
    } else if(chosenTransitions.length == 2) {
      chosenTransitions[0](el, randomInt(-3, 3), function() {
        chosenTransitions[1](el, randomInt(-3, 3));
      });
    } else {
      chosenTransitions[0](el, randomInt(-3, 3), function() {
        chosenTransitions[1](el, randomInt(-3, 3), function() {
          chosenTransitions[2](el, randomInt(-3, 3));
        });
      });
    }
  }

  $('.block').each(function() {
    var el = $(this);
    moveC($(this));
    // setInterval(function() {
    //   if(Math.random() < .2) {randomZ(el);}
    // }, 2500);
  });

})();
