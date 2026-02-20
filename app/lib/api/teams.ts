'use server'

import { updateTag } from "next/cache"
import omit from 'lodash/omit'
import { Team, TeamWithTeamSeasons } from "../types/team"
import { GenericServerActionState } from "@/app/lib/types/baseTypes"
import { apiFetch, apiMutate, handleMutationResponse } from "./client"

/**
 * Fetch all teams
 */
export async function fetchTeams(): Promise<Team[]> {
    return apiFetch<Team[]>('/teams');
}

/**
 * Fetch one team with season detail
 */
export async function fetchTeam(teamId: string): Promise<TeamWithTeamSeasons> {
    return apiFetch<TeamWithTeamSeasons>(`/teams/${teamId}`);
}

export async function createTeam(team: Team): Promise<GenericServerActionState<Team>> {
    const response = await apiMutate(
        `/teams/${team.id}`,
        'POST',
        team
    );

    if (response.ok) {
        updateTag('teams');
    }

    return handleMutationResponse<Team>(response);
}


export async function updateTeam(team: Team): Promise<GenericServerActionState<Team>> {
    const response = await apiMutate(
        `/teams/${team.id}`,
        'PATCH',
        omit(team, ['id'])
    );

    if (response.ok) {
        updateTag('teams');
    }

    return handleMutationResponse<Team>(response);
}

export async function deleteTeam(teamId: string): Promise<GenericServerActionState<Team>> {
    const response = await apiMutate(
        `/teams/${teamId}`,
        'DELETE'
    );

    if (response.ok) {
        updateTag('teams');
    }

    return handleMutationResponse<Team>(response);
}
