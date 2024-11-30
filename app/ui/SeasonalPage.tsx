import Link from 'next/link';
import { Dropdown, DropdownItem } from 'flowbite-react';
import { fetchSeasons } from '@/app/lib/data';

export const SeasonalPage = function ({
  heading,
  base,
  selectedSeasonId,
  children,
}: Readonly<{
  heading: string,
  base: string,
  selectedSeasonId: number,
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl text-bold mb-1">{heading}</h1>
      <SeasonDropdown base={base} selectedSeasonId={selectedSeasonId} />
      <div className="mt-8">
        {children}
      </div>
    </div>
  );
}



const SeasonDropdown = async ({ base, selectedSeasonId}: { base: string, selectedSeasonId: number}) => {

  const sortedSeasons = (await fetchSeasons()).sort( (a, b) => {
    if (a.startDate < b.startDate) return 1;
    if (a.startDate > b.startDate) return -1;
    return 0;
  });

  return (
    <Dropdown
      dismissOnClick={true}
      label={selectedSeasonId}
      size="xs"
    >
      {sortedSeasons.map((s, k) =>
        <Link key={k} href={base + `?season-id=${s.id}`}>
          <DropdownItem>
            {s.id.toString()}
          </DropdownItem>
        </Link>
      )}
    </Dropdown>
  )
}


