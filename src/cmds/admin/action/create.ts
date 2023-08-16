import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {hasAdminPermissions} from "../../util/hasAdmin";
import {reloadGuildCommands} from "../../../util/reloadGuildCommands";
import {isUrl} from "../../util/urlUtil";
import {HydratedDocument} from "mongoose";
import {IGuild, MGuild} from "../../../models/guild";

export default {
    name: 'create',
    description: 'Creates an guild-only action (10 max)',
    options:[
        {
            name: 'name',
            description: 'Action name',
            type: 3,
            required: true
        },
        {
            name: 'description',
            description: 'Action description',
            type: 3,
            required: true
        },
        {
            name: 'prompt',
            description: 'Action prompt (use <@{u1}>: ping the user running the command; <@{u2}>: ping the user specified)',
            type: 3,
            required: true
        },
        {
            name: 'gif',
            description: 'Action gif (must be a tenor link)',
            type: 3,
            required: true
        },
        {
            name: 'embed_color',
            description: 'Action embed color (must be a hex color -- ex. #00FAFF)',
            type: 3,
            required: false
        },
    ],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        if (!await hasAdminPermissions(i.member as GuildMember,c)) return await i.reply({ content:'You shall not pass!', ephemeral:true })

        let guild:HydratedDocument<IGuild> = await MGuild.findByGuildId(i.guildId)

        if (guild.customCommands.action.length >= 10) return await i.reply({ content: 'Cannot create more action commands.', ephemeral:true })

        const name = options.getString('name',true)
        const description = options.getString('description',true)
        const prompt = options.getString('prompt',true)
        let gif = options.getString('gif',true)
        const embedColor = options.getString('embed_color',false) || "#FFFFFF"

        if (!isUrl(gif)) return await i.reply({content:'Gif is not a valid url.', ephemeral:true})
        let regex = /https?:\/\/tenor\.com\/view\/([A-Za-z0-9]+(-[A-Za-z0-9]+)+)(\.gif)?/g;
        if (!gif.match(regex)) return await i.reply({content:'Not a tenor link.', ephemeral:true})
        if (!gif.endsWith('.gif')) gif += '.gif'

        guild.customCommands.action.push({
            name,
            description,
            prompt,
            gifs: [gif],
            embedColor
        })

        await guild.save()
        await reloadGuildCommands(c,i.guildId)

        return await i.reply({content:`Successfully added an action command named \`${name}\`.`})
    }
}