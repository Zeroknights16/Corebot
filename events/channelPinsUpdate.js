const Utils = require('../modules/utils');
const Embed = Utils.Embed;
const { lang, config } = Utils.variables;

module.exports = (bot, channel) => {
    if (require('../modules/handlers/CommandHandler.js').commands.length > 0 && require('../modules/handlers/KeyHandler.js').verified) {
        if (!channel.guild || !config.Logs.Enabled.includes("ChannelPinsUpdated")) return;

        const logs = Utils.findChannel(config.Logs.Channels.ChannelPinsUpdated, channel.guild);

        logs.send(Embed({
            title: lang.LogSystem.ChannelPinsUpdated.Title,
            fields: [
                {
                    name: lang.LogSystem.ChannelPinsUpdated.Fields[0],
                    value: `<#${channel.id}>`
                }
            ],
            timestamp: Date.now()
        }))
    }
}
// 203265   8501   2228469    63250   1622514811   5ca616571bef5cf6cc5dc5f13623f65d70d8022f   2228469