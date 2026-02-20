export type UserRole = {
    role: string;
    objectType: string;
    objectId: string;
}



export type User  = {
    sub: string,
    givenName: string,
    familyName: string,
    email: string,
    note?: string,
    userStatus?: string,
    roles: UserRole[]
}