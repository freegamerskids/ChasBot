import {
    ButtonBuilder,
    Client,
    ButtonStyle, ButtonComponentData
} from "discord.js";
import {randomBytes} from 'crypto'

interface ButtonCallListener {
    callback:Function,
    customId: string,
    update?: any[],
    memberId?:string
}

let c:Client;
let buttons: ButtonCallListener[] = []

export class SetButtonListener{
    constructor(cli:Client){
        c = cli

        c.on('interactionCreate',async (i)=>{
            if (!i.isButton()) return;
            let button = buttons.find(b => b.customId == i.customId)
            if (button) {
                if (button.memberId != undefined){ if (button.memberId != i.member?.user.id) return; }

                await button.callback(i)

                if (i.replied || i.deferred) return;

                if (button.update) {
                    await i.update({
                        components: button.update
                    })
                } else await i.deferUpdate()
            }
        })
    }
}

export class MsgBtn extends ButtonBuilder{
    private customId: string;
    private label: string;
    private memberId: any|undefined;
    private style: ButtonStyle;
    private callback:Function|undefined;

    constructor(data:Partial<ButtonComponentData>,memberId?: any) {
        let customId = randomBytes(32).toString('hex');

        //@ts-ignore
        data.customId = customId

        super(data)

        this.customId = customId
        this.label = data.label || 'null';
        this.style = data.style || ButtonStyle.Danger;
        this.memberId = memberId ? memberId : undefined;
        this.callback = undefined;

        return this
    }
    setCallback(callback:Function,update?:any[]) {
        this.callback = callback;
        buttons.push({
            callback: this.callback,
            customId: this.customId,
            update: update
        })
        return this
    }
}
