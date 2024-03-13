import { fetchStandings } from '@/app/lib/data';
import { Fragment } from 'react';
import { Table, TableBody, TableRow, TableCell, TableHead, TableHeadCell } from 'flowbite-react';
import { notFound } from 'next/navigation';


export default async function Page({ params }: { params: { seasonId: number } }) {
  const standings = await fetchStandings(params.seasonId);
  if (!standings) {
    notFound();
  }
  const nStars = (n: number): string => Array(n + 1).join('*')
  const fmt = (a: number | null, places?: number): string => a === null ? '' : (places ? a.toFixed(places) : a.toString());

  return (
    <Table striped>
      {Object.entries(standings).map(([div, divResults]) =>
        <Fragment key={div}>
          <TableHead>
            <TableHeadCell colSpan={8} className='text-left text-2xl pt-6 pb-2'>Division {div}</TableHeadCell>
          </TableHead>
          <TableHead>
            <TableHeadCell className='w-64'>Pool</TableHeadCell>
            <TableHeadCell className="px-3">Seed</TableHeadCell>
            <TableHeadCell className="px-3">Dual Meets</TableHeadCell>
            <TableHeadCell className="px-3">Div Meets</TableHeadCell>
            <TableHeadCell className="px-3">Dual Rank Points</TableHeadCell>
            <TableHeadCell className="px-3">Div Meet Score</TableHeadCell>
            <TableHeadCell className="px-3">Rank Points</TableHeadCell>
            <TableHeadCell className="px-3">Total</TableHeadCell>

          </TableHead>
          <TableBody>
            {divResults.map((t, k) =>
              <TableRow key={k}>
                <TableCell>{t.teamName}</TableCell>
                <TableCell className='text-center'>{t.seed}</TableCell>
                <TableCell className='text-center'>{`${fmt(t.dualRecord.W)}-${fmt(t.dualRecord.L)}-${fmt(t.dualRecord.T)}`}</TableCell>
                <TableCell className='text-center'>{`${fmt(t.dualRecord.dW)}-${fmt(t.dualRecord.dL)}-${fmt(t.dualRecord.dT)}`}</TableCell>
                <TableCell className='text-center'>{fmt(t.dualMeetSeasonRank.rankPoints)}</TableCell>
                <TableCell className='text-right pr-10'>{fmt(t.divMeetScore, 1)}</TableCell>
                <TableCell className='text-center'>{fmt(t.divMeetRank.rankPoints)}</TableCell>
                <TableCell className='text-center'>
                  {fmt(t.sumDualDivRankPoints) + ' ' + nStars(t.fullSeasonRank.tieBreakerLevel || 0)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Fragment>
      )}
    </Table>
  );
}


