import { Grid, Row, Table } from "rsuite";
import { Cell, Column, HeaderCell } from "rsuite-table";
import { useState } from "react";
import { formatRupiah } from "@/helpers/currency";

export default function MedicineList(props) {
    const {status, medicineList} = props;

    const getData = () => {
        console.log("getData: ", medicineList)
    }

    return (<div className="flex flex-col gap-4">
        <Table
            data={medicineList}
            bordered
            cellBordered
            shouldUpdateScroll={false}
            autoHeight={true}
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

            <Column flexGrow={4} fullText>
                <HeaderCell className="text-dark">Nama Obat</HeaderCell>
                <Cell>
                    {(rowData) => {
                        return (<div className="flex flex-col h-full">
                            <p>{rowData?.medicineName  ? rowData?.medicineName : rowData?.medicine?.name} <br /> <span className="text-gray-500">{rowData.instruction}</span></p>
                        </div>)
                        // <Grid>
                        //     <Row>
                        //         {rowData.medicine.name}
                        //     </Row>
                        //     <Row className="text-gray-500">
                        //         {rowData.instruction}
                        //     </Row>
                        // </Grid>
                    }}
                </Cell>
            </Column>

            <Column flexGrow={1}>
                <HeaderCell className="text-dark">Jumlah</HeaderCell>
                <Cell dataKey='quantity' />
            </Column>

            <Column flexGrow={2}>
                <HeaderCell className="text-dark">Harga Per Obat (Rp.)</HeaderCell>
                <Cell dataKey='medicine.price'>
                    {rowData => formatRupiah(rowData?.medicine?.price || rowData?.totalPrice/rowData?.quantity)}
                </Cell>
            </Column>

            <Column flexGrow={2} fixed="right">
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
