import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { fetchUsers } from '@/app/lib/userPoolData';

export default async function Page() {

    const users = await fetchUsers();

    return (
        <>
            <Link href='/users/_'>
                <Button variant='default'>
                    Add
                </Button>
            </Link>

            <div className="grid grid-cols-11 gap-2">

                <div className="col-span-4">Name</div>
                <div className="col-span-6">Email</div>
                <div className="col-span-1">Groups</div>

            </div>
            <hr />
            {users.map((u, k) =>
                <Link key={k} href={"/users/"+u.sub}>
                    <div key={k} className='grid grid-cols-11 gap-2 hover:bg-slate-200 cursor-pointer'>
                        <div className="col-span-4">{u.familyName}, {u.givenName}</div>
                        <div className="col-span-6">{u.email}</div>
                        <div className="col-span-1">{u.serializedGroups}</div>

                    </div>
                </Link>
            )}
        </>
    )
}
