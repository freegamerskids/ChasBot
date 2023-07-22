import {
    ActionRowBuilder, ButtonInteraction,
    ButtonStyle,
    CommandInteraction,
    CommandInteractionOptionResolver, MessageActionRowComponentBuilder,
    ModalActionRowComponentBuilder,
    ModalSubmitFields,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ChasBot} from "../../typings/ChasBot";
import {MsgBtn} from "../util/msgBtn";
import {Modal} from "../util/modal";

export default {
    name: 'set',
    description: 'Set your timezone',
    options:[],
    async run(i: CommandInteraction, options: CommandInteractionOptionResolver, c: ChasBot){
        let ac = new ActionRowBuilder<MessageActionRowComponentBuilder>()
        let btn = new MsgBtn({label:'Set timezone',style:ButtonStyle.Primary},i.user?.id)
            .setCallback(async (interaction:ButtonInteraction)=>{
                let modal = new Modal({title: 'Timezone'})
                let m_ac = new ActionRowBuilder<ModalActionRowComponentBuilder>()

                const timezoneInput = new TextInputBuilder()
                    .setCustomId('timezone')
                    .setLabel('Type in a valid timezone')
                    .setPlaceholder('<Name>/<Name>(/<Name>)')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)

                m_ac.addComponents(timezoneInput)
                modal.addComponents([m_ac])

                modal.setCallback(async (fields:ModalSubmitFields)=>{
                    let timezone = fields.getTextInputValue('timezone')

                    if (!c.timezones.find(t => t == timezone)) return await i.editReply({content: 'Not a valid timezone. Try again.'})

                    await c.GuildDB.push(`/timezones/${i.user?.id}`,timezone)

                    btn.setDisabled(true)
                    await i.editReply('Successfully changed your timezone.')
                }, [ac])

                await interaction.showModal(modal)
            })

        ac.addComponents([btn])

        return await i.reply({content:'Find your own timezone at [this site](https://kevinnovak.github.io/Time-Zone-Picker/) and then click the button below to set your timezone!',components: [ac]})
    }
}