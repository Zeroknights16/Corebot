const Utils = require("../../modules/utils");
const config = Utils.variables.config;
const lang = Utils.variables.lang;
const createTicket = require('../../modules/methods/createTicket');

module.exports = {
    name: 'new',
    run: async (bot, message, args) => {
        createTicket(bot, args, message.member, message.channel);
    },
    description: "Create a ticket",
    usage: config.Tickets.RequireReason ? 'new <reason>' : 'new [reason]',
    aliases: [
        'ticket'
    ]
}
// 203265   8501   2228469    63250   1622514811   5ca616571bef5cf6cc5dc5f13623f65d70d8022f   2228469