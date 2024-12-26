import Button from "@/components/Button";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import SearchBar from "@/components/SearchBar";
import { formatRupiah } from "@/helpers/currency";
import formatDate from "@/helpers/dayHelper";
import { resolveisArrivedStatus } from "@/helpers/resolveStatus";
import { useUserContext } from "@/pages/api/context/UserContext";
import useReceiveMedicineAPI from "@/pages/api/transaction/receiveMedicine";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { PiTrash } from "react-icons/pi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoMdCheckboxOutline } from "react-icons/io";
import { FcAddDatabase } from "react-icons/fc";
import { toast } from "react-toastify";
import { Modal, Pagination, Panel, Table, Tooltip, Whisper } from "rsuite";
import { HeaderCell, Column, Cell } from "rsuite-table";
import { useRouter } from "next/router";
import { MdOutlineEdit } from "react-icons/md";
import Text from "@/components/Text";
import Toaster from "@/components/Modal/Toaster";

export default function Index() {
    const router = useRouter();
    const { user } = useUserContext();
    const { GetAllReceiveMedicines, SearchReceiveMedicine, DeleteReceiveMedicine } = useReceiveMedicineAPI();

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [modal, setModal] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState({});

    const handleFetchReceiveMedicine = async () => {
        try {
            const res = await GetAllReceiveMedicines(page, limit);
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

    const handleSearchReceiveMedicine = async () => {
        try {
            const res = await SearchReceiveMedicine(page, limit, search);
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

    const handleDeleteReceiveMedicine = async () => {
        try {
            const payload = { id: selectedMedicine?.id }
            const res = await DeleteReceiveMedicine(payload);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            }
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
            setModalDelete(false);
            handleFetchReceiveMedicine();
        } catch (error) {
            console.error(error);
        }
    }

    const renderTooltip = (content) => {
        return (
            <Tooltip >
                {content}
            </Tooltip>
        )
    }

    useEffect(() => {
        async function fetchData() {
            if (search === '') {
                await handleFetchReceiveMedicine();
            } else {
                await handleSearchReceiveMedicine();
            }
        }
        fetchData();
    }, [page, limit, search]);

    return (
        <Layout active="transaction-receive" user={user}>
            <ContentLayout title="List Penerimaan Obat">
            <div className="w-full h-[500px]">
                <div className="flex flex-row justify-between items-center w-full pb-6">
                    <Button
                        prependIcon={<IoMdAdd size={24} />}
                        onClick={() => {
                            setModal(true);
                        }}>
                        Tambah
                    </Button>

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
                    height={400}
                    shouldUpdateScroll={false}
                    affixHorizontalScrollbar
                    loading={isLoading}
                >
                    <Column width={50} fixed="left">
                        <HeaderCell className="text-center text-dark font-bold">No</HeaderCell>
                        <Cell className="text-center text-dark">
                            {(rowData, index) => index + 1}
                        </Cell>
                    </Column>

                    <Column width={250} fullText resizable>
                        <HeaderCell className="text-dark font-bold">No Dokumen</HeaderCell>
                        <Cell dataKey='documentNumber'/>
                    </Column>

                    <Column width={250} fullText resizable>
                        <HeaderCell className="text-dark font-bold">Batch Code</HeaderCell>
                        <Cell dataKey='batchCode'/>
                    </Column>

                    <Column width={250} fullText resizable>
                        <HeaderCell className="text-dark font-bold">Kode Obat</HeaderCell>
                        <Cell dataKey='medicine.code'/>
                    </Column>

                    <Column width={250} fullText resizable>
                        <HeaderCell className="text-dark font-bold">Nama Obat</HeaderCell>
                        <Cell dataKey="medicine.name" />
                    </Column>

                    <Column width={250} fullText resizable>
                        <HeaderCell className="text-dark font-bold">Quantity</HeaderCell>
                        <Cell dataKey="quantity" />
                    </Column>

                    <Column width={250} fullText resizable>
                        <HeaderCell className="text-dark font-bold">Vendor</HeaderCell>
                        <Cell dataKey='vendor.name'/>
                    </Column>

                    <Column width={250} fullText resizable>
                        <HeaderCell className="text-dark font-bold">Alamat Vendor</HeaderCell>
                        <Cell dataKey='vendor.address'/>
                    </Column>

                    <Column width={250} fullText resizable>
                        <HeaderCell className="text-dark font-bold">Harga</HeaderCell>
                        <Cell dataKey='buyingPrice'>
                            {(rowData) => formatRupiah(rowData?.buyingPrice)}    
                        </Cell>
                    </Column>

                    <Column width={250} fullText resizable>
                        <HeaderCell className="text-dark font-bold">Metode Pembayaran</HeaderCell>
                        <Cell dataKey='paymentMethod'/>
                    </Column>

                    <Column width={250} fullText resizable>
                        <HeaderCell className="text-dark font-bold">Tenggat Waktu</HeaderCell>
                        <Cell dataKey='deadline'>
                            {rowData => formatDate(rowData?.deadline)}
                        </Cell>
                    </Column>

                    <Column width={250} fullText resizable>
                        <HeaderCell className="text-dark font-bold">Timestamp</HeaderCell>
                        <Cell dataKey='created_at'>
                            {rowData => formatDate(rowData?.created_at)}
                        </Cell>
                    </Column>

                    <Column width={150} fixed="right">
                        <HeaderCell className="text-dark font-bold">Status Penerimaan</HeaderCell>
                        <Cell dataKey='isArrived'>
                            {rowData => resolveisArrivedStatus(rowData?.isArrived)}
                        </Cell>
                    </Column>

                    <Column width={150} fixed="right">
                        <HeaderCell className="text-center text-dark font-bold">Aksi</HeaderCell>
                        <Cell className="text-center" style={{ padding: '6px' }}>
                            {
                                rowData => {
                                    return (
                                        <div className="flex justify-center flex-row gap-6">
                                            {!rowData?.is_active || !rowData?.isArrived ?
                                                <Whisper speaker={renderTooltip("Konfirmasi")} placement="top" controlId="control-id-hover" trigger="hover">
                                                    <button
                                                        className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                        onClick={() => {
                                                            console.log(rowData);
                                                            router.push(`/transaction/receive/confirm/${rowData?.id}`)
                                                        }}
                                                    >
                                                        <IoMdCheckboxOutline size="2em" color="#79B12A" />
                                                    </button>
                                                </Whisper>
                                                : null       
                                            }
                                            {!rowData?.is_active || !rowData?.isArrived ?
                                                <Whisper speaker={renderTooltip("Hapus")} placement="top" controlId="control-id-hover" trigger="hover">
                                                    <button
                                                        className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                        onClick={() => {
                                                            console.log(rowData);
                                                            setSelectedMedicine(rowData);
                                                            setModalDelete(!modalDelete);
                                                        }}
                                                    >
                                                        <PiTrash 
                                                            size="1.7em" 
                                                            color="#DC4A43" 
                                                        />
                                                    </button>
                                                </Whisper>
                                                : null
                                            }
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

            <Modal open={modal} size="md" onClose={() => setModal(false)}>
                <Modal.Header></Modal.Header>
                <Modal.Body>
                    <div className="flex md:flex-row gap-2 justify-between">
                        <Panel bordered className="w-full hover:bg-hover-light hover:cursor-pointer" onClick={() => router.push('/transaction/receive/order-form')}>
                            <IoDocumentTextOutline size={96} />
                            <Text type="title">Surat Pemesanan Obat</Text>
                            <Text type="body">Buat surat pemesanan obat ke vendor</Text>
                        </Panel>
                        <Panel bordered className="w-full hover:bg-hover-light hover:cursor-pointer" onClick={() => router.push('/transaction/receive/create')}>
                            <FcAddDatabase size={96} />
                            <Text type="title">Terima Pemesanan Obat</Text>
                            <Text type="body">Simpan pembelian obat dari vendor</Text>
                        </Panel>
                    </div>
                </Modal.Body>
            </Modal>

            <Toaster
				type="warning"
				open={modalDelete}
				onClose={() => setModalDelete(false)}
				body={
					<>
						Apakah anda yakin untuk menghapus data{" "}
						<span className="text-danger">{selectedMedicine?.documentNumber}</span>?
					</>
				}
				btnText="Hapus"
				onClick={handleDeleteReceiveMedicine}
			/>
        </Layout>
    )
}
