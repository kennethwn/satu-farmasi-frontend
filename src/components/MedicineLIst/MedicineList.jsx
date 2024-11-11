import { Grid, Row, Table } from "rsuite";
import { Cell, Column, HeaderCell } from "rsuite-table";
import { useState } from "react";
import { formatRupiah } from "@/helpers/currency";

export default function MedicineList(props) {
    const {medicineList} = props;
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([])
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();

    const getData = () => {
        console.log("getData:", medicineList)
        let data = medicineList.filter((value, index) => {
            const start = limit * (page - 1);
            const end = start + limit;
            return index >= start && index < end
        })
        .sort((a, b) => {
            if (sortColumn && sortType) {
                let x = a[sortColumn]?.toString();
                let y = b[sortColumn]?.toString();
                return sortType === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
            }
        })

        if (filter) {
            data = data.filter((value) => value.status === filter);
        }
        
        return data;
    }

    return(<div className="flex flex-col gap-4">
        <Table
            data={getData()}
            bordered
            cellBordered
            shouldUpdateScroll={false}
            autoHeight
            wordWrap="break-word"
            // height={400}
            affixHorizontalScrollbar
            sortColumn={sortColumn}
            sortType={sortType}
        >
            <Column width={50} fixed="left">
                <HeaderCell className="text-center text-dark">No</HeaderCell>
                <Cell className="text-center text-dark">
                    {(rowData, index) => index + 1}
                </Cell>
            </Column>

            <Column flexGrow={2} fullText resizable>
                <HeaderCell className="text-dark">Nama Obat</HeaderCell>
                <Cell>
                    {(rowData) => {
                        return (
                            <div className="flex flex-col">
                                <p>{rowData.medicine.name}</p>
                                <p>{rowData.instruction}</p>
                            </div>
                        )
                    }}
                        {/* // <Grid>
                        //     <Row>
                        //         {rowData.medicine.name}
                        //     </Row>
                        //     <Row className="text-gray-500">
                        //         {rowData.instruction}
                        //     </Row>
                        // </Grid>
                    // } */}
                </Cell>
            </Column>

            <Column width={75} resizable sortable>
                <HeaderCell className="text-dark">Jumlah</HeaderCell>
                <Cell dataKey='quantity'/>
            </Column>

            <Column flexGrow={1} resizable sortable>
                <HeaderCell className="text-dark">Harga Per Obat (Rp.)</HeaderCell>
                <Cell dataKey='medicine.price'>
                    {rowData => formatRupiah(rowData?.medicine?.price)}
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
