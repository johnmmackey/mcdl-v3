
import arraySort from 'array-sort';
import { getCurrentSeason, getMeets } from '@/app/lib/dbData'

export const dynamic = 'error';
export const revalidate = 60;

export default async function Test() {
    const season = await getCurrentSeason();
    const meets = await getMeets(season);
//console.log(meets[10].get({plain:true}));
    const sortedMeets = arraySort(meets, ['meetDate', 'division']);
    let lastMeetDate = '';

    const dateFmt = (d: string) => (new Date(d)).toLocaleDateString();
    const meetName = (m: any) => m.name || (`${m.visitingPoolFull?.name} at ${m.hostPoolFull?.name}`);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <td>Date</td>
                        <td>Division</td>
                        <td>Meet Name</td>
                        <td>Score</td>
                    </tr>
                </thead>
                <tbody>
                    {sortedMeets.map((m, k) =>
                        <tr key={k}>
                            <td>{dateFmt(m.meetDate)}</td>
                            <td>{m.division}</td>
                            <td>{meetName(m)}</td>
                            <td>Score</td>
                        </tr>
                    )}


                </tbody>
            </table>
        </div>
    )
}

