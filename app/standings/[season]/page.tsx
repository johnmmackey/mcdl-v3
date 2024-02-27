import { fetchStandings } from '@/app/lib/data';
import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { SeasonDropdown } from '@/app/ui/SeasonDropdown';

export default async function Standings({ params }: { params: { season: string } }) {
  const standings = await fetchStandings(params.season);
  if (!standings) {
    notFound();
  }
  const nStars = (n: number): string => Array(n + 1).join('*')
  const fmt = (a: number | null, places?: number): string => a === null ? '' : (places ? a.toFixed(places) : a.toString());

  return (
    <div>
      <h1 className="text-center text-2xl text-bold">{params.season} Divisional Standings</h1>
      <div className="flex justify-center">
        <SeasonDropdown base="/standings" currentSeason={params.season} />
      </div>
      <table>
        {Object.entries(standings).map(([div, divResults]) =>
          <Fragment key={div}>
            <thead>
              <tr>
                <th colSpan={8} className='text-left text-2xl pt-6 pb-2'>Division {div}</th>
              </tr>
              <tr>
                <th className='w-64'>Pool</th>
                <th className="px-3">Seed</th>
                <th className="px-3">Dual Meets</th>
                <th className="px-3">Div Meets</th>
                <th className="px-3">Dual Rank Points</th>
                <th className="px-3">Div Meet Score</th>
                <th className="px-3">Rank Points</th>
                <th className="px-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {divResults.map((t, k) =>
                <tr key={k}>
                  <td>{t.teamName}</td>
                  <td className='text-center'>{t.seed}</td>
                  <td className='text-center'>{`${fmt(t.dualRecord.W)}-${fmt(t.dualRecord.L)}-${fmt(t.dualRecord.T)}`}</td>
                  <td className='text-center'>{`${fmt(t.dualRecord.dW)}-${fmt(t.dualRecord.dL)}-${fmt(t.dualRecord.dT)}`}</td>
                  <td className='text-center'>{fmt(t.dualMeetSeasonRank.rankPoints)}</td>
                  <td className='text-right pr-10'>{fmt(t.divMeetScore, 1)}</td>
                  <td className='text-center'>{fmt(t.divMeetRank.rankPoints)}</td>
                  <td className='text-center'>
                    {fmt(t.sumDualDivRankPoints) + ' ' + nStars(t.fullSeasonRank.tieBreakerLevel || 0)}
                  </td>
                </tr>
              )}
            </tbody>
          </Fragment>
        )}
      </table>
    </div>
  );
}


