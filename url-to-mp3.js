
'use strict';

const fs = require('fs');
const rp = require('request-promise');

const url = 'https://rcf.fr/sites/default/static.rcf.fr/diffusions/2017/11/06/RCF85_OUESTECO_20171106.mp3';
const filePath = '/home/administrateur/Documents/1-5.mp3';

console.log(filePath);

var ws = fs.createWriteStream(filePath);

rp.get(url).pipe(ws)
    .on('error', console.log)
    .on('finish', function () {
        console.log(['Downloaded: ', url].join(''));
    });