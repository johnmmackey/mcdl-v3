import { TeamName } from "./team";

/* Base Meet and Meet Team Types from DB */
type Meet = {
    id: number | null,
    seasonId: number,
    name: string | null,
    parentMeet: number | null,
    meetDate: string,
    entryDeadline: string | null,
    hostPoolId: string | null,
    coordinatorPool: string | null,
    meetType: string,
    divisionId: number | null,
    scoresPublished: Date | null
} 

type MeetTeam = {
    id: number,
    meetId: number,
    teamId: string,
    score: number,
    meetRank: number,
    meetRankPeers: number,
    meetRankPoints: number
}

// For joining meet teams with team names
type MeetTeamsWithDetail = {
    teams: (MeetTeam & TeamName)[]
}

// For joining host pool name
type HostPool = {
    hostPool: {
        name: string
    }
}

// Combined Types used in application
export type MeetWithTeams = Meet & HostPool & MeetTeamsWithDetail;


// Create and Update Types

export type MeetCreateInput = {
    seasonId: number,
    name?: string | null,
    parentMeet?: number | null,
    meetDate?: string,
    entryDeadline?: string | null,
    hostPool?: string | null,
    coordinatorPool?: string | null,
    meetType?: string,
    divisionId?: number | null,
    teamList: string[]
    //scoresPublished?: string | null
}

export type MeetUpdateInput = {
    seasonId?: number,
    name?: string | null,
    parentMeet?: number | null,
    meetDate?: string,
    entryDeadline?: string | null,
    hostPool?: string | null,
    coordinatorPool?: string | null,
    meetType?: string,
    divisionId?: number | null,
    teamList: string[]
    //scoresPublished?: string | null
}

export type MeetTeamUpdateInput = {
    meetId?: number,
    teamId?: string,
    score?: number,
    meetRank?: number,
    meetRankPeers?: number,
    meetRankPoints?: number
}
