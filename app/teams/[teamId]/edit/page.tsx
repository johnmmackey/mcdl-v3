import { notFound } from 'next/navigation';
import { fetchTeam } from '@/app/lib/api';
import { TeamForm } from '@/app/teams/components/TeamForm';


export default async function Page(props: {
    params: Promise<{ teamId: string }>,
}) {
    const teamId = (await props.params)?.teamId;

    if (!teamId) 
        notFound();

    const team = await fetchTeam(teamId);
    if (!team) 
        notFound();

    return (
        <TeamForm team={team} />
    )
}

