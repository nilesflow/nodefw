'use strict';

const fs = require('fs');
const path = require('path');

/**
 * ディレクトリ直下のファイルを読み込み
 * index.jsから使用
 */
exports.exportClass = (dir, cb) => {
    const files = fs.readdirSync(dir);
    files.forEach(function(filename){ 
        let file = dir + '/' + filename;
    
        // ファイル以外を除外
        if (! fs.statSync(file).isFile()) {
            return;
        }
        // 拡張子.jsのみ
        if (!/.*\.js$/.test(filename)) {
            return;
        }
        // 自身は除外
        if (filename == 'index.js') {
            return;
        }
        let base = path.basename(filename, '.js');
        cb(base, require(dir + `/${filename}`));
    });
}
