
import { fetchCurrentSeasonId, fetchMeet, fetchSeasons } from '@/app/lib/data';
import { Meet } from '@/app/lib/definitions'


import { MeetForm } from './MeetForm'

export default async function Page(props: {
    params: Promise<{ meetId: string }>,
}) {
    const params = await props.params;
    const seasons = await fetchSeasons();
    const currentSeasonId = await fetchCurrentSeasonId();
    const meetId = parseInt(params.meetId) || null;

    const meet: Meet = meetId ? await fetchMeet(meetId) : {
        id:null,
        seasonId: currentSeasonId,
        name: "",
        parentMeet: null,
        meetDate: new Date().toISOString(),
        entryDeadline: new Date().toISOString(),
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

