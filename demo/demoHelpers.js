var helpers = new (function () {
  this.generateRandomData = function (numElems, type, prediction) {
    var types = { linear, logarithmic, power, exponential };
    var fn = (types[type] || types.exponential)();
    var delta = 0;
    return new Array(numElems).fill(0).map(function (v, i) {
      return !i || (prediction == 'last' && i >= demo.NUM_NORMAL_ELEMS)
        ? null
        : fn(i) + helpers.rnd(delta);
    });
  };

  function linear() {
    var A = helpers.rnd(10) + 10,
      B = helpers.rnd(100),
      rnd = f(demo.NUM_ELEMS_4);
    function f(x) {
      return A * x + B;
    }
    return function (x) {
      return f(x) + Math.random() * rnd;
    };
  }
  function exponential() {
    var A = Math.random() * 10,
      B = Math.random() * 0.2 + 1e-2,
      rnd = f(demo.NUM_ELEMS_2);
    function f(x) {
      return A * Math.exp(x * B);
    }
    return function (x) {
      return f(x) + Math.random() * rnd;
    };
  }
  function logarithmic() {
    var A = helpers.rnd(200),
      B = helpers.rnd(50) + 1,
      rnd = f(0.5);
    function f(x) {
      return A + B * Math.log(x);
    }
    return function (x) {
      return f(x) + Math.random() * rnd;
    };
  }
  function power() {
    var A = Math.random() * 2 + 0.2,
      B = Math.random() * 2 + 0.2,
      rnd = f(demo.NUM_ELEMS_4);
    function f(x) {
      return A * Math.pow(x, B);
    }
    return function (x) {
      return f(x) + Math.random() * rnd;
    };
  }

  this.generateColors = function (numElems, id, alpha) {
    var normal = this.color(id, alpha);
    var predicted = 'rgba(136,136,136,' + alpha + ')';
    var colors = new Array(numElems);
    for (var i = 0; i < numElems; i++)
      colors[i] = i < demo.NUM_NORMAL_ELEMS ? normal : predicted;
    return colors;
  };

  this.rnd = function (max) {
    return Math.trunc(max * Math.random());
  };

  this.formatJson = function (cfg) {
    var s = JSON.stringify(cfg, jsonReplacer, 2)
      .replace(/"(\w+)":/g, '$1:')
      .replace(/\{[^{}}]+\}/gm, strReplacer)
      .replace(/\[[^\[\]]+\]/gm, strReplacer);
    return s;
    function jsonReplacer(k, v) {
      return k == '$$hashKey' ? undefined : v;
    }
    function strReplacer(g) {
      return g.length < 80 ? g.replace(/\s+/g, ' ') : g;
    }
  };

  this.color = function (id, alpha) {
    var [r, g, b] = hslToRgb(id / 100, 1, 0.5);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  /**
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   *
   * Source: https://stackoverflow.com/a/29316972/8524080
   * 
   * @param   {number}  h       The hue
   * @param   {number}  s       The saturation
   * @param   {number}  l       The lightness
   * @return  {Array}           The RGB representation
   */
  function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
})();
