'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _signup = require('../controller/signup');

var _signup2 = _interopRequireDefault(_signup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/auth/signup', _signup2.default);

exports.default = router;