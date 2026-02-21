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
    note: string,
    status: string;
    createDate: string;
    lastModifiedDate: string;
    enabled: boolean;
    roles: UserRole[]
}

export type UserCreateUpdateInput = Omit<User, 'sub' | 'status' | 'createDate' | 'lastModifiedDate'> 
