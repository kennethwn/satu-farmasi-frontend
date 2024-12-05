import { useEffect, useState } from "react";
import usePrescription from "../api/prescription";
import { useUserContext } from "../api/context/UserContext";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { Toggle } from "rsuite";
import PatientForm from "@/components/DynamicForms/PatientForm";
import PrescriptionForm from "@/components/DynamicForms/PrescriptionForm";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import { z, ZodError } from "zod";
import { isRequiredNumber, isRequiredString } from "@/helpers/validation";
import { ErrorForm } from "@/helpers/errorForm";

const medicineSchema = z.object({
    instruction: isRequiredString(),
    code: isRequiredString(),
    quantity: isRequiredNumber(),
});

const prescriptionSchemaWithExistingPatient = z.object({
    prescription: z.object({
        medicineList: z.array(medicineSchema),
        patient: z.object({
            patientId: isRequiredNumber(),
        }),
    }),
});

const prescriptionSchemaWithNewPatient = z.object({
    prescription: z.object({
        medicineList: z.array(medicineSchema),
        patient: z.object({
            patientName: isRequiredString(),
            credentialNum: isRequiredString(),
            phoneNum: isRequiredString(),
        }),
    }),
});

export default function create() {
    const { user } = useUserContext();
    const { isLoading, addNewPrescription } = usePrescription();
    const [existingPatient, setExistingPatient] = useState(true);
    const router = useRouter();
    const [errors, setErrors] = useState({});

    const [formFields, setFormFields] = useState([
        {   
            code: "",
            medicineName: "",
            quantity: 0,
            price: 0,
            totalPrice: 0,
            instruction: "",
        },
    ]);
    const [selectedPatient, setSelectedPatient] = useState({
        patientId: -1,
        patientName: "",
        credentialNum: "",
        phoneNum: "",
    });

    const handleSubmitPrescription = async (e) => {
        e.preventDefault();
        try {
            let data = {
                patient: {
                    patientId: -1,
                    patientName: "",
                    credentialNum: "",
                    phoneNum: "",
                },
                medicineList : [{
                    code: "",
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
                code: item.code,
                quantity: parseInt(item.quantity),
                instruction: item.instruction,
                price: item.totalPrice,
            }))
            setErrors({});
            const dataToValidate = { prescription: data };
            if (existingPatient){
                console.log("to be validate", dataToValidate)
                prescriptionSchemaWithExistingPatient.parse(dataToValidate);
            }
            else prescriptionSchemaWithNewPatient.parse(dataToValidate);

            console.log(data)

            const res = await addNewPrescription(data);
            toast.success(res.message, {
                autoClose: 2000,
                position: "top-right",
            });
            setTimeout(() => {
                router.push(`/prescription`);
            }, 2000);
        } catch (error) {
            console.log("error: ", error);
            if (error instanceof ZodError) {
                const newErrors = { ...errors };
                error.issues.forEach((issue) => {
                    if (issue.path.length > 0) {
                        const fieldName = issue.path.join(".");
                        newErrors[fieldName] = issue.message;
                    }
                });
                setErrors(newErrors);
            } else {
                ErrorForm(error, setErrors, false);
            }
        }
    };

    return (
        <Layout active="prescription" user={user}>
            <ContentLayout
                title="Tambah Resep"
                type="child"
                backpageUrl="/prescription"
            >
                <form
                    onSubmit={handleSubmitPrescription}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-2">
                        <Toggle
                            size="lg"
                            checkedChildren="Pasien Lama"
                            unCheckedChildren="Pasien Baru"
                            defaultChecked
                            onChange={(e) => setExistingPatient(e)}
                        />
                        <PatientForm
                            selectedPatient={selectedPatient}
                            setSelectedPatient={setSelectedPatient}
                            existingPatient={existingPatient}
                            errors={errors}
                            setErrors={setErrors}
                        />
                    </div>
                    <PrescriptionForm
                        formFields={formFields}
                        setFormFields={setFormFields}
                        errors={errors}
                        setErrors={setErrors}
                    />
                    {/* <input
                        type="submit"
                        value="Submit Prescription"
                    /> */}

                    <div className="flex justify-center gap-2 mt-6 lg:justify-end">
                        {isLoading ? (
                            <Button
                                appearance="primary"
                                isDisabled={true}
                                isLoading={isLoading}
                            >
                                Simpan
                            </Button>
                        ) : (
                            <Button
                                isLoading={isLoading}
                                appearance="primary"
                                type="submit"
                            >
                                Simpan
                            </Button>
                        )}
                    </div>
                </form>
            </ContentLayout>
        </Layout>
    );
}
