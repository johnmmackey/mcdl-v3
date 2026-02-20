import { notFound } from 'next/navigation';
import { fetchMeet, fetchSeasons } from '@/app/lib/api';
import { MeetCreateUpdateInput } from '@/app/lib/types/meet';
import { MeetForm } from '@/app/meets/components';


export default async function Page(props: {
    params: Promise<{ meetId: string }>,
}) {
    const params = await props.params;
    const seasons = await fetchSeasons();
    const meetId = parseInt(params.meetId);

    if (!meetId) 
        notFound();

    let meetdata: MeetCreateUpdateInput;

    const meet = await fetchMeet(meetId);
    if (!meet) 
        notFound();

    meetdata = {
        ...meet,
        teamList: meet.teams.map(t => t.teamId)
    };

    return (
        <MeetForm meetId={meetId} meet={meetdata} seasons={seasons} />
    )
}

