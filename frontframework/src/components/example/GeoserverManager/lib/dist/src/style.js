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

var _workspace = _interopRequireDefault(require("./workspace.js"));

var _geoserver = require("./util/geoserver.js");

var _about = _interopRequireDefault(require("./about.js"));

/**
 * Client for GeoServer styles
 *
 * @module StyleClient
 */
var StyleClient = /*#__PURE__*/function () {
  /**
   * Creates a GeoServer REST StyleClient instance.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} auth The Basic Authentication string
   */
  function StyleClient(url, auth) {
    (0, _classCallCheck2["default"])(this, StyleClient);
    this.url = url;
    this.auth = auth;
  }
  /**
   * Returns all default styles.
   *
   * @throws Error if request fails
   *
   * @returns {Object} An object with the default styles
   */


  (0, _createClass2["default"])(StyleClient, [{
    key: "getDefaults",
    value: function () {
      var _getDefaults = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'styles.json', {
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

      function getDefaults() {
        return _getDefaults.apply(this, arguments);
      }

      return getDefaults;
    }()
    /**
     * Returns all styles in a workspace.
     *
     * @param {String} workspace Workspace name to get styles for
     *
     * @throws Error if request fails
     *
     * @returns {Object} An object with all styles
     */

  }, {
    key: "getInWorkspace",
    value: function () {
      var _getInWorkspace = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(workspace) {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'workspaces/' + workspace + '/styles.json', {
                  credentials: 'include',
                  method: 'GET',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 2:
                response = _context2.sent;

                if (response.ok) {
                  _context2.next = 8;
                  break;
                }

                _context2.next = 6;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 6:
                geoServerResponse = _context2.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 8:
                return _context2.abrupt("return", response.json());

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getInWorkspace(_x) {
        return _getInWorkspace.apply(this, arguments);
      }

      return getInWorkspace;
    }()
    /**
     * Returns all styles defined in workspaces.
     *
     * @throws Error if request fails
     *
     * @returns {Object[]} An array with all style objects
     */

  }, {
    key: "getAllWorkspaceStyles",
    value: function () {
      var _getAllWorkspaceStyles = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var allStyles, ws, allWs, i, _ws, wsStyles;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                allStyles = [];
                ws = new _workspace["default"](this.url, this.auth);
                _context3.next = 4;
                return ws.getAll();

              case 4:
                allWs = _context3.sent;

                if (!(!allWs || !allWs.workspaces || !allWs.workspaces.workspace || !Array.isArray(allWs.workspaces.workspace))) {
                  _context3.next = 7;
                  break;
                }

                throw new _geoserver.GeoServerResponseError('Response of available workspaces is malformed');

              case 7:
                i = 0;

              case 8:
                if (!(i < allWs.workspaces.workspace.length)) {
                  _context3.next = 17;
                  break;
                }

                _ws = allWs.workspaces.workspace[i];
                _context3.next = 12;
                return this.getInWorkspace(_ws.name);

              case 12:
                wsStyles = _context3.sent;

                if (wsStyles.styles.style) {
                  wsStyles.styles.style.forEach(function (wsStyle) {
                    allStyles.push(wsStyle);
                  });
                }

              case 14:
                i++;
                _context3.next = 8;
                break;

              case 17:
                return _context3.abrupt("return", allStyles);

              case 18:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getAllWorkspaceStyles() {
        return _getAllWorkspaceStyles.apply(this, arguments);
      }

      return getAllWorkspaceStyles;
    }()
    /**
     * Returns all styles as combined object (default ones and those in
     * workspaces).
     *
     * @returns {Object[]} An array with all style objects
     */

  }, {
    key: "getAll",
    value: function () {
      var _getAll = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        var defaultStyles, wsStyles, allStyles;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.getDefaults();

              case 2:
                defaultStyles = _context4.sent;
                _context4.next = 5;
                return this.getAllWorkspaceStyles();

              case 5:
                wsStyles = _context4.sent;

                if (!(!defaultStyles || !defaultStyles.styles || !defaultStyles.styles.style || !Array.isArray(defaultStyles.styles.style))) {
                  _context4.next = 8;
                  break;
                }

                throw new _geoserver.GeoServerResponseError('Response of default styles malformed');

              case 8:
                allStyles = defaultStyles.styles.style.concat(wsStyles);
                return _context4.abrupt("return", allStyles);

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getAll() {
        return _getAll.apply(this, arguments);
      }

      return getAll;
    }()
    /**
     * Publishes a new SLD style.
     *
     * @param {String} workspace The workspace to publish the style in
     * @param {String} name Name of the style
     * @param {String} sldBody SLD style (as XML text)
     *
     * @throws Error if request fails
     */

  }, {
    key: "publish",
    value: function () {
      var _publish = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(workspace, name, sldBody) {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'workspaces/' + workspace + '/styles?name=' + name, {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/vnd.ogc.sld+xml'
                  },
                  body: sldBody
                });

              case 2:
                response = _context5.sent;

                if (response.ok) {
                  _context5.next = 8;
                  break;
                }

                _context5.next = 6;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 6:
                geoServerResponse = _context5.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function publish(_x2, _x3, _x4) {
        return _publish.apply(this, arguments);
      }

      return publish;
    }()
    /**
     * Deletes a style.
     *
     * @param {String} workspace The name of the workspace, can be undefined if style is not assigned to a workspace
     * @param {String} name The name of the style to delete
     * @param {Boolean} [recurse=false] If references to the specified style in existing layers should be deleted
     * @param {Boolean} [purge=false] Whether the underlying file containing the style should be deleted on disk
     */

  }, {
    key: "delete",
    value: function () {
      var _delete2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(workspace, name, recurse, purge) {
        var paramPurge, paramRecurse, endpoint, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                paramPurge = false;
                paramRecurse = false;

                if (purge === true) {
                  paramPurge = true;
                }

                if (recurse === true) {
                  paramRecurse = true;
                }

                if (workspace) {
                  // delete style inside workspace
                  endpoint = this.url + 'workspaces/' + workspace + '/styles/' + name + '?' + 'purge=' + paramPurge + '&' + 'recurse=' + paramRecurse;
                } else {
                  // delete style without workspace
                  endpoint = this.url + 'styles/' + name + '?' + 'purge=' + paramPurge + '&' + 'recurse=' + paramRecurse;
                }

                _context6.next = 7;
                return (0, _nodeFetch["default"])(endpoint, {
                  credentials: 'include',
                  method: 'DELETE',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 7:
                response = _context6.sent;

                if (response.ok) {
                  _context6.next = 17;
                  break;
                }

                _context6.next = 11;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 11:
                geoServerResponse = _context6.sent;
                _context6.t0 = response.status;
                _context6.next = _context6.t0 === 403 ? 15 : 16;
                break;

              case 15:
                throw new _geoserver.GeoServerResponseError('Deletion failed. There might be dependant layers to this style. Delete them first or call this with "recurse=false"', geoServerResponse);

              case 16:
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 17:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function _delete(_x5, _x6, _x7, _x8) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
    /**
     * Assigns a style to a layer.
     *
     * @param {String} workspaceOfLayer The name of the layer's workspace, can be undefined
     * @param {String} layerName The name of the layer to query
     * @param {String} workspaceOfStyle The workspace of the style, can be undefined
     * @param {String} styleName The name of the style
     * @param {Boolean} [isDefaultStyle=true] If the style should be the default style of the layer
     *
     * @throws Error if request fails
     */

  }, {
    key: "assignStyleToLayer",
    value: function () {
      var _assignStyleToLayer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(workspaceOfLayer, layerName, workspaceOfStyle, styleName, isDefaultStyle) {
        var qualifiedName, styleBody, url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (workspaceOfLayer) {
                  qualifiedName = "".concat(workspaceOfLayer, ":").concat(layerName);
                } else {
                  qualifiedName = layerName;
                }

                _context7.next = 3;
                return this.getStyleInformation(workspaceOfStyle, styleName);

              case 3:
                styleBody = _context7.sent;

                // we set the style as defaultStyle, unless user explicitly provides 'false'
                if (isDefaultStyle !== false) {
                  url = this.url + 'layers/' + qualifiedName + '/styles?default=true';
                } else {
                  url = this.url + 'layers/' + qualifiedName + '/styles';
                }

                _context7.next = 7;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(styleBody)
                });

              case 7:
                response = _context7.sent;

                if (response.ok) {
                  _context7.next = 13;
                  break;
                }

                _context7.next = 11;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 11:
                geoServerResponse = _context7.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 13:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function assignStyleToLayer(_x9, _x10, _x11, _x12, _x13) {
        return _assignStyleToLayer.apply(this, arguments);
      }

      return assignStyleToLayer;
    }()
    /**
     * Get information about a style.
     *
     * @param {String} workspace The name of the workspace, can be undefined
     * @param {String} styleName The name of the style
     *
     * @throws Error if request fails
     *
     * @returns {Object} An object about the style or undefined if it cannot be found
     */

  }, {
    key: "getStyleInformation",
    value: function () {
      var _getStyleInformation = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(workspace, styleName) {
        var url, response, grc, geoServerResponse;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (workspace) {
                  url = this.url + 'workspaces/' + workspace + '/styles/' + styleName + '.json';
                } else {
                  url = this.url + 'styles/' + styleName + '.json';
                }

                _context8.next = 3;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'GET',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 3:
                response = _context8.sent;

                if (response.ok) {
                  _context8.next = 16;
                  break;
                }

                grc = new _about["default"](this.url, this.auth);
                _context8.next = 8;
                return grc.exists();

              case 8:
                if (!_context8.sent) {
                  _context8.next = 12;
                  break;
                }

                return _context8.abrupt("return");

              case 12:
                _context8.next = 14;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 14:
                geoServerResponse = _context8.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 16:
                return _context8.abrupt("return", response.json());

              case 17:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getStyleInformation(_x14, _x15) {
        return _getStyleInformation.apply(this, arguments);
      }

      return getStyleInformation;
    }()
  }]);
  return StyleClient;
}();

exports["default"] = StyleClient;