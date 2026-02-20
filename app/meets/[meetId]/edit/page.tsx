import { notFound } from 'next/navigation';
import { fetchMeet, fetchSeasons } from '@/app/lib/api';
import { MeetCreateUpdateInput, MeetEditable } from '@/app/lib/types/meet';
import { MeetForm } from '@/app/meets/components';


export default async function Page(props: {
    params: Promise<{ meetId: string }>,
}) {
    const params = await props.params;
    const seasons = await fetchSeasons();
    const meetId = parseInt(params.meetId);

    if (!meetId) 
        notFound();

    let meetEditable: MeetCreateUpdateInput;

    const meet = await fetchMeet(meetId);
    if (!meet) 
        notFound();

    meetEditable = {
        ...meet,
        teamList: meet.teams.map(t => t.teamId)
    };

    return (
        <MeetForm meet={meetEditable} seasons={seasons} />
    )
}

