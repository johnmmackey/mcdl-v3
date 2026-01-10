import { TableHead, TableCell } from '@/components/ui/table';
import { fetchTeams, } from '@/app/lib/data';
import Loading from '@/app/ui/Loading'
import { Team } from '@/app/lib/definitions'
import { Suspense } from 'react';
import CrudGrid from '@/app/ui/crudGrid';

export default async function Page() {

    const teams = (await fetchTeams()).sort((a, b) => ((a.name || a.id) > (b.name || b.id) ? 1 : -1));
    return (
        <Suspense fallback={Loading()} >
            <CrudGrid resources={teams} renderHeader={TeamHeader} renderRow={TeamRow} />
        </Suspense>
    )
}

function TeamHeader() {
    return (
        <>
            <TableHead >Team Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Address</TableHead>
        </>
    )
}

function TeamRow(t: Team) {
    return (
        <>
            <TableCell>{t.name}</TableCell>
            <TableCell>{t.id}</TableCell>
            <TableCell>{(t.address1 || '') + (t.address1 && t.address2 ? ', ' + t.address2 : '')}</TableCell>
        </>
    )
}