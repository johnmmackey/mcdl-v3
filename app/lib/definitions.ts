import { Session } from "next-auth"

export type Team = {
    poolcode: string,
    name: string | null,
    clubName: string | null,
    teamName: string | null,
    address1: string | null,
    address2: string | null,
    phone: string | null,
    url: string | null
}

export type MeetPool = {
    id: number,
    meetId: number,
    poolcode: string,
    score: number,
    meetRank: number,
    meetRankPeers: number,
    meetRankPoints: number
}


export type Meet = {
    id: number,
    seasonId: number,
    name: string | null,
    meetDate: string,
    entryDeadline: string | null,
    hostPool: string | null,
    visitingPool: string | null,
    visitingPool2: string | null,
    coordinatorPool: string | null,
    meetType: string,
    division: number | null,
    week: number | null,
    minAge: number | null,
    maxAge: number | null,
    scoresPublished: string | null,
    meetsPools: MeetPool[]
}

export type Entry = {
        id: number,
        firstName: string,
        lastName: string,
        sex: string,
        poolcode: string,
        createDate: string,
        ageGroupId: 6,
        firstYear: boolean,
        registrationDate: string,
        lateRegistration: boolean
}

export type AgeGroup = {
    id: number,
    gender: string,
    name: string,
    min: number,
    max: number
}

export type DiverScore = {
    ageGroupId: number,
    scoreId: number,
    diverId: number,
    firstName: string,
    lastName: string,
    exhibition: number | null,
    agRank: {
        rank: number | null,
        rankPoints: number | null
    },
    score: number,
    diverAgeGroupScore: number | null,
    diverAgeGroupId: number,
    team: string
}

export type Rank = {
    rank: number,
    rankPoints: number,
    rankPeers?: number,
    tieBreakerLevel?: number
}

export type Standing = {
    season: number,
    team: string,
    division: number,
    seed: number,
    teamName: string,
    dualRecord: {
        W: number, L: number, T: number, dW: number, dL: number, dT: number
    },
    dualMeetSeasonRank: Rank,
    divMeetScore: number,
    divMeetRank: Rank,
    dualMeetSeasonPoints: number,
    sumDualDivRankPoints: number,
    fullSeasonRank: Rank
};

export type GroupedStandings = {
    [id: string]: Standing[]
}

export type Season = {
    id: number,
    name: string,
    registerDate: string,
    startDate: string,
    endDate: string
}

export type Diver = {
    id: number,
    firstName: string,
    lastName: string,
    birthdate?: string,
    sex: string,
    poolcode: string,
    createDate: string,
    ageGroupId: number,
    firstYear: boolean | null,
    inactive: boolean | null,
    registrationDate: string
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