'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = 'test';

var should = _chai2.default.should();

_chai2.default.use(_chaiHttp2.default);

var userCredentials = {
  email: 'admin@admin.com',
  password: 'thebestadmin'
};

// now let's login the user before we run any tests
beforeEach(function (done) {
  _chai2.default.request(_app2.default).post('/api/v1/auth/login').send(userCredentials).end(function (err, response) {
    response.body.should.have.status(200);
    done();
  });
});

// test the get parcel route
describe('/GET Parcels', function () {
  it('it should GET all parcels delivery order', function (done) {
    _chai2.default.request(_app2.default).get('/api/v1/parcels').end(function (err, res) {
      res.should.have.status(200);
      res.body.should.have.property('parcelOrders');
      res.body.parcelOrders.should.be.a('array');
      res.body.should.be.a('object');
      done();
    });
  });
});

// test the post parcel route
describe('/POST Parcels', function () {
  it('it should POST a parcel delivery order', function (done) {
    _chai2.default.request(_app2.default).post('/api/v1/parcels').end(function (err, res) {
      res.should.have.status(200);
      res.body.should.have.property('parcelOrders');
      res.body.parcelOrders.should.be.a('array');
      res.body.should.be.a('object');
      done();
    });
  });
});