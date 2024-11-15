import PrescriptionForm from "@/components/DynamicForms/PrescriptionForm";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "../api/context/UserContext";
import { useEffect, useState } from "react";
import PatientForm from "@/components/DynamicForms/PatientForm";
import Input from "@/components/Input";
import useSubmitDiagnose from "../api/submitDiagnose";
import { Toggle } from "rsuite";
import { z, ZodError } from "zod";
import { isRequiredNumber, isRequiredString } from "@/helpers/validation";
import { ErrorForm } from "@/helpers/errorForm";
import { toast } from "react-toastify";

// FIX: if thhe token is already expired, the user is still able to access the page

const medicineSchema = z.object({
    instruction: isRequiredString(),
    medicineId: isRequiredNumber(),
    quantity: isRequiredNumber(),
})

const diagnoseSchemaWithExistingPatient = z.object({
    description: isRequiredString(),
    title: isRequiredString(),
    prescription: z.object({
        medicineList: z.array(medicineSchema),
        patient:  z.object({
            patientId: isRequiredNumber(),
        }),
    }),
})

const diagnoseSchemaNewPatient = z.object({
    description: isRequiredString(),
    title: isRequiredString(),
    prescription: z.object({
        medicineList: z.array(medicineSchema),
        patient:  z.object({
            patientName: isRequiredString(),
            credentialNum: isRequiredString(),
            phoneNum: isRequiredString(),
        }),
    }),
})

export default function index() {
    const { user } = useUserContext();
    const { submitDiagnose } = useSubmitDiagnose();
    const [title, setTitle] = useState("")
    const [errors, setErrors] = useState({})
    const [description, setDescription] = useState("")
    const [existingPatient, setExistingPatient] = useState(true)

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

    const handleSubmitDiagnose = async (e) => {
        e.preventDefault()
        try {
            let data = {
                doctorId : -1,
                title : "",
                description : "",
                prescription : {
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
            }

            data.doctorId = 1,
            data.title = title
            data.description = description
            data.prescription.patient = selectedPatient
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
            setErrors({});
            if (existingPatient) diagnoseSchemaWithExistingPatient.parse(data);
            else diagnoseSchemaNewPatient.parse(data)
            const res = await submitDiagnose(data)
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
        } catch (error) {
            console.log("error: ", error)
            if (error instanceof ZodError) {
                const newErrors = { ...errors };
                error.issues.forEach((issue) => {
                    if (issue.path.length > 0) {
                        const fieldName = issue.path.join(".");
                        newErrors[fieldName] = issue.message;
                    }
                });
                setErrors(newErrors);
            }
            else {
                ErrorForm(error, setErrors, false)
            }
        }
    }

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
                        <Input 
                            type="text" 
                            id="title" name="title" 
                            onChange={(e) => {
                                setTitle(e.target.value)
                                setErrors({ ...errors, "title": "" });
                            }} 
                            placeholder="name" 
                            error={errors["title"]} 
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Toggle 
                            size="lg" 
                            checkedChildren="Existing Patient" 
                            unCheckedChildren="New Patient" 
                            defaultChecked 
                            onChange={(e) => {
                                setExistingPatient(e)
                                setErrors({
                                    ...errors,
                                    "prescription.patient.patientId": "",
                                    "prescription.patient.patientName": "",
                                    "prescription.patient.credentialNum": "",
                                    "prescription.patient.phoneNum": ""
                                })
                            }}/>
                        <PatientForm
                            selectedPatient = {selectedPatient}
                            setSelectedPatient = {setSelectedPatient}
                            existingPatient = {existingPatient}
                            errors = {errors}
                            setErrors = {setErrors}
                        />
                    </div>
                    <PrescriptionForm 
                        formFields={formFields} 
                        setFormFields={setFormFields}
                        errors={errors}
                        setErrors={setErrors}
                    />
                    <div className="flex flex-col gap-2">
                        <p> Description </p>
                        <Input 
                            type="text" 
                            id="description" 
                            name="description" 
                            onChange={(e) => {
                                setDescription(e.target.value)
                                setErrors({ ...errors, "description": "" });
                            }} 
                            placeholder="name" error={errors["description"]} />
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
