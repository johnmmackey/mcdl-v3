
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
    safeStartDate: string,
    safeEndDate: string,
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


export type DivisionAssignment = {
    teamId: string,
    divisionId: number,
    seed: number
}