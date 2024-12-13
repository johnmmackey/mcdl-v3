import { fetchStandings, fetchCurrentSeason } from '@/app/lib/data';
import { Fragment } from 'react';
import { Table, TableThead, TableTr, TableTh, TableTd, TableTbody } from '@mantine/core';
import { notFound } from 'next/navigation';

import { SeasonalPage } from '@/app/ui/SeasonalPage';


export default async function Page(props: { searchParams: Promise<{ 'season-id': number }> }) {
  const searchParams = await props.searchParams;
  const currentSeason = await fetchCurrentSeason();

  const selectedSeasonId = searchParams['season-id'] ? Number(searchParams['season-id']) : currentSeason.id;
  const standings = await fetchStandings(selectedSeasonId);
  if (!standings) {
    notFound();
  }
  const nStars = (n: number): string => Array(n + 1).join('*')
  const fmt = (a: number | null, places?: number): string => a === null ? '' : (places ? a.toFixed(places) : a.toString());

  return (
    <SeasonalPage base="/standings" selectedSeasonId={selectedSeasonId}>
      {Object.entries(standings).map(([div, divResults]) =>
        <Table key={div} striped className="mb-4">
          <TableThead>
            <TableTr>
              <TableTh colSpan={8} className='text-left text-2xl pt-6 pb-2'>Division {div}</TableTh>
            </TableTr>

            <TableTr>
              <TableTh className='px-2'>Pool</TableTh>
              <TableTh className="px-2">Seed</TableTh>
              <TableTh className="px-2">Dual Meets</TableTh>
              <TableTh className="px-2">Div Meets</TableTh>
              <TableTh className="px-2">Dual Rank Points</TableTh>
              <TableTh className="px-2">Div Meet Score</TableTh>
              <TableTh className="px-2">Rank Points</TableTh>
              <TableTh className="px-2">Total</TableTh>
            </TableTr>

          </TableThead>
          <TableTbody>
            {divResults.map((t, k) =>
              <TableTr key={k} className="hover:bg-slate-400 hover:text-white">
                <TableTd className='text-nowrap'>{t.teamName}</TableTd>
                <TableTd className='text-center'>{t.seed}</TableTd>
                <TableTd className='text-center text-nowrap'>{`${fmt(t.dualRecord.W)}-${fmt(t.dualRecord.L)}-${fmt(t.dualRecord.T)}`}</TableTd>
                <TableTd className='text-center text-nowrap'>{`${fmt(t.dualRecord.dW)}-${fmt(t.dualRecord.dL)}-${fmt(t.dualRecord.dT)}`}</TableTd>
                <TableTd className='text-center'>{fmt(t.dualMeetSeasonRank.rankPoints)}</TableTd>
                <TableTd className='text-right pr-10'>{fmt(t.divMeetScore, 1)}</TableTd>
                <TableTd className='text-center'>{fmt(t.divMeetRank.rankPoints)}</TableTd>
                <TableTd className='text-center'>
                  {fmt(t.sumDualDivRankPoints) + ' ' + nStars(t.fullSeasonRank.tieBreakerLevel || 0)}
                </TableTd>
              </TableTr>
            )}
          </TableTbody>
        </Table>
      )}
    </SeasonalPage >
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