import {ModalSubmitInteraction} from "discord.js";
import {ChasBot} from "../typings/ChasBot";

export async function call(i:ModalSubmitInteraction,c:ChasBot){
    let timezone = i.fields.getTextInputValue('timezone')

    if (!c.timezones.find(t => t == timezone)) return await i.editReply({content: 'Not a valid timezone. Try again.'})

    await c.GuildDB.push(`/timezones/${i.user?.id}`,timezone)

    //@ts-ignore
    await i.update({
        content: 'Successfully changed your timezone.',
        components: []
    })
    return true
}