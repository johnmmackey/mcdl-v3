import React from 'react';
import UserForm from '../components/userForm'
import { User } from '@/app/lib/types/user';
import { fetchUser } from '@/app/lib/api/users';


export default async function Page() {


    let user = { givenName: '', familyName: '', email: '' };

    return (
        <div>
            {!user &&
                <div>User not found</div>
            }
            {user &&
                <UserForm user={user as User} newUser={true} />
            }
        </div>
    )
}


