import { MeetWithTeams } from "@/app/lib/types/meet";

export async function MeetDisplayName(props: { meet: MeetWithTeams }): Promise<string> {
    if (props.meet.name)
        return props.meet.name;

    let name = '';

    let sortedTeams = props.meet.teams.sort((a, b) => {
        const nameA = a.team.name.toUpperCase();
        const nameB = b.team.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    const visitingTeams: string[] = [];
    for (const m of sortedTeams) {
        if (m.teamId !== props.meet.hostPoolId) {
            visitingTeams.push(m.team.name);
        }
    }

    if (visitingTeams.length <= 3) {
        name = visitingTeams.join(', ');
    } else {
        switch (props.meet.meetType) {
            case 'Div':
                name = 'Divisional Meet';
                break;
            case 'Star':
                name = 'All Star Meet';
                break;
            case 'Qual':
                name = 'Qualifier Meet';
                break;
            case 'Exhib':
                name = 'Exhibition Meet';
                break;
            default:
                name = 'Unknown Meet';
        }
    }

    name += ' @ ';
    name += props.meet.hostPool?.name || 'TBD';
    return name;
}