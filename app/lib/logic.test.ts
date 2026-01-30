import { validateDivisionAssignments } from './logic';
import { DivisionAssignment } from './types';

describe('validateDivisionAssignments', () => {
  it('should return true for valid division assignments', () => {
    const validAssignments: DivisionAssignment[] = [
      { teamId: 'team1', divisionId: 1, seed: 1 },
      { teamId: 'team2', divisionId: 1, seed: 2 },
      { teamId: 'team3', divisionId: 1, seed: 3 },
      { teamId: 'team4', divisionId: 2, seed: 1 },
      { teamId: 'team5', divisionId: 2, seed: 2 },
    ];

    expect(validateDivisionAssignments(validAssignments)).toBe(true);
  });

  it('should return true for single division with sequential seeds', () => {
    const validAssignments: DivisionAssignment[] = [
      { teamId: 'team1', divisionId: 1, seed: 1 },
      { teamId: 'team2', divisionId: 1, seed: 2 },
      { teamId: 'team3', divisionId: 1, seed: 3 },
    ];

    expect(validateDivisionAssignments(validAssignments)).toBe(true);
  });

  it('should return true for multiple divisions with different team counts', () => {
    const validAssignments: DivisionAssignment[] = [
      { teamId: 'team1', divisionId: 1, seed: 1 },
      { teamId: 'team2', divisionId: 1, seed: 2 },
      { teamId: 'team3', divisionId: 2, seed: 1 },
      { teamId: 'team4', divisionId: 2, seed: 2 },
      { teamId: 'team5', divisionId: 2, seed: 3 },
      { teamId: 'team6', divisionId: 3, seed: 1 },
    ];

    expect(validateDivisionAssignments(validAssignments)).toBe(true);
  });

  it('should return false when division IDs have gaps', () => {
    const invalidAssignments: DivisionAssignment[] = [
      { teamId: 'team1', divisionId: 1, seed: 1 },
      { teamId: 'team2', divisionId: 1, seed: 2 },
      { teamId: 'team3', divisionId: 3, seed: 1 }, // Gap - missing division 2
      { teamId: 'team4', divisionId: 3, seed: 2 },
    ];

    expect(validateDivisionAssignments(invalidAssignments)).toBe(false);
  });

  it('should return false when division IDs do not start at 1', () => {
    const invalidAssignments: DivisionAssignment[] = [
      { teamId: 'team1', divisionId: 2, seed: 1 }, // Should start at 1
      { teamId: 'team2', divisionId: 2, seed: 2 },
      { teamId: 'team3', divisionId: 3, seed: 1 },
    ];

    expect(validateDivisionAssignments(invalidAssignments)).toBe(false);
  });

  it('should return false when seeds have gaps within a division', () => {
    const invalidAssignments: DivisionAssignment[] = [
      { teamId: 'team1', divisionId: 1, seed: 1 },
      { teamId: 'team2', divisionId: 1, seed: 3 }, // Gap - missing seed 2
      { teamId: 'team3', divisionId: 2, seed: 1 },
    ];

    expect(validateDivisionAssignments(invalidAssignments)).toBe(false);
  });

  it('should return false when seeds do not start at 1 within a division', () => {
    const invalidAssignments: DivisionAssignment[] = [
      { teamId: 'team1', divisionId: 1, seed: 2 }, // Should start at 1
      { teamId: 'team2', divisionId: 1, seed: 3 },
      { teamId: 'team3', divisionId: 2, seed: 1 },
    ];

    expect(validateDivisionAssignments(invalidAssignments)).toBe(false);
  });

  it('should return false when seeds are duplicated within a division', () => {
    const invalidAssignments: DivisionAssignment[] = [
      { teamId: 'team1', divisionId: 1, seed: 1 },
      { teamId: 'team2', divisionId: 1, seed: 2 },
      { teamId: 'team3', divisionId: 1, seed: 2 }, // Duplicate seed
    ];

    expect(validateDivisionAssignments(invalidAssignments)).toBe(false);
  });

  it('should return true for empty array', () => {
    expect(validateDivisionAssignments([])).toBe(true);
  });

  it('should return true for single team assignment', () => {
    const validAssignments: DivisionAssignment[] = [
      { teamId: 'team1', divisionId: 1, seed: 1 },
    ];

    expect(validateDivisionAssignments(validAssignments)).toBe(true);
  });

  it('should handle unordered input correctly', () => {
    const validAssignments: DivisionAssignment[] = [
      { teamId: 'team5', divisionId: 2, seed: 2 },
      { teamId: 'team1', divisionId: 1, seed: 1 },
      { teamId: 'team4', divisionId: 2, seed: 1 },
      { teamId: 'team3', divisionId: 1, seed: 3 },
      { teamId: 'team2', divisionId: 1, seed: 2 },
    ];

    expect(validateDivisionAssignments(validAssignments)).toBe(true);
  });
});
