import Button from "@/components/Button";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import Toaster from "@/components/Modal/Toaster";
import SearchBar from "@/components/SearchBar";
import { useUserContext } from "@/pages/api/context/UserContext";
import useExpenseMedicineAPI from "@/pages/api/transaction/expenseMedicine";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { PiTrash } from "react-icons/pi";
import { Pagination, SelectPicker, Table } from "rsuite";
import { toast } from "react-toastify";
import formatCalendar from "@/helpers/dayHelper";

export default function Index() {
    const { user } = useUserContext();
    const { HeaderCell, Cell, Column } = Table;
    const { isLoading, GetAllMedicine, GetMedicineByParams, DeleteMedicine } = useExpenseMedicineAPI();
    const status = ["LOST", "EXPIRED", "BROKEN"];
    const [filter, setFilter] = useState('');

    const [data, setData] = useState([]);
    const [editInput, setEditInput] = useState({});
    const [open, setOpen] = useState({
        create: false,
        edit: false,
        delete: false,
    });
    const [search, setSearch] = useState({
        q: "",
        filter: "",
    });

    const router = useRouter();
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const HandleFetchMedicineData = async () => {
        try {
            const res = await GetAllMedicine(page, limit);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            }
            res.data.results.map(item => { item.created_at = formatCalendar(item.created_at); })
            console.log(res.data.results);
            setData(res.data.results);
            setTotalPage(res.data.total);
        } catch (error) {
            console.error(error);
        }
    };

    const HandleFetchMedicineByParams = async () => {
        try {
            const res = await GetMedicineByParams(search);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            }
            res?.data.results.map(item => { item.created_at = formatCalendar(item.created_at); })
            setData(res?.data.results);
            setTotalPage(res.data.total);
        } catch (error) {
            console.error(error);
        }
    };

    const HandleDeleteMedicine = async () => {
        try {
            setEditInput({ ...editInput, is_active: false });
            const res = await DeleteMedicine(editInput);
            if (res.code !== 200) {
                toast.error(res.message, {
                    autoClose: 2000,
                    position: "top-right",
                });
                return;
            }
            toast.success(res.message, {
                autoClose: 2000,
                position: "top-right",
            });
            setOpen({ ...open, create: false, edit: false, delete: false });
            HandleFetchMedicineData();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            if (search.q === "" && search.filter === "") {
                await HandleFetchMedicineData();
            } else {
                await HandleFetchMedicineByParams();
            }
        }
        fetchData();
    }, [page, limit, search]);

    return (
        <Layout active="master-expense" user={user}>
            <ContentLayout title="List Pengeluaran Obat">
                <div className="flex flex-col gap-2 md:flex-row justify-between w-full">
                    <div>
                        <Button
                            prependIcon={<IoMdAdd size={24} />}
                            onClick={() => router.push(`/transaction/expense/create`)}
                        >
                            Tambah
                        </Button>
                    </div>
                    <div className="flex md:flex-row flex-col gap-4">
                        <SelectPicker
                            style={{
                                // borderWidth: '0.5px',     
                                color: '#DDDDDD',
                                borderColor: '#DDDDDD',
                                // borderRadius: '0.4rem',
                            }}
                            label="Status"
                            data={status.map((status) => ({ label: status, value: status }))}
                            value={filter}
                            onChange={value => {
                                setSearch({ ...search, filter: value }),
                                    setFilter(value)
                            }}
                        />
                        <SearchBar
                            size="md"
                            placeholder="Search..."
                            onChange={value => setSearch({ ...search, q: value })}
                        />
                    </div>
                </div>
                <div className="w-full pt-6">
                    <Table
                        data={data || []}
                        bordered
                        cellBordered
                        shouldUpdateScroll={false}
                        height={400}
                        affixHorizontalScrollbar
                        loading={isLoading}
                    >
                        <Column width={100} fixed="left">
                            <HeaderCell className="text-center text-dark font-bold">
                                No
                            </HeaderCell>
                            <Cell className="text-center text-dark">
                                {(rowData, index) => index + 1}
                            </Cell>
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark font-bold">
                                Nama Obat
                            </HeaderCell>
                            <Cell dataKey="medicine.name" />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark font-bold">
                                Jumlah Keluar
                            </HeaderCell>
                            <Cell dataKey="quantity" />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark font-bold">
                                Stock Obat Sekarang
                            </HeaderCell>
                            <Cell dataKey="medicine.currStock" />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark font-bold">
                                Penyebab Keluar
                            </HeaderCell>
                            <Cell dataKey="reasonOfDispose" />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark font-bold">
                                Tanggal Keluar
                            </HeaderCell>
                            <Cell dataKey="created_at" />
                        </Column>

                        <Column width={150} fixed="right">
                            <HeaderCell className="text-center text-dark font-bold">
                                Action
                            </HeaderCell>
                            <Cell className="text-center">
                                {(rowData) => {
                                    return (
                                        <div className="flex justify-center flex-row gap-6">
                                            <button
                                                disabled={rowData?.report?.isFinalized} className={`${rowData?.report?.isFinalized ? 'hidden' : ''} inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg`}
                                                onClick={() =>
                                                    router.push(`/transaction/expense/edit/${rowData?.id}`)
                                                }
                                            >
                                                <MdOutlineEdit size="2em" color="#FFD400" />
                                            </button>

                                            <button
                                                disabled={rowData?.report?.isFinalized}
                                                className={`${rowData?.report?.isFinalized ? 'hidden' : ''} inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg`}
                                                onClick={() => {
                                                    setEditInput({ ...rowData, is_active: false });
                                                    setOpen({ ...open, delete: true });
                                                }}
                                            >
                                                <PiTrash size="2em" color="#DC4A43" />
                                            </button>
                                        </div>
                                    );
                                }}
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
                            onChangePage={(page) => setPage(page)}
                            onChangeLimit={(limit) => setLimit(limit)}
                        />
                    </div>
                </div>
            </ContentLayout>

            <Toaster
                type="warning"
                open={open.delete}
                onClose={() => setOpen({ ...open, delete: false })}
                body={
                    <>
                        Apakah anda yakin untuk menghapus data{" "}
                        <span className="text-danger">{editInput.name}</span>?
                    </>
                }
                btnText="Hapus"
                onClick={() => HandleDeleteMedicine("delete")}
            />
        </Layout>
    );
}
