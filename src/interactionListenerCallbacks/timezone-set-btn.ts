import {
    ActionRowBuilder,
    ButtonInteraction,
    ModalActionRowComponentBuilder, ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export async function call(i:ButtonInteraction){
    let modal = new ModalBuilder({title: 'Timezone',custom_id:'timezone-set-modal'})
    let m_ac = new ActionRowBuilder<ModalActionRowComponentBuilder>()

    const timezoneInput = new TextInputBuilder()
        .setCustomId('timezone')
        .setLabel('Type in a valid timezone')
        .setPlaceholder('<Name>/<Name>(/<Name>)')
        .setRequired(true)
        .setStyle(TextInputStyle.Short)

    m_ac.addComponents(timezoneInput)
    modal.addComponents([m_ac])

    await i.showModal(modal)
    return true
}