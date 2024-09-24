import { Table } from "rsuite";
import { Cell, Column, HeaderCell } from "rsuite-table";
import { useState } from "react";

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
        <p>Medicine List: </p>
        <Table
            data={getData()}
            bordered
            cellBordered
            shouldUpdateScroll={false}
            height={400}
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

            <Column width={200} resizable sortable>
                <HeaderCell className="text-dark">Nama Obat</HeaderCell>
                <Cell dataKey='medicine.name'/>
            </Column>

            <Column width={75} resizable sortable>
                <HeaderCell className="text-dark">Jumlah</HeaderCell>
                <Cell dataKey='quantity'/>
            </Column>

            <Column width={175} resizable sortable>
                <HeaderCell className="text-dark">Harga Per Obat (Rp.)</HeaderCell>
                <Cell dataKey='medicine.price'/>
            </Column>

            <Column width={175} resizable sortable>
                <HeaderCell className="text-dark">Total Sub Harga (Rp.)</HeaderCell>
                <Cell dataKey='totalPrice'/>
            </Column>

            <Column width={225} fixed="right">
                <HeaderCell className="text-center text-dark">Instruction</HeaderCell>
                <Cell dataKey='instruction'/>
            </Column>
        </Table>
      </div>
    )
};