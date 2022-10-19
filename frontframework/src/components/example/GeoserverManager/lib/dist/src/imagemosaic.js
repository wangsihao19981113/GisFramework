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
 * Client for GeoServer image mosaics
 *
 * @module ImageMosaicClient
 */
var ImageMosaicClient = /*#__PURE__*/function () {
  /**
   * Creates a GeoServer REST ImageMosaicClient instance.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} auth The Basic Authentication string
   */
  function ImageMosaicClient(url, auth) {
    (0, _classCallCheck2["default"])(this, ImageMosaicClient);
    this.url = url;
    this.auth = auth;
  }
  /**
   * Returns all granules of an image mosaic.
   *
   * @param {String} workspace Workspace of image mosaic
   * @param {String} coverageStore CoverageStore of image mosaic
   * @param {String} coverage Name of image mosaic
   *
   * @throws Error if request fails
   *
   * @returns {Object} An object with the granules
   */


  (0, _createClass2["default"])(ImageMosaicClient, [{
    key: "getGranules",
    value: function () {
      var _getGranules = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(workspace, coverageStore, coverage) {
        var url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = this.url + 'workspaces/' + workspace + '/coveragestores/' + coverageStore + '/coverages/' + coverage + '/index/granules.json';
                _context.next = 3;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'GET',
                  headers: {
                    Authorization: this.auth,
                    'Content-type': 'text/plain'
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
                return _context.abrupt("return", response.json());

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getGranules(_x, _x2, _x3) {
        return _getGranules.apply(this, arguments);
      }

      return getGranules;
    }()
    /**
     * Harvests all granules in the given folder for an image mosaic.
     *
     * @param {String} workspace Workspace of image mosaic
     * @param {String} coverageStore CoverageStore of image mosaic
     * @param {String} filePath Server path of folder to harvest
     *
     * @throws Error if request fails
     *
     * @returns {Object} An object with the granules
     */

  }, {
    key: "harvestGranules",
    value: function () {
      var _harvestGranules = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(workspace, coverageStore, filePath) {
        var url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                url = this.url + 'workspaces/' + workspace + '/coveragestores/' + coverageStore + '/external.imagemosaic';
                _context2.next = 3;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'text/plain'
                  },
                  body: filePath
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
                return _context2.abrupt("return", response.json());

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function harvestGranules(_x4, _x5, _x6) {
        return _harvestGranules.apply(this, arguments);
      }

      return harvestGranules;
    }()
    /**
     * Adds a granule (defined by a server file) to an image mosaic.
     *
     * @param {String} workspace Workspace of image mosaic
     * @param {String} coverageStore CoverageStore of image mosaic
     * @param {String} filePath Server file path of new granule
     *
     * @throws Error if request fails
     */

  }, {
    key: "addGranuleByServerFile",
    value: function () {
      var _addGranuleByServerFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(workspace, coverageStore, filePath) {
        var url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                url = this.url + 'workspaces/' + workspace + '/coveragestores/' + coverageStore + '/external.imagemosaic';
                _context3.next = 3;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'POST',
                  headers: {
                    Authorization: this.auth,
                    'Content-type': 'text/plain'
                  },
                  body: filePath
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

      function addGranuleByServerFile(_x7, _x8, _x9) {
        return _addGranuleByServerFile.apply(this, arguments);
      }

      return addGranuleByServerFile;
    }()
    /**
     * Deletes a single granule of an image mosaic.
     *
     * @param {String} workspace Workspace of image mosaic
     * @param {String} coverageStore CoverageStore of image mosaic
     * @param {String} coverage Name of image mosaic
     * @param {String} covFileLocation Location of coverage file
     *
     * @throws Error if request fails
     */

  }, {
    key: "deleteSingleGranule",
    value: function () {
      var _deleteSingleGranule = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(workspace, coverageStore, coverage, covFileLocation) {
        var url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                url = this.url + 'workspaces/' + workspace + '/coveragestores/' + coverageStore + '/coverages/' + coverage + '/index/granules.xml';
                url += '?filter=location=\'' + covFileLocation + '\'';
                _context4.next = 4;
                return (0, _nodeFetch["default"])(url, {
                  credentials: 'include',
                  method: 'DELETE',
                  headers: {
                    Authorization: this.auth,
                    'Content-type': 'text/plain'
                  }
                });

              case 4:
                response = _context4.sent;

                if (response.ok) {
                  _context4.next = 10;
                  break;
                }

                _context4.next = 8;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 8:
                geoServerResponse = _context4.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 10:
                return _context4.abrupt("return", true);

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function deleteSingleGranule(_x10, _x11, _x12, _x13) {
        return _deleteSingleGranule.apply(this, arguments);
      }

      return deleteSingleGranule;
    }()
  }]);
  return ImageMosaicClient;
}();

exports["default"] = ImageMosaicClient;