'use strict';

const SONUS = require('../sonus');
const speech = require('@google-cloud/speech');
const path = require('path');
const EventEmitter = require('events');

const sonusPath = path.normalize(__dirname + '/../sonus/');//path.dirname(require.resolve('sonus'));

const DEFAULT_OPTIONS = {
    language: 'de-DE',
    jsonCredentials: '',
    record: 'arecord',
    model: '',
    logger: {
        info:  function () {console.log.apply(null, arguments)},
        silly: function () {console.log.apply(null, arguments)},
        debug: function () {console.log.apply(null, arguments)},
        warn:  function () {console.warn.apply(null, arguments)},
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

        const hotwords = [
            {file: options.model || path.join(sonusPath, 'resources/snowboy.umdl'), hotword: options.model ? 'hotword' : 'snowboy', sensitivity: options.sensitivity},
            {file: path.join(sonusPath, 'resources/sonus.pmdl'), hotword: 'sonus'}
        ];

        // recordProgram can also be 'arecord' which works much better on the Pi and low power devices
        this.sonus = SONUS.init({
            hotwords,
            language: options.language,
            recordProgram: options.record,
            resource: path.join(sonusPath, 'resources/common.res')
        }, this.gClient);

        SONUS.start(this.sonus);

        options.logger.info('Started with hotword "' + hotwords[0].hotword + '"...');

        this.sonus.on('hotword', (index, keyword) => this.emit('hotword', keyword));

        this.sonus.on('partial-result', result => this.emit('partial', result));

        this.sonus.on('error', error => this.emit('error', error));

        this.sonus.on('final-result', result => this.emit('final', result));

        setTimeout(() => this.emit('ready'), 100);
    }

    destroy() {
        SONUS.stop();
    }
}

module.exports = Sonus;