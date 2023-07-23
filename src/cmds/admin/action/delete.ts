import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {hasAdminPermissions} from "../../util/hasAdmin";
import {reloadGuildCommands} from "../../../util/reloadGuildCommands";

export default {
    name: 'delete',
    description: 'Deletes an guild-only action',
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

        try {
            await c.GuildDB.delete(`/${i.guildId}/custom_commands/action/${name}`)
        } catch (e) {
            return await i.reply({content:'Action doesn\'t exist.', ephemeral:true})
        }

        await reloadGuildCommands(c, i.guildId)

        return await i.reply({content:`Successfully removed action command named \`${name}\`.`})
    }
}