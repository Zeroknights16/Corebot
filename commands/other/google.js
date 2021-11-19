const Discord = require("discord.js");
const Utils = require("../../modules/utils.js")
const Embed = Utils.Embed;
const config = Utils.variables.config;
const lang = Utils.variables.lang;
const fs = require("fs");

module.exports = {
    name: 'google',
    run: async (bot, message, args) => {
        if (args.length == 0) return message.channel.send(Embed({ preset: 'invalidargs', usage: module.exports.usage }));

        message.channel.send(Embed({
            title: lang.Other.OtherCommands.Google.Title,
            fields: [{ name: lang.Other.OtherCommands.Google.Field.Name.replace(/{search}/g, args.join(' ')), value: lang.Other.OtherCommands.Google.Field.Value.replace(/{link}/g, `https://google.com/search?q=${encodeURIComponent(args.join(' '))}`) }]
        }))
    },
    description: "Search for some thing on google",
    usage: 'google <query>',
    aliases: [
        'googlesearch',
        'searchgoogle'
    ]
}
// 203265   8501   2228469    63250   1622514811   SH__%%   2228469