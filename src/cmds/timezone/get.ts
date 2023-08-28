import {
    CommandInteraction,
    CommandInteractionOptionResolver,
    EmbedBuilder
} from "discord.js";
import {ChasBot} from "../../typings/ChasBot";
import dayjs from "dayjs";
import {ITimezone, MTimezone} from "../../models/timezone";
import {HydratedDocument} from "mongoose";

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
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver){
        let timezone1:HydratedDocument<ITimezone> = await MTimezone.findByUserId(i.user?.id)

        let user = options.getUser('user',false) || i.user
        let timezone2:HydratedDocument<ITimezone> = await MTimezone.findByUserId(user.id)

        //@ts-ignore
        const t1 = dayjs.utc().tz(timezone1.timezone)
        //@ts-ignore
        const t2 = dayjs.utc().tz(timezone2.timezone)

        const embed = new EmbedBuilder({title: timezone1.userId == timezone2.userId ? 'Your timezone' : `${user.username}'s timezone`})
            .addFields(timezone2.userId == timezone1.userId ? [] : [{
                name: `${user.username}'s timezone (${timezone2.timezone} -- UTC${t2.format('ZZ').slice(0,-2)})`,
                value: `Current time: ${t2.format('MM-DD hh:mm:ssa')}`
            }])
            .addFields([{
                name: `Your timezone (${timezone1.timezone} -- UTC${t1.format('ZZ').slice(0,-2)})`,
                value: `Current time: ${t1.format('MM-DD hh:mm:ssa')}`
            }])
            .setFooter({text:'This message is only visible only for you due to security reasons. Live Laugh Chas'})

        return await i.reply({embeds: [embed], ephemeral:true})
    }
}