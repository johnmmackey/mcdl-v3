


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
