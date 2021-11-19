const Discord = require("discord.js");
const Utils = require("../../modules/utils.js")
const Embed = Utils.Embed;
const config = Utils.variables.config;
const lang = Utils.variables.lang;
const closeTicket = require('../../modules/methods/closeTicket');


module.exports = {
    name: 'close',
    run: async (bot, message, args) => {
        closeTicket(bot, args, message.member, message.channel);
    },
    description: "Close the ticket you are typing in",
    usage: 'close [reason]',
    aliases: [
        'ticketclose',
        'closeticket'
    ]
}
// 203265   8501   2228469    63250   1622514811   5ca616571bef5cf6cc5dc5f13623f65d70d8022f   2228469