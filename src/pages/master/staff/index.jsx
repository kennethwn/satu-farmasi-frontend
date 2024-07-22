import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { Checkbox, Pagination, SelectPicker, Table } from "rsuite";
import useStaffAPI from "@/pages/api/master/staff";
import { toast } from "react-toastify";
import formatDate from "@/helpers/dayHelper";
import { MdOutlineEdit } from "react-icons/md";
import { useRouter } from "next/router";
import { useUserContext } from "@/pages/api/context/UserContext";

export default function Index() {
    const { user } = useUserContext();
    const [staffData, setStaffData] = useState([]);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([])
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const roles = ["DOCTOR", "PHARMACIST", "ADMIN"];
    
    const router = useRouter();
    const { HeaderCell, Cell, Column } = Table;
    const { isLoading: loading, GetAllStaff, EditStaff } = useStaffAPI();

    const HandleFetchStaffByNik = async (nik) => {
        try {
          const response = await GetAllStaffByUserNik(nik);
          if (response === undefined || response === null) return;
          setStaff(data);
        } catch (error) {
          console.error(error);
        }
      };

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

    const handleActivateStaff = async (rowData) => {
        try {
            let data = [...staffData];
            let selectedData = data.find((item) => item.nik === rowData.nik);
            selectedData.isActive = !selectedData.isActive;
            
            const res = await EditStaff(selectedData);
            console.log(res);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            }

            toast.success(res.message, { autoClose: 2000, position: "top-center" });
            handleFetchStaffData();
        } catch (error) {
            console.error(error);
        }
    }

    const handleFetchStaffData = async () => {
        try {
            const res = await GetAllStaff();
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            }
            setStaffData(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getData = () => {
        let data = staffData.filter((value, index) => {
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
            data = data.filter((value) => value.role === filter);
        }
        
        return data;
    }

    useEffect(() => {
        async function fetchData() {
            await handleFetchStaffData();
        }
        fetchData();
    }, []); 

    return (
        <Layout active="master-staff"  user={user}>
            <ContentLayout title="Daftar Staf">
                <div className="flex flex-row justify-between w-full">
                    <SelectPicker
                        style={{
                            borderWidth: '0.5px',     
                            color: '#DDDDDD',       
                            borderColor: '#DDDDDD', 
                            borderRadius: '0.4rem',
                        }}
                        label="Role"
                        data={roles.map((role) => ({ label: role, value: role }))}
                        value={filter}
                        onChange={(value) => {
                            setFilter(value);
                            console.log(value);
                        }}
                    />
                    
                    <SearchBar 
                        size="md"
                        className="w-1/4"
                        placeholder="Search..."
                        onChange={(value) => {
                            console.log(value);
                        }}
                        value={search}
                    />
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
                            <HeaderCell className="text-dark">NIK</HeaderCell>
                            <Cell dataKey='nik'/>
                        </Column>

                        <Column width={200} resizable sortable>
                            <HeaderCell className="text-dark">Nama Lengkap</HeaderCell>
                            <Cell>
                                {rowData => `${rowData?.firstName} ${rowData?.lastName}`}
                            </Cell>
                        </Column>

                        <Column width={200} resizable sortable>
                            <HeaderCell className="text-dark">Email</HeaderCell>
                            <Cell className="text-dark" dataKey='email'/>
                        </Column>

                        <Column width={100} resizable sortable>
                            <HeaderCell className="text-dark">Role</HeaderCell>
                            <Cell className="text-dark" dataKey='role'/>
                        </Column>

                        <Column width={150} resizable sortable>
                            <HeaderCell className="text-dark">No Handphone</HeaderCell>
                            <Cell className="text-dark" dataKey='phoneNum'/>
                        </Column>

                        <Column width={150} resizable sortable>
                            <HeaderCell className="text-dark">Tanggal Lahir</HeaderCell>
                            <Cell className="text-dark">
                                {rowData => formatDate(rowData?.dob)}
                            </Cell>
                        </Column>

                        <Column width={100} fixed="right" sortable>
                            <HeaderCell className="text-center text-dark">Status Aktif</HeaderCell>
                            <Cell className="text-center">
                                {
                                    rowData => {
                                        return (
                                            <div className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg">
                                                <Checkbox
                                                    checked={rowData?.isActive}
                                                    onChange={(value) => {
                                                        console.log(rowData?.isActive);
                                                        // setModal({...modal, delete: true});
                                                        // handleChangeActivateStaff(rowData);
                                                        handleActivateStaff(rowData);
                                                    }}
                                                />
                                            </div>
                                        )
                                    }
                                }
                            </Cell>
                        </Column>

                        <Column width={100} fixed="right">
                            <HeaderCell className="text-center text-dark">Action</HeaderCell>
                            <Cell className="text-center">
                                {
                                    rowData => {
                                        return (
                                            <button
                                                className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                onClick={() => {
                                                    console.log(rowData)
                                                    router.push(`/master/staff/edit/${rowData?.nik}`);
                                                }}
                                            >
                                                <MdOutlineEdit 
                                                    size="2em" 
                                                    color="#FFD400" 
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
        </Layout>
    )
}