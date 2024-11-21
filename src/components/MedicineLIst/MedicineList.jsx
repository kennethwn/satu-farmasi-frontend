import { Grid, Row, Table } from "rsuite";
import { Cell, Column, HeaderCell } from "rsuite-table";
import { useState } from "react";
import { formatRupiah } from "@/helpers/currency";

export default function MedicineList(props) {
    const {status, medicineList} = props;

    const getData = () => {
        console.log("getData: ", medicineList)
    }

    return(<div className="flex flex-col gap-4">
        <Table
            data={medicineList}
            bordered
            cellBordered
            shouldUpdateScroll={false}
            autoHeight
            wordWrap="break-word"
            // height={400}
            affixHorizontalScrollbar
        >
            <Column width={50} fixed="left">
                <HeaderCell className="text-center text-dark">No</HeaderCell>
                <Cell className="text-center text-dark">
                    {(rowData, index) => index + 1}
                </Cell>
            </Column>

            <Column width={250} fullText resizable sortable>
                <HeaderCell className="text-dark">Nama Obat</HeaderCell>
                <Cell>
                    {(rowData) => 
                        <Grid>
                            <Row>
                                {status === "UNPROCESSED" ? rowData?.medicineName : rowData?.medicine?.name}
                            </Row>
                            <Row>
                                {rowData.instruction}
                            </Row>
                        </Grid>
                    }
                </Cell>
            </Column>

            <Column width={75} resizable sortable>
                <HeaderCell className="text-dark">Jumlah</HeaderCell>
                <Cell dataKey='quantity'/>
            </Column>

            <Column flexGrow={1} resizable sortable>
                <HeaderCell className="text-dark">Harga Per Obat (Rp.)</HeaderCell>
                <Cell dataKey='medicine.price'>
                    {rowData => formatRupiah(rowData?.medicine?.price || rowData?.totalPrice/rowData?.quantity)}
                </Cell>
            </Column>

            <Column flexGrow={1} resizable sortable>
                <HeaderCell className="text-dark">Total Sub Harga (Rp.)</HeaderCell>
                <Cell dataKey='totalPrice'>
                    {rowData => formatRupiah(rowData?.totalPrice)}
                </Cell>
            </Column>

            {/* <Column width={225} fixed="right">
                <HeaderCell className="text-center text-dark">Instruction</HeaderCell>
                <Cell dataKey='instruction'/>
            </Column> */}
        </Table>
      </div>
    )
};
