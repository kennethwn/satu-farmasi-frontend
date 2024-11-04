import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import SearchBar from "@/components/SearchBar";
import formatDate from "@/helpers/dayHelper";
import { useUserContext } from "@/pages/api/context/UserContext";
import useReportAPI from "@/pages/api/master/report";
import { useEffect, useState } from "react";
import { PiListMagnifyingGlass } from "react-icons/pi";
import { toast } from "react-toastify";
import { Checkbox, Pagination, Table } from "rsuite";

export default function index() {
    const { user } = useUserContext();
    const { isLoading, GetAllReports, GetReportById } = useReportAPI();

    const { HeaderCell, Cell, Column } = Table;
    const [data, setData] = useState([]);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const HandleFetchReportsData = async () => {
        try {
            const res = await GetAllReports(page, limit);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            }
            res.data.results.map(item => {
                item.created_at = formatDate(item.created_at);
                item.updated_at = formatDate(item.updated_at);
            })
            setData(res.data.results);
            setTotalPage(res.data.total);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            await HandleFetchReportsData();
        }
        fetchData();
    }, [page, limit, search]);

    return (
        <Layout active="master-report" user={user}>
            <ContentLayout title="List Laporan">
                <div className="w-full h-[500px]">
                    <div className="flex flex-row justify-between items-center w-full pb-6">
                        <SearchBar
                            size="md"
                            className="w-1/4"
                            placeholder="Search..."
                            onChange={(value) => setSearch(value)}
                        />
                    </div>
                    <Table
                        data={data || []}
                        bordered
                        cellBordered
                        shouldUpdateScroll={false}
                        affixHorizontalScrollbar
                        height={400}
                        loading={isLoading}
                    >
                        <Column width={100} fixed="left">
                            <HeaderCell className="text-center text-dark font-bold"> No </HeaderCell>
                            <Cell className="text-center text-dark">
                                {(rowData, index) => index + 1}
                            </Cell>
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark font-bold"> Tanggal Terbit </HeaderCell>
                            <Cell dataKey="created_at" />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark font-bold"> Tanggal Finalize </HeaderCell>
                            <Cell dataKey="updated_at" />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark font-bold"> ID Transaksi </HeaderCell>
                            <Cell dataKey="id" />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark font-bold"> Total Obat Masuk </HeaderCell>
                            <Cell dataKey="_count.receiveMedicines" />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark font-bold">Total Obat Keluar</HeaderCell>
                            <Cell dataKey="_count.outputMedicines" />
                        </Column>

                        <Column flexGrow={1}>
                            <HeaderCell className="text-dark font-bold">Total Transaksi</HeaderCell>
                            <Cell dataKey="_count.transactions" />
                        </Column>

                        <Column flexGrow={1} fixed={"right"}>
                            <HeaderCell className="text-dark font-bold">Is Finalized</HeaderCell>
                            <Cell className="text-center">
                                {
                                    rowData => {
                                        return (
                                            <div className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg">
                                                <Checkbox checked={rowData?.isFinalized} disabled />
                                            </div>
                                        )
                                    }
                                }
                            </Cell>
                        </Column>

                        <Column width={150} fixed="right">
                            <HeaderCell className="text-center text-dark font-bold">
                                Action
                            </HeaderCell>
                            <Cell className="text-center">
                                {(rowData) => {
                                    return (
                                        <div className="flex justify-center flex-row gap-6">
                                            <button className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                onClick={() => {
                                                    console.log(rowData.id);
                                                }}>
                                                <PiListMagnifyingGlass />
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
        </Layout>
    );
}
