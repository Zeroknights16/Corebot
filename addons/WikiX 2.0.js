const Utils = require('../modules/utils')
const Embed = Utils.Embed;
const EventHandler = require('../modules/handlers/EventHandler')
const ZUtils = require('../ZUtils.js')

module.exports = async bot => {
    const CustomConfig = require('../modules/CustomConfig.js');
    const config = new CustomConfig('./addon_configs/WikiX.yml', {
        Prefix: '$',
        PingMessage: "{pingedUser}, {author} has mentioned you read this",
        Rules: [
            {
                Title: "Best Discord bot | Corebot",
                Description: "**Purchase Here**\n> https://corebot.dev/mcm",
                Footer: "Requested by: {user-displayname}"
            },
            {
                Title: "WikiX Addon | Corebot",
                Description: "WikiX Addon Made by @Zorino#1110",
                Footer: "Requested by: {user-displayname}"
            }
        ]
    }, true)
    
    EventHandler.set('message', (bot, message) => {
        const prefix = config.Prefix
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        let user = message.mentions.members.first()

        if (config.Rules[command - 1] == undefined) return;
        if (!user && !isNaN(command) && config.Rules[command - 1]) {
            message.channel.send(Utils.setupEmbed({
                configPath: config.Rules[command - 1],
                variables: [
                    ...Utils.userVariables(message.member, "user")
                ]
            }))
        } else {
            message.channel.send(config.PingMessage
                .replace(/{pingedUser}/g, `<@${user.user.id}>`)
                .replace(/{author}/g, `<@${message.author.id}>`),
                Utils.setupEmbed({
                    configPath: config.Rules[command - 1],
                    variables: [
                        ...Utils.userVariables(message.member, "user"),
                        ...Utils.userVariables(user, "mention")
                    ]
                }))
            message.delete()
        } 
        return;
    })
}
ZUtils.LoadAddon("WikiX")