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
 * Client for GeoServer layers
 *
 * @module LayerClient
 */
var LayerClient = /*#__PURE__*/function () {
  /**
   * Creates a GeoServer REST LayerClient instance.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} auth The Basic Authentication string
   */
  function LayerClient(url, auth) {
    (0, _classCallCheck2["default"])(this, LayerClient);
    this.url = url;
    this.auth = auth;
  }
  /**
   * Returns a GeoServer layer by the given workspace and layer name,
   * e.g. "myWs:myLayer".
   *
   * @param {String} workspace The name of the workspace, can be undefined
   * @param {String} layerName The name of the layer to query
   *
   * @throws Error if request fails
   *
   * @returns {Object} An object with layer information or undefined if it cannot be found
   */


  (0, _createClass2["default"])(LayerClient, [{
    key: "get",
    value: function () {
      var _get = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(workspace, layerName) {
        var qualifiedName, response, grc, geoServerResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (workspace) {
                  qualifiedName = "".concat(workspace, ":").concat(layerName);
                } else {
                  qualifiedName = layerName;
                }

                _context.next = 3;
                return (0, _nodeFetch["default"])(this.url + 'layers/' + qualifiedName + '.json', {
                  credentials: 'include',
                  method: 'GET',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 3:
                response = _context.sent;

                if (response.ok) {
                  _context.next = 16;
                  break;
                }

                grc = new _about["default"](this.url, this.auth);
                _context.next = 8;
                return grc.exists();

              case 8:
                if (!_context.sent) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt("return");

              case 12:
                _context.next = 14;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 14:
                geoServerResponse = _context.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 16:
                return _context.abrupt("return", response.json());

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get(_x, _x2) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
    /**
     * Sets the attribution text and link of a layer.
     *
     * @param {String} workspace The name of the workspace, can be undefined
     * @param {String} layerName The name of the layer to query
     * @param {String} [attributionText] The attribution text
     * @param {String} [attributionLink] The attribution link
     *
     * @throws Error if request fails
     */

  },
    {
    key: "modifyAttribution",
    value: function () {
      var _modifyAttribution = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(workspace, layerName, attributionText, attributionLink) {
        var qualifiedName, jsonBody, url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (workspace) {
                  qualifiedName = "".concat(workspace, ":").concat(layerName);
                } else {
                  qualifiedName = layerName;
                } // take existing layer properties as template


                _context2.next = 3;
                return this.get(workspace, layerName);

              case 3:
                jsonBody = _context2.sent;

                if (!(!jsonBody || !jsonBody.layer || !jsonBody.layer.attribution)) {
                  _context2.next = 6;
                  break;
                }

                throw new _geoserver.GeoServerResponseError("layer '".concat(workspace, ":").concat(layerName, "' misses the property 'attribution'"));

              case 6:
                // set attribution text and link
                if (attributionText) {
                  jsonBody.layer.attribution.title = attributionText;
                }

                if (attributionLink) {
                  jsonBody.layer.attribution.href = attributionLink;
                }

                url = this.url + 'layers/' + qualifiedName + '.json';
                _context2.next = 11;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'PUT',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(jsonBody)
                });

              case 11:
                response = _context2.sent;

                if (response.ok) {
                  _context2.next = 17;
                  break;
                }

                _context2.next = 15;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 15:
                geoServerResponse = _context2.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function modifyAttribution(_x3, _x4, _x5, _x6) {
        return _modifyAttribution.apply(this, arguments);
      }

      return modifyAttribution;
    }()
    /**
     * Returns all layers in the GeoServer.
     *
     * @throws Error if request fails
     *
     * @returns {Object} An object with all layer information
     */

  }, {
    key: "getAll",
    value: function () {
      var _getAll = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'layers.json', {
                  credentials: 'include',
                  method: 'GET',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 2:
                response = _context3.sent;

                if (response.ok) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 6;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 6:
                geoServerResponse = _context3.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 8:
                return _context3.abrupt("return", response.json());

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getAll() {
        return _getAll.apply(this, arguments);
      }

      return getAll;
    }()
    /**
     * Get all layers of a workspace.
     *
     * @param {String} workspace The workspace
     *
     * @throws Error if request fails
     *
     * @return {Object} An object with the information about the layers
     */

  }, {
    key: "getLayers",
    value: function () {
      var _getLayers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(workspace) {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'workspaces/' + workspace + '/layers.json', {
                  credentials: 'include',
                  method: 'GET',
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
                _context4.next = 10;
                return response.json();

              case 10:
                return _context4.abrupt("return", _context4.sent);

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getLayers(_x7) {
        return _getLayers.apply(this, arguments);
      }

      return getLayers;
    }()
    /**
     * Returns information about a cascaded WMS layer.
     *
     * @param {String} workspace The workspace
     * @param {String} datastore The datastore
     * @param {String} layerName The WMS layer name
     *
     * @throws Error if request fails
     *
     * @returns {Object} An object with layer information or undefined if it cannot be found
     */

  }, {
    key: "getWmsLayer",
    value: function () {
      var _getWmsLayer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(workspace, datastore, layerName) {
        var response, grc, geoServerResponse;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'workspaces/' + workspace + '/wmsstores/' + datastore + '/wmslayers/' + layerName + '.json', {
                  credentials: 'include',
                  method: 'GET',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 2:
                response = _context5.sent;

                if (response.ok) {
                  _context5.next = 15;
                  break;
                }

                grc = new _about["default"](this.url, this.auth);
                _context5.next = 7;
                return grc.exists();

              case 7:
                if (!_context5.sent) {
                  _context5.next = 11;
                  break;
                }

                return _context5.abrupt("return");

              case 11:
                _context5.next = 13;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 13:
                geoServerResponse = _context5.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 15:
                _context5.next = 17;
                return response.json();

              case 17:
                return _context5.abrupt("return", _context5.sent);

              case 18:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getWmsLayer(_x8, _x9, _x10) {
        return _getWmsLayer.apply(this, arguments);
      }

      return getWmsLayer;
    }() // TODO: automated test needed

    /**
     * Returns information about a cascaded WMTS layer.
     *
     * @param {String} workspace The workspace
     * @param {String} datastore The datastore
     * @param {String} layerName The WMTS layer name
     *
     * @throws Error if request fails
     *
     * @returns {Object} An object with layer information or undefined if it cannot be found
     */

  }, {
    key: "getWmtsLayer",
    value: function () {
      var _getWmtsLayer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(workspace, datastore, layerName) {
        var response, grc, geoServerResponse;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'workspaces/' + workspace + '/wmtsstores/' + datastore + '/layers/' + layerName + '.json', {
                  credentials: 'include',
                  method: 'GET',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 2:
                response = _context6.sent;

                if (response.ok) {
                  _context6.next = 15;
                  break;
                }

                grc = new _about["default"](this.url, this.auth);
                _context6.next = 7;
                return grc.exists();

              case 7:
                if (!_context6.sent) {
                  _context6.next = 11;
                  break;
                }

                return _context6.abrupt("return");

              case 11:
                _context6.next = 13;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 13:
                geoServerResponse = _context6.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 15:
                _context6.next = 17;
                return response.json();

              case 17:
                return _context6.abrupt("return", _context6.sent);

              case 18:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getWmtsLayer(_x11, _x12, _x13) {
        return _getWmtsLayer.apply(this, arguments);
      }

      return getWmtsLayer;
    }()
    /**
     * Publishes a FeatureType in the default data store of the workspace.
     *
     * @param {String} workspace Workspace to publish FeatureType in
     * @param {String} [nativeName] Native name of FeatureType
     * @param {String} name Published name of FeatureType
     * @param {String} [title] Published title of FeatureType
     * @param {String} [srs="EPSG:4326"] The SRS of the FeatureType
     * @param {String} enabled Flag to enable FeatureType by default
     * @param {String} [abstract] The abstract of the layer
     *
     * @throws Error if request fails
     */

  }, {
    key: "publishFeatureTypeDefaultDataStore",
    value: function () {
      var _publishFeatureTypeDefaultDataStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(workspace, nativeName, name, title, srs, enabled, _abstract) {
        var body, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                body = {
                  featureType: {
                    name: name,
                    nativeName: nativeName || name,
                    title: title || name,
                    srs: srs || 'EPSG:4326',
                    enabled: enabled,
                    "abstract": _abstract || ''
                  }
                };
                _context7.next = 3;
                return (0, _nodeFetch["default"])(this.url + 'workspaces/' + workspace + '/featuretypes', {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                });

              case 3:
                response = _context7.sent;

                if (response.ok) {
                  _context7.next = 9;
                  break;
                }

                _context7.next = 7;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 7:
                geoServerResponse = _context7.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function publishFeatureTypeDefaultDataStore(_x14, _x15, _x16, _x17, _x18, _x19, _x20) {
        return _publishFeatureTypeDefaultDataStore.apply(this, arguments);
      }

      return publishFeatureTypeDefaultDataStore;
    }()
    /**
     * Publishes a FeatureType in the given data store of the workspace.
     *
     * @param {String} workspace Workspace to publish FeatureType in
     * @param {String} dataStore The datastore where the FeatureType's data is in
     * @param {String} [nativeName] Native name of FeatureType
     * @param {String} name Published name of FeatureType
     * @param {String} [title] Published title of FeatureType
     * @param {String} [srs="EPSG:4326"] The SRS of the FeatureType
     * @param {String} enabled Flag to enable FeatureType by default
     * @param {String} [abstract] The abstract of the layer
     * @param {String} [nativeBoundingBox] The native BoundingBox of the FeatureType (has to be set if no data is in store at creation time)
     *
     * @throws Error if request fails
     */

  }, {
    key: "publishFeatureType",
    value: function () {
      var _publishFeatureType = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(workspace, dataStore, nativeName, name, title, srs, enabled, _abstract2, nativeBoundingBox) {
        var body, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                // apply CRS info for native BBOX if not provided
                if (nativeBoundingBox && !nativeBoundingBox.crs) {
                  nativeBoundingBox.crs = {
                    '@class': 'projected',
                    $: srs
                  };
                }

                body = {
                  featureType: {
                    name: name || nativeName,
                    nativeName: nativeName,
                    title: title || name,
                    srs: srs || 'EPSG:4326',
                    enabled: enabled,
                    "abstract": _abstract2 || '',
                    nativeBoundingBox: nativeBoundingBox
                  }
                };
                _context8.next = 4;
                return (0, _nodeFetch["default"])(this.url + 'workspaces/' + workspace + '/datastores/' + dataStore + '/featuretypes', {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                });

              case 4:
                response = _context8.sent;

                if (response.ok) {
                  _context8.next = 10;
                  break;
                }

                _context8.next = 8;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 8:
                geoServerResponse = _context8.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 10:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function publishFeatureType(_x21, _x22, _x23, _x24, _x25, _x26, _x27, _x28, _x29) {
        return _publishFeatureType.apply(this, arguments);
      }

      return publishFeatureType;
    }()
    /**
     * Get detailed information about a FeatureType.
     *
     * @param {String} workspace The workspace of the FeatureType
     * @param {String} datastore The datastore of the FeatureType
     * @param {String} name The name of the FeatureType
     *
     * @throws Error if request fails
     *
     * @returns {Object} The object of the FeatureType
     */

  },
    {
    key: "getFeatureType",
    value: function () {
      var _getFeatureType = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(workspace, datastore, name) {
        var url, response, grc, geoServerResponse;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                url = this.url + 'workspaces/' + workspace + '/datastores/' + datastore + '/featuretypes/' + name + '.json';
                _context9.next = 3;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'GET',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 3:
                response = _context9.sent;

                if (response.ok) {
                  _context9.next = 16;
                  break;
                }

                grc = new _about["default"](this.url, this.auth);
                _context9.next = 8;
                return grc.exists();

              case 8:
                if (!_context9.sent) {
                  _context9.next = 12;
                  break;
                }

                return _context9.abrupt("return");

              case 12:
                _context9.next = 14;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 14:
                geoServerResponse = _context9.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 16:
                return _context9.abrupt("return", response.json());

              case 17:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getFeatureType(_x30, _x31, _x32) {
        return _getFeatureType.apply(this, arguments);
      }

      return getFeatureType;
    }()
    /**
     *  Publishes a WMS layer.
     *
     * @param {String} workspace Workspace to publish WMS layer in
     * @param {String} dataStore The datastore where the WMS is connected
     * @param {String} nativeName Native name of WMS layer
     * @param {String} [name] Published name of WMS layer
     * @param {String} [title] Published title of WMS layer
     * @param {String} [srs="EPSG:4326"] The SRS of the WMS layer
     * @param {String} enabled Flag to enable WMS layer by default
     * @param {String} [abstract] The abstract of the layer
     *
     * @throws Error if request fails
     */

  }, {
    key: "publishWmsLayer",
    value: function () {
      var _publishWmsLayer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(workspace, dataStore, nativeName, name, title, srs, enabled, _abstract3) {
        var body, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                body = {
                  wmsLayer: {
                    name: name || nativeName,
                    nativeName: nativeName,
                    title: title || name || nativeName,
                    srs: srs || 'EPSG:4326',
                    enabled: enabled,
                    "abstract": _abstract3 || ''
                  }
                };
                _context10.next = 3;
                return (0, _nodeFetch["default"])(this.url + 'workspaces/' + workspace + '/wmsstores/' + dataStore + '/wmslayers', {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                });

              case 3:
                response = _context10.sent;

                if (response.ok) {
                  _context10.next = 9;
                  break;
                }

                _context10.next = 7;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 7:
                geoServerResponse = _context10.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 9:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function publishWmsLayer(_x33, _x34, _x35, _x36, _x37, _x38, _x39, _x40) {
        return _publishWmsLayer.apply(this, arguments);
      }

      return publishWmsLayer;
    }()
    /**
     * Publishes a raster stored in a database.
     *
     * @param {String} workspace Workspace to publish layer in
     * @param {String} coverageStore The coveragestore where the layer's data is in
     * @param {String} nativeName Native name of raster
     * @param {String} name Published name of layer
     * @param {String} [title] Published title of layer
     * @param {String} [srs="EPSG:4326"] The SRS of the layer
     * @param {String} enabled Flag to enable layer by default
     * @param {String} [abstract] The abstract of the layer
     *
     * @throws Error if request fails
     */

  }, {
    key: "publishDbRaster",
    value: function () {
      var _publishDbRaster = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(workspace, coverageStore, nativeName, name, title, srs, enabled, _abstract4) {
        var body, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                body = {
                  coverage: {
                    name: name || nativeName,
                    nativeName: nativeName,
                    title: title || name,
                    srs: srs,
                    enabled: enabled,
                    "abstract": _abstract4 || ''
                  }
                };
                _context11.next = 3;
                return (0, _nodeFetch["default"])(this.url + 'workspaces/' + workspace + '/coveragestores/' + coverageStore + '/coverages', {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                });

              case 3:
                response = _context11.sent;

                if (response.ok) {
                  _context11.next = 9;
                  break;
                }

                _context11.next = 7;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 7:
                geoServerResponse = _context11.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 9:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function publishDbRaster(_x41, _x42, _x43, _x44, _x45, _x46, _x47, _x48) {
        return _publishDbRaster.apply(this, arguments);
      }

      return publishDbRaster;
    }()
    /**
     * Deletes a FeatureType.
     *
     * @param {String} workspace Workspace where layer to delete is in
     * @param {String} datastore The datastore where the layer to delete is in
     * @param {String} name Layer to delete
     * @param {Boolean} recurse Flag to enable recursive deletion
     *
     * @throws Error if request fails
     */

  }, {
    key: "deleteFeatureType",
    value: function () {
      var _deleteFeatureType = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(workspace, datastore, name, recurse) {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'workspaces/' + workspace + '/datastores/' + datastore + '/featuretypes/' + name + '?recurse=' + recurse, {
                  credentials: 'include',
                  method: 'DELETE',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 2:
                response = _context12.sent;

                if (response.ok) {
                  _context12.next = 8;
                  break;
                }

                _context12.next = 6;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 6:
                geoServerResponse = _context12.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 8:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function deleteFeatureType(_x49, _x50, _x51, _x52) {
        return _deleteFeatureType.apply(this, arguments);
      }

      return deleteFeatureType;
    }()
    /**
     * Enables TIME dimension for the given coverage layer.
     *
     * @param {String} workspace Workspace where layer to enable time dimension for is in
     * @param {String} datastore The datastore where the layer to enable time dimension for is in
     * @param {String} name Layer to enable time dimension for
     * @param {String} presentation Presentation type: 'LIST' or 'DISCRETE_INTERVAL' or 'CONTINUOUS_INTERVAL'
     * @param {Number} resolution Resolution in milliseconds, e.g. 3600000 for 1 hour
     * @param {String} defaultValue The default time value, e.g. 'MINIMUM' or 'MAXIMUM' or 'NEAREST' or 'FIXED'
     * @param {Boolean} [nearestMatchEnabled] Enable nearest match
     * @param {Boolean} [rawNearestMatchEnabled] Enable raw nearest match
     * @param {String} [acceptableInterval] Acceptable interval for nearest match, e.g.'PT30M'
     *
     * @throws Error if request fails
     */

  }, {
    key: "enableTimeCoverage",
    value: function () {
      var _enableTimeCoverage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(workspace, dataStore, name, presentation, resolution, defaultValue, nearestMatchEnabled, rawNearestMatchEnabled, acceptableInterval) {
        var body, url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                body = {
                  coverage: {
                    metadata: {
                      entry: [{
                        '@key': 'time',
                        dimensionInfo: {
                          enabled: true,
                          presentation: presentation || 'DISCRETE_INTERVAL',
                          resolution: resolution,
                          units: 'ISO8601',
                          defaultValue: {
                            strategy: defaultValue
                          },
                          nearestMatchEnabled: nearestMatchEnabled,
                          rawNearestMatchEnabled: rawNearestMatchEnabled,
                          acceptableInterval: acceptableInterval
                        }
                      }]
                    }
                  }
                };
                url = this.url + 'workspaces/' + workspace + '/coveragestores/' + dataStore + '/coverages/' + name + '.json';
                _context13.next = 4;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'PUT',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                });

              case 4:
                response = _context13.sent;

                if (response.ok) {
                  _context13.next = 10;
                  break;
                }

                _context13.next = 8;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 8:
                geoServerResponse = _context13.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 10:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function enableTimeCoverage(_x53, _x54, _x55, _x56, _x57, _x58, _x59, _x60, _x61) {
        return _enableTimeCoverage.apply(this, arguments);
      }

      return enableTimeCoverage;
    }()
    /**
     * Enables TIME dimension for the given FeatureType layer.
     *
     * @param {String} workspace Workspace containing layer to enable time dimension for
     * @param {String} datastore The datastore containing the FeatureType to enable time dimension for
     * @param {String} name FeatureType to enable time dimension for
     * @param {String} attribute Data column / attribute holding the time values
     * @param {String} presentation Presentation type: 'LIST' or 'DISCRETE_INTERVAL' or 'CONTINUOUS_INTERVAL'
     * @param {Number} resolution Resolution in milliseconds, e.g. 3600000 for 1 hour
     * @param {String} defaultValue The default time value, e.g. 'MINIMUM' or 'MAXIMUM' or 'NEAREST' or 'FIXED'
     * @param {Boolean} [nearestMatchEnabled] Enable nearest match
     * @param {Boolean} [rawNearestMatchEnabled] Enable raw nearest match
     *
     * @throws Error if request fails
     */

  }, {
    key: "enableTimeFeatureType",
    value: function () {
      var _enableTimeFeatureType = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(workspace, dataStore, name, attribute, presentation, resolution, defaultValue, nearestMatchEnabled, rawNearestMatchEnabled, acceptableInterval) {
        var body, url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                body = {
                  featureType: {
                    metadata: {
                      entry: [{
                        '@key': 'time',
                        dimensionInfo: {
                          attribute: attribute,
                          presentation: presentation,
                          resolution: resolution,
                          units: 'ISO8601',
                          defaultValue: {
                            strategy: defaultValue
                          },
                          nearestMatchEnabled: nearestMatchEnabled,
                          rawNearestMatchEnabled: rawNearestMatchEnabled,
                          acceptableInterval: acceptableInterval
                        }
                      }]
                    }
                  }
                };
                url = this.url + 'workspaces/' + workspace + '/datastores/' + dataStore + '/featuretypes/' + name + '.json';
                _context14.next = 4;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'PUT',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                });

              case 4:
                response = _context14.sent;

                if (response.ok) {
                  _context14.next = 10;
                  break;
                }

                _context14.next = 8;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 8:
                geoServerResponse = _context14.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 10:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function enableTimeFeatureType(_x62, _x63, _x64, _x65, _x66, _x67, _x68, _x69, _x70, _x71) {
        return _enableTimeFeatureType.apply(this, arguments);
      }

      return enableTimeFeatureType;
    }()
    /**
     * Returns a dedicated coverage object.
     *
     * @param {String} workspace Workspace containing the coverage
     * @param {String} coverageStore The coveragestore containing the coverage
     * @param {String} name Coverage to query
     *
     * @throws Error if request fails
     *
     * @returns {Object} An object with coverage information or undefined if it cannot be found
     */

  }, {
    key: "getCoverage",
    value: function () {
      var _getCoverage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(workspace, coverageStore, name) {
        var url, response, grc, geoServerResponse;
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                url = this.url + 'workspaces/' + workspace + '/coveragestores/' + coverageStore + '/coverages/' + name + '.json';
                _context15.next = 3;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'GET',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 3:
                response = _context15.sent;

                if (response.ok) {
                  _context15.next = 16;
                  break;
                }

                grc = new _about["default"](this.url, this.auth);
                _context15.next = 8;
                return grc.exists();

              case 8:
                if (!_context15.sent) {
                  _context15.next = 12;
                  break;
                }

                return _context15.abrupt("return");

              case 12:
                _context15.next = 14;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 14:
                geoServerResponse = _context15.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 16:
                return _context15.abrupt("return", response.json());

              case 17:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function getCoverage(_x72, _x73, _x74) {
        return _getCoverage.apply(this, arguments);
      }

      return getCoverage;
    }()
    /**
     * Renames the existing bands of a coverage layer.
     *
     * Make sure to provide the same number of bands as existing in the layer.
     *
     * @param {String} workspace Workspace of layer
     * @param {String} datastore The datastore of the layer
     * @param {String} layername The layer name
     * @param {String[]} bandNames An array of the new band names in correct order
     *
     * @throws Error if request fails
     */

  }, {
    key: "renameCoverageBands",
    value: function () {
      var _renameCoverageBands = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(workspace, dataStore, layername, bandNames) {
        var body, url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                body = {
                  coverage: {
                    dimensions: {
                      coverageDimension: []
                    }
                  }
                }; // dynamically create the body

                bandNames.forEach(function (bandName) {
                  body.coverage.dimensions.coverageDimension.push({
                    name: bandName
                  });
                });
                url = this.url + 'workspaces/' + workspace + '/coveragestores/' + dataStore + '/coverages/' + layername + '.json';
                _context16.next = 5;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'PUT',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                });

              case 5:
                response = _context16.sent;

                if (response.ok) {
                  _context16.next = 11;
                  break;
                }

                _context16.next = 9;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 9:
                geoServerResponse = _context16.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 11:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function renameCoverageBands(_x75, _x76, _x77, _x78) {
        return _renameCoverageBands.apply(this, arguments);
      }

      return renameCoverageBands;
    }()
  }]);
  return LayerClient;
}();

exports["default"] = LayerClient;
