import {ChasBot} from "../typings/ChasBot";
import console from '../util/logger'
import {createGreetingBanner} from "../util/canvasUtil";
import {GuildMember, TextChannel} from "discord.js";

export function init(c: ChasBot){
    c.on('guildMemberAdd',async (member) => {
        const {default_background_url} = require('../../config.json')

        let background_url: string
        let guild_greeting: string
        let welcome_channel: string

        try { background_url = await c.GuildDB.getData(`/${member.guild.id}/background`) }
        catch (e) { background_url = default_background_url }

        try { guild_greeting = await c.GuildDB.getData(`/${member.guild.id}/messages/greeting`) }
        catch (e) { guild_greeting = `Welcome to ${member.guild.name}!` }

        try { welcome_channel = await c.GuildDB.getData(`/${member.guild.id}/channels/welcome`) }
        catch (e) { welcome_channel = member.guild.systemChannelId as string }

        let attach = await createGreetingBanner(member,background_url,guild_greeting)

        // horrible conversion but whatever
        await (await member.guild.channels.fetch(welcome_channel as string) as TextChannel).send({content: `> <@${member.user.id}> ${guild_greeting}`, files: [attach]})
    })

    c.on('guildMemberRemove',async (member) => {
        const {default_background_url} = require('../../config.json')

        let background_url: string
        let guild_goodbye: string
        let goodbye_channel: string

        try { background_url = await c.GuildDB.getData(`/${member.guild.id}/background`) }
        catch (e) { background_url = default_background_url }

        try { guild_goodbye = await c.GuildDB.getData(`/${member.guild.id}/messages/goodbye`) }
        catch (e) { guild_goodbye = `Sad to see you go so soon ${member.displayName} :(` }

        try { goodbye_channel = await c.GuildDB.getData(`/${member.guild.id}/channels/goodbye`) }
        catch (e) { goodbye_channel = member.guild.systemChannelId as string }

        let attach = await createGreetingBanner(member as GuildMember,background_url,guild_goodbye)

        // horrible conversion but whatever
        await (await member.guild.channels.fetch(goodbye_channel as string) as TextChannel).send({files: [attach]})
    })
}