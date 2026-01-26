// Diver Types
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