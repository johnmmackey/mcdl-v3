import { UserForm } from '@/app/users/components/UserForm'
import { User } from '@/app/lib/types/user';
import { fetchUser } from '@/app/lib/api/users';
import { notFound } from 'next/navigation';
import { fetchPermissionOptions } from '@/app/lib/api/reference';


export default async function Page(props: { params: Promise<{ userId: string }> }) {
    const userId = (await props.params).userId;
    const permissionOptions = await fetchPermissionOptions();

    const user =  await fetchUser(userId);
    if(!user) 
        notFound();

    return (
        <div>
                <UserForm user={user as User} userId={user.sub} permissionOptions={permissionOptions} />
        </div>
    )
}


