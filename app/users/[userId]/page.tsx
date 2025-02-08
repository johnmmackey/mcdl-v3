import React from 'react';
import UserForm from './userForm'
import { fetchUser, User } from '@/app/lib/userPoolData';


export default async function Page(props: { params: Promise<{ userId: string }> }) {
    const userId = (await props.params).userId;

    let user = userId === '_' ? ({ givenName: '', familyName: '', email: '' }) : await fetchUser(userId);

    return (
        <div>
            {!user &&
                <div>User not found</div>
            }
            {user &&
                <UserForm user={user as User} newUser={userId === '_'} />
            }
        </div>
    )
}


