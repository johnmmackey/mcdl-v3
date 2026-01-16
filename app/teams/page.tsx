import { Suspense } from 'react';
import Link from 'next/link';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { fetchTeams, } from '@/app/lib/data';
import Loading from '@/app/ui/Loading'
import { Team } from '@/app/lib/definitions'

import { LinkTableRow } from '../ui/LinkTableRow';

export default async function Page() {

    const teams = (await fetchTeams()).sort((a, b) => ((a.name || a.id) > (b.name || b.id) ? 1 : -1));
    return (
        <Suspense fallback={Loading()} >

            <Table >
                <TableHeader>
                    <TableRow>
                        <TableHead >Team Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Address</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teams.map((t, k) =>
                        <LinkTableRow href={`/teams/${t.id}`} key={t.id}>
                            <TableCell>{t.name}</TableCell>
                            <TableCell>{t.id}</TableCell>
                            <TableCell>{(t.address1 || '') + (t.address1 && t.address2 ? ', ' + t.address2 : '')}</TableCell>
                        </LinkTableRow>
                    )}
                </TableBody>
            </Table>


        </Suspense>
    )
}
