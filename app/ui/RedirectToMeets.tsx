import { redirect } from 'next/navigation'
import { fetchCurrentSeasonId } from '@/app/lib/api';
 
export const RedirectToMeets = async () => {
  const csId = await fetchCurrentSeasonId();
  redirect(`/meets/season/${csId}`); 
}

