"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _geoserver = require("./util/geoserver.js");

/**
 * Client for GeoServer "Reset/Reload" to clear internal caches and reload
 * configuration from disk endpoint.
 *
 * @module ResetReloadClient
 */
var ResetReloadClient = /*#__PURE__*/function () {
  /**
   * Creates a GeoServer REST ResetReloadClient instance.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} auth The Basic Authentication string
   */
  function ResetReloadClient(url, auth) {
    (0, _classCallCheck2["default"])(this, ResetReloadClient);
    this.url = url;
    this.auth = auth;
  }
  /**
   * Resets all store, raster, and schema caches. This operation is used to
   * force GeoServer to drop all caches and store connections and reconnect to
   * each of them the next time they are needed by a request.
   * This is useful in case the stores themselves cache some information about
   * the data structures they manage that may have changed in the meantime.
   *
   * @throws Error if request fails
   */


  (0, _createClass2["default"])(ResetReloadClient, [{
    key: "reset",
    value: function () {
      var _reset = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = this.url + 'reset';
                _context.next = 3;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 3:
                response = _context.sent;

                if (response.ok) {
                  _context.next = 9;
                  break;
                }

                _context.next = 7;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 7:
                geoServerResponse = _context.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function reset() {
        return _reset.apply(this, arguments);
      }

      return reset;
    }()
    /**
     * Reloads the GeoServer catalog and configuration from disk. This operation
     * is used in cases where an external tool has modified the on-disk
     * configuration. This operation will also force GeoServer to drop any
     * internal caches and reconnect to all data stores.
     *
     * @throws Error if request fails
     */

  }, {
    key: "reload",
    value: function () {
      var _reload = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                url = this.url + 'reload';
                _context2.next = 3;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 3:
                response = _context2.sent;

                if (response.ok) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 7;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 7:
                geoServerResponse = _context2.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function reload() {
        return _reload.apply(this, arguments);
      }

      return reload;
    }()
  }]);
  return ResetReloadClient;
}();

exports["default"] = ResetReloadClient;