'use server'

import { updateTag } from "next/cache"
import omit from 'lodash/omit'
import { DiverBase, DiverWithSeason, DiverSeason } from "../types/diver"
import { GenericServerActionState } from "@/app/lib/types/baseTypes"
import { apiFetch, apiMutate, handleMutationResponse } from "./client"

/**
 * Fetch all divers for a team (all time)
 */
export async function fetchTeamDivers(teamId: string): Promise<DiverWithSeason[]> {
    return apiFetch<DiverWithSeason[]>(`/teams/${teamId}/divers`, { tags: [`team:${teamId}:divers`] });
}

/**
 * Fetch divers registered for a specific season
 */
export async function fetchTeamDiversForSeason({ teamId, seasonId }: { teamId: string, seasonId: number }): Promise<DiverWithSeason[]> {
    return apiFetch<DiverWithSeason[]>(`/teams/${teamId}/divers?seasonId=${seasonId}`, { tags: [`team:${teamId}:divers:${seasonId}`] });
}

/**
 * Fetch a single diver
 */
export async function fetchDiver(diverId: number): Promise<DiverWithSeason> {
    return apiFetch<DiverWithSeason>(`/divers/${diverId}`, { tags: [`diver:${diverId}`] });
}

/**
 * Create a new diver
 */
export async function createDiver(diver: Omit<DiverBase, 'id' | 'createDate'>): Promise<GenericServerActionState<DiverBase>> {
    const response = await apiMutate(
        `/divers`,
        'POST',
        diver
    );

    if (response.ok) {
        updateTag(`team:${diver.teamId}:divers`);
    }

    return handleMutationResponse<DiverBase>(response);
}

/**
 * Update a diver
 */
export async function updateDiver(diver: DiverBase): Promise<GenericServerActionState<DiverBase>> {
    const response = await apiMutate(
        `/divers/${diver.id}`,
        'PATCH',
        omit(diver, ['id', 'createDate'])
    );

    if (response.ok) {
        updateTag(`diver:${diver.id}`);
        updateTag(`team:${diver.teamId}:divers`);
    }

    return handleMutationResponse<DiverBase>(response);
}

/**
 * Delete a diver
 */
export async function deleteDiver(diverId: number, teamId: string): Promise<GenericServerActionState<DiverBase>> {
    const response = await apiMutate(
        `/divers/${diverId}`,
        'DELETE'
    );

    if (response.ok) {
        updateTag(`diver:${diverId}`);
        updateTag(`team:${teamId}:divers`);
    }

    return handleMutationResponse<DiverBase>(response);
}

/**
 * Create a diver season registration
 */
export async function createDiverSeasonRegistration(registration: Omit<DiverSeason, 'id'>): Promise<GenericServerActionState<DiverSeason>> {
    const response = await apiMutate(
        `/diver-seasons`,
        'POST',
        registration
    );

    if (response.ok) {
        updateTag(`diver:${registration.diverId}`);
        // Invalidate team divers cache for this season
        const diver = await apiFetch<DiverBase>(`/divers/${registration.diverId}`);
        updateTag(`team:${diver.teamId}:divers:${registration.seasonId}`);
    }

    return handleMutationResponse<DiverSeason>(response);
}

/**
 * Update a diver season registration
 */
export async function updateDiverSeasonRegistration(registration: DiverSeason): Promise<GenericServerActionState<DiverSeason>> {
    const response = await apiMutate(
        `/diver-seasons/${registration.id}`,
        'PATCH',
        omit(registration, ['id'])
    );

    if (response.ok) {
        updateTag(`diver:${registration.diverId}`);
        // Invalidate team divers cache for this season
        const diver = await apiFetch<DiverBase>(`/divers/${registration.diverId}`);
        updateTag(`team:${diver.teamId}:divers:${registration.seasonId}`);
    }

    return handleMutationResponse<DiverSeason>(response);
}

/**
 * Delete a diver season registration
 */
export async function deleteDiverSeasonRegistration(registrationId: number, diverId: number, seasonId: number): Promise<GenericServerActionState<DiverSeason>> {
    const response = await apiMutate(
        `/diver-seasons/${registrationId}`,
        'DELETE'
    );

    if (response.ok) {
        updateTag(`diver:${diverId}`);
        // Invalidate team divers cache for this season
        const diver = await apiFetch<DiverBase>(`/divers/${diverId}`);
        updateTag(`team:${diver.teamId}:divers:${seasonId}`);
    }

    return handleMutationResponse<DiverSeason>(response);
}
