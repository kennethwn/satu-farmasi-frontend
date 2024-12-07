import Button from "@/components/Button";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import SearchBar from "@/components/SearchBar";
import { useUserContext } from "@/pages/api/context/UserContext";
import { useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { Pagination, SelectPicker, Table, Modal, Checkbox } from "rsuite";
import { MdOutlineEdit } from "react-icons/md";
import { PiTrash } from "react-icons/pi";
import { toast } from "react-toastify";
import { z } from "zod";
import { isRequiredString } from "@/helpers/validation";
import Input from "@/components/Input";
import usePackagingAPI from "@/pages/api/master/packaging";
import Toaster from "@/components/Modal/Toaster";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const packagingSchema = z.object({
    label: isRequiredString(),
})

export default function index(props) {
    const { user } = useUserContext();
    const { Header, Body, Footer } = Modal;
    const { HeaderCell, Cell, Column } = Table;
    const { isLoading, GetAllPackaging, GetPackagingByLabel, CreatePackaging, EditPackaging, DeletePackaging } = usePackagingAPI();

    const [data, setData] = useState([]);
    const [editInput, setEditInput] = useState({});
    const [input, setInput] = useState({ label: "", value: "" });
    const [open, setOpen] = useState({
        create: false,
        edit: false,
        delete: false,
    });

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const createFormRef = useRef();
    const editFormRef = useRef();

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
        resolver: zodResolver(packagingSchema), defaultValues: {
            id: "",
            label: "",
            value: ""
        }
    });

    const HandleOnChange = (e, action) => {
        switch (action) {
            case "create":
                setInput({
                    ...input,
                    label: e.target.value,
                    value: e.target.value
                });
                break;
            case "edit":
                setEditInput({
                    ...editInput,
                    label: e.target.value,
                    value: e.target.value
                });
                break;
        }
    }

    const HandeFetchPackagingData = async () => {
        try {
            const res = await GetAllPackaging(page, limit);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            }
            setData(res.data.results);
            setTotalPage(res.data.total);
        } catch (error) {
            console.error(error);
        }
    }

    const HandleFetchPackagingByLabel = async () => {
        try {
            const res = await GetPackagingByLabel(search);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            }
            setData(res?.data.results);
            setTotalPage(res.total);
        } catch (error) {
            console.error(error);
        }
    }

    const HandleCreatePackaging = async (data) => {
        try {
            data = { ...data, value: data.label };
            const res = await CreatePackaging(data);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            }
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
            setOpen({ ...open, create: false, edit: false, delete: false });
            reset();
            HandeFetchPackagingData();
        } catch (error) {
            console.error(error);
        }
    }

    const HandleEditPackaging = async (data) => {
        try {
            data = { ...data, id: editInput.id, value: data.label };
            const res = await EditPackaging(data);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            }
            toast.success("Successfully edited packaging", { autoClose: 2000, position: "top-right" });
            setOpen({ ...open, create: false, edit: false, delete: false });
            reset();
            HandeFetchPackagingData();
        } catch (error) {
            console.error(error);
        }
    }

    const HandleDeletePackaging = async (rowData) => {
        try {
            rowData = { ...rowData, isActive: rowData.is_active };
            const res = await DeletePackaging(rowData);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            }
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
            setOpen({ ...open, create: false, edit: false, delete: false });
            reset();
            HandeFetchPackagingData();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (search === '') {
                await HandeFetchPackagingData();
            } else {
                await HandleFetchPackagingByLabel();
            }
        }
        fetchData();
    }, [page, limit, search]);

    const submitcreateform = () => createFormRef.current.requestSubmit();
    const submitEditForm = () => editFormRef.current.requestSubmit();

    return (
        <Layout active="master-packaging" user={user}>
            <ContentLayout title="List Kemasan">
                <div className="w-full h-[500px]">
                    <div className="flex flex-row justify-between items-center w-full pb-6">
                        <Button
                            prependIcon={<IoMdAdd size={24} />}
                            onClick={() => setOpen({ ...open, create: true })}>
                            Tambah
                        </Button>

                        <SearchBar
                            size="md"
                            className="w-1/4"
                            placeholder="Cari Kemasan ..."
                            onChange={(value) => setSearch(value)}
                        />
                    </div>
                    <Table
                        data={data || []}
                        bordered
                        cellBordered
                        height={400}
                        shouldUpdateScroll={false}
                        affixHorizontalScrollbar
                        loading={isLoading}
                    >
                        <Column width={100} fixed="left">
                            <HeaderCell className="text-center text-dark font-bold">No</HeaderCell>
                            <Cell className="text-center text-dark">
                                {(rowData, index) => index + 1}
                            </Cell>
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark font-bold">Nama Kemasan</HeaderCell>
                            <Cell dataKey='value' />
                        </Column>

                        <Column width={100} fixed="right">
                            <HeaderCell className="text-center text-dark font-bold">Status Aktif</HeaderCell>
                            <Cell className="text-center">
                                {
                                    rowData => {
                                        return (
                                            <div className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg">
                                                <Checkbox
                                                    checked={rowData?.is_active} 
                                                    onChange={() => {
                                                        HandleDeletePackaging({ ...rowData, is_active: !rowData.is_active, id: parseInt(rowData.id) });
                                                    }}
                                                />
                                            </div>
                                        )
                                    }
                                }
                            </Cell>
                        </Column>

                        <Column width={150} fixed="right">
                            <HeaderCell className="text-center text-dark font-bold">Aksi</HeaderCell>
                            <Cell className="text-center">
                                {
                                    rowData => {
                                        return (
                                            <div className="flex justify-center flex-row gap-6">
                                                <button
                                                    className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                    onClick={() => {
                                                        setEditInput(rowData);
                                                        setValue("id", rowData.id);
                                                        setValue("label", rowData.label);
                                                        setValue("value", rowData.value);
                                                        setOpen({ ...open, edit: true });
                                                    }}
                                                >
                                                    <MdOutlineEdit
                                                        size="2em"
                                                        color="#FFD400"
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

            <Modal
                backdrop="static"
                open={open.create}
                onClose={() => {
                    reset();
                    setOpen({ ...open, create: false })
                }}
                size="lg"
            >
                <Header className="text-2xl font-bold">Tambah Kemasan</Header>
                <form onSubmit={handleSubmit(HandleCreatePackaging)} ref={createFormRef}>
                    <Body className="pt-2">
                        <Input
                            type="text"
                            label="Nama Kemasan"
                            name="label"
                            placeholder="Nama kemasan"
                            autofocus={true}
                            register={register}
                            error={errors["label"]?.message}
                            onChange={e => HandleOnChange(e, "create")}
                        />
                    </Body>
                    <Footer className="pt-4">
                        <Button
                            type="button"
                            appearance="primary"
                            isLoading={isLoading}
                            onClick={submitcreateform}
                        >
                            Simpan
                        </Button>
                    </Footer>
                </form>
            </Modal>

            <Modal
                backdrop="static"
                open={open.edit}
                onClose={() => {
                    reset();
                    setOpen({ ...open, edit: false })
                }}
                size="lg"
            >
                <Header className="text-2xl font-bold">Ubah Kemasan</Header>
                <form onSubmit={handleSubmit(HandleEditPackaging)} ref={editFormRef}>
                    <Body className="pt-2">
                        <Input
                            type="text"
                            label="Nama Kemasan"
                            name="label"
                            placeholder="Nama kemasan"
                            autofocus={true}
                            register={register}
                            error={errors["label"]?.message}
                            onChange={e => HandleOnChange(e, "edit")}
                        />
                    </Body>
                    <Footer className="pt-4">
                        <Button
                            type="button"
                            isLoading={isLoading}
                            appearance="primary"
                            onClick={submitEditForm}
                        >
                            Simpan
                        </Button>
                    </Footer>
                </form>
            </Modal>
        </Layout>
    )
}
