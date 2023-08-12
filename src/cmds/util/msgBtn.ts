import {
    ButtonBuilder,
    ButtonStyle, ButtonComponentData
} from "discord.js";

export class MsgBtn extends ButtonBuilder{
    private label: string;
    private memberId: any|undefined;
    private style: ButtonStyle;

    constructor(data:Partial<ButtonComponentData>,memberId?: string) {
        if (memberId && data.style != ButtonStyle.Link) data.customId += `{${memberId}}`

        super(data)

        this.label = data.label || 'null';
        this.style = data.style || ButtonStyle.Danger;
        this.memberId = memberId ? memberId : undefined;

        return this
    }
}
