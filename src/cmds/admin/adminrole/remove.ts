import {CommandInteraction, CommandInteractionOptionResolver, GuildMember} from "discord.js";
import {ChasBot} from "../../../typings/ChasBot";

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

        let index: number
        try { index = await c.GuildDB.getIndex(`/${i.guildId}/admin_roles`,role.id,"id") }
        catch (e) { return await i.reply({content:'The role you specified is not an admin role.',ephemeral:true}) }

        if (index < 0) return await i.reply({content:'There aren\'t any admin roles set.', ephemeral:true})
        if ((await c.GuildDB.getData(`/${i.guildId}/admin_roles[${index}]`)).name != role.name) return await i.reply({content:'The role you specified is not an admin role.',ephemeral:true})

        await c.GuildDB.delete(`/${i.guildId}/admin_roles[${index}]`)

        await i.reply({content:`Successfully removed the role \`${role.name}\` as an admin role.`})
    }
}