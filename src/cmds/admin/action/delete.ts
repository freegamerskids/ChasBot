import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {hasAdminPermissions} from "../../util/hasAdmin";
import {reloadGuildCommands} from "../../../util/reloadGuildCommands";
import {HydratedDocument} from "mongoose";
import {IGuild, MGuild} from "../../../models/guild";

export default {
    name: 'delete',
    description: 'Deletes an server-only action',
    options:[
        {
            name: 'name',
            description: 'Action name',
            type: 3,
            required: true
        }
    ],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        if (!await hasAdminPermissions(i.member as GuildMember,c)) return await i.reply({ content:'You shall not pass!', ephemeral:true })

        const name = options.getString('name',true)

        let guild:HydratedDocument<IGuild> = await MGuild.findByGuildId(i.guildId)

        let actionCmdIndex = guild.customCommands.action.findIndex(a => a.name == name)
        if (actionCmdIndex < 0) return await i.reply({content:'Action doesn\'t exist.', ephemeral:true})

        guild.customCommands.action.splice(actionCmdIndex,1)

        await guild.save()
        await reloadGuildCommands(c, i.guildId)

        return await i.reply({content:`Successfully removed action command named \`${name}\`.`})
    }
}