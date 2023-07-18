import {ChasBot} from "../../typings/ChasBot";
import {GuildMember} from "discord.js";

export async function hasAdminPermissions(member: GuildMember, c: ChasBot) {
    let hasAdminRole: boolean = false

    let adminRoles: []
    try {adminRoles = await c.GuildDB.getData(`/${member.guild.id}/admin_roles`)}
    catch (err) {adminRoles = []}

    for (const role of adminRoles) {
        if (member.roles.cache.has(role)) {hasAdminRole = true; break}
    }

    return member.permissions.has('Administrator') || member.guild.ownerId == member.id || hasAdminRole
}