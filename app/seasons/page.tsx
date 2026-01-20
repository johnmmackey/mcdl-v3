import { Suspense } from 'react';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button'

import { fetchTeams, fetchSeasons, fetchDivisions, fetchCurrentSeasonId, fetchTeamsForSeason } from '@/app/lib/data';
import { SeasonDropDownMenu } from './SeasonDropDownMenu';
import Loading from '@/app/ui/Loading'
import { LinkTableRow } from '../ui/LinkTableRow';



export default async function Page() {
    const seasons = (await fetchSeasons()).sort((a, b) => b.id - a.id);
    const currentSeasonId = await fetchCurrentSeasonId();

    return (
        <Suspense fallback={Loading()} >
            <div className="flex justify-end mb-4">
                <Link href={`/seasons/_/edit`} >
                    <Button variant="destructive" >New</Button>
                </Link>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead >Season</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Week 1 Date</TableHead>
                        <TableHead>Number of Meets</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {seasons.map(s =>
                        <LinkTableRow key={s.id} href={`/seasons/${s.id}`}>
                            <TableCell>
                                {s.id}
                                {s.id === currentSeasonId &&
                                    <span className='mx-2'>(current)</span>
                                }
                            </TableCell>

                            <TableCell className=''>
                                {new Date(s.startDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className=''>
                                {new Date(s.endDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className=''>
                                {new Date(s.week1Date).toLocaleDateString()}
                                </TableCell>
                            <TableCell className=''>
                                {s._count.meets}
                            </TableCell>
                        </LinkTableRow>

                    )}
                </TableBody>
            </Table>
        </Suspense>
    )
}


