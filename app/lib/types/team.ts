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

// types for joined queries
export type TeamName = {
    team: {
        name: string
    }
}
