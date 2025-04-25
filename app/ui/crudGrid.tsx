import { Grid, GridCol, Menu, MenuTarget, MenuDropdown, MenuItem, Button } from '@mantine/core';
import {
    IconChevronDown,
} from '@tabler/icons-react';
import { ReactNode } from 'react';
//import classes from './SeasonalPage.module.css';

async function CrudGrid<T>({
    resources,
    sorter,
    renderRow
}: Readonly<{
    resources: T[]
    sorter: (a: T, b: T) => number,
    renderRow: (row: T) => ReactNode
}>) {

    return (
        <>
            {(sorter ? resources.sort(sorter) : resources).map(r =>
                <Grid>
                    {renderRow(r)}

                </Grid>
            )}
        </>
    )
}

