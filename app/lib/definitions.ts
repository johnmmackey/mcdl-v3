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
    "data": {
        "menus": {
            "nodes": {
                "name": string,
                "slug": string,
                "menuItems": {
                    "edges": [
                        {
                            "node": {
                                "label": string,
                                "target": string,
                                "url": string,
                                "order": number
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
        "label": string,
        "target": string,
        "url": string,
        "order": number
    }[]
}

export type Menus = Menu[]
