import { fetchStandings, fetchCurrentSeasonId } from '@/app/lib/data';
import { Fragment } from 'react';
import { Table, TableThead, TableTr, TableTh, TableTd, TableTbody } from '@mantine/core';
import { notFound } from 'next/navigation';

import {SeasonSelector} from '@/app/ui/SeasonSelector';


export default async function Page(props: { searchParams: Promise<{ 'season-id': number }> }) {
  const searchParams = await props.searchParams;
  const currentSeasonId = await fetchCurrentSeasonId();

  const selectedSeasonId = searchParams['season-id'] ? Number(searchParams['season-id']) : currentSeasonId;
  const standings = await fetchStandings(selectedSeasonId);

  if (!standings) {
    notFound();
  }
  const nStars = (n: number): string => Array(n + 1).join('*')
  const fmt = (a: number | null | undefined, places?: number): string => typeof a !== 'number' ? ' ' : (places ? a.toFixed(places) : a.toString());

  return (
    <>
      <SeasonSelector base="/standings" selectedSeasonId={selectedSeasonId} />
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
                <TableTd className='text-nowrap'>{t.teamId}</TableTd>
                <TableTd className='text-center'>{t.seed}</TableTd>
                <TableTd className='text-center text-nowrap'>{`${fmt(t.dualW)}-${fmt(t.dualL)}-${fmt(t.dualT)}`}</TableTd>
                <TableTd className='text-center text-nowrap'>{`${fmt(t.dualDw)}-${fmt(t.dualDl)}-${fmt(t.dualDt)}`}</TableTd>
                <TableTd className='text-center'>{fmt(t.dualPoints)}</TableTd>
                <TableTd className='text-right pr-10'>{fmt(t.divisionalScore, 1)}</TableTd>
                <TableTd className='text-center'>{fmt(t.divisionalPoints)}</TableTd>
                <TableTd className='text-center'>
                  {fmt(t.fsTotalPoints) + ' ' + nStars(t.tieBreaker || 0)}
                </TableTd>
              </TableTr>
            )}
          </TableTbody>
        </Table>
      )}
    </>
  )
}

