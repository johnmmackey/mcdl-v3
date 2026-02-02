import type { TeamSeason } from "./season"

export type Team = {
    id: string,
    name: string | null,
    clubName: string | null,
    address1: string | null,
    address2: string | null,
    phone: string | null,
    url: string | null,
    archived: boolean
}

export type TeamWithTeamSeasons = Team & {seasons: TeamSeason[]};

// types for joined queries
export type TeamName = {
    team: {
        name: string
    }
}

