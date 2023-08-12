import {ChasBot} from "../typings/ChasBot";
import {InteractionType} from 'discord.js'

export function init(c:ChasBot){
    c.on('interactionCreate',async (i) => {
        if (i.isCommand()) return;
        switch (i.type) {
            case InteractionType.ModalSubmit:
                try {
                    let updated = await require(`../interactionListenerCallbacks/${i.customId}.ts`).call(i,c)
                    if (!updated) await i.deferUpdate()
                } catch (e) {
                    console.log(e)

                    //@ts-ignore
                    await i.update({
                        components: [],
                        content: `I'm sorry, but i forgor 💀`
                    })
                }
                break
            case InteractionType.MessageComponent:
                if (i.isButton()){
                    try {
                        let customId = i.customId
                        let memberId
                        {
                            let memberIdRegEx = /{\d*}/g
                            const match = customId.match(memberIdRegEx)
                            if (match) {
                                customId = customId.replace(match[0],'')
                                memberId = match[0].replace(/[{}]/g,'')
                            }
                            if (i.user?.id != memberId) {await i.deferUpdate(); break;}
                        }

                        let updated = await require(`../interactionListenerCallbacks/${customId}.ts`).call(i,c)
                        if (!updated) await i.deferUpdate()
                    } catch (e) {
                        console.log(e)

                        await i.update({
                            components: [],
                            content: `I'm sorry, but i forgor 💀`
                        })
                    }
                }
                break
        }
    })
}