import { Container, Grid, GridCol, Popover, PopoverDropdown, PopoverTarget, Overlay, Menu, MenuTarget, MenuDropdown, MenuItem, Button } from '@mantine/core';
import {
    IconChevronDown,
} from '@tabler/icons-react';
import { ReactNode } from 'react';
import classes from './CrudGrid.module.css';

export default async function CrudGrid<T>({
    resources,
    sorter,
    renderHeader,
    renderRow
}: Readonly<{
    resources: T[]
    sorter?: (a: T, b: T) => number,
    renderHeader?: () => ReactNode,
    renderRow: (row: T) => ReactNode
}>) {

    return (
        <>
            <Grid>
                {renderHeader && renderHeader()}
            </Grid>
            <Container className={classes.striped}>
                {(sorter ? resources.sort(sorter) : resources).map((r, k) =>

                    <Popover key={k} position='bottom' width='target' offset={-50}>
                        <PopoverTarget>

                            <Grid className={classes.item}>
                                <div className={classes.test}>
                                    <div className={classes.menuItem}>
                                        <Button>test</Button>
                                    </div>
                                    <div className={classes.menuItem}>
                                        <Button>test2</Button>
                                    </div>
                                </div>
                                {
                                    renderRow(r)
                                }
                            </Grid>
                        </PopoverTarget>
                        <PopoverDropdown>
                            <Button size='xs'>Button</Button>
                        </PopoverDropdown>
                    </Popover>

                )}

            </Container>
        </>
    )
}
/*
'use client'
function CrudInlineToolBar ({

}: Readonly<{

}>) {

    return (
        <>
            <Grid>
                {renderHeader && renderHeader()}
            </Grid>
            <Container className={classes.striped}>
                {(sorter ? resources.sort(sorter) : resources).map((r, k) =>
                    <Grid key={k} className={classes.item}>
                        {
                            renderRow(r)
                        }
                    </Grid>
                )}

            </Container>
        </>
    )
}*/