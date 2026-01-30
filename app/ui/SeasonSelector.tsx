import Link from 'next/link';
import { fetchSeasons } from '@/app/lib/api';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  IconChevronDown,
} from '@tabler/icons-react';

export const SeasonSelector = async ({
  base,
  selectedSeasonId
}: Readonly<{
  base: string,
  selectedSeasonId: number,
}>) => {

  const sortedSeasons = (await fetchSeasons()).sort((a, b) => {
    if (a.safeStartDate < b.safeStartDate) return 1;
    if (a.safeStartDate > b.safeStartDate) return -1;
    return 0;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>
          {selectedSeasonId} <IconChevronDown size={18} stroke={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {sortedSeasons.map((s) =>
              <DropdownMenuItem key={s.id} asChild>
                <Link href={base + `?season-id=${s.id}`}><div className="w-32 text-center">{s.id.toString()}</div></Link>
              </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )

}

