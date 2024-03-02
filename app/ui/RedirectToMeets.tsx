import { redirect } from 'next/navigation'
import { fetchCurrentSeason } from '@/app/lib/data';
 
export const RedirectToMeets = async () => {
  const sc = await fetchCurrentSeason();
  redirect(`/meets/season/${sc.id}`); 
}

