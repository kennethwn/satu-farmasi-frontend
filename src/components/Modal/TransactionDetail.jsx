import usePrescription from "@/pages/api/prescription";
import Input from "../Input";
import { useEffect, useState } from "react";
import MedicineList from "../MedicineLIst/MedicineList";
import { Col, Dropdown, Grid, Modal, Row, SelectPicker } from "rsuite";
import Button from "../Button";
import { useRouter } from "next/router";
import useTransaction from "@/pages/api/transaction/transaction";
import { toast } from "react-toastify";
import prescriptionStatusMapped from "@/helpers/prescriptionStatusMap";
import Toaster from "./Toaster";
import { formatRupiah } from "@/helpers/currency";
import { generateInvoiceTransaction } from "@/data/document";

export default function TransactionDetail(props) {
    const { statusUpdated, transactionId, openModal, setOpenModal, user, pharmacy } = props
    const { Header, Body, Footer } = Modal;
    const router = useRouter();
    const prescriptionStatusMap = prescriptionStatusMapped
    const { getTransactionDetail, confirmPayment, publishNotification } = useTransaction();
    const [ paymentMethod, setPaymentMethod] = useState("")
    const [ open, setOpen ] = useState(false)
    const paymentMethodOptions = [
        {label: "Debit Card", value: "DEBIT"},
        {label: "Credit Card", value: "CREDIT"},
        {label: "QRIS", value: "QRIS"},
        {label: "Paypal", value: "PAYPAL"},
        {label: "Cash", value: "CASH"}
    ]
    const [ transactionData, setTransactionData ] = useState({
        id: -1,
        totalPrice: "",
        pharmacist: {
            firstName: "",
            lastName: ""
        },
        prescription: {
            id: -1,
            status: "",
            patient: {
                credentialNumber: "",
                name: ""
            },
            medicineList: [{
                quantity: -1,
                instruction: "",
                totalPrice: "",
                medicine: {
                    name: "",
                    price: ""
                }
            }]
        },
        physicalReport: {
            id: -1,
            data: {},
            created_at: ""
        }
    })

    const handleConfirmPayment = async () => {
        try {
            const physicalReport = {
                id: 0,
                data: {
                    pharmacy: pharmacy,
                    pharmacist: user,
                    patient: transactionData.prescription.patient,
                    medicine: transactionData.prescription.medicineList,
                    totalPrice: transactionData.totalPrice,
                }
            }
            const data = {
                id: parseInt(transactionData.id),
                paymentMethod: paymentMethod,
                physicalReport: physicalReport
            }
            const res = await confirmPayment(data);
            console.log(res)
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            } else {
                toast.success(`Payment has been confirmed and status has been change to on progress`, { autoClose: 2000, position: "top-center" });
                setTransactionData(transactionData => ({
                    ...transactionData,
                    prescription: {
                        ...transactionData.prescription,
                        status: "ON_PROGRESS"
                    }
                }))
                const changeStatusPayload = {
                    transactionId: parseInt(transactionId),
                    prescriptionId: parseInt(transactionData.prescription.id),
                    status: "ON_PROGRESS"
                }
                publishNotification(changeStatusPayload)
                setOpen(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleGenereateInvoice = () => {
        try {
            const patient = transactionData.physicalReport.data.patient;
            const pharmacist = transactionData.physicalReport.data.pharmacist;
            const pharmacy = transactionData.physicalReport.data.pharmacy;
            const input = transactionData.physicalReport;
            const totalPrice = transactionData.totalPrice;
            const formField = transactionData.physicalReport.data.medicine;
            console.log("patient: ", patient)
            generateInvoiceTransaction(pharmacy, pharmacist, patient, input, formField, totalPrice);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        console.log("TransactionID: ", transactionId)
        async function fetchTransactionById(transactionId){
            try {
                if (transactionId !== -1) {
                    const response = await getTransactionDetail(transactionId)
                    console.log(response)
                    setTransactionData(response.data)
                }
            } catch (error) {
                console.log("error when #fetchTransactionById with error: ", error)
            }
        }
        fetchTransactionById(transactionId)
    }, [transactionId])

    useEffect(() => {
        console.log("transactionData: ", transactionData)
    }, [transactionData])

    useEffect(() => {
        if (transactionId === statusUpdated.transactionId) {
            transactionData.prescription.status = statusUpdated.status
        }
    }, [statusUpdated])

    return (
        <Modal
            backdrop="static"
            open={openModal}
            onClose={() => {
                setOpenModal(false);
            }}
            size="lg"
        >
            <Header className="text-2xl font-bold">Detail Transaction</Header>
            <Body className="pt-2 gap-4">
                <div className="flex flex-col gap-4">
                    <Grid className="w-full pt-0">
                        <Row>
                            <Col xs={4}>
                                <p>Nama Pasien </p>
                            </Col>
                            <Col xs={4}>
                                <p>: {transactionData.prescription.patient.name}</p>
                            </Col>
                            <Col xs={10}>
                            </Col>
                            <Col xs={6} className="flex flex-row justify-end text-center">
                                <p 
                                    style={{ backgroundColor: prescriptionStatusMap.get(transactionData.prescription.status)?.color }}
                                    className="text-white rounded-lg w-3/4">
                                    {prescriptionStatusMap.get(transactionData.prescription.status)?.label}
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <p>Nama Apoteker</p>
                            </Col>
                            <Col xs={4}>
                                <p>: {transactionData.pharmacist.firstName + " " + transactionData.pharmacist.lastName}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <p>Total Harga</p>
                            </Col>
                            <Col xs={4}>
                                <p>: {formatRupiah(transactionData.totalPrice)}</p>
                            </Col>
                        </Row>
                    </Grid>
                    
                    <MedicineList 
                        medicineList = {transactionData?.prescription.medicineList}
                    />
                </div>  
            </Body>
            <Footer className="flex flex-row justify-end">
                {
                    transactionData?.prescription.status == "WAITING_FOR_PAYMENT" && 
                    <div className="flex flex-row w-full justify-between">
                        <div className="flex flex-col gap-2">
                            <p className="text-start">Choose Payment Method:</p>
                            <SelectPicker
                                data={paymentMethodOptions}
                                searchable={false}
                                style={{ width: 200 }}
                                cleanable={false}
                                onChange={(value) => setPaymentMethod(value)}
                                placeholder="Payment Method"
                            />
                        </div>
                        <Button appearance="primary" onClick={() => setOpen(true)}>
                            Confirm Payment
                        </Button>
                    </div>    
                }
                {
                    (transactionData?.prescription.status == "ON_PROGRESS" || transactionData?.prescription.status == "DONE") && 
                    <>
                        <Button appearance="primary" onClick={() => handleGenereateInvoice()}>
                            Download Invoice
                        </Button>
                    </>   
                }
            </Footer>

            <Toaster
                open={open}
                onClose={() => setOpen(false)}
                body={
                    <>
                        Are you sure you want to confirm this payment, changes cannot be revert
                    </>
                }
                title={"Confirm Payment"}
                onClick={handleConfirmPayment}
            />
        </Modal>
    )
};
