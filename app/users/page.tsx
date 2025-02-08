import Link from 'next/link'
import { Grid, Button, GridCol } from '@mantine/core';
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

            <Grid>

                <GridCol span={4}>Name</GridCol>
                <GridCol span={6}>Email</GridCol>
                <GridCol span={1}>Groups</GridCol>

            </Grid>
            <hr />
            {users.map((u, k) =>
                <Link key={k} href={"/users/"+u.sub}>
                    <Grid key={k} className='hover:bg-slate-200 cursor-pointer'>
                        <GridCol span={4}>{u.familyName}, {u.givenName}</GridCol>
                        <GridCol span={6}>{u.email}</GridCol>
                        <GridCol span={1}>{u.serializedGroups}</GridCol>

                    </Grid>
                </Link>
            )}
        </>
    )
}
