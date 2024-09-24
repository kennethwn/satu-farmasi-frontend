import Button from "@/components/Button";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import SearchBar from "@/components/SearchBar";
import { useUserContext } from "@/pages/api/context/UserContext";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { Pagination, SelectPicker, Table, Modal } from "rsuite";
import { MdOutlineEdit } from "react-icons/md";
import { PiTrash } from "react-icons/pi";
import { toast } from "react-toastify";
import { z } from "zod";
import { isRequiredString } from "@/helpers/validation";
import Input from "@/components/Input";
import usePackagingAPI from "@/pages/api/master/packaging";
import Toaster from "@/components/Modal/Toaster";

const packagingSchema = z.object({
    label: isRequiredString(),
    value: isRequiredString(),
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

    const HandleClear = () => {
        setData([]);
        setEditInput({});
        setPage(1);
        setTotalPage(0);
        setLimit(10);
        setInput({ label: "", value: "" });
        setOpen({
            create: false,
            edit: false,
            delete: false,
        });
    }

    const HandeFetchPackagingData = async () => {
        try {
            const res = await GetAllPackaging(page, limit);
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

    const HandleFetchPackagingByLabel = async () => {
        try {
            const res = await GetPackagingByLabel(search);
            console.log(res);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            }
            setData(res?.data.results);
            setTotalPage(res.total);
        } catch (error) {
            console.error(error);
        }
    }

    const HandleCreatePackaging = async () => {
        try {
            const validatedData = packagingSchema.parse(input);
            const res = await CreatePackaging(validatedData);
            if (res.code !== 200) {
                toast.error("Failed to create packaging", { autoClose: 2000, position: "top-center" });
                return;
            } 
            toast.success("Successfully created packaging", { autoClose: 2000, position: "top-center" });
            setOpen({...open, create: false, edit: false, delete: false});
            HandeFetchPackagingData();
        } catch (error) {
            console.error(error);
        }
    }

    const HandleEditPackaging = async () => {
        try {
            const res = await EditPackaging(editInput);
            if (res.code !== 200) {
                toast.error("Failed to edit packaging", { autoClose: 2000, position: "top-center" });
                return;
            }
            toast.success(`${action === "delete" ? "Successfully deleted packaging" : "Successfully edited packaging"}`, { autoClose: 2000, position: "top-center" });
            setOpen({...open, create: false, edit: false, delete: false});
            HandeFetchPackagingData();
        } catch (error) {
            console.error(error);
        }
    }

    const HandleDeletePackaging = async () => {
        try {
            setEditInput({...editInput, isActive: false});
            const res = await DeletePackaging(editInput);
            if (res.code !== 200) {
                toast.error("Failed to delete packaging", { autoClose: 2000, position: "top-center" });
                return;
            }
            toast.success("Successfully deleted packaging", { autoClose: 2000, position: "top-center" });
            setOpen({...open, create: false, edit: false, delete: false});
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

    return (
        <Layout active="master-packaging" user={user}>
            <ContentLayout title="List Kemasan">
                <div className="flex flex-row justify-between items-center w-full pb-6">
                    <Button 
                        prependIcon={<IoMdAdd size={24}/>} 
                        onClick={() => setOpen({...open, create: true})}>
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
                            <HeaderCell className="text-center text-dark font-bold">No</HeaderCell>
                            <Cell className="text-center text-dark">
                                {(rowData, index) => index + 1}
                            </Cell>
                        </Column>

                        <Column width={400}>
                            <HeaderCell className="text-dark font-bold">ID Kemasan</HeaderCell>
                            <Cell dataKey='label'/>
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark font-bold">Nama Kemasan</HeaderCell>
                            <Cell dataKey='value'/>
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
                                                        setEditInput(rowData);
                                                        setOpen({...open, edit: true});
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
                                                        setEditInput({...rowData, isActive: false});
                                                        setOpen({...open, delete: true});
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

            <Modal 
                backdrop="static"
                open={open.create} 
                onClose={() => setOpen({...open, create: false})}
                size="lg"
            >
                <Header className="text-2xl font-bold">Tambah Kemasan</Header>
                <Body className="pt-2">
                    <Input
                        type="text"
                        label="Nama Kemasan"
                        name="name"
                        placeholder="nama kemasan"
                        onChange={e => HandleOnChange(e, "create")}
                    />
                </Body>
                <Footer className="pt-4">
                    <Button
                        appearance="primary"
                        isLoading={isLoading}
                        onClick={() => HandleCreatePackaging()}
                    >
                        Simpan
                    </Button>
                </Footer>
            </Modal>

            <Modal 
                backdrop="static"
                open={open.edit} 
                onClose={() => {
                    setOpen({...open, edit: false})
                }}
                size="lg"
            >
                <Header className="text-2xl font-bold">Edit Kemasan</Header>
                <Body className="pt-2">
                    <Input
                        type="text"
                        label="Nama Kemasan"
                        name="name"
                        placeholder="nama kemasan"
                        value={editInput.value}
                        onChange={e => HandleOnChange(e, "edit")}
                    />
                </Body>
                <Footer className="pt-4">
                    <Button
                        isLoading={isLoading}
                        appearance="primary"
                        onClick={() => HandleEditPackaging()}
                    >
                        Simpan
                    </Button>
                </Footer>
            </Modal>

            {/* TODO: Bold editInput.label */}
            <Toaster
                type="warning"
                open={open.delete} 
                onClose={() => setOpen({...open, delete: false})}
                body={<>Apakah anda yakin untuk menghapus data <span className="text-danger">{editInput.label}</span>?</>}
                btnText="Hapus"
                onClick={() => HandleDeletePackaging()}
            />
        </Layout>
    )
}