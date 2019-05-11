'use strict';

const utils = require('@iobroker/adapter-core');
const Sonus = require('./lib/sonus');
const fs = require('fs');

/**
 * The adapter instance
 * @type {ioBroker.Adapter}
 */
let adapter;

/**
 * Decrypt the password/value with given key
 * @param {string} key - Secret key
 * @param {string} value - value to decrypt
 * @returns {string}
 */
function decrypt(key, value) {
    let result = '';
    for(let i = 0; i < value.length; i++) {
        result += String.fromCharCode(key[i % key.length].charCodeAt(0) ^ value.charCodeAt(i));
    }
    return result;
}

/**
 * Starts the adapter instance
 * @param {Partial<ioBroker.AdapterOptions>} [options]
 */
function startAdapter(options) {
    // Create the adapter and define its methods
    return adapter = utils.adapter(Object.assign({}, options, {
        name: 'sonus',

        ready: () => {
            adapter.getForeignObject('system.config', (err, obj) => {
                main((obj.native ? obj.native.secret : '') || 'Zgfr56gFe87jJOM');
            });
        },

        // is called when adapter shuts down - callback has to be called under any circumstances!
        unload: (callback) => {
            try {
                adapter.setState('info.connection', false, true);
                adapter.log.info('cleaned everything up...');
                adapter.sonus && adapter.sonus.destroy();
                adapter.sonus = null;
                callback();
            } catch (e) {
                adapter.log.error('Cannot destroy sonus: ' + e);
                callback();
            }
        },

        // is called if a subscribed object changes
        objectChange: (id, obj) => {
            if (obj) {
                // The object was changed
                adapter.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
            } else {
                // The object was deleted
                adapter.log.info(`object ${id} deleted`);
            }
        },
    }));
}

function main(secret) {
    adapter.setState('info.connection', false, true);
    adapter.setState('data.recording',  false,  true);

    adapter.readFile(null, '/model.mdl', (err, data) => {
        let jsonCredentials = adapter.config.googleJson || '';
        if (jsonCredentials) {
            jsonCredentials = decrypt(secret, jsonCredentials);
        }
        if (data) {
            if (fs.existsSync(__dirname + '/model.mdl')) {
                const stat = fs.statSync(__dirname + '/model.mdl');
                if (stat.size !== data.length) {
                    fs.writeFileSync(__dirname + '/model.mdl', data);
                }
            }
            data = __dirname + '/model.mdl';
        }

        try {
            let sonus = new Sonus({
                language: adapter.config.language,
                recordProgram: adapter.config.rec ? 'rec' : 'arecord',
                jsonCredentials,
                model: data,
                logger: adapter.log
            });

            sonus.on('error',   e       => adapter.log.error(e));
            sonus.on('ready',   ()      => {
                adapter.setState('info.connection', true, true);
                adapter.log.debug('Ready to listen...');
            });
            sonus.on('hotword', keyword => {
                adapter.setState('data.recording',  true,  true);
                adapter.log.debug('Recording...');
            });
            sonus.on('partial', words   => {
                adapter.setState('data.partial',    words, true);
                adapter.log.debug('Partial: ' + words);
            });
            sonus.on('final',   words   => {
                adapter.log.debug('Final: ' + words);
                adapter.setState('data.detected',   words, true);
                adapter.config.text2command && adapter.setForeignState(adapter.config.text2command + '.text', words);
            });

            adapter.sonus = sonus;
        } catch (e) {
            adapter.log.error(e);
        }
    });
}

if (module.parent) {
    // Export startAdapter in compact mode
    module.exports = startAdapter;
} else {
    // otherwise start the instance directly
    startAdapter();
}