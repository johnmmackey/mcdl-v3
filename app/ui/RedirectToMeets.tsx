import { redirect } from 'next/navigation'
import { fetchCurrentSeasonId } from '@/app/lib/data';
 
export const RedirectToMeets = async () => {
  const csId = await fetchCurrentSeasonId();
  redirect(`/meets/season/${csId}`); 
}

