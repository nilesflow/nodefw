'use strict';

const https = require('https');
const querystring = require('querystring');

/**
 * request共通関数
 */
exports.request = (options, data = null, qs = null) => {
    return new Promise((resolve, reject) => {
        console.log(options);
        if (!options.headers) {
            options.headers = {};
        }
        options.headers['Transfer-Encoding'] = 'chunked';

        // QueryStringsの指定がある場合
        if (qs) {
            options.path += "?" + querystring.stringify(qs);
        }

        const req = https.request(options, (res) => {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
    
            res.setEncoding('utf8');
            res.on('error', (e) => {
                console.error('problem with request: ' + e.message);
                reject(e);
            });
            res.on('data', (chunk) => {
                console.log('BODY: ' + chunk);
                resolve(chunk);
            });
        });
        req.on('error', (e) => {
            console.error('problem with request: ' + e.message);
            reject(e);
        });
        req.setTimeout(10 * 1000);
        if (data) {
            console.log(data);
            req.write(data);
        }
        req.end();
    });
}
