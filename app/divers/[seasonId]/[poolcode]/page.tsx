import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import { format } from 'date-fns';


import { fetchAgeGroups, fetchDivers } from '@/app/lib/api';

export default async function Page(props: { params: Promise<{ seasonId: number, teamId: string }> }) {
    const params = await props.params;

    const divers = await fetchDivers(params);
    const ageGroups = await fetchAgeGroups();

    const sDivers = sortBy(divers, ['lastName', 'firstName']);
    //const gDivers = groupBy(sDivers, e => e.ageGroupId);

    return (
        <p>Nothing for now
        {/*
        ageGroups.map((ag, k) =>
            <div key={k} className='my-8'>
                <Table striped>
                    <TableThead>
                        <TableTr>
                            <TableTh colSpan={5}>{ag.name}</TableTh>
                        </TableTr>
                        <TableTr>
                            <TableTh className="w-96">Diver</TableTh>
                            <TableTh className="">DOB</TableTh>
                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        {!gDivers[ag.id] &&
                            <TableTr>
                                <TableTd colSpan={5} className='py-1'>
                                    <em>No Divers In This Age Group</em>
                                </TableTd>
                            </TableTr>
                        }
                        {(gDivers[ag.id] || []).map((ds, k) =>
                            <TableTr key={k}>
                                <TableTd className='py-1'>{ds.firstName} {ds.lastName}</TableTd>
                                <TableTd className='py-1'>{ds.birthdate}</TableTd>
                            </TableTr>
                        )}
                    </TableTbody>
                </Table>
            </div>
        )
            */}
            </p>
            
    )
}


/*
<Table striped>
    <TableThead>
        <TableTh>Date</TableHeadCell>
        <TableTh>Division</TableHeadCell>
        <TableTh>Meet Name</TableHeadCell>
        <TableTh>Score</TableHeadCell>
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