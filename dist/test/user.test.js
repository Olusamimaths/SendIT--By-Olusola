'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _test = require('../middleware/test.auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();
_chai2.default.use(_chaiHttp2.default);

process.env.NODE_ENV = 'test';

var token = (0, _test.test_login)('user');

describe('/POST user/login', function () {
    // getting all parcels
    it('It should get all parcel', function (done) {
        _chai2.default.request(_app2.default).post('/api/v1/auth/login').send({
            email: 'solathecoder07m@lmail.com', password: 'solathecoder'
        }).end(function (err, res) {
            res.should.have.status(200);
            _chai.assert.equal(res.body.message, 'Auth Successful');
            done();
        });
    });
});