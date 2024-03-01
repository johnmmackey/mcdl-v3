import Link from 'next/link';
import { Dropdown, DropdownItem } from 'flowbite-react';

const BASEYEAR = 2010;
const currentYear = (new Date()).getFullYear(); // FIX - need to deal with 'current season' issue
const years: number[] = [];

for (let year = currentYear; year >= BASEYEAR; year--)
  years.push(year);

export const SeasonDropdown = ({ base, label }: { base: string, label?: string }) => {
  return (
    <Dropdown dismissOnClick={false} label={label || "Other Seasons"} size="sm">
      {years.map((y, k) =>
        <DropdownItem key={k} as={Link} href={base + `/${y}`}>
          {y}
        </DropdownItem>
      )}
    </Dropdown>
  );
}