import { useState } from "react";
import usePrescription from "../api/prescription"
import { useUserContext } from "../api/context/UserContext";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { Toggle } from "rsuite";
import PatientForm from "@/components/DynamicForms/PatientForm";
import PrescriptionForm from "@/components/DynamicForms/PrescriptionForm";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { toast } from "react-toastify";

export default function create() {
    const { user } = useUserContext();
    const { isLoading, addNewPrescription } = usePrescription();
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
                medicineId: parseInt(item.medicineId),
                quantity: parseInt(item.quantity),
                instruction: item.instruction,
                price: item.totalPrice,
            }))

            console.log(data)

            const res = await addNewPrescription(data);
            console.log(res)
            if (res == undefined || res == null || res.code != 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return
            }
            toast.success(res.message, { autoClose: 2000, position: "top-center" });
            router.push(`/prescription`);
        } catch (error) {
            console.log("error when #submitPrescription")
        }
    }

    return (
        <Layout active="prescription" user={user}>
            <ContentLayout title="Create Prescription" type="child" backpageUrl="/prescription">
                <form onSubmit={handleSubmitPrescription} className="flex flex-col gap-4">
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
                    {/* <input
                        type="submit"
                        value="Submit Prescription"
                    /> */}

                    <div className="flex justify-center gap-2 mt-6 lg:justify-end">
                        {isLoading ?
                            <Button
                                appearance="primary"
                                isDisabled={true}
                                isLoading={isLoading}
                            >
                                Simpan
                            </Button>
                            :
                            <Button
                                isLoading={isLoading}
                                appearance="primary"
                                type="submit"
                            >
                                Simpan
                            </Button>
                        }
                    </div>
                </form>
            </ContentLayout>
        </Layout>
    )
};
