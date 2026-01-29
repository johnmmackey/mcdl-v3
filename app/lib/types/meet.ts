import { TeamName } from "./team";

/* Base Meet and Meet Team Types from DB */
type Meet = {
    id: number,
    seasonId: number,
    customName: string | null,
    defaultName: string,
    parentMeet: number | null,
    meetDate: string,
    entryDeadline: string | null,
    hostPoolId: string | null,
    coordinatorPoolId: string | null,
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

// Combined Type for Meet Form
export type MeetEditable = Omit<Meet, 'id' |'teams' > & {
    id: number | null
    teamList: string[]
}

// Create and Update Types
export type MeetCreateInput = {
    seasonId: number,
    customName?: string | null,
    parentMeet?: number | null,
    meetDate: string,
    entryDeadline?: string | null,
    hostPoolId?: string | null,
    coordinatorPoolId?: string | null,
    meetType: string,
    divisionId?: number | null,
    teamList: string[]

}

export type MeetUpdateInput = {
    seasonId?: number,
    customName?: string | null,
    parentMeet?: number | null,
    meetDate?: string,
    entryDeadline?: string | null,
    hostPoolId?: string | null,
    coordinatorPoolId?: string | null,
    meetType?: string,
    divisionId?: number | null,
    teamList: string[]
}



