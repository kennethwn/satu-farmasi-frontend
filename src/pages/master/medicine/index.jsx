import Button from "@/components/Button";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import Toaster from "@/components/Modal/Toaster";
import SearchBar from "@/components/SearchBar";
import { formatRupiah } from "@/helpers/currency";
import formatDate from "@/helpers/dayHelper";
import { useUserContext } from "@/pages/api/context/UserContext";
import useMedicineAPI from "@/pages/api/master/medicine";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { PiTrash } from "react-icons/pi";
import { toast } from "react-toastify";
import { Pagination, Table } from "rsuite";

export default function index() {
    const router = useRouter();
    const { user } = useUserContext();
    const { HeaderCell, Cell, Column } = Table;
    const { isLoading: loading, GetAllMedicines, SearchMedicine, DeleteMedicine } = useMedicineAPI(); 

    const [isLoading, setIsLoading] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState({});
    const [data, setData] = useState([]);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const handleFetchMedicines = async () => {
        try {
            const res = await GetAllMedicines(page, limit);
            console.log(res);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            }
            setData(res.data.results);
            setTotalPage(res.data.total);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSearchMedicines = async () => {
        try {
            // TODO: By Name atau By Code
            const res = await SearchMedicine(page, limit, search);
            if (res.code != 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            }
            setData(res.data.results);
            setTotalPage(res.data.total);
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteMedicine = async () => {
        try {
            const payload = { id: Number(selectedMedicine?.id) };
            const res = await DeleteMedicine(payload);
            console.log(res);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            }
            toast.success(res.message, { autoClose: 2000, position: "top-center" });
            setSelectedMedicine({});
            handleFetchMedicines();
            setModalDelete(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (search === '') {
                await handleFetchMedicines();
            } else {
                await handleSearchMedicines();
            }
        }
        fetchData();
    }, [page, limit, search]);

    return (
        <Layout active="master-medicine" user={user}>
            <ContentLayout title="List Obat">
                <div className="flex flex-row justify-end items-center w-full pb-6">
                    <SearchBar 
                        size="md"
                        className="w-1/4"
                        placeholder="Search..."
                        onChange={(value) => setSearch(value)}
                    />
                </div>
                <div className="w-full h-[500px]">
                    <Table
                        data={data || []}
                        bordered
                        cellBordered
                        shouldUpdateScroll={false}
                        affixHorizontalScrollbar
                        fillHeight={true}
                        loading={isLoading}
                    >
                        <Column width={50} fixed="left">
                            <HeaderCell className="text-center text-dark font-bold">No</HeaderCell>
                            <Cell className="text-center text-dark">
                                {(rowData, index) => index + 1}
                            </Cell>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Kode</HeaderCell>
                            <Cell dataKey='code'/>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Nama</HeaderCell>
                            <Cell dataKey='name'/>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Merk</HeaderCell>
                            <Cell dataKey='merk'/>
                        </Column>

                        <Column width={250} fullText resizable>
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
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Deskripsi</HeaderCell>
                            <Cell dataKey='description'/>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Satuan</HeaderCell>
                            <Cell dataKey='unitOfMeasure'/>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Harga</HeaderCell>
                            <Cell dataKey='price'>
                                {(rowData) => formatRupiah(rowData?.price)}    
                            </Cell>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Current Stock</HeaderCell>
                            <Cell dataKey='currStock'/>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Minimum Stock</HeaderCell>
                            <Cell dataKey='minStock'/>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Maximum Stock</HeaderCell>
                            <Cell dataKey='maxStock'/>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Tanggal Masuk</HeaderCell>
                            <Cell dataKey='created_at'>
                                {rowData => formatDate(rowData?.created_at)}
                            </Cell>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Tanggal Expired</HeaderCell>
                            <Cell dataKey='expiredDate'>
                                {rowData => formatDate(rowData?.expiredDate)}
                            </Cell>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Efek Samping</HeaderCell>
                            <Cell dataKey='sideEffect'/>
                        </Column>

                        <Column width={150} fixed="right">
                            <HeaderCell className="text-center text-dark font-bold">Action</HeaderCell>
                            <Cell className="text-center">
                                {
                                    rowData => {
                                        return (
                                            <div className="flex justify-center flex-row gap-6">
                                                <button
                                                    className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                    onClick={() => {
                                                        console.log(rowData);
                                                        router.push(`/master/medicine/edit/${rowData?.code}`)
                                                    }}
                                                >
                                                    <MdOutlineEdit 
                                                        size="2em" 
                                                        color="#FFD400" 
                                                    />
                                                </button>

                                                <button
                                                    className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                    onClick={() => {
                                                        console.log(rowData);
                                                        setSelectedMedicine(rowData);
                                                        setModalDelete(!modalDelete);
                                                    }}
                                                >
                                                    <PiTrash 
                                                        size="2em" 
                                                        color="#DC4A43" 
                                                    />
                                                </button>
                                            </div>
                                        )
                                    }
                                }
                            </Cell>
                        </Column>
                    </Table>
                    <div className="pt-4">
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
            </ContentLayout>

            <Toaster
                type="warning"
                open={modalDelete} 
                onClose={() => setModalDelete(!modalDelete)}
                body={<>Apakah anda yakin untuk menghapus data <span className="text-danger">{selectedMedicine.name}</span>?</>}
                btnText="Hapus"
                onClick={() => handleDeleteMedicine()}
            />
        </Layout>
    )
}