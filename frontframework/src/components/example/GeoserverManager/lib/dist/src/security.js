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
 * Client for GeoServer security.
 *
 * @module SecurityClient
 */
var SecurityClient = /*#__PURE__*/function () {
  /**
   * Creates a GeoServer REST SecurityClient instance.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} auth The Basic Authentication string
   */
  function SecurityClient(url, auth) {
    (0, _classCallCheck2["default"])(this, SecurityClient);
    this.url = url;
    this.auth = auth;
  }
  /**
   * Returns all users registered in GeoServer.
   *
   * @throws Error if request fails
   *
   * @returns {Object} An object with all users
   */


  (0, _createClass2["default"])(SecurityClient, [{
    key: "getAllUsers",
    value: function () {
      var _getAllUsers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'security/usergroup/users.json', {
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

      function getAllUsers() {
        return _getAllUsers.apply(this, arguments);
      }

      return getAllUsers;
    }()
    /**
     * Creates a new user.
     *
     * @param {String} username The name of the user to be created
     * @param {String} password The password of the user to be created
     *
     * @throws Error if request fails
     */

  }, {
    key: "createUser",
    value: function () {
      var _createUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(username, password) {
        var body, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                body = {
                  user: {
                    userName: username,
                    password: password,
                    enabled: true
                  }
                };
                _context2.next = 3;
                return (0, _nodeFetch["default"])(this.url + 'security/usergroup/users.json', {
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
                  _context2.next = 13;
                  break;
                }

                _context2.next = 7;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 7:
                geoServerResponse = _context2.sent;
                _context2.t0 = response.status;
                _context2.next = _context2.t0 === 404 ? 11 : 12;
                break;

              case 11:
                throw new _geoserver.GeoServerResponseError("User ".concat(username, " might already exists."), geoServerResponse);

              case 12:
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function createUser(_x, _x2) {
        return _createUser.apply(this, arguments);
      }

      return createUser;
    }()
    /**
     * Updates an existing user. User name is only taken for identification and
     * cannot be changed with this API call.
     *
     * @param {String} username The name of the user to be created
     * @param {String} password The password of the user to be created
     * @param {Boolean} enabled Enable / disable the user
     *
     * @throws Error if request fails
     */

  }, {
    key: "updateUser",
    value: function () {
      var _updateUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(username, password, enabled) {
        var body, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                body = {
                  user: {
                    password: password,
                    enabled: enabled
                  }
                };
                _context3.next = 3;
                return (0, _nodeFetch["default"])(this.url + 'security/usergroup/user/' + username, {
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
                  _context3.next = 9;
                  break;
                }

                _context3.next = 7;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 7:
                geoServerResponse = _context3.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function updateUser(_x3, _x4, _x5) {
        return _updateUser.apply(this, arguments);
      }

      return updateUser;
    }()
    /**
     * Associates the given role to the user.
     *
     * @param {String} username The name of the user to add the role to
     * @param {String} role The role to associate
     *
     * @throws Error if request fails
     */

  }, {
    key: "associateUserRole",
    value: function () {
      var _associateUserRole = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(username, role) {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _nodeFetch["default"])("".concat(this.url, "security/roles/role/").concat(role, "/user/").concat(username), {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 2:
                response = _context4.sent;

                if (response.ok) {
                  _context4.next = 8;
                  break;
                }

                _context4.next = 6;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 6:
                geoServerResponse = _context4.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function associateUserRole(_x6, _x7) {
        return _associateUserRole.apply(this, arguments);
      }

      return associateUserRole;
    }()
  }]);
  return SecurityClient;
}();

exports["default"] = SecurityClient;