import Button from "@/components/Button";
import Input from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/pages/api/context/UserContext";
import useReportAPI from "@/pages/api/master/report";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Accordion from "@/components/Accordion/index"
import { Header, Modal, Table } from "rsuite";
import { formatRupiah } from "@/helpers/currency";
import { PiListMagnifyingGlass } from "react-icons/pi";
import Toaster from "@/components/Modal/Toaster";
import formatDate from "@/helpers/dayHelper";
import Label from "@/components/Input/Label";

export default function index() {
    const router = useRouter();
    const id = router.query.id;
    const { Header, Body, Footer } = Modal;
    const { isLoading, GetReportById, finalizeReport } = useReportAPI();
    const [currState, setCurrState] = useState(0);

    const [modalState, setModalState] = useState([{
        data: [],
        table: [
            {
                column: "",
                key: "",
            }
        ]
    }])

    const { user } = useUserContext();
    const [value, setValue] = useState({});
    const { HeaderCell, Cell, Column } = Table;
    const [unFinalized, setUnFinalized] = useState(false);
    const [errorData, setErrorData] = useState(false);
    const [open, setOpen] = useState(false);

    const handleFetchReportById = async () => {
        try {
            const res = await GetReportById(id);
            if (res.code !== 200)
                return toast.error(res.message, {
                    autoClose: 2000,
                    position: "top-right",
                });
            console.log(res.data);
            setValue({
                ...res.data,
                receiveMedicines: res.data.receiveMedicines.map(item => ({
                    ...item,
                    buyingPrice: formatRupiah(item.buyingPrice),
                })),
                transactions: res.data.transactions.map(item => ({
                    ...item,
                    pharmacist: {
                        ...item.pharmacist,
                        fullName: item.pharmacist.firstName + " " + item.pharmacist.lastName
                    },
                    prescription: {
                        ...item.prescription,
                        medicineList: item.prescription.medicineList.map(medicine => ({
                            ...medicine,
                            totalPrice: formatRupiah(medicine.totalPrice),
                            medicine: {
                                ...medicine.medicine,
                                price: formatRupiah(medicine.medicine.price),
                            },
                        })),
                        diagnose: {
                            ...item.prescription.diagnose,
                            doctor: {
                                ...item.prescription.diagnose.doctor,
                                fullName: item.prescription.diagnose.doctor.firstName + " " + item.prescription.diagnose.doctor.lastName
                            },
                        },
                    },
                    totalPrice: formatRupiah(item.totalPrice)
                }))
            });
        } catch (error) {
            console.error(error);
        }
    };


    const handleFinalizeReport = async () => {
        try {
            const res = await finalizeReport(id);
            setValue({ ...value, isFinalized: true })
            toast.success(res.message, {
                autoClose: 2000,
                position: "top-right",
            });
            // TODO: add export to pdf logic
            console.log(res.data);
        } catch (error) {
            console.error(error);
            error.errors.forEach((errorObject) => {
                Object.entries(errorObject).forEach(([field, details]) => {
                    if (field === "unFinalizedReport") {
                        setUnFinalized(true);
                        setErrorData({
                            ...details.data,
                            created_at: formatDate(details.data.created_at),
                        })
                    }
                })
            })
        }
    }

    const goToAnotherReport = (id) => { router.push(`/report/medicine/${id}`); }
    const getReportDate = () => {
        if (value.created_at) {
            return formatDate(value.created_at);
        }
        return "";
    }

    const getReportStatusClass = () => {
        if (value.isFinalized) {
            return "text-success border bg-[#F0FFF4] success-field";
        }
        return "text-danger border bg-[#FEF8F8] error-field";
    }

    useEffect(() => {
        const fetchData = async () => await handleFetchReportById();
        if (router.isReady) fetchData();
    }, [id, router.isReady]);

    const handleDetailPrescription = (index) => {
        const updatedModalState = [...modalState];
        updatedModalState.push({
            data: value.transactions[index].prescription.medicineList,
            table: [
                {
                    column: "Nama Obat",
                    key: "medicine.name",
                },
                {
                    column: "Jumlah Obat",
                    key: "quantity",
                },
                {
                    column: "Harga Per Obat",
                    key: "medicine.price",
                },
                {
                    column: "Total Harga Obat",
                    key: "totalPrice",
                },
            ]
        });
        setModalState(updatedModalState);
    }

    useEffect(() => {
        console.log("modalState", modalState)
        console.log("currState: ", currState)
        console.log("value: ", value)
    }, [modalState, currState, value])

    return (
        <Layout active="master-report" user={user}>
            <ContentLayout
                title="Detail Laporan"
                type="child"
                backpageUrl="/report/medicine"
            >
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                    <div className="sm:col-span-6 flex justify-between">
                        <div class="flex flex-col gap-y-3">
                            <Label id="reportId" label={`ID Laporan ${value.id}`} />
                            <Label id="reportCreateDate" label={`Tanggal Laporan ${getReportDate()}`} />
                        </div>
                        <Label className={`my-3 p-2 font-semibold rounded-lg ${getReportStatusClass()}`} id="transactions" label={`${value.isFinalized ? 'Sudah Diselesaikan ' : 'Belum Diselesaikan'}`} />
                    </div>
                    <div className="sm:col-span-6">
                        <Label className="my-3" id="transactions" label={`Total Transaksi ${value.transactions?.length}`} />
                        <Accordion header="List Transaksi">
                            <Table
                                data={value.transactions || []}
                                bordered
                                cellBordered
                                shouldUpdateScroll={false}
                                affixHorizontalScrollbar
                                loading={isLoading}
                                autoHeight={true}
                            >
                                <Column width={100} fixed="left">
                                    <HeaderCell className="text-center text-dark font-bold"> No </HeaderCell>
                                    <Cell className="text-center text-dark">
                                        {(rowData, index) => index + 1}
                                    </Cell>
                                </Column>

                                <Column flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold"> Nama Pasien </HeaderCell>
                                    <Cell dataKey="patient.name" />
                                </Column>

                                <Column flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold"> Nama Dokter </HeaderCell>
                                    <Cell dataKey="prescription.diagnose.doctor.fullName" />
                                </Column>

                                <Column flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold"> Nama Farmasi </HeaderCell>
                                    <Cell dataKey="pharmacist.fullName" />
                                </Column>

                                <Column flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold"> Total Harga </HeaderCell>
                                    <Cell dataKey="totalPrice" />
                                </Column>

                                <Column width={150} fixed="right">
                                    <HeaderCell className="text-center text-dark font-bold">
                                        Detail Resep
                                    </HeaderCell>
                                    <Cell className="text-center">
                                        {(rowData, index) => {
                                            return (
                                                <div className="flex justify-center flex-row gap-6">
                                                    <button className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                        onClick={() => {
                                                            setCurrState(currState + 1)
                                                            setOpen(true)
                                                            handleDetailPrescription(index)
                                                        }}>
                                                        <PiListMagnifyingGlass />
                                                    </button>
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                            </Table>
                        </Accordion>
                    </div>
                    <div className="sm:col-span-6">
                        <Label className="my-3" id="receiveMedicines" label={`Total Obat Masuk ${value.receiveMedicines?.length}`} />
                        <Accordion header="List Obat Masuk">
                            <Table
                                data={value.receiveMedicines || []}
                                bordered
                                cellBordered
                                shouldUpdateScroll={false}
                                affixHorizontalScrollbar
                                loading={isLoading}
                                autoHeight={true}
                            >
                                <Column width={100} fixed="left">
                                    <HeaderCell className="text-center text-dark font-bold"> No </HeaderCell>
                                    <Cell className="text-center text-dark">
                                        {(rowData, index) => index + 1}
                                    </Cell>
                                </Column>

                                <Column flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold"> Nama Obat </HeaderCell>
                                    <Cell dataKey="medicine.name" />
                                </Column>

                                <Column flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold"> Jumlah Obat Masuk </HeaderCell>
                                    <Cell dataKey="quantity" />
                                </Column>

                                <Column flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold"> Harga Beli </HeaderCell>
                                    <Cell dataKey="buyingPrice" />
                                </Column>

                                <Column flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold"> Metode Pembayaran </HeaderCell>
                                    <Cell dataKey="paymentMethod" />
                                </Column>

                                <Column flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold"> Nama Vendor </HeaderCell>
                                    <Cell dataKey="vendor.name" />
                                </Column>

                                <Column width={150} fixed="right">
                                    <HeaderCell className="text-center text-dark font-bold">
                                        Detail Resep
                                    </HeaderCell>
                                    <Cell className="text-center">
                                        {(rowData, index) => {
                                            return (
                                                <div className="flex justify-center flex-row gap-6">
                                                    <button className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                        onClick={() => {
                                                            setCurrState(index)
                                                            setOpen(true)

                                                        }}>
                                                        <PiListMagnifyingGlass />
                                                    </button>
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                            </Table>
                        </Accordion>
                    </div>
                    <div className="sm:col-span-6">
                        <Label className="my-3" id="outputMedicines" label={`Total Obat Keluar ${value.outputMedicines?.length}`} />
                        <Accordion header="List Obat Keluar">
                            <Table
                                data={value.outputMedicines || []}
                                bordered
                                cellBordered
                                shouldUpdateScroll={false}
                                affixHorizontalScrollbar
                                loading={isLoading}
                                autoHeight={true}
                            >
                                <Column width={100} fixed="left">
                                    <HeaderCell className="text-center text-dark font-bold"> No </HeaderCell>
                                    <Cell className="text-center text-dark">
                                        {(rowData, index) => index + 1}
                                    </Cell>
                                </Column>

                                <Column flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold"> Nama Obat </HeaderCell>
                                    <Cell dataKey="medicine.name" />
                                </Column>

                                <Column flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold"> Jumlah Obat Keluar </HeaderCell>
                                    <Cell dataKey="quantity" />
                                </Column>

                                <Column flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold"> Penyebab Keluar </HeaderCell>
                                    <Cell dataKey="reasonOfDispose" />
                                </Column>

                                <Column width={150} fixed="right">
                                    <HeaderCell className="text-center text-dark font-bold">
                                        Detail Resep
                                    </HeaderCell>
                                    <Cell className="text-center">
                                        {(rowData, index) => {
                                            return (
                                                <div className="flex justify-center flex-row gap-6">
                                                    <button className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                        onClick={() => {
                                                            setCurrState(index)
                                                            setOpen(true)

                                                        }}>
                                                        <PiListMagnifyingGlass />
                                                    </button>
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                            </Table>
                        </Accordion>
                    </div>
                </div>
                {!value.isFinalized &&
                    <div className="flex justify-center gap-2 my-6 lg:justify-end">
                        <Button type="button" appearance="primary" isLoading={isLoading} isDisabled={value.isFinalized} onClick={handleFinalizeReport}>
                            Selesaikan
                        </Button>
                    </div>
                }

                <Toaster
                    type="warning"
                    open={unFinalized}
                    onClose={() => setUnFinalized(false)}
                    body={<>
                        <p>Silahkan selesaikan laporan tanggal <span className="text-danger">{errorData.created_at}</span> terlebih dahulu!</p> </>}
                    onClick={() => {
                        setUnFinalized(false)
                        goToAnotherReport(errorData.id)
                    }}
                    btnText="Lihat Laporan"
                    btnAppearance="primary"
                />

            </ContentLayout>

            {currState !== 0 &&
                <Modal
                    backdrop="static"
                    open={open}
                    onClose={() => {
                        setCurrState(currState - 1)
                        const prevModalState = [...modalState]
                        prevModalState.pop()
                        setModalState(prevModalState)
                        setOpen(false)
                    }}
                    size="lg"
                >
                    <Header className="text-2xl font-bold">Detail Resep</Header>
                    <Body className="pt-2">
                        <Accordion header="Daftar Obat">
                            <Table
                                data={modalState[currState].data || []}
                                bordered
                                cellBordered
                                shouldUpdateScroll={false}
                                affixHorizontalScrollbar
                                loading={isLoading}
                                autoHeight={true}
                            >
                                <Column width={100} fixed="left">
                                    <HeaderCell className="text-center text-dark font-bold"> No </HeaderCell>
                                    <Cell className="text-center text-dark">
                                        {(rowData, index) => index + 1}
                                    </Cell>
                                </Column>

                                {modalState[currState].table.map(item =>
                                    <Column flexGrow={1}>
                                        <HeaderCell className="text-dark font-bold"> {item.column} </HeaderCell>
                                        <Cell dataKey={item.key} />
                                    </Column>
                                )}

                                <Column width={150} fixed="right">
                                    <HeaderCell className="text-center text-dark font-bold">
                                        Detail Obat
                                    </HeaderCell>
                                    <Cell className="text-center">
                                        {(rowData, index) => {
                                            return (
                                                <div className="flex justify-center flex-row gap-6">
                                                    <button className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                        onClick={() => {
                                                            console.log("rowdata", rowData)
                                                        }}>
                                                        <PiListMagnifyingGlass />
                                                    </button>
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>

                            </Table>
                        </Accordion>
                    </Body>
                    <Footer className="pt-4">
                    </Footer>
                </Modal>
            }
        </Layout>
    );
}
