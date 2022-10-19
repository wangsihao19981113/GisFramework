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
 * Client for GeoServer settings.
 *
 * @module SettingsClient
 */
var SettingsClient = /*#__PURE__*/function () {
  /**
   * Creates a GeoServer REST SettingsClient instance.
   *
   * @param {String} url The URL of the GeoServer REST API endpoint
   * @param {String} auth The Basic Authentication string
   */
  function SettingsClient(url, auth) {
    (0, _classCallCheck2["default"])(this, SettingsClient);
    this.url = url;
    this.auth = auth;
  }
  /**
   * Get the complete GeoServer settings object.
   *
   * @throws Error if request fails
   *
   * @returns {Object} Settings object
   */


  (0, _createClass2["default"])(SettingsClient, [{
    key: "getSettings",
    value: function () {
      var _getSettings = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'settings.json', {
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

      function getSettings() {
        return _getSettings.apply(this, arguments);
      }

      return getSettings;
    }()
    /**
     * Update the global GeoServer settings.
     *
     * @param {Object} settings The adapted GeoServer settings object
     */

  }, {
    key: "updateSettings",
    value: function () {
      var _updateSettings = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(settings) {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'settings', {
                  credentials: 'include',
                  method: 'PUT',
                  headers: {
                    Authorization: this.auth,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(settings)
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
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function updateSettings(_x) {
        return _updateSettings.apply(this, arguments);
      }

      return updateSettings;
    }()
    /**
     * Update the global proxyBaseUrl setting.
     *
     * @param {String} proxyBaseUrl The proxy base URL
     */

  }, {
    key: "updateProxyBaseUrl",
    value: function () {
      var _updateProxyBaseUrl = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(proxyBaseUrl) {
        var settingsJson;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.getSettings();

              case 2:
                settingsJson = _context3.sent;

                if (!(!settingsJson.global && !settingsJson.global.settings)) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return", false);

              case 5:
                // add proxyBaseUrl to settings
                settingsJson.global.settings.proxyBaseUrl = proxyBaseUrl;
                _context3.next = 8;
                return this.updateSettings(settingsJson);

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function updateProxyBaseUrl(_x2) {
        return _updateProxyBaseUrl.apply(this, arguments);
      }

      return updateProxyBaseUrl;
    }()
    /**
     * Get the contact information of the GeoServer.
     *
     * @throws Error if request fails
     *
     * @returns {Object} An object with contact information
     */

  }, {
    key: "getContactInformation",
    value: function () {
      var _getContactInformation = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        var response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _nodeFetch["default"])(this.url + 'settings/contact', {
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
                return _context4.abrupt("return", response.json());

              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getContactInformation() {
        return _getContactInformation.apply(this, arguments);
      }

      return getContactInformation;
    }()
    /**
     * Update the contact information.
     *
     * Deleting is not supported.
     *
     * @param {String} [address] The contact's address
     * @param {String} [city] The contact's city
     * @param {String} [country] The contact's country
     * @param {String} [postalCode] The contact's postCode
     * @param {String} [state] The contact's state
     * @param {String} [email] The contact's email
     * @param {String} [organization] The contact's organization
     * @param {String} [contactPerson] The contact person
     * @param {String} [phoneNumber] The contact's phone number
     *
     * @throws Error if request fails
     */

  }, {
    key: "updateContactInformation",
    value: function () {
      var _updateContactInformation = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(address, city, country, postalCode, state, email, organization, contactPerson, phoneNumber) {
        var contact, body, url, response, geoServerResponse;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                contact = {
                  address: address,
                  addressCity: city,
                  addressCountry: country,
                  addressPostalCode: postalCode,
                  addressState: state,
                  contactEmail: email,
                  contactOrganization: organization,
                  contactPerson: contactPerson,
                  contactVoice: phoneNumber
                };
                body = {
                  contact: contact
                };
                url = this.url + 'settings/contact';
                _context5.next = 5;
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
                response = _context5.sent;

                if (response.ok) {
                  _context5.next = 11;
                  break;
                }

                _context5.next = 9;
                return (0, _geoserver.getGeoServerResponseText)(response);

              case 9:
                geoServerResponse = _context5.sent;
                throw new _geoserver.GeoServerResponseError(null, geoServerResponse);

              case 11:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function updateContactInformation(_x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10, _x11) {
        return _updateContactInformation.apply(this, arguments);
      }

      return updateContactInformation;
    }()
  }]);
  return SettingsClient;
}();

exports["default"] = SettingsClient;