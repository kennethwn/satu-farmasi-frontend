import Button from "@/components/Button";
import Input from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/pages/api/context/UserContext";
import useReportAPI from "@/pages/api/master/report";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Accordion from "@/components/Accordion/index";
import { Header, Modal, Table } from "rsuite";
import { formatRupiah } from "@/helpers/currency";
import { PiListMagnifyingGlass } from "react-icons/pi";
import Toaster from "@/components/Modal/Toaster";
import Label from "@/components/Input/Label";
import useOutputMedicineAPI from "@/pages/api/transaction/outputMedicine";
import { generateOutputMedicine } from "@/data/document";
import OutputMedicineWitnessForm from "@/components/DynamicForms/OuputMedicineWitnessForm";
import formatDate, { formatCalendar } from "@/helpers/dayHelper";
import usePharmacy from "@/pages/api/pharmacy";
import Text from "@/components/Text";
import prescriptionStatusMapped from "@/helpers/prescriptionStatusMap";

export default function index() {
    const router = useRouter();
    const id = router.query.id;
    const { Header, Body, Footer } = Modal;
    const { HeaderCell, Cell, Column } = Table;
    const { isLoading, GetReportById, finalizeReport, checkExpiredMedicine } =
        useReportAPI();

    const prescriptionStatusMap = prescriptionStatusMapped;
    const [currState, setCurrState] = useState(0);
    const { bulkCreate, GetOutputMedicineById } = useOutputMedicineAPI();
    const { getPharmacyInfo } = usePharmacy();

    const [modalState, setModalState] = useState([
        {
            data: [],
            table: [
                {
                    column: "",
                    key: "",
                },
            ],
        },
    ]);
    const [errors, setErrors] = useState({
        medicineId: "",
        quantity: "",
        reasonOfDispose: "",
        oldQuantity: "",
        medicine: {
            currstock: "",
        },
        physicalReport: {
            data: {
                pharmacist: "",
                sipaNumber: "",
                pharmacy: "",
                addressPharmacy: "",
                witnesses: [{ name: "", nip: "", role: "" }],
            }
        }
    });

    const { user } = useUserContext();
    const [value, setValue] = useState({
        transactions: [
            {
                id: 0,
                patient: {
                    id: 0,
                    name: "",
                },
                prescription: {
                    id: 0,
                    status: "",
                    medicineList: [
                        {
                            id: 0,
                            medicineCode: "",
                            quantity: 0,
                            instruction: "",
                            totalPrice: "",
                            draft: false,
                            medicine: {
                                id: 0,
                                name: "",
                                price: "",
                            },
                        },
                    ],
                    diagnose: {
                        doctor: {
                            fullName: "",
                        },
                    },
                },
                pharmacist: {
                    id: 5,
                    firstName: "",
                    lastName: "",
                    fullName: "",
                },
                totalPrice: "",
            },
        ],
        receiveMedicines: [
            {
                vendor: {},
                medicine: {
                    packaging: {
                        id: "",
                        value: "",
                    },
                    genericName: {
                        id: "",
                        value: "",
                    },
                    classifications: [
                        {
                            classification: {
                                id: "",
                                value: "",
                            },
                        },
                    ],
                },
            },
        ],
        outputMedicines: [
            {
                id: 0,
                quantity: 0,
                reasonOfDispose: "",
                physicalReportId: 0,
                medicine: {
                    id: 0,
                    code: "",
                    name: "",
                    batchCode: "",
                    genericNameId: 0,
                    merk: "",
                    description: "",
                    unitOfMeasure: "",
                    price: "",
                    expiredDate: "",
                    packagingId: 0,
                    currStock: 0,
                    minStock: 0,
                    maxStock: 0,
                    reservedStock: 0,
                    sideEffect: "",
                },
                medicineName: ""
            },
        ]
    });
    const [unFinalized, setUnFinalized] = useState(false);
    const [hasExpiredMedicine, setHasExpiredMedicine] = useState(false);
    const [showExpiredMedicine, setShowExpiredMedicine] = useState(false);
    const [showPrescirptions, setShowPrescriptions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showVendor, setShowVendor] = useState(false);
    const [showOutputMedicine, setShowOuputMedicine] = useState(false);
    const [showReceiveMedicineDetail, setShowReceiveMedicineDetail] =
        useState(false);

    const [expiredMedicineList, setExpiredMedicineList] = useState([]);
    const [errorData, setErrorData] = useState(false);
    const [open, setOpen] = useState(false);

    const [formField, setFormField] = useState([
        { name: "", nip: "", role: "" },
    ]);

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
                receiveMedicines: res.data.receiveMedicines.map((item) => ({
                    ...item,
                    buyingPrice: formatRupiah(item.buyingPrice),
                    medicine: {
                        ...item.medicine,
                        expiredDate: formatCalendar(item.medicine.expiredDate)
                    }
                })),
                outputMedicines: res.data.outputMedicines.map((item) => ({
                    ...item,
                    medicineName: item.medicine.name,
                    medicine: {
                        ...item.medicine,
                        expiredDate: formatCalendar(item.medicine.expiredDate)
                    }
                })),
                transactions: res.data.transactions.map((item) => ({
                    ...item,
                    pharmacist: {
                        ...item.pharmacist,
                        fullName:
                            item.pharmacist.firstName +
                            " " +
                            item.pharmacist.lastName,
                    },
                    prescription: {
                        ...item.prescription,
                        medicineList: item.prescription.medicineList.map(
                            (medicine) => ({
                                ...medicine,
                                totalPrice: formatRupiah(medicine.totalPrice),
                                medicine: {
                                    ...medicine.medicine,
                                    price: formatRupiah(
                                        medicine.medicine.price,
                                    ),
                                },
                            }),
                        ),
                        diagnose: {
                            ...item.prescription.diagnose,
                            doctor: {
                                ...item.prescription.diagnose?.doctor,
                                fullName:
                                    item.prescription.diagnose?.doctor
                                        ?.firstName +
                                    " " +
                                    item.prescription.diagnose?.doctor
                                        ?.lastName,
                            },
                        },
                    },
                    totalPrice: formatRupiah(item.totalPrice),
                })),
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleFinalizeReport = async () => {
        try {
            const res = await finalizeReport(id);
            console.log("res finalizeReport: ", res);
            setValue({ ...value, isFinalized: true });
            toast.success(res.message, {
                autoClose: 2000,
                position: "top-right",
            });
            console.log(res.data);
        } catch (error) {
            console.log("error finalizeReport: ", error);
            console.error(error);
            toast.error(error.message, {
                autoClose: 3000,
                position: "top-right",
            })
            error.errors.forEach((errorObject) => {
                Object.entries(errorObject).forEach(([field, details]) => {
                    if (field === "unFinalizedReport") {
                        setUnFinalized(true);
                        setErrorData({
                            ...details.data,
                            created_at: formatDate(details.data.created_at),
                        });
                    } else if (field === "hasExpiredMedicine") {
                        setHasExpiredMedicine(true);
                    }
                });
            });
        }
    };

    const handleFetchExpiredMedicine = async () => {
        try {
            const res = await checkExpiredMedicine();
            setShowExpiredMedicine(true);
            let temp = [...res.data];
            temp = temp.map((item) => ({
                ...item,
                expiredDate: formatCalendar(item.expiredDate),
            }));
            setExpiredMedicineList(temp);
        } catch (error) {
            console.error(error);
        }
    };

    const goToAnotherReport = (id) => {
        router.push(`/report/medicine/${id}`);
    };
    const getReportDate = () => {
        if (value.created_at) {
            return formatDate(value.created_at);
        }
        return "";
    };

    const getReportStatusClass = () => {
        if (value.isFinalized) {
            return "text-success border bg-[#F0FFF4] success-field";
        }
        return "text-danger border bg-[#FEF8F8] error-field";
    };

    useEffect(() => {
        const fetchData = async () => await handleFetchReportById();
        if (router.isReady) fetchData();
    }, [id, router.isReady]);

    const handleDetailPrescriptionFromTransaction = (index) => {
        setCurrState(currState + 1);
        setOpen(true);
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
            ],
        });
        setModalState(updatedModalState);
    };

    const HandleMedicineFromReceiveMedicine = (index) => {
        setCurrState(currState + 1);
        setOpen(true);
        const updatedModalState = [...modalState];
        updatedModalState.push({
            data: value.receiveMedicines[index].medicine,
            table: [
                {
                    column: "Kode Obat",
                    key: "code",
                },
                {
                    column: "Nama Obat",
                    key: "name",
                },
                {
                    column: "Merk",
                    key: "name",
                },
                {
                    column: "Deskripsi Obat",
                    key: "description",
                },
                {
                    column: "Satuan Kemasan",
                    key: "unitOfMeasure",
                },
                {
                    column: "Harga Obat",
                    key: "price",
                },
                {
                    column: "Total Harga Obat",
                    key: "totalPrice",
                },
            ],
        });
        setModalState(updatedModalState);
    };

    const HandleFetchOutputMedicinePhysicalReport = async (id) => {
        try {
            const res = await GetOutputMedicineById(id);
            if (res.code != 200) return;

            const input = res.data.physicalReport.data;
            input.created_at = res.data.physicalReport.created_at;

            let medicines = [];
            const medicine = res.data.medicine;
            medicines = [...medicines, medicine];

            let reasonOfDispose = res.data.reasonOfDispose;

            generateOutputMedicine(input, medicines, reasonOfDispose);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBulkMedicine = async () => {
        try {
            const { name, address } = await handleFetchPharmacyInfo();
            const submitedData = {
                medicineList: expiredMedicineList,
                physicalReport: {
                    id: 0,
                    data: {
                        pharmacist: user.name,
                        sipaNumber: user.sipaNumber,
                        pharmacy: name,
                        addressPharmacy: address,
                        witnesses: formField,
                    },
                },
            };
            const res = await bulkCreate(submitedData);
            toast.success(res.message, {
                autoClose: 2000,
                position: "top-right",
            });
            console.log("expired medicine: ", expiredMedicineList);
            setValue({
                ...value,
                outputMedicine: value.outputMedicines.push(
                    ...expiredMedicineList,
                ),
            });
            setShowExpiredMedicine(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        console.log("value: ", value);
        console.log("value: ", JSON.stringify(value));
    }, [value]);

    useEffect(() => {
        console.log("showVendor: ", showVendor);
    }, [showVendor]);

    useEffect(() => {
        console.log("activeIndex", activeIndex);
    }, [activeIndex]);

    useEffect(() => {
        console.log("hasExpiredMedicine", hasExpiredMedicine);
    }, [hasExpiredMedicine]);

    const handleFetchPharmacyInfo = async () => {
        try {
            const res = await getPharmacyInfo();
            const { name, address } = res.data;
            return { name, address };
        } catch (error) {
            console.error(error);
        }
    };

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
                            <Label
                                id="reportId"
                                label={`ID Laporan ${value.id}`}
                            />
                            <Label
                                id="reportCreateDate"
                                label={`Tanggal Laporan ${getReportDate()}`}
                            />
                        </div>
                        <Label
                            className={`my-3 p-2 font-semibold rounded-lg ${getReportStatusClass()}`}
                            id="transactions"
                            label={`${value.isFinalized ? "Sudah Diselesaikan " : "Belum Diselesaikan"}`}
                        />
                    </div>
                    <div className="sm:col-span-6">
                        <Label
                            className="my-3"
                            id="transactions"
                            label={`Total Transaksi ${value.transactions?.length || 0}`}
                        />
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
                                    <HeaderCell className="text-center text-dark font-bold">
                                        {" "}
                                        No{" "}
                                    </HeaderCell>
                                    <Cell className="text-center text-dark">
                                        {(rowData, index) => index + 1}
                                    </Cell>
                                </Column>

                                <Column width={200} flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Nama Pasien{" "}
                                    </HeaderCell>
                                    <Cell dataKey="patient.name" />
                                </Column>

                                <Column width={200} flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Nama Dokter{" "}
                                    </HeaderCell>
                                    <Cell>
                                        {(rowData, index) => {
                                            return rowData.prescription.diagnose
                                                .doctor.fullName !==
                                                "undefined undefined"
                                                ? rowData.prescription.diagnose
                                                    .doctor.fullName
                                                : "-";
                                        }}
                                    </Cell>
                                </Column>

                                <Column width={200} flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Nama Apoteker{" "}
                                    </HeaderCell>
                                    <Cell dataKey="pharmacist.fullName" />
                                </Column>

                                <Column width={200} flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Total Harga{" "}
                                    </HeaderCell>
                                    <Cell dataKey="totalPrice" />
                                </Column>

                                <Column width={150} fixed="right">
                                    <HeaderCell className="text-center text-dark font-bold">
                                        Detail Resep
                                    </HeaderCell>
                                    <Cell className="text-center" style={{ padding: '6px' }}>
                                        {(rowData, index) => {
                                            return (
                                                <div className="flex justify-center flex-row gap-6">
                                                    <button
                                                        className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                        onClick={() => {
                                                            setShowPrescriptions(
                                                                true,
                                                            );
                                                            setActiveIndex(
                                                                index,
                                                            );
                                                        }}
                                                    >
                                                        <PiListMagnifyingGlass size="1.5em" />
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
                        <Label
                            className="my-3"
                            id="receiveMedicines"
                            label={`Total Obat Masuk ${value.receiveMedicines?.length || 0}`}
                        />
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
                                    <HeaderCell className="text-center text-dark font-bold">
                                        {" "}
                                        No{" "}
                                    </HeaderCell>
                                    <Cell className="text-center text-dark">
                                        {(rowData, index) => index + 1}
                                    </Cell>
                                </Column>

                                <Column width={200} resizable>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Document Number{" "}
                                    </HeaderCell>
                                    <Cell dataKey="documentNumber" />
                                </Column>

                                <Column width={200} resizable>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Nama Obat{" "}
                                    </HeaderCell>
                                    <Cell dataKey="medicine.name" />
                                </Column>

                                <Column width={200} resizable>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Kode Batch{" "}
                                    </HeaderCell>
                                    <Cell dataKey="batchCode" />
                                </Column>

                                <Column width={200} resizable>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Jumlah Obat Masuk{" "}
                                    </HeaderCell>
                                    <Cell dataKey="quantity" />
                                </Column>

                                <Column width={200} resizable>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Harga Beli{" "}
                                    </HeaderCell>
                                    <Cell dataKey="buyingPrice" />
                                </Column>

                                <Column width={200} resizable>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Metode Pembayaran{" "}
                                    </HeaderCell>
                                    <Cell dataKey="paymentMethod" />
                                </Column>

                                <Column width={200} resizable>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Nama Vendor{" "}
                                    </HeaderCell>
                                    <Cell dataKey="vendor.name" />
                                </Column>

                                <Column width={150} fixed="right">
                                    <HeaderCell className="text-center text-dark font-bold">
                                        Detail Vendor
                                    </HeaderCell>
                                    <Cell className="text-center" style={{ padding: '6px' }}>
                                        {(rowData, index) => {
                                            return (
                                                <div className="flex justify-center flex-row gap-6">
                                                    <button
                                                        className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                        onClick={() => {
                                                            setShowVendor(true);
                                                            setActiveIndex(
                                                                index,
                                                            );
                                                        }}
                                                    >
                                                        <PiListMagnifyingGlass size="1.5em" />
                                                    </button>
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>

                                <Column width={150} fixed="right">
                                    <HeaderCell className="text-center text-dark font-bold">
                                        Detail Obat
                                    </HeaderCell>
                                    <Cell className="text-center" style={{ padding: '6px' }}>
                                        {(rowData, index) => {
                                            return (
                                                <div className="flex justify-center flex-row gap-6">
                                                    <button
                                                        className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                        onClick={() => {
                                                            setShowReceiveMedicineDetail(
                                                                true,
                                                            );
                                                            setActiveIndex(
                                                                index,
                                                            );
                                                        }}
                                                    >
                                                        <PiListMagnifyingGlass size="1.5em" />
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
                        <div className="flex justify-between">
                            <Label
                                className="my-3"
                                id="outputMedicines"
                                label={`Total Obat Keluar ${value.outputMedicines?.length || 0}`}
                            />
                            <Button onClick={handleFetchExpiredMedicine}>
                                Cek Obat Expired
                            </Button>
                        </div>
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
                                    <HeaderCell className="text-center text-dark font-bold">
                                        {" "}
                                        No{" "}
                                    </HeaderCell>
                                    <Cell className="text-center text-dark">
                                        {(rowData, index) => index + 1}
                                    </Cell>
                                </Column>

                                <Column width={200} flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Nama Obat{" "}
                                    </HeaderCell>
                                    <Cell dataKey="medicineName" />
                                </Column>

                                <Column width={200} rflexGrow={1}>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Jumlah Obat Keluar{" "}
                                    </HeaderCell>
                                    <Cell dataKey="quantity" />
                                </Column>

                                <Column width={200} flexGrow={1}>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Penyebab Keluar{" "}
                                    </HeaderCell>
                                    <Cell dataKey="reasonOfDispose" />
                                </Column>

                                <Column width={150} flexGrow={1}>
                                    <HeaderCell className="text-center text-dark font-bold">
                                        Detail Obat
                                    </HeaderCell>
                                    <Cell className="text-center" style={{ padding: '6px' }}>
                                        {(rowData, index) => {
                                            return (
                                                <div className="flex justify-center flex-row gap-6">
                                                    <button
                                                        className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                        onClick={() => {
                                                            setShowOuputMedicine(true)
                                                            setActiveIndex(index)
                                                        }}
                                                    >
                                                        <PiListMagnifyingGlass size="1.5em" />
                                                    </button>
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>

                                <Column width={150} flexGrow={1}>
                                    <HeaderCell className="text-center text-dark font-bold">
                                        Export PDF
                                    </HeaderCell>
                                    <Cell className="text-center" style={{ padding: '6px' }}>
                                        {(rowData, index) => {
                                            return (
                                                <div className="flex justify-center flex-row gap-6">
                                                    <button
                                                        className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                        onClick={() =>
                                                            HandleFetchOutputMedicinePhysicalReport(
                                                                rowData?.id,
                                                            )
                                                        }
                                                    >
                                                        <PiListMagnifyingGlass size="1.5em" />
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
                {!value.isFinalized && (
                    <div className="flex justify-center gap-2 my-6 py-4 lg:justify-end">
                        <Button
                            type="button"
                            appearance="primary"
                            isLoading={isLoading}
                            isDisabled={value.isFinalized}
                            onClick={handleFinalizeReport}
                        >
                            Selesaikan
                        </Button>
                    </div>
                )}

                <Toaster
                    type="warning"
                    open={unFinalized}
                    onClose={() => setUnFinalized(false)}
                    body={
                        <>
                            <p>
                                Silahkan selesaikan laporan tanggal{" "}
                                <span className="text-danger">
                                    {errorData.created_at}
                                </span>{" "}
                                terlebih dahulu!
                            </p>{" "}
                        </>
                    }
                    onClick={() => {
                        setUnFinalized(false);
                        goToAnotherReport(errorData.id);
                    }}
                    btnText="Lihat Laporan"
                    btnAppearance="primary"
                />

                {value && value.transactions.length > 0 ? (
                    <Toaster
                        size="lg"
                        type="primary"
                        showBtn={false}
                        title={"Detail Resep"}
                        open={showPrescirptions}
                        onClose={() => setShowPrescriptions(false)}
                        body={
                            <div className="sm:col-span-6 text-start">
                                <div className="flex gap-x-5">
                                    <Input
                                        label={"Nama Pasien"}
                                        value={
                                            value.transactions[activeIndex]
                                                .patient.name
                                        }
                                        type={"text"}
                                        disabled
                                        name={"name"}
                                        autofocus={false}
                                        placeholder={"Nama Pasien"}
                                    />

                                    <Input
                                        label={"Nama Farmasi"}
                                        value={
                                            value.transactions[activeIndex]
                                                .pharmacist.fullName
                                        }
                                        type={"text"}
                                        disabled
                                        name={"name"}
                                        autofocus={false}
                                        placeholder={"Nama Farmasi"}
                                    />
                                </div>

                                <Input
                                    label={"Status Resep"}
                                    value={
                                        prescriptionStatusMap.get(
                                            value.transactions[activeIndex]
                                                .prescription.status,
                                        )?.label
                                    }
                                    type={"text"}
                                    disabled
                                    name={"status"}
                                    autofocus={false}
                                    placeholder={"Status Resep"}
                                />

                                <Input
                                    label={"Total Harga Transaksi"}
                                    value={
                                        value.transactions[activeIndex]
                                            .totalPrice
                                    }
                                    type={"text"}
                                    currency={true}
                                    disabled
                                    name={"totalPrice"}
                                    autofocus={false}
                                    placeholder={"Total Harga Transaksi"}
                                />

                                <Text type={"title"} className="mb-3">
                                    List Obat
                                </Text>

                                {value.transactions[
                                    activeIndex
                                ].prescription.medicineList.map((item) => {
                                    return (
                                        <>
                                            <div className="flex gap-x-5">
                                                <Input
                                                    label={"Nama Obat"}
                                                    value={item.medicine.name}
                                                    type={"text"}
                                                    disabled
                                                    name={"medicineName"}
                                                    autofocus={false}
                                                    placeholder={"Nama Obat"}
                                                />

                                                <Input
                                                    label={"Jumlah Obat"}
                                                    value={item.quantity}
                                                    type={"text"}
                                                    disabled
                                                    name={"quantity"}
                                                    autofocus={false}
                                                    placeholder={"Jumlah Obat"}
                                                />

                                                <Input
                                                    label={"Harga Per Obat"}
                                                    value={item.medicine.price}
                                                    type={"text"}
                                                    disabled
                                                    name={"price"}
                                                    autofocus={false}
                                                    placeholder={
                                                        "Harga Per Obat"
                                                    }
                                                />

                                                <Input
                                                    label={"Total Harga Obat"}
                                                    value={item.totalPrice}
                                                    type={"text"}
                                                    disabled
                                                    name={"totalPrice"}
                                                    autofocus={false}
                                                    placeholder={
                                                        "Total Harga Obat"
                                                    }
                                                />
                                            </div>

                                            <Input
                                                label={"Kode Obat"}
                                                value={item.medicineCode}
                                                type={"text"}
                                                disabled
                                                name={"medicineCode"}
                                                autofocus={false}
                                                placeholder={"Kode Obat"}
                                            />
                                        </>
                                    );
                                })}
                            </div>
                        }
                        onClick={() => {
                            setShowPrescriptions(false);
                        }}
                    />
                ) : null}


                {value && value.outputMedicines.length > 0 ? (
<>
                        <Toaster
                            size="lg"
                            type="primary"
                            showBtn={false}
                            title={"Detail Obat Keluar"}
                            open={showOutputMedicine}
                            onClose={() => setShowOuputMedicine(false)}
                            body={
                                <div className="sm:col-span-6 text-start">
                                    <div className="flex gap-x-5">
                                            {/*  TODO: medicine.name is undefined */}
                                        <Input
                                            label={"Nama Obat"}
                                            value={
                                                value.outputMedicines[
                                                    activeIndex
                                                ].medicine.name
                                            }
                                            type={"text"}
                                            disabled
                                            name={"medicineName"}
                                            autofocus={false}
                                            placeholder={"Nama Obat"}
                                        />

                                        <Input
                                            label={"Kode Batch"}
                                            value={
                                                value.outputMedicines[
                                                    activeIndex
                                                ].medicine.batchCode
                                            }
                                            type={"text"}
                                            disabled
                                            name={"batchCode"}
                                            autofocus={false}
                                            placeholder={"Kode Batch"}
                                        />
                                    </div>

                                    <Input
                                        label={"Merek"}
                                        value={
                                            value.outputMedicines[activeIndex]
                                                .medicine.merk
                                        }
                                        type={"text"}
                                        disabled
                                        name={"merk"}
                                        autofocus={false}
                                        placeholder={"Nama Merek"}
                                    />

                                    <Input
                                        label={"Deskripsi Obat"}
                                        value={
                                            value.outputMedicines[activeIndex]
                                                .medicine.description
                                        }
                                        type={"text"}
                                        disabled
                                        name={"description"}
                                        autofocus={false}
                                        placeholder={"Deskripsi Obat"}
                                    />

                                    <Input
                                        label={"Efek Samping"}
                                        value={
                                            value.outputMedicines[activeIndex]
                                                .medicine.sideEffect
                                        }
                                        type={"text"}
                                        disabled
                                        name={"sideEffect"}
                                        autofocus={false}
                                        placeholder={"Efek Samping"}
                                    />

                                    <Input
                                        label={"Harga Obat"}
                                        value={
                                            value.outputMedicines[activeIndex]
                                                .medicine.price
                                        }
                                        type={"text"}
                                        currency={true}
                                        disabled
                                        name={"price"}
                                        autofocus={false}
                                        placeholder={"Harga Obat"}
                                    />

                                    <div className="flex gap-x-5">
                                        <Input
                                            label={"Satuan Ukuran"}
                                            value={
                                                value.outputMedicines[
                                                    activeIndex
                                                ].medicine.unitOfMeasure
                                            }
                                            type={"text"}
                                            disabled
                                            name={"unitOfMeasure"}
                                            autofocus={false}
                                            placeholder={"Satuan Ukuran"}
                                        />
                                        <Input
                                            label={"Tanggal Kedaluwarsa"}
                                            value={
                                                value.outputMedicines[
                                                    activeIndex
                                                ].medicine.expiredDate
                                            }
                                            type={"text"}
                                            disabled
                                            name={"expiredDate"}
                                            autofocus={false}
                                            placeholder={"Tanggal Kedaluwarsa"}
                                        />
                                    </div>
                                </div>
                            }
                            onClick={() => {
                                setShowReceiveMedicineDetail(false);
                            }}
                        />
</>
                ): null}

                {value && value.receiveMedicines.length > 0 ? (
                    <>
                        <Toaster
                            size="lg"
                            type="primary"
                            showBtn={false}
                            title={"Detail Obat Masuk"}
                            open={showReceiveMedicineDetail}
                            onClose={() => setShowReceiveMedicineDetail(false)}
                            body={
                                <div className="flex flex-col sm:col-span-6 text-start gap-2">
                                    <div className="flex flex-row gap-x-5">
                                        <Input
                                            label={"Nama Obat"}
                                            value={
                                                value.receiveMedicines[
                                                    activeIndex
                                                ].medicine.name
                                            }
                                            type={"text"}
                                            disabled
                                            name={"medicineName"}
                                            autofocus={false}
                                            placeholder={"Nama Obat"}
                                        />

                                        <Input
                                            label={"Kode Batch"}
                                            value={
                                                value.receiveMedicines[
                                                    activeIndex
                                                ].medicine.batchCode
                                            }
                                            type={"text"}
                                            disabled
                                            name={"batchCode"}
                                            autofocus={false}
                                            placeholder={"Kode Batch"}
                                        />
                                    </div>

                                    <Input
                                        label={"Merek"}
                                        value={
                                            value.receiveMedicines[activeIndex]
                                                .medicine.merk
                                        }
                                        type={"text"}
                                        disabled
                                        name={"merk"}
                                        autofocus={false}
                                        placeholder={"Nama Merek"}
                                    />

                                    <Input
                                        label={"Deskripsi Obat"}
                                        value={
                                            value.receiveMedicines[activeIndex]
                                                .medicine.description
                                        }
                                        type={"text"}
                                        disabled
                                        name={"description"}
                                        autofocus={false}
                                        placeholder={"Deskripsi Obat"}
                                    />

                                    <Input
                                        label={"Efek Samping"}
                                        value={
                                            value.receiveMedicines[activeIndex]
                                                .medicine.sideEffect
                                        }
                                        type={"text"}
                                        disabled
                                        name={"sideEffect"}
                                        autofocus={false}
                                        placeholder={"Efek Samping"}
                                    />

                                    <Input
                                        label={"Harga Obat"}
                                        value={
                                            value.receiveMedicines[activeIndex]
                                                .medicine.price
                                        }
                                        type={"text"}
                                        currency={true}
                                        disabled
                                        name={"price"}
                                        autofocus={false}
                                        placeholder={"Harga Obat"}
                                    />

                                    <div className="flex gap-x-5">
                                        <Input
                                            label={"Satuan Ukuran"}
                                            value={
                                                value.receiveMedicines[
                                                    activeIndex
                                                ].medicine.unitOfMeasure
                                            }
                                            type={"text"}
                                            disabled
                                            name={"unitOfMeasure"}
                                            autofocus={false}
                                            placeholder={"Satuan Ukuran"}
                                        />
                                        <Input
                                            label={"Tanggal Kedaluwarsa"}
                                            value={
                                                value.receiveMedicines[
                                                    activeIndex
                                                ].medicine.expiredDate
                                            }
                                            type={"text"}
                                            disabled
                                            name={"expiredDate"}
                                            autofocus={false}
                                            placeholder={"Tanggal Kedaluwarsa"}
                                        />
                                    </div>

                                    <div className="flex gap-x-5">
                                        <Input
                                            label={"Nama Generik"}
                                            value={
                                                value.receiveMedicines[
                                                    activeIndex
                                                ].medicine.genericName.value
                                            }
                                            type={"text"}
                                            disabled
                                            name={"genericName"}
                                            autofocus={false}
                                            placeholder={"Nama Generik"}
                                        />
                                        <Input
                                            label={"Nama Kemasan"}
                                            value={
                                                value.receiveMedicines[
                                                    activeIndex
                                                ].medicine.packaging.value
                                            }
                                            type={"text"}
                                            disabled
                                            name={"packaging"}
                                            autofocus={false}
                                            placeholder={"Nama Kemasan"}
                                        />
                                    </div>
                                    <label
                                        htmlFor="genericNameId"
                                        className="block text-body font-medium leading-6 pt-2 text-dark mb-2"
                                    >
                                        Klasifikasi Obat
                                    </label>

                                    <div className="flex flex-col gap-y-5">
                                        {value.receiveMedicines[
                                            activeIndex
                                        ].medicine.classifications.map(
                                            (item) => {
                                                return (
                                                    <Input
                                                        value={
                                                            item.classification
                                                                .value
                                                        }
                                                        type={"text"}
                                                        disabled
                                                        name={
                                                            "classificationName"
                                                        }
                                                        autofocus={false}
                                                        placeholder={
                                                            "Nama Klasifikasi"
                                                        }
                                                    />
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            }
                            onClick={() => {
                                setShowOuputMedicine(false);
                            }}
                        />

                        <Toaster
                            size="lg"
                            type="primary"
                            showBtn={false}
                            title={"Detail Vendor"}
                            open={showVendor}
                            onClose={() => setShowVendor(false)}
                            body={
                                <div className="sm:col-span-6 text-start">
                                    <Input
                                        label={"Nama Vendor"}
                                        value={
                                            value.receiveMedicines[activeIndex]
                                                .vendor.name
                                        }
                                        type={"text"}
                                        disabled
                                        name={"vendorName"}
                                        autofocus={false}
                                        placeholder={"Nama Vendor"}
                                    />

                                    <Input
                                        label={"No Handphone"}
                                        value={
                                            value.receiveMedicines[activeIndex]
                                                .vendor.phoneNum
                                        }
                                        type={"number"}
                                        disabled
                                        name={"phoneNum"}
                                        autofocus={false}
                                        placeholder={"No Handphone"}
                                    />

                                    <Input
                                        label={"Alamat"}
                                        value={
                                            value.receiveMedicines[activeIndex]
                                                .vendor.address
                                        }
                                        type={"text"}
                                        disabled
                                        name={"address"}
                                        autofocus={false}
                                        placeholder={"Alamat"}
                                    />

                                    <Input
                                        label={"Kota"}
                                        value={
                                            value.receiveMedicines[activeIndex]
                                                .vendor.city
                                        }
                                        type={"text"}
                                        disabled
                                        name={"city"}
                                        autofocus={false}
                                        placeholder={"city"}
                                    />
                                </div>
                            }
                            onClick={() => {
                                setShowVendor(false);
                            }}
                        />
                    </>
                ) : null}

                <Toaster
                    type={"primary"}
                    open={hasExpiredMedicine}
                    onClose={() => setHasExpiredMedicine(false)}
                    body={
                        <>
                            {" "}
                            Beberapa obat sudah kadaluarsa dan belum
                            dikeluarkan, silakan cek obat kadaluarsa hari ini
                            terlebih dahulu{" "}
                        </>
                    }
                    onClick={() => {
                        setHasExpiredMedicine(false);
                        handleFetchExpiredMedicine();
                    }}
                    title={"Konfirmasi"}
                    btnText="Lanjutkan"
                />

                <Toaster
                    size="lg"
                    type={"primary"}
                    showBtn={expiredMedicineList.length > 0}
                    open={showExpiredMedicine}
                    onClose={() => setShowExpiredMedicine(false)}
                    body={
                        <>
                            <Table
                                data={expiredMedicineList || []}
                                bordered
                                cellBordered
                                shouldUpdateScroll={false}
                                affixHorizontalScrollbar
                                loading={isLoading}
                                autoHeight={true}
                            >
                                <Column width={100} fixed="left">
                                    <HeaderCell className="text-center text-dark font-bold">
                                        No
                                    </HeaderCell>
                                    <Cell className="text-center text-dark">
                                        {(rowData, index) => index + 1}
                                    </Cell>
                                </Column>

                                <Column width={100}>
                                    <HeaderCell className="text-dark font-bold">
                                        ID Obat{" "}
                                    </HeaderCell>
                                    <Cell dataKey="medicineId" />
                                </Column>

                                <Column width={300}>
                                    <HeaderCell className="text-dark font-bold">
                                        Nama Obat{" "}
                                    </HeaderCell>
                                    <Cell dataKey="medicineName" />
                                </Column>

                                <Column width={250}>
                                    <HeaderCell className="text-dark font-bold">
                                        Kode Batch
                                    </HeaderCell>
                                    <Cell dataKey="batchCode" />
                                </Column>

                                <Column width={200} resizable>
                                    <HeaderCell className="text-dark font-bold">
                                        {" "}
                                        Tanggal Kedaluwarsa{" "}
                                    </HeaderCell>
                                    <Cell dataKey="expiredDate" />
                                </Column>

                                <Column width={100}>
                                    <HeaderCell className="text-dark font-bold">
                                        Stok Tersisa
                                    </HeaderCell>
                                    <Cell dataKey="currStock" />
                                </Column>

                                <Column width={100}>
                                    <HeaderCell className="text-dark font-bold">
                                        Jumlah
                                    </HeaderCell>
                                    <Cell dataKey="quantity" />
                                </Column>

                                <Column width={200} fixed="right">
                                    <HeaderCell className="text-dark font-bold">
                                        Penyebab Keluar
                                    </HeaderCell>
                                    <Cell dataKey="reasonOfDispose" />
                                </Column>
                            </Table>
                            {expiredMedicineList.length > 0 && (
                                <div className="w-full my-6">
                                    <OutputMedicineWitnessForm
                                        isLoading={isLoading}
                                        formFields={formField}
                                        setFormFields={setFormField}
                                        setErrors={setErrors}
                                        errors={errors}
                                    />
                                </div>
                            )}
                        </>
                    }
                    onClick={handleBulkMedicine}
                    title={"List Obat Expired"}
                    btnText="Tambahkan ke Pengeluaran Obat"
                />
            </ContentLayout>

            {currState !== 0 && (
                <Modal
                    backdrop="static"
                    open={open}
                    onClose={() => {
                        setCurrState(currState - 1);
                        const prevModalState = [...modalState];
                        prevModalState.pop();
                        setModalState(prevModalState);
                        setOpen(false);
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
                                    <HeaderCell className="text-center text-dark font-bold">
                                        {" "}
                                        No{" "}
                                    </HeaderCell>
                                    <Cell className="text-center text-dark">
                                        {(rowData, index) => index + 1}
                                    </Cell>
                                </Column>

                                {modalState[currState].table.map((item) => (
                                    <Column width={200} resizable>
                                        <HeaderCell className="text-dark font-bold">
                                            {" "}
                                            {item.column}{" "}
                                        </HeaderCell>
                                        <Cell dataKey={item.key} />
                                    </Column>
                                ))}

                                <Column width={150} fixed="right">
                                    <HeaderCell className="text-center text-dark font-bold">
                                        Detail Obat
                                    </HeaderCell>
                                    <Cell className="text-center" style={{ padding: '6px' }}>
                                        {(rowData, index) => {
                                            return (
                                                <div className="flex justify-center flex-row gap-6">
                                                    <button
                                                        className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                                                        onClick={() => {
                                                            console.log(
                                                                "rowdata",
                                                                rowData,
                                                            );
                                                        }}
                                                    >
                                                        <PiListMagnifyingGlass size="1.5em" />
                                                    </button>
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                            </Table>
                        </Accordion>
                    </Body>
                    <Footer className="pt-4"></Footer>
                </Modal>
            )}
        </Layout>
    );
}
