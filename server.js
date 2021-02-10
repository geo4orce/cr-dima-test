// bootstrap
const ENV = process.env;
ENV.ROOT = __dirname;
if (ENV.NODE_ENV !== 'production') {
    const dotenv_config = ENV.NODE_ENV === 'stage' ? {path: '.env.stage'} : {};
    require('dotenv').config(dotenv_config);
}
// const PKG = require(ENV.ROOT + '/package.json');
const PORT = ENV.PORT;
const fetch = require("node-fetch");

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

// init
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

// proxy
app.get('/proxy', function (req, res) {
    const url = req.query.url;
    util.log('GET /proxy ' + url);

    fetch(url).then(r => {
        const status = r.status + ' ' + r.statusText;
        util.log(status);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({status}));
    }).catch(err => {
        util.log(err);
        res.send('');
    });
});

// js assets (must be the last get!)
app.get('/:name', function (req, res) {
    const file = req.params.name;
    util.log('GET /' + file);
    res.sendFile(file, sendFileOptions);
});
