import { fetchStandings, fetchCurrentSeasonId } from '@/app/lib/data';
import { Fragment } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { notFound } from 'next/navigation';

import { SeasonSelector } from '@/app/ui/SeasonSelector';


export default async function Page(props: { searchParams: Promise<{ 'season-id'?: string, debug?: string }> }) {
  const searchParams = await props.searchParams;
  const currentSeasonId = await fetchCurrentSeasonId();

  const selectedSeasonId = searchParams['season-id'] ? Number(searchParams['season-id']) : currentSeasonId;
  const debug = !!searchParams['debug']
  const standings = await fetchStandings(selectedSeasonId);

  if (!standings) {
    notFound();
  }
  const nStars = (n: number): string => Array(n + 1).join('*')
  const fmt = (a: number, places?: number): string => (places ? a.toFixed(places) : a.toString());

  return (
    <>
      <SeasonSelector base="/standings" selectedSeasonId={selectedSeasonId} />
      {Object.entries(standings).map(([div, divResults]) =>
        <Table key={div} className="mb-4">
          <TableHeader>
            <TableRow>
              <TableHead colSpan={8} className='text-left text-2xl pt-6 pb-2'>Division {div}</TableHead>
            </TableRow>

            <TableRow>
              <TableHead className='px-2'>Pool</TableHead>
              <TableHead className="px-2">Seed</TableHead>
              <TableHead className="px-2">Dual Meets</TableHead>
              <TableHead className="px-2">Div Meets</TableHead>
              <TableHead className="px-2">Dual Rank Points</TableHead>
              <TableHead className="px-2">Div Meet Score</TableHead>
              <TableHead className="px-2">Rank Points</TableHead>
              <TableHead className="px-2">Total</TableHead>
            </TableRow>

          </TableHeader>
          <TableBody>
            {divResults.map((t, k) =>
              <TableRow key={k} >
                <TableCell className='text-nowrap'>{t.teamId}</TableCell>
                <TableCell className='text-center'>{t.seed}</TableCell>
                <TableCell className='text-center text-nowrap'>{`${fmt(t.dualW)}-${fmt(t.dualL)}-${fmt(t.dualT)}`}</TableCell>
                <TableCell className='text-center text-nowrap'>{`${fmt(t.dualDW)}-${fmt(t.dualDL)}-${fmt(t.dualDT)}`}</TableCell>
                {t.seasonComplete || debug
                  ? <>
                    <TableCell className='text-center'>{fmt(t.dualRankPoints)}</TableCell>
                    <TableCell className='text-right pr-10'>{fmt(t.divScore, 1)}</TableCell>
                    <TableCell className='text-center'>{fmt(t.divRankPoints)}</TableCell>
                    <TableCell className='text-center'>
                      {fmt(t.fsTotalPoints) + ' ' + nStars(t.fsTieBreaker || 0)}
                    </TableCell>
                  </>
                  : <>
                    <TableCell className='text-center' colSpan={5}></TableCell>
                  </>
                }
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  )
}

