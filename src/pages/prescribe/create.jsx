import { useState } from "react";
import usePrescription from "../api/prescription"
import { useUserContext } from "../api/context/UserContext";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { Toggle } from "rsuite";
import PatientForm from "@/components/DynamicForms/PatientForm";
import PrescriptionForm from "@/components/DynamicForms/PrescriptionForm";
import { useRouter } from "next/router";

export default function create() {
    const { user } = useUserContext();
    const { addNewPrescription } = usePrescription();
    const [existingPatient, setExistingPatient] = useState(true)
    const router = useRouter();

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

    const handleSubmitPrescription = async (e) => {
        e.preventDefault()
        try {
            let data = {        
                patient: {
                    patientId: -1,
                    patientName: "",
                    credentialNum: "",
                    phoneNum: ""
                },
                medicineList : [{
                    medicineId : -1,
                    price: 0,
                    quantity : 0,
                    instruction: ""
                }]
            }

            data.patient = selectedPatient
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

            await addNewPrescription(data)
                .then(router.push(`/prescribe`))
        } catch (error) {
            console.log("error when #submitPrescription")
        }
    }

    return (
        <Layout active="prescription" user={user}>
            <ContentLayout title="Create Prescription">
                <form onSubmit={handleSubmitPrescription} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <Toggle size="lg" checkedChildren="Existing Patient" unCheckedChildren="New Patient" defaultChecked onChange={(e) => setExistingPatient(e)}/>
                        <PatientForm
                            selectedPatient = {selectedPatient}
                            setSelectedPatient = {setSelectedPatient}
                            existingPatient = {existingPatient}
                        />
                    </div>
                    <PrescriptionForm 
                        formFields={formFields} 
                        setFormFields={setFormFields}
                    />
                    <input
                        type="submit"
                        value="Submit Prescription"
                    />
                </form>
            </ContentLayout>
        </Layout>
    )
};
