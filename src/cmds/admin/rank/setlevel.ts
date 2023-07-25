import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {hasAdminPermissions} from "../../util/hasAdmin";
import {xpNeedCalcFunction} from "../../../util/rankHandler";

export default {
    name: 'setlevel',
    description: 'Sets the level of a user',
    options:[
        {
            name: 'user',
            description: "the user you want to change the level to",
            type: 6,
            required: true
        },
        {
            name: 'level',
            description: 'The level you want to set it to',
            type: 4,
            required: true
        }
    ],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        if (!await hasAdminPermissions(i.member as GuildMember,c)) return await i.reply({ content:'You shall not pass!', ephemeral:true })

        const user = options.getUser('user',true)
        const level = options.getInteger('level',true)

        await c.GuildDB.push(`/${i.guildId}/ranks/${user.id}`,{level,xp: xpNeedCalcFunction(level), xp_needed: xpNeedCalcFunction(level+1)})

        await i.reply({content:`Successfully changed the level for user <@${user.id}> to \`${level}\``})
    }
}