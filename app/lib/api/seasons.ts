'use server'

import { updateTag } from "next/cache"
import omit from 'lodash/omit'
import { Season, TeamSeason, SeasonCreateUpdateInput } from "../types/season"
import { GenericServerActionState } from "@/app/lib/types/baseTypes"
import { apiFetch, apiMutate, handleMutationResponse, createErrorResult } from "./client"
import { logEvent } from "../dynamoEventLog"

/**
 * Fetch the current season ID
 */
export async function fetchCurrentSeasonId(): Promise<number> {
    return apiFetch<number>('/current-season-id', { tags: ['current-season'] });
}

/**
 * Fetch all seasons
 */
export async function fetchSeasons(): Promise<Season[]> {
    return apiFetch<Season[]>('/seasons', { tags: ['seasons'] });
}

/**
 * Fetch a single season by ID
 */
export async function fetchSeason(seasonId: number): Promise<Season> {
    return apiFetch<Season>(`/seasons/${seasonId}`, { tags: [`season:${seasonId}`] });
}

/**
 * Fetch team-season assignments for a given season
 */
export async function fetchTeamsForSeason(seasonId: number): Promise<TeamSeason[]> {
    return apiFetch<TeamSeason[]>(`/team-seasons?season-id=${seasonId}`);
}

/**
 * Create a new season
 */
export async function createSeason(season: SeasonCreateUpdateInput): Promise<GenericServerActionState<Season>> {
    const response = await apiMutate(
        `/seasons/${season.id}`,
        'POST',
        omit(season, ['id'])
    );

    if (response.ok) {
        updateTag('seasons');
        await logEvent({ eventType: 'app', eventSubType: 'create', text: `Season ${season.id} created` });
    }

    return handleMutationResponse<Season>(response);
}

/**
 * Update an existing season
 */
export async function updateSeason(season: SeasonCreateUpdateInput): Promise<GenericServerActionState<Season>> {
    const response = await apiMutate(
        `/seasons/${season.id}`,
        'PATCH',
        omit(season, ['id'])
    );

    if (response.ok) {
        updateTag('seasons');
        await logEvent({ eventType: 'app', eventSubType: 'update', text: `Season ${season.id} updated` });
    }

    return handleMutationResponse<Season>(response);
}

/**
 * Delete a season
 */
export async function deleteSeason(seasonId: number): Promise<GenericServerActionState<Season>> {
    const response = await apiMutate(`/seasons/${seasonId}?force=1`, 'DELETE');

    if (response.ok) {
        updateTag('seasons');
        await logEvent({ eventType: 'app', eventSubType: 'delete', text: `Season ${seasonId} deleted` });
    }

    return handleMutationResponse<Season>(response);
}

/**
 * Set a season as the current season
 */
export async function makeSeasonCurrent(seasonId: number): Promise<GenericServerActionState<null>> {
    const response = await apiMutate(
        `/seasons/${seasonId}/current-season-id`,
        'POST'
    );

    if (response.ok) {
        updateTag('seasons');
        updateTag('current-season');
        await logEvent({ eventType: 'app', eventSubType: 'update', text: `Season ${seasonId} set as current` });
    }

    return handleMutationResponse<null>(response);
}

/**
 * Create standard meets for a season
 */
export async function createStandardMeets(seasonId: number): Promise<GenericServerActionState<null>> {
    const response = await apiMutate(
        `/seasons/${seasonId}/create-standard-meets`,
        'POST',
        {}
    );

    if (response.ok) {
        updateTag('seasons');
        await logEvent({ eventType: 'app', eventSubType: 'create', text: `Standard meets created for season ${seasonId}` });
    }

    return handleMutationResponse<null>(response);
}
