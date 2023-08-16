import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {hasAdminPermissions} from "../../util/hasAdmin";
import {IGuild, MGuild} from "../../../models/guild";
import {HydratedDocument} from "mongoose";

export default {
    name: 'setreward',
    description: 'Sets the role reward for the level of your liking',
    options:[
        {
            name: 'level',
            description: 'The level you want the reward to',
            type: 10,
            required: true
        },
        {
            name: 'role',
            description: "the role you want to set the reward as",
            type: 8,
            required: true
        },
    ],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        if (!await hasAdminPermissions(i.member as GuildMember,c)) return await i.reply({ content:'You shall not pass!', ephemeral:true })

        const level = options.getNumber('level',true)
        const role = options.getRole('role',true)

        let guild:HydratedDocument<IGuild> = await MGuild.findByGuildId(i.guildId)

        guild.rankRewards.push({level, roleId:role.id})
        await guild.save()

        await i.reply({content:`Successfully set the reward for the level \`${level}\` as the role \`${role.name}\``})
    }
}