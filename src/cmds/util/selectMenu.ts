import {
    APIMessageComponentEmoji,
    APISelectMenuOption,

    Interaction,
    StringSelectMenuInteraction,

    StringSelectMenuComponentData,
    SelectMenuComponentOptionData,

    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,

    ComponentEmojiResolvable
} from "discord.js";
import {randomBytes} from "crypto";

export class Selection extends StringSelectMenuOptionBuilder {
    label:string;
    value:string;
    description?:string;
    emoji?:ComponentEmojiResolvable;
    default?:boolean;

    callback:Function| undefined;
    constructor(data: Partial<SelectMenuComponentOptionData>){
        // @ts-ignore
        super(data)

        this.label = data.label || 'null';
        this.value = data.value || 'null';
        this.description = data.description
        this.emoji = data.emoji
        this.default = data.default
        this.callback = undefined;
    }
    setDescription(description:string){
        this.description = description;
        this.data.description = description
        return this
    }
    setEmoji(emoji:ComponentEmojiResolvable){
        this.emoji = emoji;
        this.data.emoji = emoji as APIMessageComponentEmoji
        return this
    }
    setDefault(defaultt:boolean){
        this.default = defaultt;
        this.data.default = defaultt
        return this
    }
    setCallback(callback:Function){
        this.callback = callback;
        return this
    }

    getValue(){
        return this.value;
    }
    getCallback(){
        return this.callback
    }
}

export class SelectMenu extends StringSelectMenuBuilder {
    customId: string;
    placeholder: string;
    disabled?: boolean;
    memberId:any;

    selectMenuOptions: Selection[]

    constructor(data: Partial<StringSelectMenuComponentData>,memberId:string){
        let customId = randomBytes(32).toString('hex');

        data.customId = customId

        // @ts-ignore
        super(data)

        this.customId = customId
        this.placeholder = this.data.placeholder || 'null';
        this.memberId = memberId;
        this.disabled = this.data.disabled
        this.selectMenuOptions = []
    }
    addMenuOptions(options:Selection[]){
        this.addOptions(options)
        return this
    }
    async start(inter:Interaction, maxUses:number){
        const filter = (i:Interaction) => i.isSelectMenu() && i.user?.id == this.memberId

        const coll1 = inter.channel?.createMessageComponentCollector({
            filter,
            max: maxUses,
        })
        let uses = 0

        coll1?.on('collect',async (i: StringSelectMenuInteraction)=>{
            if (!this.selectMenuOptions) return;

            let options = this.selectMenuOptions.filter(o => i.values.find(s => s == o.getValue()))

            for (const option of options){
                //@ts-ignore
                if (option.getCallback()) await (option.getCallback())()
                if (!i.deferred || !i.replied) await i.deferUpdate()
            }
            uses += 1
            if (uses >= maxUses) { coll1?.removeAllListeners() }
        })
        return this
    }
}