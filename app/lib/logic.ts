import {  Team } from "@/app/lib/types/team"
import { Season, DivisionAssignment, TeamSeasonWithTeam} from '@/app/lib/types/season';
import { fetchTeams } from "@/app/lib/api";

export function validateDivisionAssignments(divAssignments: DivisionAssignment[]): boolean {
    // tests:

    // divisions must be sequential from 1 to n with no gaps
    const divisionIds = Array.from(new Set(divAssignments.map(da => da.divisionId)));
    divisionIds.sort((a, b) => a - b);
    for (let i = 0; i < divisionIds.length; i++) {
        if (divisionIds[i] !== i + 1) {
            return false; // Gap or non-sequential division IDs
        }
    }

    // within each division, seeds must be unique and sequential from 1 to n with no gaps
    for (const divisionId of divisionIds) {
        const teamsInDivision = divAssignments.filter(da => da.divisionId === divisionId);
        const seeds = teamsInDivision.map(da => da.seed);
        seeds.sort((a, b) => a - b);
        for (let i = 0; i < seeds.length; i++) {
            if (seeds[i] !== i + 1) {
                return false; // Gap or non-sequential seeds in this division
            }
        }
    }
    return true; // All validations passed
}

export function mapTeamsById(teams: Team[]): Map<string, Team> {
    const teamMap = new Map<string, Team>();
    teams.forEach(team => {
        teamMap.set(team.id, team);
    });
    return teamMap;
}




export const calcNextSeasonDivAssignments = (currentSeason: TeamSeasonWithTeam[]): DivisionAssignment[] => {

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
