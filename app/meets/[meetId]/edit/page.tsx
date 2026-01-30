import { notFound } from 'next/navigation';
import { fetchCurrentSeasonId, fetchMeet, fetchSeasons } from '@/app/lib/api';
import {  MeetEditable } from '@/app/lib/types/meet';
import { MeetForm } from '@/app/meets/[meetId]/edit/MeetForm';


export default async function Page(props: {
    params: Promise<{ meetId: string }>,
}) {
    const params = await props.params;
    const seasons = await fetchSeasons();
    const currentSeasonId = await fetchCurrentSeasonId();
    const meetId = parseInt(params.meetId) || 0;

    let meetEditable: MeetEditable;

    if (meetId) {
        const meet = await fetchMeet(meetId);
        if (!meet) {
            notFound();
        }
        meetEditable = {
            ...meet,
            teamList: meet.teams.map(t => t.teamId)
        };
    } else {
        let defaultDate = new Date();
        defaultDate.setHours(0, 0, 0, 0);

        meetEditable = {
            id: null,
            seasonId: currentSeasonId,
            customName: "",
            defaultName: "",
            parentMeet: null,
            meetDate: defaultDate.toISOString(),
            entryDeadline: defaultDate.toISOString(),
            hostPoolId: null,
            coordinatorPoolId: null,
            meetType: 'Dual',
            divisionId: null,
            scoresPublished: null,
            teamList: []
        };
    }


    return (
        <MeetForm meet={meetEditable} seasons={seasons} />
    )
}

