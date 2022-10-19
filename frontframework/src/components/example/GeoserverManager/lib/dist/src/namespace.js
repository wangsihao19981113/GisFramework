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

var _about = _interopRequireDefault(require("./about.js"));

/**
 * Client for GeoServer namespace
 *
 * @module NamespaceClient
 */
var NamespaceClient = /*#__PURE__*/function () {
  /**
   * Creates a GeoServer REST NamespaceClient instance.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} auth The Basic Authentication string
   */
  function NamespaceClient(url, auth) {
    (0, _classCallCheck2["default"])(this, NamespaceClient);
    this.url = url;
    this.auth = auth;
  }
  /**
   * Returns all namespaces.
   *
   * @throws Error if request fails
   *
   * @returns {Object} An object describing the namespace
   */


  (0, _createClass2["default"])(NamespaceClient, [{
    key: "getAll",
    value: function () {
      var _getAll = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'namespaces.json', {
                  credentials: 'include',
                  method: 'GET',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 2:
                response = _context.sent;

                if (response.ok) {
                  _context.next = 8;
                  break;
                }

                _context.next = 6;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 6:
                geoServerResponse = _context.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 8:
                return _context.abrupt("return", response.json());

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getAll() {
        return _getAll.apply(this, arguments);
      }

      return getAll;
    }()
    /**
     * Creates a new namespace.
     *
     * @param {String} prefix Prefix of the new namespace
     * @param {String} uri Uri of the new namespace
     *
     * @throws Error if request fails
     *
     * @returns {String} The name of the created namespace
     */

  }, {
    key: "create",
    value: function () {
      var _create = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(prefix, uri) {
        var body, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                body = {
                  namespace: {
                    prefix: prefix,
                    uri: uri
                  }
                };
                _context2.next = 3;
                return (0, _nodeFetch["default"])(this.url + 'namespaces', {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
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
                return _context2.abrupt("return", response.text());

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function create(_x, _x2) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
    /**
     * Returns a namespace.
     *
     * @param {String} name Name of the namespace
     *
     * @throws Error if request fails
     *
     * @returns {Object} An object describing the namespace or undefined if it cannot be found
     */

  }, {
    key: "get",
    value: function () {
      var _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(name) {
        var response, grc, geoServerResponse;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'namespaces/' + name + '.json', {
                  credentials: 'include',
                  method: 'GET',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 2:
                response = _context3.sent;

                if (response.ok) {
                  _context3.next = 15;
                  break;
                }

                grc = new _about["default"](this.url, this.auth);
                _context3.next = 7;
                return grc.exists();

              case 7:
                if (!_context3.sent) {
                  _context3.next = 11;
                  break;
                }

                return _context3.abrupt("return");

              case 11:
                _context3.next = 13;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 13:
                geoServerResponse = _context3.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 15:
                return _context3.abrupt("return", response.json());

              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function get(_x3) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
    /**
     * Deletes a namespace.
     *
     * @param {String} name Name of the namespace to delete
     *
     * @throws Error if request fails
     */

  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(name) {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'namespaces/' + name, {
                  credentials: 'include',
                  method: 'DELETE',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 2:
                response = _context4.sent;

                if (response.ok) {
                  _context4.next = 14;
                  break;
                }

                _context4.next = 6;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 6:
                geoServerResponse = _context4.sent;
                _context4.t0 = response.status;
                _context4.next = _context4.t0 === 403 ? 10 : _context4.t0 === 404 ? 11 : _context4.t0 === 405 ? 12 : 13;
                break;

              case 10:
                throw new _geoserver.GeoServerResponseError('Namespace or related Workspace is not empty (and recurse not true)', geoServerResponse);

              case 11:
                throw new _geoserver.GeoServerResponseError('Namespace doesn\'t exist', geoServerResponse);

              case 12:
                throw new _geoserver.GeoServerResponseError('Can\'t delete default namespace', geoServerResponse);

              case 13:
                throw new _geoserver.GeoServerResponseError('Response not recognized', geoServerResponse);

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function _delete(_x4) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }]);
  return NamespaceClient;
}();

exports["default"] = NamespaceClient;