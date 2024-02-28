import { redirect } from 'next/navigation'
import { fetchCurrentSeason } from '@/app/lib/data';
 
export default async function Standing() {
  const sc = await fetchCurrentSeason();
  redirect(`/standings/${sc.season_id}`);
}

