"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "GeoServerResponseError", {
  enumerable: true,
  get: function get() {
    return _geoserver.GeoServerResponseError;
  }
});
exports.GeoServerRestClient = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _layer = _interopRequireDefault(require("./src/layer.js"));

var _style = _interopRequireDefault(require("./src/style.js"));

var _workspace = _interopRequireDefault(require("./src/workspace.js"));

var _datastore = _interopRequireDefault(require("./src/datastore.js"));

var _imagemosaic = _interopRequireDefault(require("./src/imagemosaic.js"));

var _security = _interopRequireDefault(require("./src/security.js"));

var _settings = _interopRequireDefault(require("./src/settings.js"));

var _namespace = _interopRequireDefault(require("./src/namespace.js"));

var _about = _interopRequireDefault(require("./src/about.js"));

var _resetReload = _interopRequireDefault(require("./src/reset-reload.js"));

var _geoserver = require("./src/util/geoserver.js");

/**
 * Client for GeoServer REST API.
 * Has minimal basic functionality and offers REST client instances for
 * sub-entities, like workspaces or datastores as member variables.
 *
 * @module GeoServerRestClient
 */
var GeoServerRestClient = /*#__PURE__*/(0, _createClass2["default"])(
/**
 * Creates a GeoServerRestClient instance.
 *
 * @param {String} url The URL of the GeoServer REST API endpoint
 * @param {String} user The user for the GeoServer REST API
 * @param {String} password The password for the GeoServer REST API
 */
function GeoServerRestClient(url, user, password) {
  (0, _classCallCheck2["default"])(this, GeoServerRestClient);
  this.url = url.endsWith('/') ? url : url + '/';
  // this.auth = 'Basic ' + Buffer.from(user + ':' + password).toString('base64');
  this.auth = 'Basic ' + btoa(encodeURI(user + ':' + password));
  /** @member {LayerClient} layers GeoServer REST client instance for layers */

  this.layers = new _layer["default"](this.url, this.auth);
  /** @member {StyleClient} styles GeoServer REST client instance for styles */

  this.styles = new _style["default"](this.url, this.auth);
  /** @member {WorkspaceClient} workspaces GeoServer REST client instance for workspaces */

  this.workspaces = new _workspace["default"](this.url, this.auth);
  /** @member {NamespaceClient} namespaces GeoServer REST client instance for namespaces */

  this.namespaces = new _namespace["default"](this.url, this.auth);
  /** @member {DatastoreClient} datastores GeoServer REST client instance for data stores */

  this.datastores = new _datastore["default"](this.url, this.auth);
  /** @member {ImageMosaicClient} imagemosaics GeoServer REST client instance for image mosaics */

  this.imagemosaics = new _imagemosaic["default"](this.url, this.auth);
  /** @member {SecurityClient} security GeoServer REST client instance for security related modifications */

  this.security = new _security["default"](this.url, this.auth);
  /** @member {SettingsClient} settings GeoServer REST client instance for settings */

  this.settings = new _settings["default"](this.url, this.auth);
  /** @member {AboutClient} about GeoServer REST client instance for about endpoint */

  this.about = new _about["default"](this.url, this.auth);
  /** @member {ResetReloadClient} about GeoServer REST client instance for reset/reload endpoints */

  this.resetReload = new _resetReload["default"](this.url, this.auth);
});
exports.GeoServerRestClient = GeoServerRestClient;
