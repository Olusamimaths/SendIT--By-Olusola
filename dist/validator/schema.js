'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.userSchema = undefined;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const userSchema = Joi.object().keys({
//     username: Joi.string().alphanum().min(3).max(30).required,
//     firstname: Joi.string().alphanum().min(3).max(30).required,
//     lastname: Joi.string().alphanum().min(3).max(30).required,
//     othernames: Joi.string().alphanum().min(3).max(30).required,
//     email: Joi.string().email({ minDomainAtoms: 2 }),
//     password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)    
// });

var userSchema = exports.userSchema = _joi2.default.object().keys({
    username: _joi2.default.string().alphanum().min(3).max(30).required(),
    firstname: _joi2.default.string().alphanum().min(3).max(30).required(),
    lastname: _joi2.default.string().alphanum().min(3).max(30).required(),
    othernames: _joi2.default.string().alphanum().min(3).max(30).required(),
    password: _joi2.default.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    email: _joi2.default.string().email({ minDomainAtoms: 2 })
});

var parcelSchema = _joi2.default.object().keys({
    // weight:  Joi.number().integer().required ,
    // from: Joi.string().alphanum().min(3).max(30).required,
    // to: Joi.string().alphanum().min(3).max(30).required,
    // currentLocation: Joi.string().alphanum().min(3).max(30).required
});

// export { userSchema, parcelSchema }