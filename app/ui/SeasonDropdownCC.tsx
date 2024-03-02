'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dropdown, DropdownItem } from 'flowbite-react';
import { Season } from '@/app/lib/definitions'

export const SeasonDropdownCC = ({
  base, sortedSeasons
}:{
  base: string, sortedSeasons:Season[]
}) => {

  const pathName = usePathname();

  return (
    <Dropdown
      dismissOnClick={false}
      label={(sortedSeasons.find(e => e.id === Number(pathName.substring(base.length + 1)))?.name) || "Season"}
      size="sm"
    >
      {sortedSeasons.map((s, k) =>
        <Link key={k} href={base + `/${s.id}`}>
          <DropdownItem>
            {s.name}
          </DropdownItem>
        </Link>
      )}
    </Dropdown>
  );
}