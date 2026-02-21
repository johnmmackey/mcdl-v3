import React from 'react';
import { UserForm } from '../components/UserForm'
import { User } from '@/app/lib/types/user';
import { fetchUser } from '@/app/lib/api/users';


export default async function Page() {


    let user = { sub: '', givenName: '', familyName: '', email: '', note: '', userStatus: '', roles: [], enabled: true,};;

    return (
        <div>
            {!user &&
                <div>User not found</div>
            }
            {user &&
                <UserForm user={user} />
            }
        </div>
    )
}


