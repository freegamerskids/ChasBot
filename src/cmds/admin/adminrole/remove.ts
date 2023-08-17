import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {HydratedDocument} from "mongoose";
import {IGuild, MGuild} from "../../../models/guild";

export default {
    name: 'remove',
    description: 'Removes an admin role.',
    options:[
        {
            name: 'role',
            description: "the role you want to remove as an admin role",
            type: 8,
            required: true
        }
    ],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        if (!(i.member as GuildMember).permissions.has('Administrator') || !(i.guild.ownerId == (i.member as GuildMember).id)) return await i.reply({ content:'You shall not pass!', ephemeral:true })

        const role = options.getRole('role',true)

        let guild:HydratedDocument<IGuild> = await MGuild.findByGuildId(i.guildId)

        if (guild.adminRoles.length <= 0) return await i.reply({content:'There aren\'t any admin roles set.', ephemeral:true})

        let index = guild.adminRoles.findIndex(r => r == role.id)
        if (index < 0) return await i.reply({content:'The role you specified is not an admin role.',ephemeral:true})

        guild.adminRoles.splice(index,1)

        await guild.save()

        await i.reply({content:`Successfully removed the role \`${role.name}\` as an admin role.`})
    }
}