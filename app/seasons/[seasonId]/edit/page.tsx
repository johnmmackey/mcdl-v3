import { redirect } from 'next/navigation';
import { fetchTeams, fetchDivisions, fetchSeason, fetchTeamsForSeason, fetchCurrentSeasonId } from '@/app/lib/data';

import { SeasonForm } from "./SeasonForm";
import { Season, DivisionAssignment, TeamSeason } from '@/app/lib/definitions';
import { validateDivisionAssignments } from '@/app/lib/logic';

export default async function Page(props: {
    params: Promise<{ seasonId: string }>,
}) {
    const params = await props.params;
    const teams = (await fetchTeams()).filter(t => !t.archived);
    const divisions = await fetchDivisions();

    let divAssignments: DivisionAssignment[] = [];
    let season: Season;

    if (params.seasonId === '_') {
        // new season
        const currentSeasonId = await fetchCurrentSeasonId();
        divAssignments = calcNextSeasonDivAssignments(await fetchTeamsForSeason(currentSeasonId));
        season = {
            id: currentSeasonId + 1,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            week1Date: new Date().toISOString(),
        } as Season;
    } else if (!isNaN(parseInt(params.seasonId))) {
        season = await fetchSeason(parseInt(params.seasonId))
        divAssignments = (await fetchTeamsForSeason(parseInt(params.seasonId))).map(da => ({ teamId: da.teamId, divisionId: da.divisionId, seed: da.seed }));
    } else {
        redirect('/seasons');
    }

    return (
        <SeasonForm teams={teams} divisions={divisions} season={season} divAssignments={divAssignments} newSeason={params.seasonId === '_'} />
    )
}


const calcNextSeasonDivAssignments = (currentSeason: TeamSeason[]): DivisionAssignment[] => {

    // check if the current season is valid. If not, not much to be done...
    if (!validateDivisionAssignments(currentSeason.map(da => ({ teamId: da.teamId, divisionId: da.divisionId, seed: da.seed }))))
        return [];
    
    // check if the current season is COMPLETE. If not, used old data
    if (!validateDivisionAssignments(currentSeason.map(da => ({ teamId: da.teamId, divisionId: da.divisionId, seed: da.fsRank }))))
        return currentSeason.map(da => ({ teamId: da.teamId, divisionId: da.divisionId, seed: da.seed }));

    const activeDivisions = Array.from(new Set(currentSeason.map(da => da.divisionId)));

    const maxSeedByDivision: { [divisionId: number]: number } = {};
    currentSeason.forEach(da => {
        if (!maxSeedByDivision[da.divisionId] || da.seed > maxSeedByDivision[da.divisionId]) {
            maxSeedByDivision[da.divisionId] = da.seed;
        }
    });

    // Simple logic, layout per fsrank: promote top from each division, relegate bottom from each division
    const newAssignments = currentSeason.map(da => {
        let newDivisionId = da.divisionId;
        let newSeed = da.fsRank;
        // Promote if top seed and not already in top division
        if (da.fsRank === 1 && da.divisionId > 1) {
            newDivisionId = da.divisionId - 1;
            newSeed = maxSeedByDivision[newDivisionId];
        }
        // Relegate if bottom seed and not already in bottom division
        else if (da.fsRank === maxSeedByDivision[da.divisionId] && da.divisionId < activeDivisions.length) {
            newDivisionId = da.divisionId + 1;
            newSeed = 1;
        }
        return {
            teamId: da.teamId,
            divisionId: newDivisionId,
            seed: newSeed
        } as DivisionAssignment;
    })

    return newAssignments;
}