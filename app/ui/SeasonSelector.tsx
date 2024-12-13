import Link from 'next/link';
import { fetchSeasons } from '@/app/lib/data';
import { Menu, MenuTarget, MenuDropdown, MenuItem, Button } from '@mantine/core';
import {
  IconChevronDown,
} from '@tabler/icons-react';
import classes from './SeasonalPage.module.css';

export const SeasonSelector = async ({
  base,
  selectedSeasonId,
  children,
}: Readonly<{
  base: string,
  selectedSeasonId: number,
  children?: React.ReactNode
}>) => {

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
            <Link key={k} href={base + `?season-id=${s.id}`}><div className="w-32 text-center">{s.id.toString()}</div></Link>
          </MenuItem>

        )}
      </MenuDropdown>
    </Menu>
  )

}

