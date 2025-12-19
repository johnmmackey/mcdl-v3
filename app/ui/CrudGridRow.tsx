'use client'

import { Container, Grid, GridCol, Popover, PopoverDropdown, PopoverTarget, Overlay, Menu, MenuTarget, MenuDropdown, MenuItem, Button, Group, Table, TableTr, TableTd } from '@mantine/core';
import {
    IconChevronDown,
} from '@tabler/icons-react';
import { ReactNode } from 'react';
import classes from './CrudGrid.module.css';



export default function Row<T>(props: {renderedRow: ReactNode} ) {
    return (
        <TableTr className={classes.item} onClick={() => alert('alert me')}>
            {props.renderedRow}
        </TableTr>
    )
}