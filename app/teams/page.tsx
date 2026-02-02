import { Suspense } from 'react';
import Link from 'next/link';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { fetchTeams, } from '@/app/lib/api';
import Loading from '@/app/ui/Loading'
import { ActionButton } from '@/app/ui/StandardButtons';
import { IconPlus } from '@tabler/icons-react';

import { LinkTableRow } from '../ui/LinkTableRow';

export default async function Page() {

    const teams = (await fetchTeams()).sort((a, b) => ((a.name || a.id) > (b.name || b.id) ? 1 : -1));
    return (
        <Suspense fallback={Loading()} >
            <div className="flex justify-end mb-4">
                <Link href={`/teams/new`} >
                    <ActionButton><IconPlus size={24} />New</ActionButton>
                </Link>

            </div>
            <Table >
                <TableHeader>
                    <TableRow>
                        <TableHead >Team Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Archived?</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teams.map((t, k) =>
                        <LinkTableRow href={`/teams/${t.id}`} key={t.id}>
                            <TableCell>{t.name}</TableCell>
                            <TableCell>{t.id}</TableCell>
                            <TableCell>{t.url}</TableCell>
                            <TableCell>{t.archived ? "Yes" : ""}</TableCell>
                        </LinkTableRow>
                    )}
                </TableBody>
            </Table>


        </Suspense>
    )
}
