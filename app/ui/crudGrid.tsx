import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    IconChevronDown,
} from '@tabler/icons-react';
import { ReactNode } from 'react';
import classes from './CrudGrid.module.css';
import Row from './CrudGridRow'

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


            <Table className={classes.striped}>
                <TableHeader>
                    <TableRow>

                        {   renderHeader && renderHeader()}
                        </TableRow>
                </TableHeader>
                <TableBody>
                    {(sorter ? resources.sort(sorter) : resources).map((r, k) =>
                        <Row key={k} renderedRow={renderRow(r)} />
                    )}
                </TableBody>
            </Table>
        </>
    )
}

/*
            <Container className={classes.striped}>
                {(sorter ? resources.sort(sorter) : resources).map((r, k) =>



                    <Grid key={k} className={classes.item} columns={14}>

                        {
                            renderRow(r)
                        }
                        <GridCol span={1} key={99}>
                            <div className={classes.actionGroupBox}>
                                <Button variant="default" size='xs'>First</Button>
                                <Button variant="default" size='xs'>Second</Button>
                                <Button variant="default" size='xs'>Third</Button>
                            </div>
                        </GridCol>
                    </Grid>


                )}

            </Container>

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