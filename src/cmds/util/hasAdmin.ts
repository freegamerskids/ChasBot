import {ChasBot} from "../../typings/ChasBot";
import {GuildMember, PermissionsBitField} from "discord.js";
import {MGuild} from "../../models/guild";

export async function hasAdminPermissions(member: GuildMember, c: ChasBot) {
    let hasAdminRole: boolean = false

    const {adminRoles} = await MGuild.findByGuildId(member.guild.id).select('adminRoles')

    for (const role of adminRoles) {
        if (member.roles.cache.has(role)) {hasAdminRole = true; break}
    }

    return member.permissions.has(PermissionsBitField.Flags.Administrator,true) || member.guild.ownerId == member.id || hasAdminRole
}