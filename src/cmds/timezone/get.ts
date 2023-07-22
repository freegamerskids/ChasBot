import {
    CommandInteraction,
    CommandInteractionOptionResolver,
    EmbedBuilder
} from "discord.js";
import {ChasBot} from "../../typings/ChasBot";
import dayjs from "dayjs";

export default {
    name: 'get',
    description: 'Gets the timezone of someone else (or yourself)',
    options:[
        {
            name: 'user',
            description: "the user you want to check",
            type: 6,
            required: false
        }
    ],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        let timezone1: string
        try { timezone1 = await c.GuildDB.getData(`/timezones/${i.user?.id}`) }
        catch (err) { return await i.reply({content:'Please set your timezone before getting someone else\'s with /timezone set.',ephemeral:true}) }

        let user = options.getUser('user',false) || i.user

        let timezone2: string
        try { timezone2 = await c.GuildDB.getData(`/timezones/${user.id}`) }
        catch (err) { return await i.reply({content:'We\'re sorry, but that user is not in our database. Ask them to set their timezone!',ephemeral:true}) }

        //@ts-ignore
        const t1 = dayjs.utc().tz(timezone1)
        //@ts-ignore
        const t2 = dayjs.utc().tz(timezone2)

        const embed = new EmbedBuilder({title: timezone1 == timezone2 ? 'Your timezone' : `${user.username}'s timezone`})
            .addFields(timezone2 == timezone1 ? [] : [{
                name: `${user.username}'s timezone (${timezone2} -- UTC${t2.format('ZZ').slice(0,-2)})`,
                value: `Current time: ${t2.format('MM-DD hh:mm:ssa')}`
            }])
            .addFields([{
                name: `Your timezone (${timezone1} -- UTC${t1.format('ZZ').slice(0,-2)})`,
                value: `Current time: ${t1.format('MM-DD hh:mm:ssa')}`
            }])
            .setFooter({text:'This message is only visible only for you due to security reasons. Live Laugh Chas'})

        return await i.reply({embeds: [embed], ephemeral:true})
    }
}