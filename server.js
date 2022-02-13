// bootstrap
const ENV = process.env;
ENV.ROOT = __dirname;
if (ENV.NODE_ENV !== 'production') {
    const dotenv_config = ENV.NODE_ENV === 'stage' ? {path: '.env.stage'} : {};
    require('dotenv').config(dotenv_config);
}
// const PKG = require(ENV.ROOT + '/package.json');
const PORT = ENV.PORT;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// import deps
const express = require('express');
const util = require(ENV.ROOT + '/server/util.js');

// start the app
util.log("\nvvvvvvvvvvvvvvvvvvvvv\n");
util.log('NODE_ENV: ' + ENV.NODE_ENV);
util.log('ROOT: ' + ENV.ROOT);

const app = express();
const sendFileOptions = {
    root: ENV.ROOT + '/dist/',
    dotfiles: 'deny',
};
app.listen(PORT, function () {
    util.log('Listening on port ' + PORT);
});

/////////////////////// ROUTES ///////////////////////

app.get('/', function (req, res) {
    util.log('GET /index');
    res.sendFile('index.html', sendFileOptions);
});
app.get('/favicon.ico', function (req, res) {
    util.log('GET /favicon.ico');
    res.sendFile('favicon.ico', {
        root: ENV.ROOT,
        dotfiles: 'deny',
    });
});
app.get('/proxy', function (req, res) {
    const url = req.query.url;
    util.log('GET /proxy ' + url);

    res.setHeader('Content-Type', 'application/json');
    let status = 'none';
    let redirected = false;
    fetch(url, {method: 'HEAD'}).then(r => {
        redirected = r.redirected;
        status = `${r.status} (${r.statusText})`;
    }).catch(err => {
        status = 'Proxy Error: ' + err;
    }).finally(() => {
        util.log(status);
        res.send(JSON.stringify({
            status,
            redirected,
        }));
    });
});

// js assets (must be the last get!)
app.get('/:name', function (req, res) {
    const file = req.params.name;
    util.log('GET /' + file);
    res.sendFile(file, sendFileOptions);
});
