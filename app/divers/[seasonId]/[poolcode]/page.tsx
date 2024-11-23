import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';
import { Table, TableBody, TableRow, TableCell, TableHead, TableHeadCell } from 'flowbite-react';
import { LinkTableRow } from '@/app/ui/LinkTableRow';
import { fetchAgeGroups, fetchDivers } from '@/app/lib/data';

export default async function Page({
    params
}:{
    params: { 
        seasonId: number,
        poolcode: string
} }) {

    const divers = await fetchDivers(params);
    const ageGroups = await fetchAgeGroups();

    const sDivers = sortBy(divers, ['lastName', 'firstName']);
    const gDivers = groupBy(sDivers, e => e.ageGroupId);

    return (
        ageGroups.map((ag, k) =>
            <div key={k} className='my-8'>
                <Table striped>
                    <TableHead>
                        <TableHeadCell colSpan={5}>{ag.name}</TableHeadCell>
                    </TableHead>
                    <TableHead>
                        <TableHeadCell className="w-96">Diver</TableHeadCell>
                        <TableHeadCell className="">DOB</TableHeadCell>
                    </TableHead>
                    <TableBody>
                        {!gDivers[ag.id] &&
                            <TableRow>
                                <TableCell colSpan={5} className='py-1'>
                                    <em>No Divers In This Age Group</em>
                                </TableCell>
                            </TableRow>
                        }
                        {(gDivers[ag.id] || []).map((ds, k) =>
                            <TableRow key={k}>
                                <TableCell className='py-1'>{ds.firstName} {ds.lastName}</TableCell>
                                <TableCell className='py-1'>{ds.birthdate}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        )
    )
}


        /*
        <Table striped>
            <TableHead>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell>Division</TableHeadCell>
                <TableHeadCell>Meet Name</TableHeadCell>
                <TableHeadCell>Score</TableHeadCell>
            </TableHead>
            <TableBody>
                {Object.entries(gmeets).map(([dt, meets], k1) =>
                    meets.map((m, k2) =>
                        <LinkTableRow key={k2} className='cursor-pointer hover:bg-slate-400 hover:text-white' href={`/meets/meet/${m.id}`}>
                            <TableCell className='py-2'>{format(m.meetDate, 'PPP')}</TableCell>
                            <TableCell className='pl-12 py-2'>{m.division || 'NDM'}</TableCell>
                            <TableCell className='py-2'>{meetName(m)}</TableCell>
                            <TableCell className='py-2'>{scoreStr(m)}</TableCell>
                        </LinkTableRow>
                    )
                )}
            </TableBody>
        </Table>
                */