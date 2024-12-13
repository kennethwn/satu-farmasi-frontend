import { formatRupiah } from "@/helpers/currency";
import formatDate, { formatDateWithTime } from "@/helpers/dayHelper";
import { resolveStatusStockMedicine } from "@/helpers/resolveStatus";
import { useRouter } from "next/router";
import { Pagination, Table, Tooltip, Whisper } from "rsuite";
import SearchBar from "../SearchBar";
import { MdOutlineEdit } from "react-icons/md";
import { PiTrash } from "react-icons/pi";

export default function MasterMedicineList(props) {
    const {
        data,
        isLoading,
        allowEdit,
        setSelectedMedicine,
        setModalDelete,
        allowDeleteData,
        totalPage,
        limit,
        page,
        setLimit,
        setPage,
        setSearch,
        isMaster,
        setSortMode,
        setSortBy,
        sortBy,
        sortMode,
    } = props;

    const router = useRouter();
    const { Column, HeaderCell, Cell } = Table;

    const handleSortColumn = (sortColumn, sortType) => {
        console.log("sort column", sortColumn);
        console.log("sort type", sortType);
        setSortBy(sortColumn);
        setSortMode(sortType);
    };

    const renderTooltip = (content) => (
        <Tooltip>
            {content}
        </Tooltip>
    )

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center w-full pb-6">
                <div>
                    {isMaster ?
                        <span>*Rekomendasi restock untuk <span className="text-red-500">1 tahun</span></span>
                        : <span>*List obat berdasarkan <span className="text-red-500">batch</span> dan <span className="text-red-500">expired date</span></span>
                    }
                </div>
                <SearchBar 
                    size="md"
                    className="w-1/4"
                    placeholder="Search..."
                    onChange={(value) => setSearch(value)}
                />
            </div>
            <Table
                data={data || []}
                bordered
                cellBordered
                autoHeight
                shouldUpdateScroll={false}
                affixHorizontalScrollbar
                loading={isLoading}
                sortType={sortMode}
                sortColumn={sortBy}
                onSortColumn={handleSortColumn}
            >
                <Column width={50} fixed="left">
                    <HeaderCell className="text-center text-dark font-bold">No</HeaderCell>
                    <Cell className="text-center text-dark">
                        {(rowData, index) => index + 1}
                    </Cell>
                </Column>

                <Column width={250} sortable fullText resizable>
                    <HeaderCell className="text-dark font-bold">Kode</HeaderCell>
                    <Cell dataKey='code'/>
                </Column>

                <Column width={250} sortable fullText resizable>
                    <HeaderCell className="text-dark font-bold">Nama</HeaderCell>
                    <Cell dataKey='name'/>
                </Column>

                <Column width={250} sortable fullText resizable>
                    <HeaderCell className="text-dark font-bold">Merek</HeaderCell>
                    <Cell dataKey='merk'/>
                </Column>

                {/* <Column width={250} fullText resizable>
                    <HeaderCell className="text-dark font-bold">Generik</HeaderCell>
                    <Cell>
                        {(rowData) => rowData?.genericName?.label}
                    </Cell>
                </Column>

                <Column width={250} fullText resizable>
                    <HeaderCell className="text-dark font-bold">Kemasan</HeaderCell>
                    <Cell>
                        {(rowData) => rowData?.packaging?.label}
                    </Cell>
                </Column> */}

                <Column width={250} sortable fullText resizable>
                    <HeaderCell className="text-dark font-bold">Deskripsi</HeaderCell>
                    <Cell dataKey='description'/>
                </Column>

                <Column width={250} sortable fullText resizable>
                    <HeaderCell className="text-dark font-bold">Satuan</HeaderCell>
                    <Cell dataKey='unitOfMeasure'/>
                </Column>

                <Column width={250} fullText resizable>
                    <HeaderCell className="text-dark font-bold">Harga</HeaderCell>
                    <Cell dataKey='price'>
                        {(rowData) => formatRupiah(rowData?.price)}    
                    </Cell>
                </Column>

                <Column width={250} sortable fullText resizable>
                    <HeaderCell className="text-dark font-bold">Stok Sekarang</HeaderCell>
                    <Cell dataKey='currStock'/>
                </Column>

                <Column width={250} sortable fullText resizable>
                    <HeaderCell className="text-dark font-bold">Stok Minimum</HeaderCell>
                    <Cell dataKey='minStock'/>
                </Column>

                <Column width={250} sortable fullText resizable>
                    <HeaderCell className="text-dark font-bold">Stok Maksimum</HeaderCell>
                    <Cell dataKey='maxStock'/>
                </Column>

                <Column width={250} sortable fullText resizable>
                    <HeaderCell className="text-dark font-bold">Tanggal Masuk</HeaderCell>
                    <Cell dataKey='created_at'>
                        {rowData => formatDate(rowData?.created_at)}
                    </Cell>
                </Column>

                <Column width={250} sortable fullText resizable>
                    <HeaderCell className="text-dark font-bold">Tanggal Expired</HeaderCell>
                    <Cell dataKey='expiredDate'>
                        {rowData => formatDateWithTime(rowData?.expiredDate)}
                    </Cell>
                </Column>

                <Column width={250} sortable fullText resizable>
                    <HeaderCell className="text-dark font-bold">Efek Samping</HeaderCell>
                    <Cell dataKey='sideEffect'/>
                </Column>

                {isMaster &&
                    <>
                        <Column width={150} sortable fixed="right" resizable>
                            <HeaderCell className="text-dark font-bold">Status Stok</HeaderCell>
                            <Cell dataKey='status_stock'>
                                {rowData => resolveStatusStockMedicine(rowData?.lowStock)}
                            </Cell>
                        </Column>

                        <Column width={180} sortable fixed="right" resizable>
                            <HeaderCell className="text-dark font-bold">Rekomendasi Restock</HeaderCell>
                            <Cell dataKey='recommendedRestock' className="items-center">
                                {rowData => {
                                    return (
                                        <span className="text-red-500 text-center">{rowData?.recommendedRestock} items</span>
                                    )
                                }}
                            </Cell>
                        </Column>

                        <Column width={100} fixed="right">
                            <HeaderCell className="text-center text-dark font-bold">Aksi</HeaderCell>
                            <Cell className="text-center" style={{ padding: '6px' }}>
                                {
                                    rowData => {
                                        return (
                                            <div className="flex justify-center flex-row gap-6">
                                                {allowEdit &&
                                                    <Whisper speaker={renderTooltip("Edit")} placement="top" controlId="control-id-hover" trigger="hover">
                                                        <button
                                                            className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                            onClick={() => {
                                                                console.log(rowData);
                                                                router.push(`/master/medicine/edit/${rowData?.code}`)
                                                            }}
                                                        >
                                                            <MdOutlineEdit size="2em" color="#FFD400" />
                                                        </button>
                                                    </Whisper>
                                                }

                                                {allowDeleteData &&
                                                    <Whisper speaker={renderTooltip("Hapus")} placement="top" controlId="control-id-hover" trigger="hover">
                                                        <button
                                                            className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                            onClick={() => {
                                                                console.log(rowData);
                                                                setSelectedMedicine(rowData);
                                                                setModalDelete(true);
                                                            }}
                                                        >
                                                            <PiTrash 
                                                                size="2em" 
                                                                color="#DC4A43" 
                                                            />
                                                        </button>
                                                    </Whisper>
                                                }
                                            </div>
                                        )
                                    }
                                }
                            </Cell>
                        </Column>
                    </>
                }
            </Table>
            <div className="py-4">
                <Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    boundaryLinks
                    maxButtons={5}
                    size="xs"
                    layout={["total", "-", "limit", "|", "pager"]}
                    total={totalPage || 0}
                    limitOptions={[5, 10, 15]}
                    limit={limit}
                    activePage={page}
                    onChangePage={page => setPage(page)}
                    onChangeLimit={limit => setLimit(limit)}
                />
            </div>
        </div>
    )
}
