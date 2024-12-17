import Layout from "@/components/Layouts";
import { useUserContext } from "../api/context/UserContext";
import ContentLayout from "@/components/Layouts/Content";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useRouter } from "next/router";
import { Pagination, Table, Tooltip, Whisper } from "rsuite";
import { PiListMagnifyingGlass } from "react-icons/pi";
import useDiagnose from "../api/diagnose";
import { toast } from "react-toastify";
import formatDate from "@/helpers/dayHelper";
import prescriptionStatusMapped from "@/helpers/prescriptionStatusMap";
import DiagnoseDetail from "@/components/Modal/DiagnoseDetail";

export default function Index() {
    const router = useRouter();
    const { user } = useUserContext();
    const { getDiagnoseSummary } = useDiagnose();
    const { Column, HeaderCell, Cell } = Table;

    const [isLoading, setIsLoading] = useState(false);
    const [selectedDiagnose, setSelectedDiagnose] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [open, setOpen] = useState({
        view: false
    })
    const prescriptionStatusMap = prescriptionStatusMapped;

    const handleFetchDiagnose = async () => {
        try {
            let payload = { data: { doctorEmail: user.email } }
            if (search !== "") {
                payload = { data: { doctorEmail: user.email, patientName: search } }
            }
            const res = await getDiagnoseSummary(payload, limit, page)
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

    const renderTooltip = (content) => (
        <Tooltip>
            {content}
        </Tooltip>
    )

    useEffect(() => {
        async function fetchData() {
            if (user) {
                await handleFetchDiagnose();
            }
        }
        fetchData();
    }, [user]);

    return (
        <Layout active="diagnose" user={user} >
            <ContentLayout title="Diagnosis">
                <div className="w-full h-[500px]">
                    <div className="flex flex-row justify-between items-center w-full pb-6">
                        <Button
							prependIcon={<IoMdAdd size={24} />}
							onClick={() => {
								router.push('/diagnose/create')
							}}
						>
							Tambah
						</Button>

						<SearchBar
							size="md"
							className="w-1/4"
							placeholder=" Pasien ..."
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
                        <Column width={50} fixed="left">
                            <HeaderCell className="text-center text-dark ">No</HeaderCell>
                            <Cell className="text-center text-dark">
                                {(rowData, index) => index + 1}
                            </Cell>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Judul</HeaderCell>
                            <Cell dataKey='title'/>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Deskripsi</HeaderCell>
                            <Cell dataKey='description'/>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Pasien</HeaderCell>
                            <Cell dataKey='prescription.patient.name'/>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Timestamp</HeaderCell>
                            <Cell dataKey='created_at'>
                                {rowData => formatDate(rowData?.created_at)}
                            </Cell>
                        </Column>

                        <Column width={250} fullText resizable>
                            <HeaderCell className="text-dark font-bold">Timestamp</HeaderCell>
                            <Cell dataKey='created_at'>
                                {rowData => formatDate(rowData?.created_at)}
                            </Cell>
                        </Column>

                        <Column width={180} fullText fixed="right" resizable>
                            <HeaderCell className="text-dark font-bold">Status</HeaderCell>
                            <Cell className="text-center">
                                {(rowData) => {
                                    return (
                                        <div className="flex justify-center flex-row gap-6 text-white">
                                            <p 
                                                style={{ backgroundColor: prescriptionStatusMap.get(rowData.prescription.status)?.color }}
                                                className="font-extrabold text-center rounded-lg w-full">
                                                {prescriptionStatusMap.get(rowData.prescription.status)?.label}
                                            </p>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>

                        <Column width={150} fixed="right">
                            <HeaderCell className="text-center text-dark font-bold">Action</HeaderCell>
                            <Cell className="text-center" style={{ padding: '6px' }}>
                                {
                                    rowData => {
                                        return (
                                            <div className="flex justify-center flex-row gap-6">
                                                <Whisper speaker={renderTooltip("Detail")} placement="top" controlId="control-id-hover" trigger="hover">
                                                    <button
                                                        className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                        onClick={() => {
                                                            console.log(rowData);
                                                            // router.push(`/diagnose/detail/${rowData?.id}`)
                                                            setSelectedDiagnose(rowData?.id);
                                                            setOpen({...open, view: true});
                                                        }}
                                                    >
                                                        <PiListMagnifyingGlass size="1.5em" />
                                                    </button>
                                                </Whisper>
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

                <DiagnoseDetail
                    diagnoseId={selectedDiagnose}
                    openModal={open.view}
                    setOpenModal={setOpen}
                />
            </ContentLayout>
        </Layout>
    )
}