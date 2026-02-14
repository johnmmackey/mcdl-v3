'use server'

import { updateTag } from "next/cache"
import { MeetWithTeams, MeetWithTeamsAndScoreCount, MeetUpdateInput, MeetCreateInput } from '@/app/lib/types/meet';
import  {DiverScore, Entry} from '@/app/lib/types/diver';
import { GenericServerActionState } from "@/app/lib/types/baseTypes"
import { apiFetch, apiMutate, handleMutationResponse } from "./client"
import { logEvent } from "../dynamoEventLog"
import { loggerFactory } from '../logger'

const logger = loggerFactory({ module: 'meets-api' })

/**
 * Fetch all meets for a season
 */
export async function fetchMeets(seasonId: number): Promise<MeetWithTeams[]> {
    return apiFetch<MeetWithTeams[]>(`/meets?season-id=${seasonId}`, { tags: ['meets'] });
}

/**
 * Fetch a single meet by ID
 */
export async function fetchMeet(meetId: number): Promise<MeetWithTeamsAndScoreCount> {
    return apiFetch<MeetWithTeamsAndScoreCount>(`/meets/${meetId}`, { tags: [`meet:${meetId}`] });
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
    return apiFetch<Entry[]>(`/meets/${meetId}/entries`, { tags: [`meet:${meetId}`], includeAuth: true });
}

/**
 * Create a new meet
 */
export async function createMeet(meet: MeetCreateInput): Promise<GenericServerActionState<MeetWithTeams>> {
    const response = await apiMutate('/meets', 'POST', meet);

    if (response.ok) {
        updateTag('meets');
        await logEvent({ eventType: 'app', eventSubType: 'create', text: 'Meet created' });
    }

    return handleMutationResponse<MeetWithTeams>(response);
}

/**
 * Update an existing meet
 */
export async function updateMeet(meetId: number, meet: MeetUpdateInput): Promise<GenericServerActionState<MeetWithTeams>> {
    const response = await apiMutate(`/meets/${meetId}`, 'PATCH', meet);

    if (response.ok) {
        updateTag(`meet:${meetId}`);
        updateTag('meets');
        await logEvent({ eventType: 'app', eventSubType: 'update', text: `Meet ${meetId} updated` });
    }

    return handleMutationResponse<MeetWithTeams>(response);
}

/**
 * Delete a meet
 */
export async function deleteMeet(meetId: number): Promise<GenericServerActionState<MeetWithTeams>> {
    const response = await apiMutate(`/meets/${meetId}`, 'DELETE');

    if (response.ok) {
        updateTag('meets');
        await logEvent({ eventType: 'app', eventSubType: 'delete', text: `Meet ${meetId} deleted` });
    }

    return handleMutationResponse<MeetWithTeams>(response);
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


export async function fetchLabels(meetId: number, options: Record<string, unknown>): Promise<Blob> {
    return apiFetch<Blob>(`/meets/${meetId}/labels?${toQueryString(options)}`, { cache: 'no-store', blob: true, includeAuth: true });
}

function toQueryString(params: Record<string, unknown>): string {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== false)
      .map(([key, value]) => [key, String(value)])
  ).toString();
}

