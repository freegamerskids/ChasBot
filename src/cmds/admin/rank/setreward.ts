import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {hasAdminPermissions} from "../../util/hasAdmin";

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

        await c.GuildDB.push(`/${i.guildId}/rank_rewards/${level}`,role.id)

        await i.reply({content:`Successfully set the reward for the level \`${level}\` as the role \`${role.name}\``})
    }
}