'use client'

import { TableRow } from '@/components/ui/table';
import {
    IconChevronDown,
} from '@tabler/icons-react';
import { ReactNode } from 'react';
import classes from './CrudGrid.module.css';



export default function Row<T>(props: {renderedRow: ReactNode} ) {
    return (
        <TableRow className={classes.item} onClick={() => alert('alert me')}>
            {props.renderedRow}
        </TableRow>
    )
}