import { DivisionAssignment } from "@/app/lib/definitions"

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