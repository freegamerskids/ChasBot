import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";
import {HydratedDocument} from "mongoose";
import {IGuild, MGuild} from "../../../models/guild";

export default {
    name: 'add',
    description: 'Adds an admin role.',
    options:[
        {
            name: 'role',
            description: "the role you want to make an admin role",
            type: 8,
            required: true
        }
    ],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        if (!(i.member as GuildMember).permissions.has('Administrator') || !(i.guild.ownerId == (i.member as GuildMember).id)) return await i.reply({ content:'You shall not pass!', ephemeral:true })

        const role = options.getRole('role',true)

        let guild:HydratedDocument<IGuild> = await MGuild.findByGuildId(i.guildId)
        guild.adminRoles.push(role.id)

        await guild.save()

        await i.reply({content:`Successfully made the role \`${role.name}\` an admin role.`})
    }
}