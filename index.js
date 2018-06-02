console.error(process.cwd());
console.error(require("path").resolve(""));
const apigateway = require('./classes/aws/apigateway');
const slack = require('./classes/slack');

exports.aws = {
    apigateway : apigateway
};
exports.slack = slack;