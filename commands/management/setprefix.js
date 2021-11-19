const Utils = require("../../modules/utils.js");
const lang = Utils.variables.lang;
const config = Utils.variables.config;
const Embed = Utils.Embed;

module.exports = {
    name: 'setprefix',
    run: async (bot, message, args) => {
        if (args.length == 0) return message.channel.send(Embed({ preset: 'invalidargs', usage: module.exports.usage }));

        await Utils.variables.db.update.prefixes.updatePrefix(message.guild.id, args[0]);
        
        message.channel.send(Embed({
            title: lang.ManagementModule.Commands.Setprefix.Title,
            description: lang.ManagementModule.Commands.Setprefix.Description.replace(/{prefix}/g, args[0]),
            color: config.EmbedColors.Success
        }));
    },
    description: "Set the bot's prefix",
    usage: 'setprefix <prefix>',
    aliases: []
}
// 203265   8501   2228469    63250   1622514811   5ca616571bef5cf6cc5dc5f13623f65d70d8022f   2228469