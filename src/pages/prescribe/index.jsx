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

export default function index() {
    const { user } = useUserContext();
    const [prescriptionsData, setPrescriptionsData] = useState([])
    const { isLoading: loading, getAllPrescription, getSearchedPrescription } = usePrescription()
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([])
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const status = ["UNPROCESSED", "ON PROGRESS", "WAITING FOR PAYMENT", "DONE"];
    const { HeaderCell, Cell, Column } = Table;
    const router = useRouter()
    const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(-1)
    const [openModal, setOpenModal] = useState(false)

    const handleSortColumn = (sortColumn, sortType) => {
        setTimeout(() => {
            setSortColumn(sortColumn);
            setSortType(sortType);
        }, 500);
    };

    const handleChangeLimit = (dataKey) => {
        setPage(1);
        setLimit(dataKey);
    };

    const handleFetchPrescriptionData = async () => {
        try {
            const res = await getAllPrescription();
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            }
            setPrescriptionsData(res.data)
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

    const getData = () => {
        console.log("getData:", prescriptionsData)
        let data = prescriptionsData.filter((value, index) => {
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

    useEffect(() => {
        async function fetchData() {
            await handleFetchPrescriptionData();
        }
        fetchData();
    }, []); 

    useEffect(() => {
        console.log(openModal)
        console.log("selectedID:", selectedPrescriptionId)
    }, [openModal])


    // useEffect(() => {
    //     async function fetchSearchData(){
    //         await handleFetchSearchedPrescriptionData();
    //     }
    //     fetchSearchData();
    // }, [search])

    return (
        <Layout active="prescribe" user={user}>
            <ContentLayout title="Resep">
            <div className="flex flex-row justify-between w-full">
                <div>
                    <Button
                        prependIcon={<IoMdAdd size={24} />}
                        onClick={() => router.push(`/prescribe/create`)}
                    >
                        Tambah
                    </Button>
                </div>
                <div className="flex flex-row gap-4">
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
                        onChange={(value) => {
                            setFilter(value);
                            console.log(value);
                        }}
                    />   
                    <SearchBar 
                        size="md"
                        // className="w-1/4"
                        placeholder="Search..."
                        onChange={(value) => {
                            console.log(value);
                        }}
                        value={search}
                    />
                </div>
            </div>
                <div className="w-full pt-6">
                    <Table
                        data={getData()}
                        bordered
                        cellBordered
                        shouldUpdateScroll={false}
                        height={400}
                        affixHorizontalScrollbar
                        sortColumn={sortColumn}
                        sortType={sortType}
                        onSortColumn={handleSortColumn}
                        loading={loading}
                        // wordWrap
                    >
                        <Column width={50} fixed="left">
                            <HeaderCell className="text-center text-dark">No</HeaderCell>
                            <Cell className="text-center text-dark">
                                {(rowData, index) => index + 1}
                            </Cell>
                        </Column>

                        <Column width={150} resizable sortable>
                            <HeaderCell className="text-dark">Prescription ID</HeaderCell>
                            <Cell dataKey='prescriptionId'/>
                        </Column>

                        <Column width={150} resizable sortable>
                            <HeaderCell className="text-dark">Timestamp</HeaderCell>
                            <Cell className="text-dark">
                                {rowData => formatDate(rowData?.timestamps)}
                            </Cell>
                        </Column>

                        <Column width={200} resizable sortable>
                            <HeaderCell className="text-dark">Patient Name</HeaderCell>
                            <Cell dataKey='patientName'/>
                        </Column>

                        <Column width={200} resizable sortable>
                            <HeaderCell className="text-dark">Status</HeaderCell>
                            <Cell dataKey='status'/>
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
                                                console.log(rowData.prescriptionId);
                                                setSelectedPrescriptionId(rowData.prescriptionId);
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
                            layout={["total", "-", "limit", "|", "pager", "skip"]}
                            total={getData().length || 0}
                            limitOptions={[10, 30, 50]}
                            limit={limit}
                            activePage={page}
                            onChangePage={setPage}
                            onChangeLimit={handleChangeLimit}
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