'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = signatureAssert;

var _qs = require('qs');

var qs = _interopRequireWildcard(_qs);

var _validator = require('validator.js');

var _crypto = require('crypto');

var _url = require('url');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Export `SignatureAssert`.
 */

/**
 * Module dependencies.
 */

function signatureAssert() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  let key = _ref.key;
  let request = _ref.request;

  // Class name.
  this.__class__ = 'Signature';

  if (!key) {
    throw new Error('Key is missing');
  }

  if (!request) {
    throw new Error(`Request is missing`);
  }

  this.key = key;
  this.request = request;

  // Validation algorithm.
  this.validate = value => {
    if (request.method === 'GET') {
      return true;
    }

    var _request = this.request;
    const body = _request.body;
    var _request$headers = _request.headers;
    const nonce = _request$headers['x-authy-signature-nonce'];
    const host = _request$headers.host;
    const method = _request.method;
    const protocol = _request.protocol;
    const path = _request.url;

    const url = (0, _url.parse)(`${ protocol }://${ host }${ path }`, true);
    const encoded = qs.stringify(body, { sort: (a, b) => a.localeCompare(b) });
    const data = `${ nonce }|${ method }|${ url.protocol }//${ url.host }${ url.pathname }|${ encoded }`;
    const signature = (0, _crypto.createHmac)('sha256', this.key).update(data).digest('base64');

    if (signature !== value) {
      throw new _validator.Violation(this, value);
    }

    return true;
  };

  return this;
}