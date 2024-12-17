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
import usePharmacy from "@/pages/api/pharmacy";

export default function PrescriptionDetail(props) {
    const { setStatusChanged, prescriptionId, openModal, setOpenModal, user } = props
    console.log("user: ", user)
    const { Header, Body, Footer } = Modal;
    const router = useRouter();
    const { createTransaction, finishTransaction, publishNotification } = useTransaction();
    const [isListening, setIsListening] = useState(false)
    const [hasSubmit, setHasSubmit] = useState(false);

    const { getPharmacyInfo } = usePharmacy();

    const { getPrescriptionDetail, cancelPrescription } = usePrescription();
    const [open, setOpen] = useState({
        proceedToPayment: false,
        canceled: false,
        markAsDone: false
      });
    const [ finalized, setFinalized ] = useState(false)
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

    const handleCancelProcess = async () => {
        try {
            setHasSubmit(true);
            const res = await cancelPrescription(prescriptionId);
            console.log("cancel: ", res)
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            } else {
                toast.success(`Status Change to Canceled`, { autoClose: 2000, position: "top-right" });
                setStatusChanged({prescriptionId: prescriptionId, status: "CANCELED"})
                setPrescriptionsData(prescriptionData => ({
                    ...prescriptionData,
                    status: "CANCELED"
                }))
                setOpen({ ...open, canceled: false })
            }
        } catch (error) {
            setHasSubmit(false);
            console.error(error)
        }
    }
    const handleProcess = async () => {
        try {
            setHasSubmit(true);
            const data = {
                patientId: prescriptionData.patient.id,
                prescriptionId: prescriptionData.id,
                pharmacistId: user.id
            }
            console.log("data create transaction: ", data)
            const res = await createTransaction(data);
            console.log(res)
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            } else {
                toast.success(`Status Change to Waiting for Payment`, { autoClose: 2000, position: "top-right" });
                setStatusChanged({prescriptionId: prescriptionId, status: "WAITING_FOR_PAYMENT"})
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
            setHasSubmit(false);
            console.error(error)
        }
    }

    const handleMarkAsDone = async () => {
        try {
            setHasSubmit(true);
            const data = {
                transactionId: null,
                prescriptionId: parseInt(prescriptionData.id),
                status: "DONE"
            }
            const res = await finishTransaction(data);
            console.log(res)
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            } else {
                toast.success(`Status Change to Done`, { autoClose: 2000, position: "top-right" });
                setStatusChanged({prescriptionId: prescriptionId, status: "DONE"})
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
            setHasSubmit(false);
            console.error(error)
        }
    }

    useEffect(() => {
        async function fetchPrescriptionById(prescriptionId){
            try {
                if (prescriptionId !== -1) {
                    const response = await getPrescriptionDetail(prescriptionId)
                    console.log("prescription response: ", response)
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
            newEvent = new EventSource(process.env.NEXT_PUBLIC_SATUFARMASI_EVENT_SOURCE_URL,  {withCredentials: true});
            console.log("subscribing")
            console.log(newEvent)
            
            newEvent.onmessage = (event) => {
                try {
                    const parsedData = JSON.parse(event?.data);
                    setStatusChanged(parsedData)
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
            <Header className="text-2xl font-bold">Detail Preskripsi</Header>
            <Body className="flex flex-col py-2 gap-2">
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
                    status = {prescriptionData?.status}
                    medicineList = {prescriptionData?.medicineList}
                />
            </Body>
            <div className="flex flex-row justify-between gap-4">
                
                {
                    prescriptionData?.status === "UNPROCESSED" && 
                    <>
                        <Button appearance="danger" onClick={() => setOpen({...open, canceled: true})} isDisabled={hasSubmit}>
                            Batalkan
                        </Button>
                        <div className="flex flex-row gap-4">
                            <Button appearance="primary" onClick={() => router.push(`/prescription/edit/` + prescriptionData.id)} isDisabled={hasSubmit}>
                                Ubah
                            </Button>
                            <Button appearance="primary" onClick={() => setOpen({...open, proceedToPayment: true})} isDisabled={hasSubmit}>
                                Proses Pembayaran
                            </Button>
                        </div>
                    </>
                }
                {
                    prescriptionData?.status === "ON_PROGRESS" &&
                    <div className="w-full flex justify-end">
                        <Button appearance="primary" onClick={() => setOpen({...open, markAsDone: true})} isDisabled={hasSubmit}>
                            Mark as Done
                        </Button>
                    </div>
                }
            </div>

            <Toaster
                type="warning"
                open={open.proceedToPayment}
                onClose={() => setOpen({ ...open, proceedToPayment: false })}
                body={
                    <>
                         Apakah Anda yakin ingin mengubah transaksi ini untuk melanjutkan ke pembayaran?<br/>
                        Setelah konfirmasi,<span className="font-semibold text-danger"> perubahan ini tidak dapat dikembalikan</span>
                    </>
                }
                btnText="Konfirmasi"
                onClick={handleProcess}
                isLoading={hasSubmit}
            />

            <Toaster
                type="warning"
                open={open.markAsDone}
                onClose={() => setOpen({ ...open, markAsDone: false })}
                body={
                    <>
                        Apakah Anda yakin ingin menandai transaksi ini sebagai selesai?
                        <span className="font-bold text-danger">Perubahan ini tidak dapat dikembalikan</span>
                    </>
                }

                title={"Mark Prescription as Done"}
                onClick={handleMarkAsDone}
                isLoading={hasSubmit}
            />

            <Toaster
                type="warning"
                open={open.canceled}
                onClose={() => setOpen({ ...open, canceled: false })}
                body={
                    <>
                        Are you sure you want to cancel this prescription,
                        <b> after confirmation prescription cannot be updated and these changes cannot be revert</b>
                    </>
                }
                btnText="Confirm"
                onClick={handleCancelProcess}
                isLoading={hasSubmit}
            />
        </Modal>
    )
};
