import { Team } from '@/app/lib/types/team';
import { TeamForm } from '@/app/teams/components/TeamForm';

export default async function Page() {

    const team: Team = {
        id: '',
        name: '',
        clubName: '',
        url: '',
        phone: '',
        address1: '',
        address2: '',
        archived: false
    };

    return (
        <TeamForm team={team}  />
    )
}

