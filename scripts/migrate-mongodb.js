const {Schema,model, connect} = require('mongoose')

const guildSchema = new Schema({
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

const timezoneSchema = new Schema({
    userId:String,
    timezone:String
})

const MGuild = model('Guild',guildSchema)
const MTimezone = model('Timezone',timezoneSchema)

const {database} = require('../config.json')
const jsonDB = require('../db.json')

run().then(_ => {console.log('Successfully migrated to MongoDB!'); process.exit(0)}).catch(e => console.error(e))

async function run(){
    let dbUri = `mongodb://${database.username ? database.username + (database.password ? `:${database.password}` : "") + "@" : ""}${database.hostname}/chasbot`

    try {
        await connect(dbUri)
        console.log('Connected to MongoDB')
    } catch (e) {
        console.error(e)
    }

    for (let guildId in jsonDB){
        if (guildId === 'timezones') continue;

        let guild = jsonDB[guildId]

        let dbGuild = new MGuild({
            id:guildId,
            background:guild.background ? guild.background : '',
            messages: guild.messages ? guild.messages : {},
            channels: guild.channels ? guild.channels : {},
            adminRoles: [],
            customCommands: {
                action: []
            },
            ranks: [],
            rankRewards: [],
            importedRanks: guild.imported_ranks ? guild.imported_ranks : ''
        })

        if (guild.admin_roles){
            for (let role of guild.admin_roles){
                dbGuild.adminRoles.push(role.id)
            }
        }

        if (guild.custom_commands){
            let actionCmds = guild.custom_commands.action
            for (let actionName in actionCmds){
                let action = actionCmds[actionName]
                dbGuild.customCommands.action.push({
                    name:actionName,
                    description: action.description,
                    gifs: action.gifs,
                    prompt: action.prompt,
                    embedColor: action.embed_color
                })
            }
        }

        if (guild.ranks){
            for (let userId in guild.ranks){
                let rank = guild.ranks[userId]
                dbGuild.ranks.push({
                    userId,
                    level: rank.level,
                    xp: rank.xp,
                    xpNeeded: rank.xp_needed
                })
            }
        }

        if (guild.rank_rewards) {
            for (let level in guild.rank_rewards) {
                let roleId = guild.rank_rewards[level]
                dbGuild.rankRewards.push({
                    level,
                    roleId
                })
            }
        }

        await dbGuild.save()
    }

    for (let userId in jsonDB['timezones']){
        let timezone = jsonDB["timezones"][userId]
        await MTimezone.create({
            userId,
            timezone
        })
    }
}