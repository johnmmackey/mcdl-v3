/**
 * Data Layer - Wrapper functions for backward compatibility
 *
 * This file maintains backward compatibility with existing imports.
 * New code should import directly from '@/app/lib/api'
 *
 * @deprecated Import from '@/app/lib/api' instead
 */
'use server'

import * as api from './api'

// Re-export types
export type { GenericServerActionState } from './definitions'

// Client utilities
export async function accessToken() {
    return api.getAuthToken()
}

// Season operations
export async function fetchCurrentSeasonId() {
    return api.fetchCurrentSeasonId()
}

export async function fetchSeasons() {
    return api.fetchSeasons()
}

export async function fetchSeason(seasonId: number) {
    return api.fetchSeason(seasonId)
}

export async function fetchTeamsForSeason(seasonId: number) {
    return api.fetchTeamsForSeason(seasonId)
}

export async function createSeason(season: Parameters<typeof api.createSeason>[0]) {
    return api.createSeason(season)
}

export async function updateSeason(season: Parameters<typeof api.updateSeason>[0]) {
    return api.updateSeason(season)
}

export async function deleteSeason(seasonId: number) {
    return api.deleteSeason(seasonId)
}

export async function makeSeasonCurrent(seasonId: number) {
    return api.makeSeasonCurrent(seasonId)
}

export async function createStandardMeets(seasonId: number) {
    return api.createStandardMeets(seasonId)
}

// Meet operations
export async function fetchMeets(seasonId: number) {
    return api.fetchMeets(seasonId)
}

export async function fetchMeet(meetId: number) {
    return api.fetchMeet(meetId)
}

export async function fetchMeetResults(meetId: number) {
    return api.fetchMeetResults(meetId)
}

export async function fetchMeetEntries(meetId: number) {
    return api.fetchMeetEntries(meetId)
}

export async function createMeet(meet: Parameters<typeof api.createMeet>[0]) {
    return api.createMeet(meet)
}

export async function updateMeet(meetId: number, meet: Parameters<typeof api.updateMeet>[1]) {
    return api.updateMeet(meetId, meet)
}

export async function deleteMeet(meetId: number) {
    return api.deleteMeet(meetId)
}

export async function scoreMeet(meetId: number, data: Array<unknown>) {
    return api.scoreMeet(meetId, data)
}

export async function setPublishedStatus(meetId: number, status: boolean) {
    return api.setPublishedStatus(meetId, status)
}

// Reference data
export async function fetchDivisions() {
    return api.fetchDivisions()
}

export async function fetchTeams() {
    return api.fetchTeams()
}

export async function fetchAgeGroups() {
    return api.fetchAgeGroups()
}

export async function fetchStandings(seasonId: number) {
    return api.fetchStandings(seasonId)
}

export async function fetchDivers(params: { seasonId: number, teamId: string }) {
    return api.fetchDivers(params)
}