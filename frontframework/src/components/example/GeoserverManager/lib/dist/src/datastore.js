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

var _fs = _interopRequireDefault(require("fs"));

var _geoserver = require("./util/geoserver.js");

var _about = _interopRequireDefault(require("./about.js"));

/**
 * Client for GeoServer data stores
 *
 * @module DatastoreClient
 */
var DatastoreClient = /*#__PURE__*/function () {
  /**
   * Creates a GeoServer REST DatastoreClient instance.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} auth The Basic Authentication string
   */
  function DatastoreClient(url, auth) {
    (0, _classCallCheck2["default"])(this, DatastoreClient);
    this.url = url;
    this.auth = auth;
  }
  /**
   * Get all DataStores in a workspace.
   *
   * @param {String} workspace The workspace to get DataStores for
   *
   * @returns {Object} An object containing store details
   */


  (0, _createClass2["default"])(DatastoreClient, [{
    key: "getDataStores",
    value: function () {
      var _getDataStores = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(workspace) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", this.getStores(workspace, 'datastores'));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getDataStores(_x) {
        return _getDataStores.apply(this, arguments);
      }

      return getDataStores;
    }()
    /**
     * Get all CoverageStores in a workspace.
     *
     * @param {String} workspace The workspace to get CoverageStores for
     *
     * @returns {Object} An object containing store details
     */

  }, {
    key: "getCoverageStores",
    value: function () {
      var _getCoverageStores = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(workspace) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.getStores(workspace, 'coveragestores'));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getCoverageStores(_x2) {
        return _getCoverageStores.apply(this, arguments);
      }

      return getCoverageStores;
    }()
    /**
     * Get all WmsStores in a workspace.
     *
     * @param {String} workspace The workspace to get WmsStores for
     *
     * @returns {Object} An object containing store details
     */

  }, {
    key: "getWmsStores",
    value: function () {
      var _getWmsStores = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(workspace) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", this.getStores(workspace, 'wmsstores'));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getWmsStores(_x3) {
        return _getWmsStores.apply(this, arguments);
      }

      return getWmsStores;
    }()
    /**
     * Get all WmtsStores in a workspace.
     *
     * @param {String} workspace The workspace to get WmtsStores for
     *
     * @returns {Object} An object containing store details
     */

  }, {
    key: "getWmtsStores",
    value: function () {
      var _getWmtsStores = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(workspace) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", this.getStores(workspace, 'wmtsstores'));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getWmtsStores(_x4) {
        return _getWmtsStores.apply(this, arguments);
      }

      return getWmtsStores;
    }()
    /**
     * @private
     * Get information about various store types in a workspace.
     *
     * @param {String} workspace The workspace name
     * @param {String} storeType The type of store
     *
     * @throws Error if request fails
     *
     * @returns {Object} An object containing store details or undefined if it cannot be found
     */

  }, {
    key: "getStores",
    value: function () {
      var _getStores = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(workspace, storeType) {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'workspaces/' + workspace + '/' + storeType + '.json', {
                  credentials: 'include',
                  method: 'GET',
                  headers: {
                    Authorization: this.auth
                  }
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
                return _context5.abrupt("return", response.json());

              case 9:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getStores(_x5, _x6) {
        return _getStores.apply(this, arguments);
      }

      return getStores;
    }()
    /**
     * Get specific DataStore by name in a workspace.
     *
     * @param {String} workspace The workspace to search DataStore in
     * @param {String} dataStore DataStore name
     *
     * @returns {Object} An object containing store details or undefined if it cannot be found
     */

  }, {
    key: "getDataStore",
    value: function () {
      var _getDataStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(workspace, dataStore) {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", this.getStore(workspace, dataStore, 'datastores'));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getDataStore(_x7, _x8) {
        return _getDataStore.apply(this, arguments);
      }

      return getDataStore;
    }()
    /**
     * Get specific CoverageStore by name in a workspace.
     *
     * @param {String} workspace The workspace to search CoverageStore in
     * @param {String} covStore CoverageStore name
     *
     * @returns {Object} An object containing store details or undefined if it cannot be found
     */

  }, {
    key: "getCoverageStore",
    value: function () {
      var _getCoverageStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(workspace, covStore) {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", this.getStore(workspace, covStore, 'coveragestores'));

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getCoverageStore(_x9, _x10) {
        return _getCoverageStore.apply(this, arguments);
      }

      return getCoverageStore;
    }()
    /**
     * Get specific WmsStore by name in a workspace.
     *
     * @param {String} workspace The workspace to search WmsStore in
     * @param {String} wmsStore WmsStore name
     *
     * @returns {Object} An object containing store details or undefined if it cannot be found
     *
     */

  }, {
    key: "getWmsStore",
    value: function () {
      var _getWmsStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(workspace, wmsStore) {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", this.getStore(workspace, wmsStore, 'wmsstores'));

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getWmsStore(_x11, _x12) {
        return _getWmsStore.apply(this, arguments);
      }

      return getWmsStore;
    }()
    /**
     * Get specific WmtsStore by name in a workspace.
     *
     * @param {String} workspace The workspace to search WmtsStore in
     * @param {String} wmtsStore WmtsStore name
     *
     * @returns {Object} An object containing store details or undefined if it cannot be found
     */

  }, {
    key: "getWmtsStore",
    value: function () {
      var _getWmtsStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(workspace, wmtsStore) {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", this.getStore(workspace, wmtsStore, 'wmtsstores'));

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getWmtsStore(_x13, _x14) {
        return _getWmtsStore.apply(this, arguments);
      }

      return getWmtsStore;
    }()
    /**
     * @private
     * Get GeoServer store by type
     *
     * @param {String} workspace The name of the workspace
     * @param {String} storeName The name of the store
     * @param {String} storeType The type of the store
     *
     * @throws Error if request fails
     *
     * @returns {Object} An object containing store details or undefined if it cannot be found
     */

  }, {
    key: "getStore",
    value: function () {
      var _getStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(workspace, storeName, storeType) {
        var url, response, grc, geoServerResponse;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                url = this.url + 'workspaces/' + workspace + '/' + storeType + '/' + storeName + '.json';
                _context10.next = 3;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'GET',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 3:
                response = _context10.sent;

                if (response.ok) {
                  _context10.next = 16;
                  break;
                }

                grc = new _about["default"](this.url, this.auth);
                _context10.next = 8;
                return grc.exists();

              case 8:
                if (!_context10.sent) {
                  _context10.next = 12;
                  break;
                }

                return _context10.abrupt("return");

              case 12:
                _context10.next = 14;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 14:
                geoServerResponse = _context10.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 16:
                return _context10.abrupt("return", response.json());

              case 17:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getStore(_x15, _x16, _x17) {
        return _getStore.apply(this, arguments);
      }

      return getStore;
    }()
    /**
     * Creates a GeoTIFF store from a file by path and publishes it as layer.
     * The GeoTIFF file has to be placed on the server, where your GeoServer
     * is running.
     *
     * @param {String} workspace The workspace to create GeoTIFF store in
     * @param {String} coverageStore The name of the new GeoTIFF store
     * @param {String} layerName The published name of the new layer
     * @param {String} layerTitle The published title of the new layer
     * @param {String} filePath The path to the GeoTIFF file on the server
     *
     * @throws Error if request fails
     *
     * @returns {String} The successful response text
     */

  }, {
    key: "createGeotiffFromFile",
    value: function () {
      var _createGeotiffFromFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(workspace, coverageStore, layerName, layerTitle, filePath) {
        var lyrTitle, stats, fileSizeInBytes, readStream, url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                lyrTitle = layerTitle || layerName;
                stats = _fs["default"].statSync(filePath);
                fileSizeInBytes = stats.size;
                readStream = _fs["default"].createReadStream(filePath);
                url = this.url + 'workspaces/' + workspace + '/coveragestores/' + coverageStore + '/file.geotiff';
                url += '?filename=' + lyrTitle + '&coverageName=' + layerName;
                _context11.next = 8;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'PUT',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'image/tiff',
                    'Content-length': fileSizeInBytes
                  },
                  body: readStream
                });

              case 8:
                response = _context11.sent;

                if (response.ok) {
                  _context11.next = 14;
                  break;
                }

                _context11.next = 12;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 12:
                geoServerResponse = _context11.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 14:
                return _context11.abrupt("return", response.text());

              case 15:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function createGeotiffFromFile(_x18, _x19, _x20, _x21, _x22) {
        return _createGeotiffFromFile.apply(this, arguments);
      }

      return createGeotiffFromFile;
    }()
    /**
     * Creates a PostGIS based data store.
     *
     * @param {String} workspace The WS to create the data store in
     * @param {String} namespaceUri The namespace URI of the workspace
     * @param {String} dataStore The data store name to be created
     * @param {String} pgHost The PostGIS DB host
     * @param {String} pgPort The PostGIS DB port
     * @param {String} pgUser The PostGIS DB user
     * @param {String} pgPassword The PostGIS DB password
     * @param {String} pgSchema The PostGIS DB schema
     * @param {String} pgDb The PostGIS DB name
     * @param {String} [exposePk] expose primary key, defaults to false
     *
     * @throws Error if request fails
     */

  }, {
    key: "createPostgisStore",
    value: function () {
      var _createPostgisStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(workspace, namespaceUri, dataStore, pgHost, pgPort, pgUser, pgPassword, pgSchema, pgDb, exposePk) {
        var body, url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                body = {
                  dataStore: {
                    name: dataStore,
                    type: 'PostGIS',
                    enabled: true,
                    workspace: {
                      name: workspace
                    },
                    connectionParameters: {
                      entry: [{
                        '@key': 'dbtype',
                        $: 'postgis'
                      }, {
                        '@key': 'schema',
                        $: pgSchema
                      }, {
                        '@key': 'database',
                        $: pgDb
                      }, {
                        '@key': 'host',
                        $: pgHost
                      }, {
                        '@key': 'port',
                        $: pgPort
                      }, {
                        '@key': 'passwd',
                        $: pgPassword
                      }, {
                        '@key': 'namespace',
                        $: namespaceUri
                      }, {
                        '@key': 'user',
                        $: pgUser
                      }, {
                        '@key': 'Expose primary keys',
                        $: exposePk || false
                      }]
                    }
                  }
                };
                url = this.url + 'workspaces/' + workspace + '/datastores';
                _context12.next = 4;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                });

              case 4:
                response = _context12.sent;

                if (response.ok) {
                  _context12.next = 10;
                  break;
                }

                _context12.next = 8;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 8:
                geoServerResponse = _context12.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 10:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function createPostgisStore(_x23, _x24, _x25, _x26, _x27, _x28, _x29, _x30, _x31, _x32) {
        return _createPostgisStore.apply(this, arguments);
      }

      return createPostgisStore;
    }()
    /**
     * Creates an ImageMosaic store from a zip archive with the 3 necessary files
     *   - datastore.properties
     *   - indexer.properties
     *   - timeregex.properties
     *
     * The zip archive has to be given as absolute path, so before it has to be
     * placed on the server, where your GeoServer is running.
     *
     * @param {String} workspace The WS to create the data store in
     * @param {String} dataStore The data store name
     * @param {String} zipArchivePath Absolute path to zip archive with the 3 properties files
     *
     * @throws Error if request fails
     *
     * @returns {String} The response text
     */

  }, {
    key: "createImageMosaicStore",
    value: function () {
      var _createImageMosaicStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(workspace, coverageStore, zipArchivePath) {
        var readStream, url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                readStream = _fs["default"].createReadStream(zipArchivePath);
                url = this.url + 'workspaces/' + workspace + '/coveragestores/' + coverageStore + '/file.imagemosaic';
                _context13.next = 4;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'PUT',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/zip'
                  },
                  body: readStream
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
                return _context13.abrupt("return", response.text());

              case 11:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function createImageMosaicStore(_x33, _x34, _x35) {
        return _createImageMosaicStore.apply(this, arguments);
      }

      return createImageMosaicStore;
    }()
  }, {
    key: "createWmsStore",
    value:
    /**
     * Creates a WMS based data store.
     *
     * @param {String} workspace The WS to create the data store in
     * @param {String} dataStore The data store name
     * @param {String} wmsCapabilitiesUrl Base WMS capabilities URL
     *
     * @throws Error if request fails
     */
    function () {
      var _createWmsStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(workspace, dataStore, wmsCapabilitiesUrl) {
        var body, url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                body = {
                  wmsStore: {
                    name: dataStore,
                    type: 'WMS',
                    capabilitiesURL: wmsCapabilitiesUrl
                  }
                };
                url = this.url + 'workspaces/' + workspace + '/wmsstores';
                _context14.next = 4;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'POST',
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

      function createWmsStore(_x36, _x37, _x38) {
        return _createWmsStore.apply(this, arguments);
      }

      return createWmsStore;
    }()
    /**
     * Creates a WMTS based data store.
     *
     * @param {String} workspace The WS to create the data store in
     * @param {String} dataStore The data store name
     * @param {String} wmtsCapabilitiesUrl Base WMTS capabilities URL
     *
     * @throws Error if request fails
     */

  }, {
    key: "createWmtsStore",
    value: function () {
      var _createWmtsStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(workspace, dataStore, wmtsCapabilitiesUrl) {
        var body, url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                body = {
                  wmtsStore: {
                    name: dataStore,
                    type: 'WMTS',
                    capabilitiesURL: wmtsCapabilitiesUrl
                  }
                };
                url = this.url + 'workspaces/' + workspace + '/wmtsstores';
                _context15.next = 4;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                });

              case 4:
                response = _context15.sent;

                if (response.ok) {
                  _context15.next = 10;
                  break;
                }

                _context15.next = 8;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 8:
                geoServerResponse = _context15.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 10:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function createWmtsStore(_x39, _x40, _x41) {
        return _createWmtsStore.apply(this, arguments);
      }

      return createWmtsStore;
    }()
    /**
     * Creates a WFS based data store.
     *
     * @param {String} workspace The WS to create the data store in
     * @param {String} dataStore The data store name
     * @param {String} wfsCapabilitiesUrl WFS capabilities URL
     * @param {String} namespaceUrl URL of the GeoServer namespace
     * @param {Boolean} [useHttpConnectionPooling=true] use HTTP connection pooling for WFS connection
     *
     * @throws Error if request fails
     */

  }, {
    key: "createWfsStore",
    value: function () {
      var _createWfsStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(workspace, dataStore, wfsCapabilitiesUrl, namespaceUrl, useHttpConnectionPooling) {
        var body, url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                body = {
                  dataStore: {
                    name: dataStore,
                    type: 'Web Feature Server (NG)',
                    connectionParameters: {
                      entry: [{
                        '@key': 'WFSDataStoreFactory:GET_CAPABILITIES_URL',
                        $: wfsCapabilitiesUrl
                      }, {
                        '@key': 'namespace',
                        $: namespaceUrl
                      }, {
                        '@key': 'WFSDataStoreFactory:USE_HTTP_CONNECTION_POOLING',
                        $: useHttpConnectionPooling !== false ? 'true' : 'false'
                      }]
                    }
                  }
                };
                url = this.url + 'workspaces/' + workspace + '/datastores';
                _context16.next = 4;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                });

              case 4:
                response = _context16.sent;

                if (response.ok) {
                  _context16.next = 10;
                  break;
                }

                _context16.next = 8;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 8:
                geoServerResponse = _context16.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 10:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function createWfsStore(_x42, _x43, _x44, _x45, _x46) {
        return _createWfsStore.apply(this, arguments);
      }

      return createWfsStore;
    }()
    /**
     * Deletes a data store.
     *
     * @param {String} workspace The workspace where the data store is in
     * @param {String} coverageStore Name of data store to delete
     * @param {String} recurse Flag to enable recursive deletion
     *
     * @throws Error if request fails
     */

  }, {
    key: "deleteDataStore",
    value: function () {
      var _deleteDataStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(workspace, dataStore, recurse) {
        var url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                url = this.url + 'workspaces/' + workspace + '/datastores/' + dataStore;
                url += '?recurse=' + recurse;
                _context17.next = 4;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'DELETE',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 4:
                response = _context17.sent;

                if (response.ok) {
                  _context17.next = 10;
                  break;
                }

                _context17.next = 8;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 8:
                geoServerResponse = _context17.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 10:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function deleteDataStore(_x47, _x48, _x49) {
        return _deleteDataStore.apply(this, arguments);
      }

      return deleteDataStore;
    }()
    /**
     * Deletes a CoverageStore.
     *
     * @param {String} workspace The workspace where the CoverageStore is in
     * @param {String} coverageStore Name of CoverageStore to delete
     * @param {String} recurse Flag to enable recursive deletion
     *
     * @throws Error if request fails
     */

  }, {
    key: "deleteCoverageStore",
    value: function () {
      var _deleteCoverageStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(workspace, coverageStore, recurse) {
        var url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                url = this.url + 'workspaces/' + workspace + '/coveragestores/' + coverageStore;
                url += '?recurse=' + recurse;
                _context18.next = 4;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'DELETE',
                  headers: {
                    Authorization: this.auth
                  }
                });

              case 4:
                response = _context18.sent;

                if (response.ok) {
                  _context18.next = 14;
                  break;
                }

                _context18.next = 8;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 8:
                geoServerResponse = _context18.sent;
                _context18.t0 = response.status;
                _context18.next = _context18.t0 === 401 ? 12 : 13;
                break;

              case 12:
                throw new _geoserver.GeoServerResponseError('Deletion failed. There might be dependant objects to ' + 'this store. Delete them first or call this with "recurse=false"', geoServerResponse);

              case 13:
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 14:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function deleteCoverageStore(_x50, _x51, _x52) {
        return _deleteCoverageStore.apply(this, arguments);
      }

      return deleteCoverageStore;
    }()
    /**
     * Creates a GeoPackage store from a file placed in the geoserver_data dir.
     *
     * @param {String} workspace The WS to create the data store in
     * @param {String} dataStore The data store name
     * @param {String} gpkgPath Relative path to GeoPackage file within geoserver_data dir
     *
     * @throws Error if request fails
     */

  }, {
    key: "createGpkgStore",
    value: function () {
      var _createGpkgStore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(workspace, dataStore, gpkgPath) {
        var body, url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                body = {
                  dataStore: {
                    name: dataStore,
                    type: 'GeoPackage',
                    connectionParameters: {
                      entry: [{
                        '@key': 'database',
                        $: "file:".concat(gpkgPath)
                      }, {
                        '@key': 'dbtype',
                        $: 'geopkg'
                      }]
                    }
                  }
                };
                url = this.url + 'workspaces/' + workspace + '/datastores';
                _context19.next = 4;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(body)
                });

              case 4:
                response = _context19.sent;

                if (response.ok) {
                  _context19.next = 10;
                  break;
                }

                _context19.next = 8;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 8:
                geoServerResponse = _context19.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 10:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function createGpkgStore(_x53, _x54, _x55) {
        return _createGpkgStore.apply(this, arguments);
      }

      return createGpkgStore;
    }()
  }]);
  return DatastoreClient;
}();

exports["default"] = DatastoreClient;