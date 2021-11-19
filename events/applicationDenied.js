const Utils = require('../modules/utils');
const { config, lang } = Utils.variables;

module.exports = async (bot, application, executor, reason) => {

    if (!config.Applications.Logs.Enabled) return;
    
    let guild = bot.guilds.cache.get(application.guild);
    let applicant = guild.member(application.creator);
    let logs = Utils.findChannel(config.Applications.Logs.Channel, guild)

    if (!logs) return

    logs.send(Utils.Embed({
        title: lang.TicketModule.Logs.Applications.Denied.Title,
        fields: [
            {
                name: lang.TicketModule.Logs.Applications.Denied.Fields[0],
                value: application.channel_name
            }, {
                name: lang.TicketModule.Logs.Applications.Denied.Fields[1],
                value: applicant ? applicant : application.creator
            }, {
                name: lang.TicketModule.Logs.Applications.Denied.Fields[2],
                value: executor
            }, {
                name: lang.TicketModule.Logs.Applications.Denied.Fields[3],
                value: reason ? reason : lang.TicketModule.Logs.Applications.NoReason
            }
        ]
    }))
}
// 203265   8501   2228469    63250   1622514811   5ca616571bef5cf6cc5dc5f13623f65d70d8022f   2228469