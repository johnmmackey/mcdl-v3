import { Session } from "next-auth";
import { MeetWithTeams } from '@/app/lib/types';

type Permissions = Record<string, Record<string, (target: any, loggedIn: boolean, roles: Record<string, any>) => boolean>>

const permissions: Permissions = {
    'meet': {
        'viewResults': (target, loggedIn, roles) => target.scoresPublished || loggedIn,
    },
    'diver': {}
}

export function meetPermissions(session: Session | null, meet: MeetWithTeams) {
    if (session?.user?.groups?.includes('admin'))
        return (['viewRoster', 'enterScores'])
    if (session?.user?.groups?.includes(meet.hostPoolId || ''))
        return (['viewRoster', 'enterScores'])
    if (session?.user)
        return (['viewRoster'])
    return []
}

export function userCan(targetType: string, target: any,  op: string, session: Session | null) {
    let roles = {};
    const loggedIn = !!(session?.user);

    session?.user?.groups?.forEach(g => {
        let tokens = g.split(':');
        Object.assign(roles, { [tokens[0]]: tokens.length > 1 ? tokens[1] : null });
    });

    return permissions[targetType][op] && permissions[targetType][op](target, loggedIn, roles);
}
