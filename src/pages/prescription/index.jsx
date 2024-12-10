import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "../api/context/UserContext";
import usePrescription from "../api/prescription";
import { useEffect, useState } from "react";
import {  Pagination, SelectPicker, Table } from "rsuite";
import SearchBar from "@/components/SearchBar";
import { formatDateWithTime } from "@/helpers/dayHelper";
import Button from "@/components/Button";
import { IoMdAdd } from "react-icons/io";
import { useRouter } from "next/router";
import PrescriptionDetail from "@/components/Modal/PrescriptionDetail";
import prescriptionStatusMapped from "@/helpers/prescriptionStatusMap";
import { PiListMagnifyingGlass } from "react-icons/pi";

export default function index() {
    const { user } = useUserContext();
    const [prescriptionsData, setPrescriptionsData] = useState([])
    const { isLoading: loading, getAllPrescription } = usePrescription()
    const [statusChanged, setStatusChanged] = useState({})
    const prescriptionStatusMap = prescriptionStatusMapped
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [filterStatus, setFilterStatus] = useState("")
    const { HeaderCell, Cell, Column } = Table;
    const router = useRouter()
    const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(-1)
    const [openModal, setOpenModal] = useState(false)

    const handleFetchPrescriptionData = async () => {
        try {
            const res = await getAllPrescription(search, limit, page, filterStatus);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            }
            console.log(res)
            setPrescriptionsData(res.data.results)
            setTotalPage(res.data.total)
        } catch (error) {
            console.error(error);
        }
    }

    const getData = (data) => {
        console.log("getData:", prescriptionsData)

        if (filterStatus) {
            data = data.filter((value) => value.status === filterStatus);
        }
        
        return data;
    }

    useEffect(() => {
        const temp = [...prescriptionsData]
        temp.map(prescription => {
            if (prescription.id === statusChanged.prescriptionId) {
                prescription.status = statusChanged.status
            }
        })

        setPrescriptionsData(temp)
    }, [statusChanged])
    
    useEffect(() => {
        async function fetchData() {
            handleFetchPrescriptionData();
        }
        fetchData();
    }, [page, limit, search, filterStatus]);

    useEffect(() => {
        console.log(openModal)
        console.log("selectedID:", selectedPrescriptionId)
    }, [openModal])

    useEffect(() => {
        setPage(1)
    }, [search, limit])

    return (
        <Layout active="prescription" user={user}>
            <ContentLayout title="List Resep">
            <div className="flex flex-col gap-2 md:flex-row justify-between w-full">
                <div>
                    <Button
                        prependIcon={<IoMdAdd size={24} />}
                         onClick={() => router.push(`/prescription/create`)}
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
                        data={Array.from(prescriptionStatusMap.values()).map((status) => ({ label: status.label, value: status.value }))}
                        value={filterStatus}
                        onChange={(value) => {
                            setFilterStatus(value);
                            console.log(value);
                        }}
                    />   
                    <SearchBar 
                        size="md"
                        // className="w-1/4"
                        placeholder="Search by patient name..."
                        onChange={(value) => {
                            setSearch(value)
                            console.log(value);
                        }}
                        value={search}
                    />
                </div>
            </div>
                <div className="w-full h-full pt-6">
                    <Table
                        data={getData(prescriptionsData)}
                        bordered
                        cellBordered
                        shouldUpdateScroll={false}
                        fillHeight
                        affixHorizontalScrollbar
                        loading={loading}
                    >
                        <Column width={50} fixed="left">
                            <HeaderCell className="text-center text-dark font-bold">No</HeaderCell>
                            <Cell className="text-center text-dark">
                                {(rowData, index) => index + 1}
                            </Cell>
                        </Column>

                        <Column flexGrow={1} resizable>
                            <HeaderCell className="text-dark font-bold">Resep ID</HeaderCell>
                            <Cell dataKey='id'/>
                        </Column>

                        <Column flexGrow={1} resizable>
                            <HeaderCell className="text-dark font-bold">Timestamp</HeaderCell>
                            <Cell className="text-dark font-bold">
                                {rowData => formatDateWithTime(rowData?.created_at)}
                            </Cell>
                        </Column>

                        <Column flexGrow={1} resizable>
                            <HeaderCell className="text-dark font-bold">Nama Pasien</HeaderCell>
                            <Cell dataKey='patient.name'/>
                        </Column>

                        <Column flexGrow={1} resizable>
                            <HeaderCell className="text-center text-dark font-bold">Status</HeaderCell>
                            <Cell className="text-center">
                                {(rowData) => {
                                    return (
                                        <div className="flex justify-center flex-row gap-6">
                                            <p 
                                                style={{ backgroundColor: prescriptionStatusMap.get(rowData.status)?.color }}
                                                className="text-white rounded-lg w-3/4">
                                                {prescriptionStatusMap.get(rowData.status)?.label}
                                            </p>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>

                        <Column width={100} fixed="right">
                            <HeaderCell className="text-center text-dark font-bold">Detail</HeaderCell>
                            <Cell className="text-center"  style={{padding: '6px'}}>
                                {
                                    rowData => {
                                        return (
                                        <button
                                            className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                            onClick={() => {
                                                console.log(rowData.id);
                                                setSelectedPrescriptionId(rowData.id);
                                                setOpenModal(true);
                                            }}
                                        >
                                        <PiListMagnifyingGlass 
                                            size='1.5em'
                                        />
                                        </button>
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
                            limitOptions={[3, 5, 10, 15]}
                            limit={limit}
                            activePage={page}
                            onChangePage={(page) => setPage(page)}
                            onChangeLimit={(limit) => setLimit(limit)}
                        />
                    </div>
                </div>
            </ContentLayout>

            <PrescriptionDetail 
                setStatusChanged={setStatusChanged}
                prescriptionId={selectedPrescriptionId}
                openModal={openModal}
                setOpenModal={setOpenModal}
                user={user}
            />
        </Layout>
    )
}
