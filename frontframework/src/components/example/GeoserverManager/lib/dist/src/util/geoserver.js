"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeoServerResponseError = void 0;
exports.getGeoServerResponseText = getGeoServerResponseText;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Utility functions and classes
 */

/**
 * Return the GeoServer response text if available.
 *
 * @param {Response} response The response of the GeoServer
 *
 * @returns {String} The response text if available
 */
function getGeoServerResponseText(_x) {
  return _getGeoServerResponseText.apply(this, arguments);
}
/**
 * Generic GeoServer error
 */


function _getGeoServerResponseText() {
  _getGeoServerResponseText = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(response) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            return _context.abrupt("return", response.text());

          case 4:
            _context.prev = 4;
            _context.t0 = _context["catch"](0);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 4]]);
  }));
  return _getGeoServerResponseText.apply(this, arguments);
}

var GeoServerResponseError = /*#__PURE__*/function (_Error) {
  (0, _inherits2["default"])(GeoServerResponseError, _Error);

  var _super = _createSuper(GeoServerResponseError);

  /**
   * @param {String} [message=GeoServer Response Error] The error message
   * @param {String} [geoServerOutput] The error output from GeoServer (useful for debugging)
   */
  function GeoServerResponseError(message, geoServerOutput) {
    var _this;

    (0, _classCallCheck2["default"])(this, GeoServerResponseError);
    _this = _super.call(this, message);
    _this.name = 'GeoServerResponseError';
    _this.message = message || 'GeoServer Response Error'; // custom property as explained here: https://xjamundx.medium.com/custom-javascript-errors-in-es6-aa891b173f87

    _this.geoServerOutput = geoServerOutput;
    return _this;
  }

  return (0, _createClass2["default"])(GeoServerResponseError);
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));

exports.GeoServerResponseError = GeoServerResponseError;