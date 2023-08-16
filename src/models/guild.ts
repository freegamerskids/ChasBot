import {Model, Schema, Types, model, Query} from "mongoose";

interface IActionCommand {
    name: string,
    description:string,
    gifs: Types.Array<string>,
    prompt?: string,
    embedColor?: string
}

export interface IUserRank {
    userId:string,
    level:number,
    xp:number,
    xpNeeded:number
}

interface IRankReward {
    level:number,
    roleId:string
}

export interface IGuild {
    id: string,
    background: string,
    messages:{
        greeting?:string,
        goodbye?:string,
    },
    channels:{
        welcome?:string,
        goodbye?:string,
        rankup?:string
    },
    adminRoles: Types.Array<string>,
    customCommands:{
        action: Types.DocumentArray<IActionCommand>
    },
    ranks: Types.DocumentArray<IUserRank>,
    rankRewards: Types.DocumentArray<IRankReward>,
    importedRanks: string
}

interface GuildModel extends Model<IGuild> {
    findByGuildId(guildId:string): Query<any, any>
}

const guildSchema = new Schema<IGuild, GuildModel>({
    id:{type:String, required:true},
    background:String,
    messages:{
        greeting:String,
        goodbye:String
    },
    channels:{
        welcome:String,
        goodbye:String,
        rankup:String
    },
    adminRoles: [String],
    customCommands:{
        action:[{
            name:String,
            description:String,
            gifs:[String],
            prompt:String,
            embedColor:String
        }]
    },
    ranks:[{
        userId:String,
        level:Number,
        xp:Number,
        xpNeeded:Number
    }],
    rankRewards:[{
        level:Number,
        roleId:String
    }],
    importedRanks:String
})

guildSchema.static('findByGuildId',function findByGuildId(guildId:string) {
    return this.findOne({ id:guildId })
})

const MGuild = model<IGuild,GuildModel>('Guild',guildSchema)

export {MGuild}