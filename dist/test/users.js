'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = _chai2.default.should();

_chai2.default.use(_chaiHttp2.default);

// test the get parcel route
describe('/PATCH Parcels', function () {
  it('it should CANCEL a parcel\'s delivery order', function (done) {
    _chai2.default.request(_app2.default).get('/api/v1/parcels').end(function (err, res) {
      res.should.have.status(200);
      res.body.should.have.property('parcelOrders');
      res.body.parcelOrders.should.be.an('array');
      res.body.should.be.a('object');
      done();
    });
  });
});