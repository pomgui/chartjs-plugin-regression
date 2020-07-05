#!/bin/env node

const
    pck = require('../package.json'),
    fs = require('fs'),
    files = ['./demo/index.html', './README.md'];

files.forEach(replaceVersion);

function replaceVersion(file) {
    var index = fs.readFileSync(file, 'utf8');
    index = index.replace(/(dist\/chartjs-plugin-regression-).*?\.js/, `$1${pck.version}.js`);
    fs.writeFileSync(file, index, 'utf8');
}