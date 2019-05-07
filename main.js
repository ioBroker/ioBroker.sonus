'use strict';

const utils = require('@iobroker/adapter-core');
const Sonus = require('./lib/sonus');

/**
 * The adapter instance
 * @type {ioBroker.Adapter}
 */
let adapter;

/**
 * Starts the adapter instance
 * @param {Partial<ioBroker.AdapterOptions>} [options]
 */
function startAdapter(options) {
    // Create the adapter and define its methods
    return adapter = utils.adapter(Object.assign({}, options, {
        name: 'sonus',

        // The ready callback is called when databases are connected and adapter received configuration.
        // start here!
        ready: main, // Main method defined below for readability

        // is called when adapter shuts down - callback has to be called under any circumstances!
        unload: (callback) => {
            try {
                adapter.log.info('cleaned everything up...');
                callback();
            } catch (e) {
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

function main() {

    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:
    adapter.log.info('config language: ' + adapter.config.language);
    adapter.log.info('config googleJson: ' + adapter.config.googleJson);

    // Reset connection state at start
    adapter.setState('info.connection', false, true);

}

if (module.parent) {
    // Export startAdapter in compact mode
    module.exports = startAdapter;
} else {
    // otherwise start the instance directly
    startAdapter();
}