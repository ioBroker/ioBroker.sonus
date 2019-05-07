'use strict';

const Sonus = require('sonus');
const speech = require('@google-cloud/speech');
const path = require('path');

// require.resolve('snowboy') => snowboy/lib/node/index.js
const snowboyPath = path.join(path.dirname(require.resolve('snowboy')), '../../');

const DEFAULT_OPTIONS = {
    language: 'de-DE',
    jsonCredentials: '',
    record: 'arecord',
    logger: {
        info: function () {console.log.apply(null, arguments)},
        silly: function () {console.log.apply(null, arguments)},
        debug: function () {console.log.apply(null, arguments)},
        warn: function () {console.warn.apply(null, arguments)},
        error: function () {console.error.apply(null, arguments)},
    }
};

class Sonus extends EventEmitter {
    constructor(options) {
        super();

        options = Object.assign({}, DEFAULT_OPTIONS, options);
        if (typeof options.jsonCredentials === 'string') {
            try {
                options.jsonCredentials = JSON.parse(options.jsonCredentials);
            } catch (e) {
                throw new Error('Cannot parse credentials');
            }
        }

        this.gClient = new speech.SpeechClient({credentials: options.jsonCredentials});

        const hotwords = [{ file: path.join(snowboyPath, '/resources/models/snowboy.umdl'), hotword: 'snowboy' }];

        //recordProgram can also be 'arecord' which works much better on the Pi and low power devices
        const sonus = Sonus.init({
            hotwords,
            language: options.language,
            recordProgram: options.record,
            resource: path.join(snowboyPath, 'resources/common.res')
        }, this.gClient);

        Sonus.start(sonus);

        options.logger.info('Started with hotword "' + hotwords[0].hotword + '"...');

        sonus.on('hotword', (index, keyword) => this.emit('hotword'));

        sonus.on('partial-result', result => this.emit('partial', result));

        sonus.on('error', error => this.emit('error', error));

        sonus.on('final-result', result => this.emit('final', result));
    }

    destroy() {
        Sonus.stop();
    }
}

module.exports = Sonus;