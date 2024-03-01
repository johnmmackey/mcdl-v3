import { redirect } from 'next/navigation'
import { fetchCurrentSeason } from '@/app/lib/data';
 
export default async function Meet() {
  const sc = await fetchCurrentSeason();
  redirect(`/meets/${sc}`); 
}

