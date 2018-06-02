'use strict';

const BaseError = require('../../error').BaseError;

/**
 * API Gateway用の例外Error
 */
class ApiGatewayError extends BaseError {
    constructor(code, error, message) {
        super(JSON.stringify({
            code : code,
            error: error,
            errorMessage : message,
        }));
    }
}

module.exports = ApiGatewayError;