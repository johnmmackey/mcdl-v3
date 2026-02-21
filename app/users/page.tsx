import Link from 'next/link'
import { fetchUsers } from '@/app/lib/api/users';
import { IfUserHasPermission } from '../ui/IfUserHasPermission';
import { NewButton } from '../ui/StandardButtons';

export default async function Page() {

    const users = await fetchUsers();

    return (
        <>
            <div className="flex justify-end mb-4">
                <IfUserHasPermission objectType="users" requiredPermission='user:createOrUpdate' >
                    <NewButton href={`/users/new`} />
                </IfUserHasPermission>
            </div>
            <div className='grid grid-cols-[auto_auto_auto_auto_auto] gap-x-2'>

                <div >Name</div>
                <div >Email</div>
                <div>Groups</div>
                <div>Status</div>
                <div>Enabled</div>

            {users.map((u, k) =>
                <Link key={k} href={"/users/"+u.sub} className='col-span-full grid grid-cols-subgrid hover:bg-gray-100 cursor-pointer py-1'>

                        <div >{u.familyName}, {u.givenName}</div>
                        <div >{u.email}</div>
                        <div >{u.roles.map(r => `${r.role}:${r.objectType}:${r.objectId}`).join(', ')}</div>
                        <div >{u.status}</div>
                        <div >{u.enabled ? 'Yes' : 'No'}</div>

                </Link>
            )}
            </div>
        </>
    )
}
