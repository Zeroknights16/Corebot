const Discord = require("discord.js");
const Utils = require("../../modules/utils.js")
const Embed = Utils.Embed;
const { config, lang, embeds } = Utils.variables;

module.exports = {
    name: 'links',
    run: async (bot, message, args) => {
        let fields = Object.keys(config.Links).map(name => {
            return { name: name, value: config.Links[name] }
        })

        message.channel.send(Utils.setupEmbed({
            configPath: embeds.Embeds.Links,
            fields: fields
        }))
    },
    description: "View links related to the Discord server",
    usage: 'links',
    aliases: [],
}
// 203265   8501   2228469    63250   1622514811   5ca616571bef5cf6cc5dc5f13623f65d70d8022f   2228469