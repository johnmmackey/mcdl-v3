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

// for score count
type ScoreCount = {
    _count: {
        scores: number
    }
}

// Combined Types used in application
export type MeetWithTeams = Meet & HostPool & MeetTeamsWithDetail;
export type MeetWithTeamsAndScoreCount = Meet & HostPool & MeetTeamsWithDetail & ScoreCount;

// Create and Update Type
export type MeetCreateUpdateInput = Omit<Meet, 'id' | 'teams' |  'defaultName' | 'parentMeet' | 'scoresPublished'> & {
    teamList: string[]
}