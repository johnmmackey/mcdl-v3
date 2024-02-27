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

export type CurrentSeason = {
    season_id: string
}

export type Post = {
    title: string,
    slug: string,
    content: string
}

export type Posts = Post[]
