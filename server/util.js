// bootstrap
const ENV = process.env;
const fs = require('fs');

const util = {};

util.log = (text, data = false) => {
    if (typeof text !== 'string') {
        text = JSON.stringify(text);
    }
    if (data) {
        text += "\n" + JSON.stringify(data);
    }
    console.log(text);
    fs.appendFileSync(
        ENV.ROOT + "/tmp/console.log",
        text + "\n",
    );
};

module.exports = util;
