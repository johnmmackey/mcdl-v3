import React from 'react';
import { UserForm } from '../components/UserForm'
import { User } from '@/app/lib/types/user';
import { fetchUser } from '@/app/lib/api/users';
import { fetchPermissionOptions } from '@/app/lib/api';


export default async function Page() {

    const permissionOptions = await fetchPermissionOptions();
    let user = { sub: '', givenName: '', familyName: '', email: '', note: '', userStatus: '', roles: [], enabled: true,};;

    return (
        <div>
            {!user &&
                <div>User not found</div>
            }
            {user &&
                <UserForm user={user} permissionOptions={permissionOptions} />
            }
        </div>
    )
}


