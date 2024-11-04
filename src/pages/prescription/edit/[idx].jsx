import { useEffect, useState } from "react";
import usePrescription from "@/pages/api/prescription";
import { useUserContext } from "@/pages/api/context/UserContext";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import PrescriptionForm from "@/components/DynamicForms/PrescriptionForm";
import { useRouter } from "next/router";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Page() {
    const { user } = useUserContext();
    const { isLoading, getPrescriptionDetail, updatePrescription } = usePrescription();
    const router = useRouter();
    const id = router.query.idx;

    const [formFields, setFormFields] = useState([
        {   
            medicineId: -1,
            medicineName: "",
            quantity: 0,
            price: 0,
            totalPrice: 0,
            instruction: ""
        }
    ])
    const [selectedPatient, setSelectedPatient] = useState(
        {
            patientId: -1,
            patientName: "",
            credentialNum: "",
            phoneNum: ""
        }
    )
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
        async function fetchPrescriptionById(id){
            try {
                const response = await getPrescriptionDetail(id)
                setPrescriptionsData(response.data)
            } catch (error) {
                console.error("error #getMedicineOptions")
            }
        }
        fetchPrescriptionById(id)
    }, [id])

    useEffect(() => {
        async function initializePatient(patient) {
            setSelectedPatient({
                patientId: patient.id,
                patientName: patient.name,
                credentialNum: patient.credentialNumber,
                phoneNum: patient.phoneNum
            })
        }

        async function initializeFormField(medicineList){
            let tempFormFields = []
            medicineList.map(medicineData => {
                const tempMedicine = {
                    medicineId: medicineData.medicine.id,
                    medicineName: medicineData.medicine.name,
                    quantity: medicineData.quantity,
                    totalPrice: medicineData.totalPrice,
                    price: medicineData.medicine.price,
                    instruction: medicineData.instruction
                }
                tempFormFields.push(tempMedicine)
            })
            setFormFields(tempFormFields)
            console.log("formFields1:", formFields)
        }

        if(prescriptionData?.medicineList !== undefined && prescriptionData?.medicineList !== undefined) {
            initializePatient(prescriptionData.patient)
            initializeFormField(prescriptionData.medicineList)
        }
    }, [prescriptionData])

    const handleUpdatePrescription = async (e) => {
        e.preventDefault()
        try {
            let data = {        
                prescriptionId: -1,
                medicineList : [{
                    medicineId : -1,
                    price: 0,
                    quantity : 0,
                    instruction: ""
                }]
            }

            data.prescriptionId = parseInt(id);
            data.medicineList.pop() 
            const temp = [...formFields]
            console.log(temp)
            temp.map(item => data.medicineList.push({
                medicineId: item.medicineId,
                quantity: parseInt(item.quantity),
                instruction: item.instruction,
                price: item.totalPrice,
            }))

            console.log(data)

            await updatePrescription(data)
                .then(router.push(`/prescription`))
        } catch (error) {
            console.log("error when #submitPrescription")
        }
    }

    return (
        <Layout active="prescription" user={user}>
            <ContentLayout title="Update Prescription">
                <form onSubmit={handleUpdatePrescription} className="flex flex-col gap-6" >
                    <div className="flex flex-col gap-2">
                        <Input
                            type="text"
                            label="Detail Pasien"
                            disabled={true}
                            name="name"
                            placeholder="Detail Pasien"
                            value={selectedPatient?.credentialNum + " - " + selectedPatient?.patientName}
                        />
                    </div>
                    <PrescriptionForm 
                        formFields={formFields} 
                        setFormFields={setFormFields}
                    />
                    <div className="flex justify-center gap-2 mt-6 lg:justify-end">
                        {isLoading
                            ? <Button appearance="primary" isDisabled={true} isLoading={isLoading}>Simpan</Button>
                            : <Button isLoading={isLoading} appearance="primary" type="submit">Simpan</Button>
                        }
                    </div>
                </form>
            </ContentLayout>
        </Layout>
    )
};
