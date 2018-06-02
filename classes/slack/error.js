'use strict';

const BaseError = require('../error').BaseError;

// base
class SlackError extends BaseError {}

class ParamError extends SlackError {
    constructor(message) {
        super(message);
        this.statusCode = 400; // Bad Request
    }
}
class InternalError extends SlackError {
    constructor(message) {
        super(message);
        this.statusCode = 500; // Internal Server Error
    }
}

exports.SlackError = SlackError;
exports.ParamError = ParamError;
exports.InternalError = InternalError;