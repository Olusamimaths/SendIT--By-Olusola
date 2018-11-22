'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkAuthor = function checkAuthor(req, res, next) {
  try {
    if (_auth2.default.id === req.params.userId) {
      next();
    }
  } catch (err) {
    return res.status(401).json({
      message: 'You are not the author'
    });
  }
};

// const userId = userData.id;

exports.default = checkAuthor;