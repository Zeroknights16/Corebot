const Utils = require('../modules/utils');
const { config, lang } = Utils.variables;

module.exports = async (bot, role) => {
    if (require('../modules/handlers/CommandHandler.js').commands.length > 0 && require('../modules/handlers/KeyHandler.js').verified) {
        if (!Utils.variables.config.Logs.Enabled.includes("RoleDeleted")) return;

        const logs = Utils.findChannel(Utils.variables.config.Logs.Channels.RoleDeleted, role.guild);

        if (logs) logs.send(Utils.Embed({
            title: lang.LogSystem.RoleDeleted.Title,
            fields: [
                {
                    name: lang.LogSystem.RoleDeleted.Field,
                    value: role.name
                }
            ]
        }))
    }
}
// 203265   8501   2228469    63250   1622514811   5ca616571bef5cf6cc5dc5f13623f65d70d8022f   2228469