import PrescriptionForm from "@/components/DynamicForms/PrescriptionForm";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "../api/context/UserContext";
import { useEffect, useState } from "react";
import useMedicineDropdownOption from "../api/medicineDropdownOption";
import PatientForm from "@/components/DynamicForms/PatientForm";
import usePatientDropdownOption from "../api/patientDropdownOption";
import Input from "@/components/Input";
import useSubmitDiagnose from "../api/submitDiagnose";

export default function index() {
    const { user } = useUserContext();
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

    const { getMedicineDropdownOptions } = useMedicineDropdownOption();
    const { getPatientDropdownOptions } = usePatientDropdownOption();
    const { submitDiagnose } = useSubmitDiagnose();
    const [medicineDropdownOptions, setMedicineDropdownOptions] = useState([])
    const [patientDropdownOptions, setPatientDropdownOptions] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const handleSubmitDiagnose = async (e) => {
        e.preventDefault()
        try {
            let data = {
                doctorId : -1,
                title : "",
                description : "",
                prescription : {
                    patientId : -1,
                    medicineList : [{
                        medicineId : -1,
                        price: 0,
                        quantity : 0,
                        instruction: ""
                    }]
                }
            }

            data.doctorId = 1,
            data.title = title
            data.description = description
            data.prescription.patientId = selectedPatient.patientId
            data.prescription.medicineList.pop()
            const temp = [...formFields]
            console.log(temp)
            temp.map(item => data.prescription.medicineList.push({
                medicineId: item.medicineId,
                quantity: parseInt(item.quantity),
                instruction: item.instruction,
                price: item.totalPrice,
            }))

            console.log(data)

            await submitDiagnose(data)
        } catch (error) {
            console.log("error when #submitDiagnose")
        }
    }

    useEffect(() => {
        async function fetchMedicineDropdownOptionsData(){
            try {
                const response = await getMedicineDropdownOptions()
                console.log(response)
                setMedicineDropdownOptions(response)
            } catch (error) {
                console.log("error #getMedicineOptions")
            }
        }
        async function fetchPatientDropdownOptionsData(){
            try {
                const response = await getPatientDropdownOptions()
                setPatientDropdownOptions(response)
            } catch (error) {
                console.log("error #getPatientOptions")
            }
        }
        fetchPatientDropdownOptionsData()
        fetchMedicineDropdownOptionsData()
    }, [])

    const styles = {
        userSelect: "none",
        borderRadius: "0.5rem",
        fontWeight: 600,
        cursor: "pointer"
    };

    return (
        <Layout active="diagnose" user={user}>
            <ContentLayout title="Diagnosis">
                <form onSubmit={handleSubmitDiagnose} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <p> Judul </p>
                        <Input type="text" id="title" name="title" onChange={(e) => setTitle(e.target.value)} placeholder="name" />
                    </div>
                    <PatientForm
                        patientDropdownOptions = {patientDropdownOptions}
                        selectedPatient = {selectedPatient}
                        setSelectedPatient = {setSelectedPatient}
                    />
                    <PrescriptionForm 
                        medicineDropdownOptions={medicineDropdownOptions} 
                        formFields={formFields} 
                        setFormFields={setFormFields}
                    />
                    <div className="flex flex-col gap-2">
                        <p> Description </p>
                        <Input type="text" id="description" name="description" onChange={(e) => setDescription(e.target.value)} placeholder="name" />
                    </div>
                    <input
                        style={styles}
                        type="submit"
                        value="Submit Diagnose"
                    />
                </form>
            </ContentLayout>
        </Layout>
    )
}