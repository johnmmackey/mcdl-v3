import { UserForm } from '@/app/users/components/UserForm'
import { User } from '@/app/lib/types/user';
import { fetchUser } from '@/app/lib/api/users';
import { notFound } from 'next/navigation';


export default async function Page(props: { params: Promise<{ userId: string }> }) {
    const userId = (await props.params).userId;

    const user =  await fetchUser(userId);
    if(!user) 
        notFound();

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


