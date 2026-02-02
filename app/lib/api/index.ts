/**
 * API Module - Centralized data fetching and mutations
 *
 * This module provides a clean interface to the backend API with:
 * - Typed request/response handling
 * - Consistent error handling
 * - Cache tag management
 * - Authentication handling
 */

// Client utilities
export { apiFetch, apiMutate, getAuthToken, createSuccessResult, createErrorResult, handleMutationResponse } from './client';

// Season operations
export {
    fetchCurrentSeasonId,
    fetchSeasons,
    fetchSeason,
    fetchTeamsForSeason,
    createSeason,
    updateSeason,
    deleteSeason,
    makeSeasonCurrent,
} from './seasons';

// Meet operations
export {
    fetchMeets,
    fetchMeet,
    fetchMeetResults,
    fetchMeetEntries,
    createMeet,
    updateMeet,
    deleteMeet,
    scoreMeet,
    setPublishedStatus,
    fetchLabels
} from './meets';

// Reference data
export * from './reference';

export * from './teams';