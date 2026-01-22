import { Session } from "next-auth"

export type Team = {
    id: string,
    name: string | null,
    clubName: string | null,
    teamName: string | null,
    address1: string | null,
    address2: string | null,
    phone: string | null,
    url: string | null,
    archived: boolean
}

export type MeetTeam = {
    id: number,
    meetId: number,
    teamId: string,
    score: number,
    meetRank: number,
    meetRankPeers: number,
    meetRankPoints: number
}


export type MeetTeamUpdateInput = {
    meetId?: number,
    teamId?: string,
    score?: number,
    meetRank?: number,
    meetRankPeers?: number,
    meetRankPoints?: number
}

export type Meet = {
    id: number | null,
    seasonId: number,
    name: string | null,
    parentMeet: number | null,
    meetDate: string,
    entryDeadline: string | null,
    hostPool: string | null,
    coordinatorPool: string | null,
    meetType: string,
    divisionId: number | null,
    scoresPublished: Date | null,
    teams: MeetTeam[]
}

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

export type DiverSeason = {
    id: number,
    diverId: number,
    seasonId: number,
    ageGroupId: number,
    firstYear: boolean,
    inactive: boolean,
    registrationDate: string
}

export type DiverBase = {
    id: number,
    firstName: string,
    lastName: string,
    birthdate?: string,
    gender: string,
    teamId: string,
    createDate: string,
}

export type DiverWithSeason = DiverBase & { seasons: DiverSeason[] }

export type Entry = {
    id: number | null,
    meetId: number,
    diverId: number,
    diver: DiverWithSeason,
    lateRegistration: boolean
}

export type AgeGroup = {
    id: number,
    gender: string,
    name: string,
    min: number,
    max: number,
    nextGroup: number
}

export type DiverScore = {
    id: number,
    score: number,
    ageGroupId: number,
    diverAgeGroupId: number,
    meetId: number,
    diverId: number,
    place: number,
    points: number,
    scoreAgeGroup: number,
    exhibition: boolean,
    teamId: string,
    diver: {
        firstName: string,
        lastName: string,
        gender: string,
        createDate: string
    }
}

export type Rank = {
    rank: number,
    rankPoints: number,
    rankPeers?: number,
    tieBreakerLevel?: number
}

export type Standing = {
    season: number,
    teamId: string,
    division: number,
    seed: number,
    teamName: string,
    dualW: number,
    dualL: number,
    dualT: number,
    dualDW: number,
    dualDL: number,
    dualDT: number,

    dualWLTPoints: number,
    dualRank: number,
    dualRankPoints: number,

    divScore: number,
    divRank: number,
    divRankPoints: number,

    fsTotalPoints: number,
    fsRank: number,
    fsTieBreaker: number,

    seasonComplete: boolean
};

export type GroupedStandings = {
    [id: string]: Standing[]
}

export type Season = {
    id: number,
    name: string,
    startDate: string,
    endDate: string,
    week1Date: string
    _count: {
        meets: number
    }
}

export type Division = {
    id: number
}

export type TeamSeason = {
    id: number,
    teamId: string,
    seasonId: number,
    divisionId: number,
    seed: number,
    dualW: number,
    dualL: number,
    dualT: number,
    dualDW: number,
    dualDL: number,
    dualDT: number,
    dualWLTPoints: number,
    dualRank: number,
    dualRankPoints: number,
    divScore: number,
    divRank: number,
    divRankPoints: number,
    fsTotalPoints: number,
    fsRank: number,
    fsTieBreaker: number,
    tsCsAcceptedBy: string,
    tsCsAcceptedAt: string,
    seasonComplete: boolean,
    team: {
        id: string,
        name: string,
        clubName: string,
        teamName: string,
        address1: string,
        address2: string,
        phone: string,
        url: string
    }
}

export type SeasonCreateUpdateInput = {
    id: number,
    name: string,
    startDate: string,
    endDate: string,
    week1Date: string
    divisionAssignments: TeamSeasonCreateInput[]
}


export type TeamSeasonCreateInput = {
    teamId: string,
    divisionId: number,
    seed: number
}


export type GraphQLPosts = {
    data: {
        posts: {
            edges: {
                node: {
                    postacf: {
                        expiry: string,
                        order: number,
                        supressTitle: boolean,
                        template: string,
                        titleIcon: string
                    },
                    title: string,
                    content: string,
                    slug: string
                }
            }[]
        }
    }
}

export type GraphQLMenus = {
    data: {
        menus: {
            nodes: {
                name: string,
                slug: string,
                menuItems: {
                    edges: [
                        {
                            node: {
                                label: string,
                                target: string,
                                url: string,
                                order: number
                            }
                        }
                    ]
                }
            }[]
        }
    },
}

export type Post = {
    title: string,
    slug: string,
    content: string,
    expiry: string,
    order: number,
    supressTitle: boolean,
    template: string,
    titleIcon: string
}

export type Posts = Post[]

export type Menu = {
    name: string,
    slug: string,
    menuItems: {
        label: string,
        target: string,
        url: string,
        order: number
    }[]
}

export type Menus = Menu[];

export type Permissions = string[];


export enum MeetView {
    Entries = 1,
    Scoring,
    Preview,
    Results
}

export type GenericServerActionState<T> = {
    error: {
        msg: string,
        seq: number
    } | null,
    data: T | null
}

export const GenericServerActionStatePlaceHolder: GenericServerActionState<any> = {
    error: null,
    data: null
}

export type DivisionAssignment = {
    teamId: string,
    divisionId: number,
    seed: number
}