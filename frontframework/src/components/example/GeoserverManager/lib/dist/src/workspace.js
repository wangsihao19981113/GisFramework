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
 * Client for GeoServer workspaces
 *
 * @module WorkspaceClient
 */
var WorkspaceClient = /*#__PURE__*/function () {
  /**
   * Creates a GeoServer REST WorkspaceClient instance.
   *
   * WARNING: For most cases the 'NameSpaceClient' seems to fit better.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} auth The Basic Authentication string
   */
  function WorkspaceClient(url, auth) {
    (0, _classCallCheck2["default"])(this, WorkspaceClient);
    this.url = url;
    this.auth = auth;
  }
  /**
   * Returns all workspaces.
   *
   * @throws Error if request fails
   *
   * @returns {Object} An Object describing the workspaces
   */


  (0, _createClass2["default"])(WorkspaceClient, [{
    key: "getAll",
    value: function () {
      var _getAll = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'workspaces.json', {
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
     * Returns a workspace.
     *
     * @param {String} name Name of the workspace
     *
     * @throws Error if request fails
     *
     * @returns {Object} An object describing the workspaces
     */

  }, {
    key: "get",
    value: function () {
      var _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(name) {
        var response, grc, geoServerResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'workspaces/' + name + '.json', {
                  credentials: 'include',
                  method: 'GET',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 2:
                response = _context2.sent;

                if (response.ok) {
                  _context2.next = 15;
                  break;
                }

                grc = new _about["default"](this.url, this.auth);
                _context2.next = 7;
                return grc.exists();

              case 7:
                if (!_context2.sent) {
                  _context2.next = 11;
                  break;
                }

                return _context2.abrupt("return");

              case 11:
                _context2.next = 13;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 13:
                geoServerResponse = _context2.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 15:
                return _context2.abrupt("return", response.json());

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function get(_x) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
    /**
     * Creates a new workspace.
     *
     * @param {String} name Name of the new workspace
     *
     * @throws Error if request fails
     *
     * @returns {String} The name of the created workspace
     */

  }, {
    key: "create",
    value: function () {
      var _create = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(name) {
        var body, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                body = {
                  workspace: {
                    name: name
                  }
                };
                _context3.next = 3;
                return (0, _nodeFetch["default"])(this.url + 'workspaces', {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                });

              case 3:
                response = _context3.sent;

                if (response.ok) {
                  _context3.next = 13;
                  break;
                }

                _context3.next = 7;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 7:
                geoServerResponse = _context3.sent;
                _context3.t0 = response.status;
                _context3.next = _context3.t0 === 409 ? 11 : 12;
                break;

              case 11:
                throw new _geoserver.GeoServerResponseError('Unable to add workspace as it already exists', geoServerResponse);

              case 12:
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 13:
                return _context3.abrupt("return", response.text());

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function create(_x2) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
    /**
     * Deletes a workspace.
     *
     * @param {String} name Name of the workspace to delete
     * @param {Boolean} recurse Flag to enable recursive deletion
     *
     * @throws Error if request fails
     */

  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(name, recurse) {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'workspaces/' + name + '?recurse=' + recurse, {
                  credentials: 'include',
                  method: 'DELETE',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 2:
                response = _context4.sent;

                if (response.ok) {
                  _context4.next = 13;
                  break;
                }

                _context4.next = 6;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 6:
                geoServerResponse = _context4.sent;
                _context4.t0 = response.status;
                _context4.next = _context4.t0 === 400 ? 10 : _context4.t0 === 404 ? 11 : 12;
                break;

              case 10:
                throw new _geoserver.GeoServerResponseError('Workspace or related Namespace is not empty (and recurse not true)', geoServerResponse);

              case 11:
                throw new _geoserver.GeoServerResponseError('Workspace doesn\'t exist', geoServerResponse);

              case 12:
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function _delete(_x3, _x4) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }]);
  return WorkspaceClient;
}();

exports["default"] = WorkspaceClient;