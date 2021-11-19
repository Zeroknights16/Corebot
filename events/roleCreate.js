const Utils = require('../modules/utils');
const { config, lang } = Utils.variables;

module.exports = async (bot, role) => {
    if (require('../modules/handlers/CommandHandler.js').commands.length > 0 && require('../modules/handlers/KeyHandler.js').verified) {
        if (!Utils.variables.config.Logs.Enabled.includes("RoleCreated")) return;

        const logs = Utils.findChannel(Utils.variables.config.Logs.Channels.RoleCreated, role.guild);

        if (logs) logs.send(Utils.Embed({
            title: lang.LogSystem.RoleCreated.Title,
            fields: [
                {
                    name: lang.LogSystem.RoleCreated.Field,
                    value: `<@&${role.id}>`
                }
            ]
        }))
    }
}
// 203265   8501   2228469    63250   1622514811   5ca616571bef5cf6cc5dc5f13623f65d70d8022f   2228469