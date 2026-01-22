
import { fetchCurrentSeasonId, fetchMeet, fetchSeasons } from '@/app/lib/data';
import { Meet } from '@/app/lib/definitions'


import { MeetForm } from './MeetForm'
import { de } from 'date-fns/locale';

export default async function Page(props: {
    params: Promise<{ meetId: string }>,
}) {
    const params = await props.params;
    const seasons = await fetchSeasons();
    const currentSeasonId = await fetchCurrentSeasonId();
    const meetId = parseInt(params.meetId) || null;

    let defaultDate = new Date();
    defaultDate.setHours(0,0,0,0);

    const meet: Meet = meetId ? await fetchMeet(meetId) : {
        id:null,
        seasonId: currentSeasonId,
        name: "",
        parentMeet: null,
        meetDate: defaultDate.toISOString(),
        entryDeadline: defaultDate.toISOString(),
        hostPool: null,
        coordinatorPool: null,
        meetType: 'Dual',
        divisionId: null,
        scoresPublished: null,
        teams: []
    };

    return (
        <MeetForm meet={{ ...meet, teamList: meet.teams.map(t => t.teamId) }} seasons={seasons} />
    )
}

