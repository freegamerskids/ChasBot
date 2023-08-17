import {ChasBot} from "../typings/ChasBot";
import {IGuild, MGuild} from "../models/guild";
import {HydratedDocument,Types} from "mongoose";

let f = (n) => {
    if (n <= 0) return 0;
    return Number(((f(n-1)*1.0462)+100).toFixed(0))
};

export {f as xpNeedCalcFunction}

export async function handleUser(c:ChasBot,guildId:string,memberId:string){
    const guild:HydratedDocument<IGuild> = await MGuild.findByGuildId(guildId)
    let ranks = guild.ranks

    let user_rank = ranks.find(r => r.userId == memberId)
    if (!user_rank) {
        let i = ranks.push({ userId: memberId, level: 0, xp: 0, xpNeeded: f(1) })
        user_rank = ranks.find(r => r.userId == memberId)
    }

    user_rank.xp += 1

    let rankedUp: boolean = false

    if (user_rank.xp >= user_rank.xpNeeded) {
        user_rank.level += 1
        user_rank.xpNeeded = f(user_rank.level+1)
        rankedUp = true
    }

    await guild.save()

    return rankedUp ? [true, user_rank] : [false, null]
}