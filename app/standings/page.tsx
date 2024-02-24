import Button from '@mui/material/Button';
import { fetchStandings } from '@/app/lib/data';
import { Fragment } from 'react';

export default async function Standings() {
  const standings = await fetchStandings();

  const nStars = (n:number): string => {
    let r = '';
    for(let i=0; i<n; i++)
      r = r.concat('*');
    return r;
  }
  
  return (
      <table>
        {Object.entries(standings).map(([div, divResults]) =>
          <Fragment key={div}>
            <thead>
              <tr>
                <th colSpan={8}>Division {div}</th>
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
              {divResults.map( (t, k) =>
                <tr key={k}>
                  <td>{t.teamName}</td>
                  <td className='text-center'>{t.seed}</td>
                  <td className='text-center'>{`${t.dualRecord.W}-${t.dualRecord.L}-${t.dualRecord.T}`}</td>
                  <td className='text-center'>{`${t.dualRecord.dW}-${t.dualRecord.dL}-${t.dualRecord.dT}`}</td>
                  <td className='text-center'>{t.dualMeetSeasonRank.rankPoints}</td>
                  <td className='text-center'>{t.divMeetScore}</td>
                  <td className='text-center'>{t.divMeetRank.rankPoints}</td>
                  <td className='text-center'>
                    {t.sumDualDivRankPoints + ' ' + nStars(t.fullSeasonRank.tieBreakerLevel || 0)}
                  </td>
                </tr>
              )}
            </tbody>
          </Fragment>
        )}
      </table>
  );
}


