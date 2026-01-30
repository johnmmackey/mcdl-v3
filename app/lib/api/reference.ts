'use server'

import { Division, Team, AgeGroup, GroupedStandings, DiverWithSeason } from "@/app/lib/types"
import { apiFetch, getAuthToken } from "./client"

const API_BASE_URL = process.env.DATA_URL;

/**
 * Fetch all divisions
 */
export async function fetchDivisions(): Promise<Division[]> {
    return apiFetch<Division[]>('/divisions');
}

/**
 * Fetch all teams
 */
export async function fetchTeams(): Promise<Team[]> {
    return apiFetch<Team[]>('/teams');
}

/**
 * Fetch all age groups
 */
export async function fetchAgeGroups(): Promise<AgeGroup[]> {
    return apiFetch<AgeGroup[]>('/agegroups');
}

/**
 * Fetch standings for a season
 */
export async function fetchStandings(seasonId: number): Promise<GroupedStandings> {
    return apiFetch<GroupedStandings>(`/standings/${seasonId}`, { tags: ['meets'] });
}

/**
 * Fetch divers for a team in a season
 */
export async function fetchDivers({ seasonId, teamId }: { seasonId: number, teamId: string }): Promise<DiverWithSeason[]> {
    const token = await getAuthToken();

    const response = await fetch(
        `${API_BASE_URL}/divers/${seasonId}/${teamId}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );

    if (!response.ok) {
        throw new Error(`Error fetching divers: ${response.statusText}`);
    }

    return response.json();
}
