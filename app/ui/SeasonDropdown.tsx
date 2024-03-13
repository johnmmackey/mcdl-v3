import { SeasonDropdownCC } from './SeasonDropdownCC';

import { fetchCurrentSeason, fetchSeasons } from '@/app/lib/data';

export const SeasonDropdown = async ({ base, }: { base: string, }) => {

  const currentSeason = await fetchCurrentSeason();
  const sortedSeasons = (await fetchSeasons()).sort( (a, b) => {
    if (a.startDate < b.startDate) return 1;
    if (a.startDate > b.startDate) return -1;
    return 0;
  });

  return (
    <SeasonDropdownCC base={base} sortedSeasons={sortedSeasons} />
  )
}