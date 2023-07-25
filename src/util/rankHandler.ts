import {ChasBot} from "../typings/ChasBot";

let f = (n) => {
    if (n <= 0) return 0;
    return Number(((f(n-1)*1.0462)+100).toFixed(0))
};

export {f as xpNeedCalcFunction}

export async function handleUser(c:ChasBot,guildId:string,memberId:string){
    let user_rank
    try { user_rank = await c.GuildDB.getData(`/${guildId}/ranks/${memberId}`) }
    catch (e) { user_rank = { level: 0, xp: 0, xp_needed: f(1) } }

    user_rank.xp += 1

    let rankedUp: boolean = false

    if (user_rank.xp >= user_rank.xp_needed) {
        user_rank.level += 1
        user_rank.xp_needed = f(user_rank.level)
        rankedUp = true
    }

    await c.GuildDB.push(`/${guildId}/ranks/${memberId}`, user_rank)

    return rankedUp ? [true, user_rank] : [false, null]
}