'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.configuration = undefined;

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var configuration = exports.configuration = function configuration(NODE_ENV) {
    if (NODE_ENV === 'test') {
        return {
            connectionString: process.env.TEST_DB,
            SECRET_KEY: "whaterverYouThinkOf1234%8"
        };
    } else if (NODE_ENV === 'production') {
        return {
            connectionString: process.env.DATABASE_URL,
            SECRET_KEY: process.env.JWT_KEY
        };
    } else if (NODE_ENV === 'development') {
        return {
            connectionString: process.env.DATABASE_URL,
            SECRET_KEY: process.env.JWT_KEY
        };
    }

    throw new Error('Environment configuration ' + NODE_ENV + ' does not exist');
};