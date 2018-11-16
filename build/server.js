'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT || 3000;

app.use(_express2.default.json());

app.get('/', function (req, res) {
  return res.status(200).send({
    message: 'First endpoint made'
  });
});

app.listen(port);
console.log('Server started at port ' + port + '...');