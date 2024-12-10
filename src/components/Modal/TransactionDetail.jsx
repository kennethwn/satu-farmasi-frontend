import usePrescription from "@/pages/api/prescription";
import Input from "../Input";
import { useEffect, useState } from "react";
import MedicineList from "../MedicineLIst/MedicineList";
import { Col, Grid, Modal, Row } from "rsuite";
import Button from "../Button";
import { useRouter } from "next/router";
import useTransaction from "@/pages/api/transaction/transaction";
import { toast } from "react-toastify";

export default function TransactionDetail(props) {
    const { transactionId, openModal, setOpenModal } = props
    const { Header, Body, Footer } = Modal;
    const router = useRouter();
    const { getTransactionDetail } = useTransaction();

    const { getPrescriptionDetail } = usePrescription();
    const [ transactionData, setTransactionData ] = useState({
        id: -1,
        totalPrice: "",
        pharmacist: {
            firstName: "",
            lastName: ""
        },
        prescription: {
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
        }
    })

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
                <Grid className="w-full pt-0">
                    <Row>
                        <Col xs={4}>
                            <p>Nama Pasien : </p>
                        </Col>
                        <Col xs={4}>
                            <p>{transactionData.prescription.patient.name}</p>
                        </Col>
                        <Col xs={12}>
                        </Col>
                        <Col xs={4} className="text-end">
                            <p>WAITING</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            <p>Nama Apoteker : </p>
                        </Col>
                        <Col xs={4}>
                            <p>{transactionData.pharmacist.firstName + " " + transactionData.pharmacist.lastName}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            <p>Total Harga : </p>
                        </Col>
                        <Col xs={4}>
                            <p>{transactionData.totalPrice}</p>
                        </Col>
                    </Row>
                </Grid>
                
                <MedicineList 
                    medicineList = {transactionData?.prescription.medicineList}
                />
            </Body>
            <Footer className="flex flex-row justify-end gap-4">
                {/* <Button appearance="primary" onClick={() => router.push(`/prescribe/edit/` + prescriptionData.id)}>
                    Edit
                </Button>
                {
                    prescriptionData?.status == "UNPROCESSED" && 
                    <Button appearance="primary" onClick={handleProcess}>
                        Proceed to Payment
                    </Button>
                } */}
            </Footer>
        </Modal>
    )
};
