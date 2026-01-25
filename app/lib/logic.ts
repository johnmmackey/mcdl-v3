import { DivisionAssignment, Meet, Team } from "@/app/lib/definitions"
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

