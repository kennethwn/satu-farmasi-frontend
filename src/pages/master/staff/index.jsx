import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { Checkbox, Pagination, SelectPicker, Table } from "rsuite";
import useStaffAPI from "@/pages/api/master/staff";
import { toast} from "react-toastify";
import formatDate from "@/helpers/dayHelper";
import { MdOutlineEdit } from "react-icons/md";
import { useRouter } from "next/router";
import { useUserContext } from "@/pages/api/context/UserContext";

export default function Index() {
    const { user } = useUserContext();
    const [filter, setFilter] = useState('Dokter');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const roles = ["Dokter", "Farmasi", "Admin"];
    const [data, setData] = useState([]);

    const router = useRouter();
    const { HeaderCell, Cell, Column } = Table;
    const { isLoading, GetAllStaff, EditAdmin, EditDoctor, EditPharmacist } = useStaffAPI();

    const handleSortColumn = (sortColumn, sortType) => {
        setTimeout(() => {
            setSortColumn(sortColumn);
            setSortType(sortType);
        }, 500);
    };

    const handleActivateStaff = async (rowData) => {
        try {
            let selectedData = data.find((item) => item.nik === rowData.nik);
            selectedData.is_active = !selectedData.is_active;

            let res = null;
            if (selectedData.role.toLowerCase() === "admin") res = await EditAdmin(selectedData);
            else if (selectedData.role.toLowerCase() === "dokter") res = await EditDoctor(selectedData);
            else if (selectedData.role.toLowerCase() === "farmasi") res = await EditPharmacist(selectedData);
                console.log("res: ", res);
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
            handleFetchStaffData();
        } catch (error) {
            console.error(error);
        }
    }

    const handleFetchStaffData = async () => {
        try {
            let filterToSubmit = ""
            if (filter === "Dokter") filterToSubmit = "doctor";
            else if (filter === "Farmasi") filterToSubmit = "pharmacist";
            else if (filter === "Admin") filterToSubmit = "admin";
            const res = await GetAllStaff(page, limit, search,filterToSubmit);
            const dataArr = res.data.results.map(item => ({
                ...item,
                oldEmail: item.email,
                oldNik: item.nik,
            }))
            setData(dataArr);
            setTotalPage(res.data.total);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await handleFetchStaffData();
        }
        fetchData();
    }, [page, limit, search, filter]);

    return (
        <Layout active="master-staff" user={user}>
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
                        cleanable={false}
                        onChange={(value) => { setFilter(value); }}
                        onClean={() => { setFilter('Dokter'); }}
                    />

                    <SearchBar
                        size="md"
                        className="w-1/4"
                        placeholder="Search..."
                        onChange={value => setSearch(value)}
                        value={search}
                    />
                </div>
                <div className="w-full pt-6">
                    <Table
                        data={data || []}
                        bordered
                        cellBordered
                        shouldUpdateScroll={false}
                        height={400}
                        affixHorizontalScrollbar
                        sortColumn={sortColumn}
                        sortType={sortType}
                        onSortColumn={handleSortColumn}
                        loading={isLoading}
                    // wordWrap
                    >
                        <Column width={50} fixed="left">
                            <HeaderCell className="text-center text-dark">No</HeaderCell>
                            <Cell className="text-center text-dark">
                                {(rowData, index) => index + 1}
                            </Cell>
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark">NIK</HeaderCell>
                            <Cell dataKey='nik' />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark">Nama Lengkap</HeaderCell>
                            <Cell>
                                {rowData => `${rowData?.firstName} ${rowData?.lastName}`}
                            </Cell>
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark">Email</HeaderCell>
                            <Cell className="text-dark" dataKey='email' />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark">No Handphone</HeaderCell>
                            <Cell className="text-dark" dataKey='phoneNum' />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark">Tanggal Lahir</HeaderCell>
                            <Cell className="text-dark">
                                {rowData => formatDate(rowData?.dob)}
                            </Cell>
                        </Column>

                        <Column width={100} fixed="right">
                            <HeaderCell className="text-center text-dark">Status Aktif</HeaderCell>
                            <Cell className="text-center">
                                {
                                    rowData => {
                                        return (
                                            <div className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg">
                                                <Checkbox
                                                    checked={rowData?.is_active} onChange={(value) => {
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
                            <HeaderCell className="text-center text-dark">Aksi</HeaderCell>
                            <Cell className="text-center">
                                {
                                    rowData => {
                                        return (
                                            <button
                                                className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                onClick={() => {
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

        </Layout>
    )
}
