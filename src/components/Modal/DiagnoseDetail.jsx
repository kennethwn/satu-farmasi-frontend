import { Modal } from "rsuite";
import MedicineList from "../MedicineLIst/MedicineList";
import Input from "../Input";
import { useEffect, useState } from "react";
import useDiagnose from "@/pages/api/diagnose";

export default function DiagnoseDetail(props) {
    const { diagnoseId, openModal, setOpenModal } = props;

    const { getDiagnoseDetailById } = useDiagnose();

    const [diagnoseData, setDiagnoseData] = useState({
        id: -1,
        title: "",
        description: "",
        created_at: "",
        prescription: {
            id: -1,
            status: "",
            patient: {
                id: -1,
                name: "",
                credentialNumber: "",
                phoneNum: ""
            },
            medicineList: [
                {
                    medicineCode: "",
                    medicineName: "",
                    quantity: 0,
                    instruction: "",
                    totalPrice: ""
                }
            ]
        }
    })

    const handleFetchDiagnoseById = async () => {
        try {
            const res = await getDiagnoseDetailById(diagnoseId);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            }
            setDiagnoseData(res.data)
            console.log("diagnose data: ", res.data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (diagnoseId !== 0) {
                await handleFetchDiagnoseById();
            }
        }
        fetchData();
    }, [diagnoseId]);

    return (
        <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            size="lg"
            overflow
        >
            <Modal.Header className="text-2xl font-bold">Detail Diagnosis</Modal.Header>
            <Modal.Body className="flex flex-col py-2 gap-2">
                <div className="flex flex-col gap-2">
                    <Input
                        type="text"
                        label="Judul"
                        disabled={true}
                        name="name"
                        placeholder="Judul"
                        value={diagnoseData?.title}
                    />

                    <Input
                        type="text"
                        label="Detail Pasien"
                        disabled={true}
                        name="name"
                        placeholder="Detail Pasien"
                        value={diagnoseData?.prescription?.patient?.credentialNumber + " - " + diagnoseData?.prescription?.patient?.name}
                    />

                    <Input
                        type="text"
                        label="Deskripsi"
                        disabled={true}
                        name="name"
                        placeholder="Deskripsi"
                        value={diagnoseData?.description}
                    />
                </div>
                
                <MedicineList 
                    status = {diagnoseData?.prescription?.status}
                    medicineList = {diagnoseData?.prescription?.medicineList}
                />
            </Modal.Body>
        </Modal>
    )   
}