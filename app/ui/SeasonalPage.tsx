import Link from 'next/link';
import { fetchSeasons } from '@/app/lib/data';
import { Menu, MenuTarget, MenuDropdown, MenuItem, Button } from '@mantine/core';
import {
  IconChevronDown,
} from '@tabler/icons-react';
import classes from './SeasonalPage.module.css';

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

const SeasonDropdown = async ({ base, selectedSeasonId }: { base: string, selectedSeasonId: number }) => {

  const sortedSeasons = (await fetchSeasons()).sort((a, b) => {
    if (a.startDate < b.startDate) return 1;
    if (a.startDate > b.startDate) return -1;
    return 0;
  });


  return (
    <Menu transitionProps={{ exitDuration: 0 }} withinPortal>
      <MenuTarget>
        <Button rightSection={<IconChevronDown size={18} stroke={1.5} />} pr={12} className={classes.button}>
          {selectedSeasonId}
        </Button>

      </MenuTarget>
      <MenuDropdown>
        {sortedSeasons.map((s, k) =>

          <MenuItem key={k}>
            <Link key={k} href={base + `?season-id=${s.id}`}>{s.id.toString()}</Link>
          </MenuItem>

        )}
      </MenuDropdown>
    </Menu>
  )
}


