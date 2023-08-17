import {ChasBot} from "../typings/ChasBot";
import {createGreetingBanner} from "../util/canvasUtil";
import {GuildMember, TextChannel} from "discord.js";
import {MGuild} from "../models/guild";

export function init(c: ChasBot){
    c.on('guildMemberAdd',async (member) => {
        const {default_background_url} = require('../../config.json')

        const guild = await MGuild.findByGuildId(member.guild.id)

        let background_url = guild.background || default_background_url
        let guild_greeting = guild.messages.greeting || `Welcome to ${member.guild.name}!`
        let welcome_channel = guild.channels.welcome || member.guild.systemChannelId as string

        let attach = await createGreetingBanner(member,background_url,guild_greeting)

        // horrible conversion but whatever
        await (await member.guild.channels.fetch(welcome_channel as string) as TextChannel).send({content: `> <@${member.user.id}> ${guild_greeting}`, files: [attach]})
    })

    c.on('guildMemberRemove',async (member) => {
        const {default_background_url} = require('../../config.json')

        const guild = await MGuild.findByGuildId(member.guild.id)

        let background_url = guild.background ? null : guild.background || default_background_url
        let guild_goodbye = guild.messages.goodbye || `Sad to see you go so soon ${member.displayName} :(`
        let goodbye_channel = guild.channels.goodbye || member.guild.systemChannelId as string

        let attach = await createGreetingBanner(member as GuildMember,background_url,guild_goodbye)

        // horrible conversion but whatever
        await (await member.guild.channels.fetch(goodbye_channel as string) as TextChannel).send({files: [attach]})
    })
}