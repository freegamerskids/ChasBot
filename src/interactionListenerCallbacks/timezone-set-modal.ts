import {ModalSubmitInteraction} from "discord.js";
import {ChasBot} from "../typings/ChasBot";
import {MTimezone} from "../models/timezone";

export async function call(i:ModalSubmitInteraction,c:ChasBot){
    let timezone = i.fields.getTextInputValue('timezone')

    if (!c.timezones.find(t => t == timezone)) return await i.editReply({content: 'Not a valid timezone. Try again.'})

    if (await MTimezone.exists({userId:i.user?.id})) {
        let userTimezone = await MTimezone.findByUserId(i.user?.id);

        userTimezone.timezone = timezone
        await userTimezone.save()
    } else {
        await MTimezone.create({userId:i.user?.id, timezone})
    }

    //@ts-ignore
    await i.update({
        content: 'Successfully changed your timezone.',
        components: []
    })
    return true
}