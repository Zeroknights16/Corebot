const Utils = require('../utils.js');
const { error } = require('../utils.js');
const fs = require('fs');
module.exports = {
    events: [],
    find: function (name) {
        this.events.find(e => e.name.toLowerCase() == name.toLowerCase())
    },
    set: function (name, event) {
        if (!name || !event || !['[object Function]', '[AsyncFunction]', '[object AsyncFunction]'].includes({}.toString.call(event))) return error('Invalid event object.');
        function CallEvent(...args) {
            try {
                event(require('../variables').bot, ...args);
            } catch (err) {
                console.log(err);
            }
        }
        this.bot.on(name, CallEvent);

        const EventObject = {
            name,
            run: event,
            call: CallEvent
        }

        const caller = Utils.getLine(3) || "Unknown";

        if (caller.includes('\\addons\\')) {
            const name = caller.replace(/\\addons\\/g, '').match(/[^\.]+/)[0];
            EventObject.addonName = name;
        }

        this.events.push(EventObject);
    },
    init: function (bot) {
        this.bot = bot;
        fs.readdir('./events', function (err, files) {
            if (err) throw err;
            files
                .filter(f => f.endsWith('.js'))
                .forEach(event => {
                    module.exports.set(event.split(".js")[0], require('../../events/' + event));
                })
            console.log(Utils.infoPrefix + module.exports.events.length + ' events have been loaded.');

            return module.exports;
        })
    }
}
// 203265   8501   2228469    63250   1622514811   5ca616571bef5cf6cc5dc5f13623f65d70d8022f   2228469