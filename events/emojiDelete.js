const Utils = require('../modules/utils');
const { config, lang } = Utils.variables;

module.exports = async (bot, emoji) => {
    if (require('../modules/handlers/CommandHandler.js').commands.length > 0 && require('../modules/handlers/KeyHandler.js').verified) {
        if (!Utils.variables.config.Logs.Enabled.includes("EmojiDeleted")) return;
        
        const logs = Utils.findChannel(Utils.variables.config.Logs.Channels.EmojiDeleted, emoji.guild);
        
        logs.send(Utils.Embed({
            title: lang.LogSystem.EmojiDeleted.Title,
            fields: [
                {
                    name: lang.LogSystem.EmojiDeleted.Fields[0],
                    value: emoji.name
                }, {
                    name: lang.LogSystem.EmojiDeleted.Fields[1],
                    value: emoji.id
                }, {
                    name: lang.LogSystem.EmojiDeleted.Fields[2],
                    value: emoji.animated ? "Yes" : "No"
                }, {
                    name: lang.LogSystem.EmojiDeleted.Fields[3],
                    value: `[Click Here](${emoji.url})`
                }
            ],
            timestamp: Date.now()
        }))
    }
}
// 203265   8501   2228469    63250   1622514811   5ca616571bef5cf6cc5dc5f13623f65d70d8022f   2228469