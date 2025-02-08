"use server"
import {
    CognitoIdentityProviderClient,
    ListUsersCommand,
    AdminCreateUserCommand,
    AdminCreateUserCommandOutput,
    AdminDeleteUserCommand,
    AdminDeleteUserCommandOutput
} from "@aws-sdk/client-cognito-identity-provider";
import { delay } from "./delay";

export type User  = {
    sub: string,
    givenName: string,
    familyName: string,
    email: string,
    note?: string,
    serializedGroups?: string,
    userStatus?: string,
}

const propMap = {
    sub: 'sub',
    given_name: 'givenName',
    family_name: 'familyName',
    email: 'email',
    'custom:note': 'note',
    'custom:serialized_groups': 'serializedGroups'
}

export async function fetchUser(userId: string ): Promise<User | null> {
    let r = await fetchUsers(`sub = \"${userId}\"`);
    return r.length === 1 ? r[0] : null;
}

export async function fetchUsers(filter?: string ): Promise<User[]> {
    const client = new CognitoIdentityProviderClient({});

    let PaginationToken;
    let users: User[] = [];
    let count = 0;

    do {
        const command: ListUsersCommand = new ListUsersCommand({
            UserPoolId: process.env.AWS_IDENTITY_POOL,
            Limit: 50,
            PaginationToken,
            Filter: filter
        });

        let r = await client.send(command);

        r.Users?.forEach(e => {
            let u: User  = {sub: '', givenName: '', familyName: '', email: '', userStatus: ''};
            e.Attributes?.forEach(a => {
                let prop  = a.Name as keyof typeof propMap;
                if(propMap[prop])
                    u[propMap[prop] as keyof User] = a.Value as string;
            });
            u.userStatus = e.UserStatus
            users.push(u);
        });


        count++;
        PaginationToken = r.PaginationToken
        if (count > 20)
            throw new Error('to many iterations');
    } while (PaginationToken)

    return users;
};

export async function addUser(user: any): Promise<AdminCreateUserCommandOutput> {
    const client = new CognitoIdentityProviderClient({});

    const command: AdminCreateUserCommand = new AdminCreateUserCommand({
        UserPoolId: process.env.AWS_IDENTITY_POOL,
        Username: user.email,
        MessageAction: "SUPPRESS",
        UserAttributes: [
            {
                "Name": "given_name",
                "Value": user.givenName
            },
            {
                "Name": "family_name",
                "Value": user.familyName
            },
            {
                "Name": "email",
                "Value": user.email
            },
            {
                "Name": "email_verified",
                "Value": "true"
            },
            {
                "Name": "custom:note",
                "Value": "this is a note"
            },
            {
                "Name": "custom:serialized_groups",
                "Value": "REP:CG"
            },
        ]
    });
    return client.send(command);
};

export async function delUser(userId: string): Promise<AdminDeleteUserCommandOutput> {
    const client = new CognitoIdentityProviderClient({});

    const command: AdminDeleteUserCommand = new AdminDeleteUserCommand({
        UserPoolId: process.env.AWS_IDENTITY_POOL,
        Username: userId,
    });
    return client.send(command);
}