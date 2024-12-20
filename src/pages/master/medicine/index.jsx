import Button from "@/components/Button";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import MasterMedicineList from "@/components/MedicineLIst/MasterMedicineList";
import Toaster from "@/components/Modal/Toaster";
import { useUserContext } from "@/pages/api/context/UserContext";
import useMedicineAPI from "@/pages/api/master/medicine";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Divider } from "rsuite";

export default function index() {
    const { user } = useUserContext();
    const { isLoading, GetMedicineListById, GetMedicineListByCode, SearchMedicine, DeleteMedicine } = useMedicineAPI(); 

    const [modalDelete, setModalDelete] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState({});
    const [data, setData] = useState([]);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState(0);
    const [sortBy, setSortBy] = useState("");
    const [sortMode, setSortMode] = useState("");

    const handleSwitchForm = (typeState) => {
        switch (typeState) {
            case 0:
                setType(0);
                handleFetchMedicines();
                break;
            case 1:
                setType(1);
                handleFetchMedicines();
                break;
            default:
                setType(0);
                break;
        }
    }

    const handleFetchMedicines = async () => {
        try {
            const res = type == 1
                ? await GetMedicineListById(page, limit, search, sortBy, sortMode)
                : await GetMedicineListByCode(page, limit, search, sortBy, sortMode);
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

    const handleDeleteMedicine = async () => {
        try {
            const payload = { id: Number(selectedMedicine?.id) };
            const res = await DeleteMedicine(payload);
            console.log(res);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            }
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
            setSelectedMedicine({});
            handleFetchMedicines();
            setModalDelete(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await handleFetchMedicines();
        }
        fetchData();
    }, [page, limit, search, type, sortBy, sortMode]);

    useEffect(() => {
        setPage(1)
    }, [search, limit, type])

    useEffect(() => {
        setSearch('')
    }, [type])

    return (
        <Layout active="master-medicine" user={user}>
            <ContentLayout title="List Obat">
                <div className="w-full h-full">
                    <div className="flex flex-col w-full md:flex-row gap-4">
                        <Button size="small" appearance={`${type == 0 ? 'primary' : 'subtle'}`} onClick={() => handleSwitchForm(0)}>Master Obat</Button>
                        <Button size="small" appearance={`${type == 1 ? 'primary' : 'subtle'}`} onClick={() => handleSwitchForm(1)}>List Obat</Button>
                    </div>
                    <Divider />
                    {type == 0 &&
                        <MasterMedicineList
                            data={data}
                            isLoading={isLoading}
                            allowEdit={true}
                            setSelectedMedicine={setSelectedMedicine}
                            setModalDelete={setModalDelete}
                            // allowDeleteData={true}
                            totalPage={totalPage}
                            limit={limit}
                            page={page}
                            isMaster={true}
                            setLimit={setLimit}
                            setPage={setPage}
                            setSearch={setSearch}
                            setSortBy={setSortBy}
                            setSortMode={setSortMode}
                            sortBy={sortBy}
                            sortMode={sortMode}
                        />
                    }
                    {type == 1 && 
                        <MasterMedicineList
                            data={data}
                            isLoading={isLoading}
                            editPageUrl="/"
                            setSelectedMedicine={setSelectedMedicine}
                            setModalDelete={setModalDelete}
                            allowDeleteData={true}
                            totalPage={totalPage}
                            limit={limit}
                            page={page}
                            setLimit={setLimit}
                            setPage={setPage}
                            setSearch={setSearch}
                            setSortBy={setSortBy}
                            setSortMode={setSortMode}
                            sortBy={sortBy}
                            sortMode={sortMode}
                        />
                    }
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
