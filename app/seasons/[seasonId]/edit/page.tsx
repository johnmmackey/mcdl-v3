import { redirect } from 'next/navigation';
import { fetchTeams, fetchDivisions, fetchSeason, fetchTeamsForSeason } from '@/app/lib/api';

import { SeasonForm } from "@/app/seasons/components";
import { Season, DivisionAssignment } from '@/app/lib/types/season';

export default async function Page(props: {
    params: Promise<{ seasonId: string }>,
}) {
    const params = await props.params;
    const teams = (await fetchTeams()).filter(t => !t.archived);
    const divisions = await fetchDivisions();

    let divAssignments: DivisionAssignment[] = [];
    let season: Season;


    if (!isNaN(parseInt(params.seasonId))) {
        season = await fetchSeason(parseInt(params.seasonId))
        divAssignments = (await fetchTeamsForSeason(parseInt(params.seasonId))).map(da => ({ teamId: da.teamId, divisionId: da.divisionId, seed: da.seed }));
    } else {
        redirect('/seasons');
    }

    return (
        <SeasonForm teams={teams} divisions={divisions} season={season} divAssignments={divAssignments} newSeason={false} />
    )
}
