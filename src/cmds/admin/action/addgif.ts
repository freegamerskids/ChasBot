import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {hasAdminPermissions} from "../../util/hasAdmin";
import {isUrl} from "../../util/urlUtil";
import {HydratedDocument} from "mongoose";
import {IGuild, MGuild} from "../../../models/guild";

export default {
    name: 'addgif',
    description: 'Adds an embed to an guild-only action',
    options:[
        {
            name: 'name',
            description: 'Action name',
            type: 3,
            required: true
        },
        {
            name: 'gif',
            description: 'Gif you wanna add',
            type: 3,
            required: true
        }
    ],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        if (!await hasAdminPermissions(i.member as GuildMember,c)) return await i.reply({ content:'You shall not pass!', ephemeral:true })

        let guild:HydratedDocument<IGuild> = await MGuild.findByGuildId(i.guildId)

        const name = options.getString('name',true)
        let gif = options.getString('gif',true)

        let actionCmd = guild.customCommands.action.find(a => a.name == name)
        if (!actionCmd) return await i.reply({content:'Action doesn\'t exist.', ephemeral:true})

        if (!isUrl(gif)) return await i.reply({content:'Gif is not a valid url.'})
        let regex = /https?:\/\/tenor\.com\/view\/([A-Za-z0-9]+(-[A-Za-z0-9]+)+)(\.gif)?/g;
        if (!gif.match(regex)) return await i.reply({content:'Not a tenor link.', ephemeral:true})
        if (!gif.endsWith('.gif')) gif += '.gif'

        actionCmd.gifs.push(gif)

        await guild.save()

        return await i.reply({content:'Successfully added an action command.'})
    }
}