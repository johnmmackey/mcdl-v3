import { fetchStandings } from '@/app/lib/data';
import { Fragment } from 'react';
import { Table, TableBody, TableRow, TableCell, TableHead, TableHeadCell } from 'flowbite-react';
import { notFound } from 'next/navigation';
import styles from "./page.module.css";


export default async function Page(props: { params: Promise<{ seasonId: number }> }) {
  const params = await props.params;
  const standings = await fetchStandings(params.seasonId);
  if (!standings) {
    notFound();
  }
  const nStars = (n: number): string => Array(n + 1).join('*')
  const fmt = (a: number | null, places?: number): string => a === null ? '' : (places ? a.toFixed(places) : a.toString());

  return (
    Object.entries(standings).map(([div, divResults]) =>
      <Table key={div} striped className="mb-4">
        <TableHead>
          <TableHeadCell colSpan={8} className='text-left text-2xl pt-6 pb-2'>Division {div}</TableHeadCell>
        </TableHead>
        <TableHead>
          <TableHeadCell className='px-2'>Pool</TableHeadCell>
          <TableHeadCell className="px-2">Seed</TableHeadCell>
          <TableHeadCell className="px-2">Dual Meets</TableHeadCell>
          <TableHeadCell className="px-2">Div Meets</TableHeadCell>
          <TableHeadCell className="px-2">Dual Rank Points</TableHeadCell>
          <TableHeadCell className="px-2">Div Meet Score</TableHeadCell>
          <TableHeadCell className="px-2">Rank Points</TableHeadCell>
          <TableHeadCell className="px-2">Total</TableHeadCell>

        </TableHead>
        <TableBody>
          {divResults.map((t, k) =>
            <TableRow key={k} className="hover:bg-slate-400 hover:text-white">
              <TableCell className='text-nowrap'>{t.teamName}</TableCell>
              <TableCell className='text-center'>{t.seed}</TableCell>
              <TableCell className='text-center text-nowrap'>{`${fmt(t.dualRecord.W)}-${fmt(t.dualRecord.L)}-${fmt(t.dualRecord.T)}`}</TableCell>
              <TableCell className='text-center text-nowrap'>{`${fmt(t.dualRecord.dW)}-${fmt(t.dualRecord.dL)}-${fmt(t.dualRecord.dT)}`}</TableCell>
              <TableCell className='text-center'>{fmt(t.dualMeetSeasonRank.rankPoints)}</TableCell>
              <TableCell className='text-right pr-10'>{fmt(t.divMeetScore, 1)}</TableCell>
              <TableCell className='text-center'>{fmt(t.divMeetRank.rankPoints)}</TableCell>
              <TableCell className='text-center'>
                {fmt(t.sumDualDivRankPoints) + ' ' + nStars(t.fullSeasonRank.tieBreakerLevel || 0)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  )
}


/* 
      {Object.entries(standings).map(([div, divResults]) =>
        <div key={div} className={styles['standings-container']}>
          <div className='col-span-8 text-left text-2xl pt-6 pb-2'>
            Division {div}
          </div>
          <div className="">Pool</div>
          <div className="text-center text-nowrap">Seed</div>
          <div className="text-center text-nowrap">Dual Meets</div>
          <div className="text-center text-nowrap">Div Meets</div>
          <div className="text-center text-nowrap">Dual Rank Points</div>
          <div className="text-center text-nowrap">Div Meet Score</div>
          <div className="text-center text-nowrap">Rank Points</div>
          <div className="text-center text-nowrap">Total</div>

          {divResults.map((t, k) =>
            <>
              <div className='text-nowrap'>{t.teamName}</div>
              <div className='text-center '>{t.seed}</div>
              <div className='text-center text-nowrap'>{`${fmt(t.dualRecord.W)}-${fmt(t.dualRecord.L)}-${fmt(t.dualRecord.T)}`}</div>
              <div className='text-center text-nowrap'>{`${fmt(t.dualRecord.dW)}-${fmt(t.dualRecord.dL)}-${fmt(t.dualRecord.dT)}`}</div>
              <div className='text-center'>{fmt(t.dualMeetSeasonRank.rankPoints)}</div>
              <div className='text-right'>{fmt(t.divMeetScore, 1)}</div>
              <div className='text-center'>{fmt(t.divMeetRank.rankPoints)}</div>
              <div className='text-center'>
                {fmt(t.sumDualDivRankPoints) + ' ' + nStars(t.fullSeasonRank.tieBreakerLevel || 0)}
              </div>
            </>
          )}
        </div>
      )
      }
      */