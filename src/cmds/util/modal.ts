import {ModalBuilder, ModalComponentData} from "discord.js";
import {randomBytes} from "crypto";
import {ChasBot} from "../../typings/ChasBot";

interface ModalCallListener {
    customId: string,
    callback: Function,
    update?: any[]
}

let modals: ModalCallListener[] = []

export class SetModalListener {
    constructor(c: ChasBot) {
        c.on('interactionCreate',  async (i) => {
            if (!i.isModalSubmit()) return;
            let modal = modals.find(m => m.customId == i.customId)
            if (modal) {
                await modal.callback(i.fields)
                if (modal.update) {
                    //@ts-ignore
                    await i.update({
                        components: modal.update
                    })
                } else await i.deferUpdate()
            }
        })
    }
}

export class Modal extends ModalBuilder {
    private customId: string
    private callback: Function | undefined

    constructor(data: Partial<ModalComponentData>) {
        let customId = randomBytes(32).toString('hex')
        data.customId = customId

        super(data);

        this.customId = customId

        return this
    }

    setCallback(callback: Function, update?: any[]){
        this.callback = callback
        modals.push({
            customId: this.customId,
            callback: callback,
            update
        })
        return this
    }
}