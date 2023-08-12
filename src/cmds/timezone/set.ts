import {
    ActionRowBuilder,
    ButtonStyle,
    CommandInteraction,
    MessageActionRowComponentBuilder,
    TextInputStyle
} from "discord.js";
import {MsgBtn} from "../util/msgBtn";

export default {
    name: 'set',
    description: 'Set your timezone',
    options:[],
    async run(i: CommandInteraction){
        let ac = new ActionRowBuilder<MessageActionRowComponentBuilder>()
        let btn = new MsgBtn({
            label:'Set timezone',
            style:ButtonStyle.Primary,
            customId:'timezone-set-btn'
        },i.user?.id)

        ac.addComponents([btn])

        return await i.reply({content:'Find your own timezone at **[this site (Timezone Picker)](https://kevinnovak.github.io/Time-Zone-Picker/)** and then click the button below to set your timezone!',components: [ac]})
    }
}