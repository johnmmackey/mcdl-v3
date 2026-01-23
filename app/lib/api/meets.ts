'use server'

import { updateTag } from "next/cache"
import { Meet, MeetUpdateInput, DiverScore, Entry, GenericServerActionState } from "../definitions"
import { apiFetch, apiMutate, handleMutationResponse } from "./client"
import { logEvent } from "../dynamoEventLog"
import { loggerFactory } from '../logger'

const logger = loggerFactory({ module: 'meets-api' })

/**
 * Fetch all meets for a season
 */
export async function fetchMeets(seasonId: number): Promise<Meet[]> {
    return apiFetch<Meet[]>(`/meets?season-id=${seasonId}`, { tags: ['meets'] });
}

/**
 * Fetch a single meet by ID
 */
export async function fetchMeet(meetId: number): Promise<Meet> {
    return apiFetch<Meet>(`/meets/${meetId}`, { tags: [`meet:${meetId}`] });
}

/**
 * Fetch meet results (scores)
 */
export async function fetchMeetResults(meetId: number): Promise<DiverScore[]> {
    return apiFetch<DiverScore[]>(`/meets/${meetId}/results`, { tags: [`meet:${meetId}`] });
}

/**
 * Fetch meet entries
 */
export async function fetchMeetEntries(meetId: number): Promise<Entry[]> {
    return apiFetch<Entry[]>(`/meets/${meetId}/entries`, { tags: [`meet:${meetId}`] });
}

/**
 * Create a new meet
 */
export async function createMeet(meet: MeetUpdateInput): Promise<GenericServerActionState<Meet>> {
    const response = await apiMutate('/meets', 'POST', meet);

    if (response.ok) {
        updateTag('meets');
        await logEvent({ eventType: 'app', eventSubType: 'create', text: 'Meet created' });
    }

    return handleMutationResponse<Meet>(response);
}

/**
 * Update an existing meet
 */
export async function updateMeet(meetId: number, meet: MeetUpdateInput): Promise<GenericServerActionState<Meet>> {
    const response = await apiMutate(`/meets/${meetId}`, 'PATCH', meet);

    if (response.ok) {
        updateTag(`meet:${meetId}`);
        updateTag('meets');
        await logEvent({ eventType: 'app', eventSubType: 'update', text: `Meet ${meetId} updated` });
    }

    return handleMutationResponse<Meet>(response);
}

/**
 * Delete a meet
 */
export async function deleteMeet(meetId: number): Promise<GenericServerActionState<Meet>> {
    const response = await apiMutate(`/meets/${meetId}`, 'DELETE');

    if (response.ok) {
        updateTag('meets');
        await logEvent({ eventType: 'app', eventSubType: 'delete', text: `Meet ${meetId} deleted` });
    }

    return handleMutationResponse<Meet>(response);
}

/**
 * Submit scores for a meet
 */
export async function scoreMeet(meetId: number, data: Array<unknown>): Promise<void> {
    logger.debug(`Saving scores for meet ${meetId}...`)

    const response = await apiMutate(`/scores/${meetId}`, 'POST', data);

    if (!response.ok) {
        throw new Error('Error posting scores');
    }

    updateTag(`meet:${meetId}`);
    updateTag('meets');
    await logEvent({ eventType: 'app', eventSubType: 'update', text: `Scores saved for meet ${meetId}` });
}

/**
 * Set the published status for a meet's scores
 */
export async function setPublishedStatus(meetId: number, status: boolean): Promise<void> {
    const response = await apiMutate(
        `/meets/${meetId}/set-published-status`,
        'POST',
        { status }
    );

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    updateTag(`meet:${meetId}`);
    updateTag('meets');
    await logEvent({
        eventType: 'app',
        eventSubType: 'update',
        text: `Meet ${meetId} ${status ? 'published' : 'unpublished'}`
    });
}
