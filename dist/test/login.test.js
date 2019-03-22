'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();
_chai2.default.use(_chaiHttp2.default);

describe('/POST user/login', function () {
    // Signing in
    it('It should sign a user in', function (done) {
        _chai2.default.request(_app2.default).post('/api/v1/auth/login').send({
            email: 'solathecoder@gmail.com', password: 'solathecoder'
        }).end(function (err, res) {
            res.should.have.status(200);
            _chai.assert.equal(res.body.message, 'Auth Successful');
            done();
        });
    });

    // Token
    it('It should send a token on successful login', function (done) {
        _chai2.default.request(_app2.default).post('/api/v1/auth/login').send({
            email: 'solathecoder@gmail.com', password: 'solathecoder'
        }).end(function (err, res) {
            res.should.have.status(200);
            _chai.assert.property(res.body.data[0], 'token');
            done();
        });
    });

    // checking if email exists
    it('It should not log a user in if email does not exist', function (done) {
        _chai2.default.request(_app2.default).post('/api/v1/auth/login').send({
            email: '059@gmail.com', password: 'anythin'
        }).end(function (err, res) {
            res.should.have.status(409);
            _chai.assert.equal(res.body.error, 'Auth failed');
            done();
        });
    });

    //invalid email
    it('It should not log a user in if email is invalid email format', function (done) {
        _chai2.default.request(_app2.default).post('/api/v1/auth/login').send({
            email: 'gmailcom', password: 'anything'
        }).end(function (err, res) {
            res.should.have.status(500);
            _chai.assert.equal(res.body.error, '\"email\" must be a valid email');
            done();
        });
    });

    // empty email field
    it('It should not log a user in if email field is empty', function (done) {
        _chai2.default.request(_app2.default).post('/api/v1/auth/login').send({
            email: '', password: 'anything'
        }).end(function (err, res) {
            res.should.have.status(500);
            _chai.assert.equal(res.body.error, '\"email\" is not allowed to be empty');
            done();
        });
    });

    // empty password field
    it('It should not log a user in if password field is empty', function (done) {
        _chai2.default.request(_app2.default).post('/api/v1/auth/login').send({
            email: 'olusola@gmail.com', password: ''
        }).end(function (err, res) {
            res.should.have.status(500);
            _chai.assert.equal(res.body.error, '\"password\" is not allowed to be empty');
            done();
        });
    });
});