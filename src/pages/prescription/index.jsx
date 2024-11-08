import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "../api/context/UserContext";
import usePrescription from "../api/prescription";
import { useEffect, useState } from "react";
import { Checkbox, Pagination, SelectPicker, Table } from "rsuite";
import SearchBar from "@/components/SearchBar";
import formatDate from "@/helpers/dayHelper";
import { MdOutlineEdit } from "react-icons/md";
import Button from "@/components/Button";
import { IoMdAdd } from "react-icons/io";
import { useRouter } from "next/router";
import PrescriptionDetail from "@/components/Modal/PrescriptionDetail";
import prescriptionStatusMapped from "@/helpers/prescriptionStatusMap";

export default function index() {
    const { user } = useUserContext();
    const [prescriptionsData, setPrescriptionsData] = useState([])
    const { isLoading: loading, getAllPrescription, getSearchedPrescription } = usePrescription()
    const [filter, setFilter] = useState('');
    const prescriptionStatusMap = prescriptionStatusMapped
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const status = ["UNPROCESSED", "ON PROGRESS", "WAITING FOR PAYMENT", "DONE"];
    const { HeaderCell, Cell, Column } = Table;
    const router = useRouter()
    const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(-1)
    const [openModal, setOpenModal] = useState(false)

    // const handleSortColumn = (sortColumn, sortType) => {
    //     setTimeout(() => {
    //         setSortColumn(sortColumn);
    //         setSortType(sortType);
    //     }, 500);
    // };

    const handleFetchPrescriptionData = async () => {
        try {
            const res = await getAllPrescription(search, limit, page);
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

    // const handleFetchSearchedPrescriptionData = async () => {
    //     try {
    //         const res = await getSearchedPrescription(search)
    //         if (res.code !== 200) {
    //             toast.error(res.message, { autoClose: 2000, position: "top-center" });
    //             return;
    //         }
    //         setPrescriptionsData(res.data)
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    const getData = (data) => {
        console.log("getData:", prescriptionsData)

        if (filter) {
            data = data.filter((value) => value.status === filter);
        }
        
        return data;
    }

    
    useEffect(() => {
        async function fetchData() {
            handleFetchPrescriptionData();
        }
        fetchData();
    }, [page, limit, search]);

    useEffect(() => {
        console.log(openModal)
        console.log("selectedID:", selectedPrescriptionId)
    }, [openModal])

    useEffect(() => {
        setPage(1)
    }, [search, limit])


    // useEffect(() => {
    //     async function fetchSearchData(){
    //         await handleFetchSearchedPrescriptionData();
    //     }
    //     fetchSearchData();
    // }, [search])

    return (
        <Layout active="prescription" user={user}>
            <ContentLayout title="Resep">
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
                        value={filter}
                        onChange={(value) => {
                            setFilter(value);
                            console.log(value);
                        }}
                    />   
                    <SearchBar 
                        size="md"
                        // className="w-1/4"
                        placeholder="Search by patient name..."
                        onChange={(value) => {
                            console.log(value);
                        }}
                        value={search}
                    />
                </div>
            </div>
                <div className="w-full pt-6">
                    <Table
                        data={getData(prescriptionsData)}
                        bordered
                        cellBordered
                        shouldUpdateScroll={false}
                        height={400}
                        affixHorizontalScrollbar
                        // sortColumn={sortColumn}
                        // sortType={sortType}
                        // onSortColumn={handleSortColumn}
                        loading={loading}
                        // wordWrap
                    >
                        <Column width={50} fixed="left">
                            <HeaderCell className="text-center text-dark">No</HeaderCell>
                            <Cell className="text-center text-dark">
                                {(rowData, index) => index + 1}
                            </Cell>
                        </Column>

                        <Column flexGrow={1} resizable>
                            <HeaderCell className="text-dark">Prescription ID</HeaderCell>
                            <Cell dataKey='id'/>
                        </Column>

                        <Column flexGrow={1} resizable>
                            <HeaderCell className="text-dark">Timestamp</HeaderCell>
                            <Cell className="text-dark">
                                {rowData => formatDate(rowData?.created_at)}
                            </Cell>
                        </Column>

                        <Column flexGrow={1} resizable>
                            <HeaderCell className="text-dark">Patient Name</HeaderCell>
                            <Cell dataKey='patient.name'/>
                        </Column>

                        <Column flexGrow={1} resizable>
                            <HeaderCell className="text-center text-dark">Status</HeaderCell>
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
                            <HeaderCell className="text-center text-dark">Detail</HeaderCell>
                            <Cell className="text-center">
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
                                            <MdOutlineEdit size="2em" color="#FFD400" />
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
                prescriptionId={selectedPrescriptionId}
                openModal={openModal}
                setOpenModal={setOpenModal}
            />
        </Layout>
    )
}