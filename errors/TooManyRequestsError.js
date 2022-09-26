const {StatusCodes} = require('http-status-codes');
const CustomError = require("./CustomError");

class TooManyRequestsError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.TOO_MANY_REQUESTS;
    }
}

module.exports = TooManyRequestsError;
