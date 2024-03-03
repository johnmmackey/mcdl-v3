import { redirect } from 'next/navigation'
import { fetchCurrentSeason } from '@/app/lib/data';

export default async function Page() {
  const sc = await fetchCurrentSeason();
  redirect(`/standings/${sc.id}`);
}

