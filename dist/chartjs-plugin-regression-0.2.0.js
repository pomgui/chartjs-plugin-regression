/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/MetaData.js":
/*!*************************!*\
  !*** ./lib/MetaData.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaDataSet = void 0;
var MetaSection_1 = __webpack_require__(/*! ./MetaSection */ "./lib/MetaSection.js");
var MetaDataSet = /** @class */ (function () {
    function MetaDataSet(chart, ds) {
        /** Scales wil be initialized in beforeDraw hook */
        this.getXY = undefined;
        /** Is the dataset's data an array of {x,y}? */
        this.isXY = false;
        var cfg = ds.regressions;
        this.chart = chart;
        this.dataset = ds;
        this.normalizedData = this._normalizeData(ds.data);
        this.sections = this._createMetaSections(cfg);
        this._calculate();
    }
    /**
     * Normalize data to DataPoint[]
     * Only supports number[] and {x:number,y:number}
     */
    MetaDataSet.prototype._normalizeData = function (data) {
        var _this = this;
        return data.map(function (value, index) {
            var p;
            if (typeof value == 'number' || value == null || value === undefined) {
                p = [index, value];
            }
            else {
                _this.isXY = true;
                p = [value.x, value.y];
            }
            return p;
        });
    };
    /** @private */
    MetaDataSet.prototype._createMetaSections = function (cfg) {
        var _this = this;
        var source = cfg.sections || [
            { startIndex: 0, endIndex: this.dataset.data.length - 1 }
        ];
        return source.map(function (s) { return new MetaSection_1.MetaSection(s, _this); });
    };
    /** @private */
    MetaDataSet.prototype._calculate = function () {
        this.sections.forEach(function (section) { return section.calculate(); }); // Calculate Section Results
    };
    MetaDataSet.prototype.adjustScales = function () {
        if (this.topY !== undefined)
            return;
        var xScale;
        var yScale;
        var scales = this.chart.scales;
        Object.keys(scales).forEach(function (k) { return (k[0] == 'x' && (xScale = scales[k])) || (yScale = scales[k]); });
        this.topY = yScale.top;
        this.bottomY = yScale.bottom;
        this.getXY = function (x, y) { return ({
            x: xScale.getPixelForValue(x, undefined, undefined, true),
            y: yScale.getPixelForValue(y)
        }); };
    };
    MetaDataSet.prototype.drawRegressions = function () {
        var ctx = this.chart.chart.ctx;
        ctx.save();
        try {
            this.sections.forEach(function (section) { return section.drawRegressions(ctx); });
        }
        finally {
            ctx.restore();
        }
    };
    MetaDataSet.prototype.drawRightBorders = function () {
        var ctx = this.chart.chart.ctx;
        ctx.save();
        try {
            for (var i = 0; i < this.sections.length - 1; i++)
                this.sections[i].drawRightBorder(ctx);
        }
        finally {
            ctx.restore();
        }
    };
    return MetaDataSet;
}());
exports.MetaDataSet = MetaDataSet;
//# sourceMappingURL=MetaData.js.map

/***/ }),

/***/ "./lib/MetaSection.js":
/*!****************************!*\
  !*** ./lib/MetaSection.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaSection = void 0;
var regression = __webpack_require__(/*! regression */ "./node_modules/regression/dist/regression.js");
var defaultConfig = {
    type: 'linear',
    calculation: {
        precision: 2,
        order: 2
    },
    line: {
        width: 2,
        color: '#000',
        dash: []
    },
    extendPredictions: false,
    copy: {
        overwriteData: 'none'
    }
};
var MetaSection = /** @class */ (function () {
    function MetaSection(sec, _meta) {
        this._meta = _meta;
        var chart = _meta.chart;
        var ds = _meta.dataset;
        var cfg = getConfig([
            'type',
            'calculation',
            'line',
            'extendPredictions',
            'copy'
        ]);
        this.startIndex = sec.startIndex || 0;
        this.endIndex = sec.endIndex || ds.data.length - 1;
        this.type = Array.isArray(cfg.type) ? cfg.type : [cfg.type];
        this.line = cfg.line;
        this.calculation = cfg.calculation;
        this.extendPredictions = cfg.extendPredictions;
        this.copy = cfg.copy;
        this.label =
            sec.label || this._meta.chart.data.labels[this.endIndex];
        this._validateType();
        // --- constructor helpers
        /**
         * Calculate the inherited configuration from defaultConfig, globalConfig,
         * dataset config, and section config (in that order)
         */
        function getConfig(fields) {
            var o, p;
            var globalConfig = ((o = chart.config.options) && (p = o.plugins) && p.regressions) || {};
            return configMerge(fields, defaultConfig, globalConfig, ds.regressions, sec);
            /** merge the config objects */
            function configMerge(fields) {
                var cfgList = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    cfgList[_i - 1] = arguments[_i];
                }
                var dstConfig = {};
                fields.forEach(function (f) {
                    cfgList.forEach(function (srcConfig) {
                        var o = srcConfig[f];
                        var t = typeof o;
                        if (t != 'undefined') {
                            if (Array.isArray(o) || t != 'object' || o == null)
                                dstConfig[f] = o;
                            else
                                dstConfig[f] = Object.assign({}, dstConfig[f], configMerge(Object.keys(o), o));
                        }
                    });
                });
                return dstConfig;
            }
        }
    }
    /** Validates the type to avoid inconsistences */
    MetaSection.prototype._validateType = function () {
        if (this.type.length > 1 && this.type.includes('copy'))
            throw Error('Invalid regression type:' +
                this.type +
                '. "none" cannot be combined with other type!');
    };
    /** Calculates the regression(s) and sets the result objects */
    MetaSection.prototype.calculate = function () {
        var sectionData = this._meta.normalizedData.slice(this.startIndex, this.endIndex + 1);
        if (this.type[0] == 'copy')
            this._calculateCopySection(sectionData);
        else
            this._calculateBestR2(sectionData);
    };
    MetaSection.prototype._calculateBestR2 = function (sectionData) {
        var _this = this;
        this.result = this.type.reduce(function (max, type) {
            var calculation = Object.assign({}, _this.calculation);
            var realType = type;
            if (/polynomial[34]$/.test(type)) {
                calculation.order = parseInt(type.substr(10));
                realType = type.substr(0, 10);
            }
            var r = regression[realType](sectionData, calculation);
            r.type = type;
            return !max || max.r2 < r.r2 ? r : max;
        }, null);
    };
    MetaSection.prototype._calculateCopySection = function (sectionData) {
        var _this = this;
        var from = this._meta.sections[this.copy.fromSectionIndex], r = (this.result = Object.assign({}, from.result)), overwrite = this.copy.overwriteData, data = this._meta.normalizedData;
        r.points = sectionData.map(function (p) { return r.predict(p[0]); });
        delete r.r2;
        if (overwrite != 'none') {
            var dsdata_1 = this._meta.dataset.data, isXY_1 = this._meta.isXY;
            r.points.forEach(function (_a, i) {
                var x = _a[0], y = _a[1];
                var index = i + _this.startIndex;
                if ((index < from.startIndex || index > from.endIndex) &&
                    (overwrite == 'all' ||
                        (overwrite == 'last' && index == _this.endIndex) ||
                        (overwrite == 'empty' && !data[index]))) {
                    if (_this.copy.maxValue)
                        y = Math.min(_this.copy.maxValue, y);
                    if (_this.copy.minValue !== undefined)
                        y = Math.max(_this.copy.minValue, y);
                    dsdata_1[index] = isXY_1 ? { x: x, y: y } : y;
                }
            });
        }
    };
    MetaSection.prototype.drawRightBorder = function (ctx) {
        ctx.beginPath();
        this._setLineAttrs(ctx);
        ctx.setLineDash([10, 2]);
        ctx.lineWidth = 2;
        // Print vertical line
        var p = this._meta.getXY(this.endIndex, 0);
        ctx.moveTo(p.x, this._meta.topY);
        ctx.lineTo(p.x, this._meta.bottomY);
        ctx.fillStyle = this.line.color;
        ctx.fillText(this.label, p.x, this._meta.topY);
        ctx.stroke();
    };
    MetaSection.prototype.drawRegressions = function (ctx) {
        for (var i = 0, len = this._meta.sections.length; i < len; i++) {
            var section = this._meta.sections[i];
            var isMe = section == this;
            if ((isMe && this.type[0] != 'copy') ||
                (!isMe && this.extendPredictions)) {
                section.drawRange(ctx, this.startIndex, this.endIndex, !isMe);
            }
            if (isMe)
                break;
        }
    };
    MetaSection.prototype.drawRange = function (ctx, startIndex, endIndex, forceDash) {
        var _this = this;
        ctx.beginPath();
        this._setLineAttrs(ctx);
        if (forceDash)
            ctx.setLineDash([5, 5]);
        var predict = this.result.predict;
        var f = function (x) { return _this._meta.getXY(x, predict(x)[1]); };
        var p = f(startIndex);
        ctx.moveTo(p.x, p.y);
        for (var x = startIndex + 1; x <= endIndex; x++) {
            p = f(x);
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    };
    MetaSection.prototype._setLineAttrs = function (ctx) {
        if (this.line.width)
            ctx.lineWidth = this.line.width;
        if (this.line.color)
            ctx.strokeStyle = this.line.color;
        if (this.line.dash)
            ctx.setLineDash(this.line.dash);
    };
    return MetaSection;
}());
exports.MetaSection = MetaSection;
//# sourceMappingURL=MetaSection.js.map

/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(/*! ./types */ "./lib/types.js"), exports);
__exportStar(__webpack_require__(/*! ./MetaData */ "./lib/MetaData.js"), exports);
__exportStar(__webpack_require__(/*! ./MetaSection */ "./lib/MetaSection.js"), exports);
__exportStar(__webpack_require__(/*! ./regression-plugin */ "./lib/regression-plugin.js"), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./lib/regression-plugin.js":
/*!**********************************!*\
  !*** ./lib/regression-plugin.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartRegressions = void 0;
var MetaData_1 = __webpack_require__(/*! ./MetaData */ "./lib/MetaData.js");
// Cache for all plugins' metadata
var _metadataMap = {};
var _chartId = 0;
var Plugin = /** @class */ (function () {
    function Plugin() {
        this.id = 'regressions';
    }
    Plugin.prototype.beforeInit = function (chart) {
        chart.$$id = ++_chartId;
    };
    /**
     * Called after update (when the chart is created and when chart.update() is called)
     * @param chart
     */
    Plugin.prototype.beforeUpdate = function (chart, options) {
        var o, p, r;
        var onComplete = (o = chart.config.options) &&
            (p = o.plugins) &&
            (r = p.regressions) &&
            r.onCompleteCalculation;
        forEach(chart, function (ds, meta, datasetIndex) {
            meta = new MetaData_1.MetaDataSet(chart, ds);
            var id = chart.$$id * 1000 + datasetIndex;
            _metadataMap[id] = meta;
        });
        if (onComplete)
            onComplete(chart);
    };
    /**
     * It's called once before all the drawing
     * @param chart
     */
    Plugin.prototype.beforeRender = function (chart, options) {
        forEach(chart, function (ds, meta) { return meta.adjustScales(); });
    };
    /** Draws the vertical lines before the datasets are drawn */
    Plugin.prototype.beforeDatasetsDraw = function (chart, easing, options) {
        forEach(chart, function (ds, meta) { return meta.drawRightBorders(); });
    };
    /** Draws the regression lines */
    Plugin.prototype.afterDatasetsDraw = function (chart, easing, options) {
        forEach(chart, function (ds, meta) { return meta.drawRegressions(); });
    };
    Plugin.prototype.destroy = function (chart) {
        Object.keys(_metadataMap)
            .filter(function (k) { return (k / 1000) >> 0 == chart.$$id; })
            .forEach(function (k) { return delete _metadataMap[k]; });
    };
    /** Get dataset's meta data */
    Plugin.prototype.getDataset = function (chart, datasetIndex) {
        var id = chart.$$id * 1000 + datasetIndex;
        return _metadataMap[id];
    };
    /** Get dataset's meta sections */
    Plugin.prototype.getSections = function (chart, datasetIndex) {
        var ds = this.getDataset(chart, datasetIndex);
        return ds && ds.sections;
    };
    return Plugin;
}());
function forEach(chart, fn) {
    chart.data.datasets.forEach(function (ds, i) {
        if (ds.regressions && chart.isDatasetVisible(i)) {
            var meta = exports.ChartRegressions.getDataset(chart, i);
            fn(ds, meta, i);
        }
    });
}
exports.ChartRegressions = new Plugin();
window.ChartRegressions = exports.ChartRegressions;
//# sourceMappingURL=regression-plugin.js.map

/***/ }),

/***/ "./lib/types.js":
/*!**********************!*\
  !*** ./lib/types.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/regression/dist/regression.js":
/*!****************************************************!*\
  !*** ./node_modules/regression/dist/regression.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (module) {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var DEFAULT_OPTIONS = { order: 2, precision: 2, period: null };

  /**
  * Determine the coefficient of determination (r^2) of a fit from the observations
  * and predictions.
  *
  * @param {Array<Array<number>>} data - Pairs of observed x-y values
  * @param {Array<Array<number>>} results - Pairs of observed predicted x-y values
  *
  * @return {number} - The r^2 value, or NaN if one cannot be calculated.
  */
  function determinationCoefficient(data, results) {
    var predictions = [];
    var observations = [];

    data.forEach(function (d, i) {
      if (d[1] !== null) {
        observations.push(d);
        predictions.push(results[i]);
      }
    });

    var sum = observations.reduce(function (a, observation) {
      return a + observation[1];
    }, 0);
    var mean = sum / observations.length;

    var ssyy = observations.reduce(function (a, observation) {
      var difference = observation[1] - mean;
      return a + difference * difference;
    }, 0);

    var sse = observations.reduce(function (accum, observation, index) {
      var prediction = predictions[index];
      var residual = observation[1] - prediction[1];
      return accum + residual * residual;
    }, 0);

    return 1 - sse / ssyy;
  }

  /**
  * Determine the solution of a system of linear equations A * x = b using
  * Gaussian elimination.
  *
  * @param {Array<Array<number>>} input - A 2-d matrix of data in row-major form [ A | b ]
  * @param {number} order - How many degrees to solve for
  *
  * @return {Array<number>} - Vector of normalized solution coefficients matrix (x)
  */
  function gaussianElimination(input, order) {
    var matrix = input;
    var n = input.length - 1;
    var coefficients = [order];

    for (var i = 0; i < n; i++) {
      var maxrow = i;
      for (var j = i + 1; j < n; j++) {
        if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxrow])) {
          maxrow = j;
        }
      }

      for (var k = i; k < n + 1; k++) {
        var tmp = matrix[k][i];
        matrix[k][i] = matrix[k][maxrow];
        matrix[k][maxrow] = tmp;
      }

      for (var _j = i + 1; _j < n; _j++) {
        for (var _k = n; _k >= i; _k--) {
          matrix[_k][_j] -= matrix[_k][i] * matrix[i][_j] / matrix[i][i];
        }
      }
    }

    for (var _j2 = n - 1; _j2 >= 0; _j2--) {
      var total = 0;
      for (var _k2 = _j2 + 1; _k2 < n; _k2++) {
        total += matrix[_k2][_j2] * coefficients[_k2];
      }

      coefficients[_j2] = (matrix[n][_j2] - total) / matrix[_j2][_j2];
    }

    return coefficients;
  }

  /**
  * Round a number to a precision, specificed in number of decimal places
  *
  * @param {number} number - The number to round
  * @param {number} precision - The number of decimal places to round to:
  *                             > 0 means decimals, < 0 means powers of 10
  *
  *
  * @return {numbr} - The number, rounded
  */
  function round(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  /**
  * The set of all fitting methods
  *
  * @namespace
  */
  var methods = {
    linear: function linear(data, options) {
      var sum = [0, 0, 0, 0, 0];
      var len = 0;

      for (var n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
          len++;
          sum[0] += data[n][0];
          sum[1] += data[n][1];
          sum[2] += data[n][0] * data[n][0];
          sum[3] += data[n][0] * data[n][1];
          sum[4] += data[n][1] * data[n][1];
        }
      }

      var run = len * sum[2] - sum[0] * sum[0];
      var rise = len * sum[3] - sum[0] * sum[1];
      var gradient = run === 0 ? 0 : round(rise / run, options.precision);
      var intercept = round(sum[1] / len - gradient * sum[0] / len, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(gradient * x + intercept, options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [gradient, intercept],
        r2: round(determinationCoefficient(data, points), options.precision),
        string: intercept === 0 ? 'y = ' + gradient + 'x' : 'y = ' + gradient + 'x + ' + intercept
      };
    },
    exponential: function exponential(data, options) {
      var sum = [0, 0, 0, 0, 0, 0];

      for (var n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
          sum[0] += data[n][0];
          sum[1] += data[n][1];
          sum[2] += data[n][0] * data[n][0] * data[n][1];
          sum[3] += data[n][1] * Math.log(data[n][1]);
          sum[4] += data[n][0] * data[n][1] * Math.log(data[n][1]);
          sum[5] += data[n][0] * data[n][1];
        }
      }

      var denominator = sum[1] * sum[2] - sum[5] * sum[5];
      var a = Math.exp((sum[2] * sum[3] - sum[5] * sum[4]) / denominator);
      var b = (sum[1] * sum[4] - sum[5] * sum[3]) / denominator;
      var coeffA = round(a, options.precision);
      var coeffB = round(b, options.precision);
      var predict = function predict(x) {
        return [round(x, options.precision), round(coeffA * Math.exp(coeffB * x), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + 'e^(' + coeffB + 'x)',
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    logarithmic: function logarithmic(data, options) {
      var sum = [0, 0, 0, 0];
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += Math.log(data[n][0]);
          sum[1] += data[n][1] * Math.log(data[n][0]);
          sum[2] += data[n][1];
          sum[3] += Math.pow(Math.log(data[n][0]), 2);
        }
      }

      var a = (len * sum[1] - sum[2] * sum[0]) / (len * sum[3] - sum[0] * sum[0]);
      var coeffB = round(a, options.precision);
      var coeffA = round((sum[2] - coeffB * sum[0]) / len, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(round(coeffA + coeffB * Math.log(x), options.precision), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + ' + ' + coeffB + ' ln(x)',
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    power: function power(data, options) {
      var sum = [0, 0, 0, 0, 0];
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += Math.log(data[n][0]);
          sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
          sum[2] += Math.log(data[n][1]);
          sum[3] += Math.pow(Math.log(data[n][0]), 2);
        }
      }

      var b = (len * sum[1] - sum[0] * sum[2]) / (len * sum[3] - Math.pow(sum[0], 2));
      var a = (sum[2] - b * sum[0]) / len;
      var coeffA = round(Math.exp(a), options.precision);
      var coeffB = round(b, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(round(coeffA * Math.pow(x, coeffB), options.precision), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + 'x^' + coeffB,
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    polynomial: function polynomial(data, options) {
      var lhs = [];
      var rhs = [];
      var a = 0;
      var b = 0;
      var len = data.length;
      var k = options.order + 1;

      for (var i = 0; i < k; i++) {
        for (var l = 0; l < len; l++) {
          if (data[l][1] !== null) {
            a += Math.pow(data[l][0], i) * data[l][1];
          }
        }

        lhs.push(a);
        a = 0;

        var c = [];
        for (var j = 0; j < k; j++) {
          for (var _l = 0; _l < len; _l++) {
            if (data[_l][1] !== null) {
              b += Math.pow(data[_l][0], i + j);
            }
          }
          c.push(b);
          b = 0;
        }
        rhs.push(c);
      }
      rhs.push(lhs);

      var coefficients = gaussianElimination(rhs, k).map(function (v) {
        return round(v, options.precision);
      });

      var predict = function predict(x) {
        return [round(x, options.precision), round(coefficients.reduce(function (sum, coeff, power) {
          return sum + coeff * Math.pow(x, power);
        }, 0), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      var string = 'y = ';
      for (var _i = coefficients.length - 1; _i >= 0; _i--) {
        if (_i > 1) {
          string += coefficients[_i] + 'x^' + _i + ' + ';
        } else if (_i === 1) {
          string += coefficients[_i] + 'x + ';
        } else {
          string += coefficients[_i];
        }
      }

      return {
        string: string,
        points: points,
        predict: predict,
        equation: [].concat(_toConsumableArray(coefficients)).reverse(),
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    }
  };

  function createWrapper() {
    var reduce = function reduce(accumulator, name) {
      return _extends({
        _round: round
      }, accumulator, _defineProperty({}, name, function (data, supplied) {
        return methods[name](data, _extends({}, DEFAULT_OPTIONS, supplied));
      }));
    };

    return Object.keys(methods).reduce(reduce, {});
  }

  module.exports = createWrapper();
});


/***/ })

/******/ });
//# sourceMappingURL=chartjs-plugin-regression-0.2.0.js.map