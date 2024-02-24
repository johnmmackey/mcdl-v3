import Button from '@mui/material/Button';
import styles from "../page.module.css";
import { fetchStandings } from '@/app/lib/data';

export default async function Standings() {
  const standings = await fetchStandings();

  const nStars = (n:number): string => {
    let r = '';
    for(let i=0; i<n; i++)
      r = r.concat('*');
    return r;
  }
  
  return (
    <main className={styles.main}>
      <table>
        {Object.entries(standings).map(([div, divResults]) =>
          <>
            <thead>
              <tr>
                <th colSpan={8}>Division {div}</th>
              </tr>
              <tr>
                <th>Pool</th>
                <th>Seed</th>
                <th>Dual Meets</th>
                <th>Div Meets</th>
                <th>Dual Rank Points</th>
                <th>Div Meet Score</th>
                <th>Rank Points</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {divResults.map(t =>
                <tr>
                  <td>{t.teamName}</td>
                  <td>{t.seed}</td>
                  <td>{`${t.dualRecord.W}-${t.dualRecord.L}-${t.dualRecord.T}`}</td>
                  <td>{`${t.dualRecord.dW}-${t.dualRecord.dL}-${t.dualRecord.dT}`}</td>
                  <td>{t.dualMeetSeasonRank.rankPoints}</td>
                  <td>{t.divMeetScore}</td>
                  <td>{t.divMeetRank.rankPoints}</td>
                  <td>
                    {t.sumDualDivRankPoints + ' ' + nStars(t.fullSeasonRank.tieBreakerLevel || 0)}
                  </td>
                </tr>
              )}
            </tbody>
          </>
        )}
      </table>
    </main >
  );
}


