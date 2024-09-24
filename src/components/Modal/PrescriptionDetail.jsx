import usePrescription from "@/pages/api/prescription";
import Input from "../Input";
import { useEffect, useState } from "react";
import MedicineList from "../MedicineLIst/MedicineList";
import { Modal } from "rsuite";
import Button from "../Button";
import { useRouter } from "next/router";

export default function PrescriptionDetail(props) {
    const { prescriptionId, openModal, setOpenModal } = props
    const { Header, Body, Footer } = Modal;
    const router = useRouter();

    const { getPrescriptionDetail } = usePrescription();
    const [ prescriptionData, setPrescriptionsData ] = useState({
        id: -1,
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

    useEffect(() => {
        console.log("PRESCRIPTION DATA: ", prescriptionData)
        async function fetchPrescriptionById(prescriptionId){
            try {
                if (prescriptionId !== -1) {
                    const response = await getPrescriptionDetail(prescriptionId)
                    console.log("RESPONSE:", response)
                    setPrescriptionsData(response.data)
                    console.log("prescriptionDetail:", response)
                }
            } catch (error) {
                console.log("error #getMedicineOptions")
            }
        }
        fetchPrescriptionById(prescriptionId)
    }, [prescriptionId])

    useEffect(() => {
        console.log(prescriptionData)
    }, [prescriptionData])

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
                <Button appearance="primary" onClick={() => router.push(`/prescribe/edit/` + prescriptionData.id)}>
                    Edit
                </Button>
                <Button appearance="primary" onClick={() => HandleEditClassification("prodces")}>
                    Process
                </Button>
            </Footer>
        </Modal>
    )
};
