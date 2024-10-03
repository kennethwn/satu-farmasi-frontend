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
import { Pagination, Table } from "rsuite";
import { toast } from "react-toastify";
import { formatCalendar } from "@/helpers/dayHelper";

export default function index() {
    const { user } = useUserContext();
    const { HeaderCell, Cell, Column } = Table;
    const { isLoading, GetAllMedicine, GetMedicineByParams, DeleteMedicine } = useExpenseMedicineAPI();

    const [data, setData] = useState([]);
    const [editInput, setEditInput] = useState({});
    const [open, setOpen] = useState({
        create: false,
        edit: false,
        delete: false,
    });
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const HandleFetchMedicineData = async () => {
        try {
            const res = await GetAllMedicine(page, limit);
            console.log(res.data);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            }
            res.data.results.map(item => { item.created_at = formatCalendar(item.created_at); })
            setData(res.data.results);
            setTotalPage(res.data.total);
        } catch (error) {
            console.error(error);
        }
    };

  const HandleFetchMedicineByParams = async () => {
    try {
      const res = await GetMedicineByParams(search);
      console.log(res);
      if (res.code !== 200) {
        toast.error(res.message, { autoClose: 2000, position: "top-center" });
        return;
      }
        res?.data.results.map(item => { item.created_at = formatCalendar(item.created_at); })
      setData(res?.data.results);
      setTotalPage(res.total);
    } catch (error) {
      console.error(error);
    }
  };

    const HandleDeleteMedicine = async () => {
        try {
            setEditInput({ ...editInput, is_active: false });
            const res = await DeleteMedicine(editInput);
            if (res.code !== 200) {
                toast.error("Failed to delete Vendor", {
                    autoClose: 2000,
                    position: "top-center",
                });
                return;
            }
            toast.success("Successfully deleted Vendor", {
                autoClose: 2000,
                position: "top-center",
            });
            setOpen({ ...open, create: false, edit: false, delete: false });
            HandleFetchMedicineData();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            if (search === "") {
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
                <div className="flex flex-row justify-between items-center w-full pb-6">
                    <Button
                        prependIcon={<IoMdAdd size={24} />}
                        onClick={() => router.push(`/transaction/expense/create`)}
                    >
                        Tambah
                    </Button>

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
                                                className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                onClick={() =>
                                                    router.push(`/transaction/expense/edit/${rowData?.id}`)
                                                }
                                            >
                                                <MdOutlineEdit size="2em" color="#FFD400" />
                                            </button>

                                            <button
                                                className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
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
