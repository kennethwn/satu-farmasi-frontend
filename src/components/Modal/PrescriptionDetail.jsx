import usePrescription from "@/pages/api/prescription";
import Input from "../Input";
import { useEffect, useState } from "react";
import MedicineList from "../MedicineLIst/MedicineList";
import { Modal } from "rsuite";
import Button from "../Button";
import { useRouter } from "next/router";
import useTransaction from "@/pages/api/transaction/transaction";
import { toast } from "react-toastify";
import Toaster from "./Toaster";

export default function PrescriptionDetail(props) {
    const { prescriptionId, openModal, setOpenModal } = props
    const { Header, Body, Footer } = Modal;
    const router = useRouter();
    const { createTransaction, finishTransaction, publishNotification } = useTransaction();
    const [isListening, setIsListening] = useState(false)

    const { getPrescriptionDetail } = usePrescription();
    const [open, setOpen] = useState({
        proceedToPayment: false,
        markAsDone: false
      });
    const [ prescriptionData, setPrescriptionsData ] = useState({
        id: prescriptionId,
        status: "",
        patient: {
            id: -1,
            name: "",
            credentialNumber: "",
            phoneNum: ""
        },
        medicineList: [{
            medicine: {
                id: -1,
                code: "",
                name: "",
                merk: "",
                currStock: -1,
                minStock: -1,
                price: "",
                classifications: [
                    {
                        classification: {
                            label: ""
                        }
                    }
                ],
                packaging: {
                    label: ""
                },
                genericName: {
                    label: ""
                }
            }
        }]
    })
    const [ newEvent, setNewEvent ] = useState({
        transactionId: -1,
        prescriptionId: -1,
        status: ""
    })

    const handleProcess = async () => {
        try {
            const data = {
                patientId: prescriptionData.patient.id,
                prescriptionId: prescriptionData.id
            }
            const res = await createTransaction(data);
            console.log(res)
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            } else {
                toast.success(`Status Change to Waiting for Payment`, { autoClose: 2000, position: "top-center" });
                setPrescriptionsData(prescriptionData => ({
                    ...prescriptionData,
                    status: "WAITING_FOR_PAYMENT"
                }))
                const updatePrescriptionStatusPayload = {
                    transactionId: -1,
                    prescriptionId: prescriptionData.id,
                    status: "WAITING_FOR_PAYMENT"
                }
                publishNotification(updatePrescriptionStatusPayload)
                setOpen({ ...open, proceedToPayment: false })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleMarkAsDone = async () => {
        try {
            const data = {
                transactionId: null,
                prescriptionId: parseInt(prescriptionData.id),
                status: "DONE"
            }
            const res = await finishTransaction(data);
            console.log(res)
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            } else {
                toast.success(`Status Change to Waiting for Payment`, { autoClose: 2000, position: "top-center" });
                setPrescriptionsData(prescriptionData => ({
                    ...prescriptionData,
                    status: "DONE"
                }))
                const updatePrescriptionStatusPayload = {
                    transactionId: -1,
                    prescriptionId: prescriptionData.id,
                    status: "DONE"
                }
                publishNotification(updatePrescriptionStatusPayload)
                setOpen({ ...open, markAsDone: false })
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        async function fetchPrescriptionById(prescriptionId){
            try {
                if (prescriptionId !== -1) {
                    const response = await getPrescriptionDetail(prescriptionId)
                    setPrescriptionsData(response.data)
                }
            } catch (error) {
                console.log("error #getMedicineOptions")
            }
        }
        fetchPrescriptionById(prescriptionId)
    }, [prescriptionId])

    useEffect( () => {
        let newEvent
        if (!isListening) {
            newEvent = new EventSource('http://localhost:8000/api/v1/transactions/_subscribe',  {withCredentials: true});
            console.log("subscribing")
            console.log(newEvent)
            
            newEvent.onmessage = (event) => {
                try {
                    const parsedData = JSON.parse(event?.data);
                    setNewEvent(existingEvent => ({
                        ...existingEvent,
                        prescriptionId: parsedData.prescriptionId,
                        status: parsedData.status
                    }))
                } catch (err) {
                    console.error("Failed to parse data from SSE:", err);
                }
            };
    
            newEvent.onerror = (err) => {
                console.error("EventSource failed:", err);
                newEvent.close(); // Close the connection if error occurs
                setIsListening(false); // Reset to allow reconnection if necessary
            };
    
            setIsListening(true);
        }
    
        return () => {
            if (newEvent) {
                console.log("Closing connection");
                newEvent.close();
            }
        };
    }, []);

    useEffect(() => {
        if (newEvent.status === "ON_PROGRESS" && newEvent.prescriptionId === prescriptionData.id) {
            setPrescriptionsData(prescriptionData => ({
                ...prescriptionData,
                status: newEvent.status
            }))
            toast.info(`Status updated!`, { autoClose: 2000, position: "top-right" });
        }
    }, [newEvent])

    return (
        <Modal
            backdrop="static"
            open={openModal}
            onClose={() => {
                setOpenModal(false);
            }}
            size="lg"
        >
            <Header className="text-2xl font-bold">Detail Prescription</Header>
            <Body className="pt-2">
                <div>
                    <Input
                        type="text"
                        label="Detail Pasien"
                        disabled={true}
                        name="name"
                        placeholder="Detail Pasien"
                        value={prescriptionData?.patient?.credentialNumber + " - " + prescriptionData?.patient?.name}
                    />
                </div>
                
                <MedicineList 
                    medicineList = {prescriptionData?.medicineList}
                />
            </Body>
            <Footer className="flex flex-row justify-end gap-4">
                
                {
                    prescriptionData?.status === "UNPROCESSED" && 
                    <div className="flex flex-row gap-4">
                        <Button appearance="primary" onClick={() => router.push(`/prescription/edit/` + prescriptionData.id)}>
                            Edit
                        </Button>
                        <Button appearance="primary" onClick={() => setOpen({...open, proceedToPayment: true})}>
                            Proceed to Payment
                        </Button>
                    </div>
                }
                {
                    prescriptionData?.status === "ON_PROGRESS" &&
                    <Button appearance="primary" onClick={() => setOpen({...open, markAsDone: true})}>
                        Mark as Done
                    </Button>
                }
            </Footer>

            <Toaster
                type="warning"
                open={open.proceedToPayment}
                onClose={() => setOpen({ ...open, proceedToPayment: false })}
                body={
                    <>
                        Are you sure you want to change this transaction to proceed to payment, 
                        <b> after confirmation prescription cannot be updated and these changes cannot be revert</b>
                    </>
                }
                btnText="Confirm"
                onClick={handleProcess}
            />

            <Toaster
                open={open.markAsDone}
                onClose={() => setOpen({ ...open, markAsDone: false })}
                body={
                    <>
                        Are you sure you want to change this transaction to be mark as done, <b>these changes cannot be revert</b>
                    </>
                }
                title={"Mark Prescription as Done"}
                onClick={handleMarkAsDone}
            />
        </Modal>
    )
};
