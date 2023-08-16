import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {hasAdminPermissions} from "../../util/hasAdmin";
import {xpNeedCalcFunction} from "../../../util/rankHandler";
import {IGuild, MGuild} from "../../../models/guild";
import {HydratedDocument} from "mongoose";

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

        let guild:HydratedDocument<IGuild> = await MGuild.findByGuildId(i.guildId)

        let rank = guild.ranks.find(r => r.userId == user.id)
        rank.level = level
        rank.xp = xpNeedCalcFunction(level)
        rank.xpNeeded = xpNeedCalcFunction(level+1)

        await guild.save()

        await i.reply({content:`Successfully changed the level for user <@${user.id}> to \`${level}\``})
    }
}