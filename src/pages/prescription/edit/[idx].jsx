import { useEffect, useState } from "react";
import usePrescription from "@/pages/api/prescription";
import { useUserContext } from "@/pages/api/context/UserContext";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import PrescriptionForm from "@/components/DynamicForms/PrescriptionForm";
import { useRouter } from "next/router";
import Input from "@/components/Input";
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

const prescriptionSchema = z.object({
    prescription: z.object({
        medicineList: z.array(medicineSchema),
    }),
});

export default function Page() {
    const { user } = useUserContext();
    const { isLoading, getPrescriptionDetail, updatePrescription } =
        usePrescription();
    const router = useRouter();
    const id = router.query.idx;
    const [errors, setErrors] = useState({});
    const [ medicineWithCurrStock, setMedicineWithCurrStock ] = useState([])
    const [ hasSubmit, setHasSubmit ] = useState(false);

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
    const [prescriptionData, setPrescriptionsData] = useState({
        id: -1,
        patient: {
            id: -1,
            name: "",
            credentialNumber: "",
            phoneNum: "",
        },
        medicineList: [
            //{
            //    medicine: {
            //        id: -1,
            //        code: "",
            //        name: "",
            //        merk: "",
            //        currStock: -1,
            //        minStock: -1,
            //        price: "",
            //        classifications: [
            //            {
            //                classification: {
            //                    label: "",
            //                },
            //            },
            //        ],
            //        packaging: {
            //            label: "",
            //        },
            //        genericName: {
            //            label: "",
            //        },
            //    },
            //},
        ],
    });

    useEffect(() => {
        async function fetchPrescriptionById(id) {
            try {
                const response = await getPrescriptionDetail(id);
                 setPrescriptionsData(response.data);
                //console.log("data: ", response.data);
                //setPrescriptionsData({
                //    ...response.data,
                //    medicineList: [
                //        ...response.data.medicineList.map(medicine => {
                //            originalMedicineCode: medicine.medicineCode
                //        })
                //    ]
                //});
            } catch (error) {
                console.error("error #getMedicineOptions");
            }
        }
        fetchPrescriptionById(id);
    }, [id]);

    useEffect(() => {
        async function initializePatient(patient) {
            setSelectedPatient({
                patientId: patient.id,
                patientName: patient.name,
                credentialNum: patient.credentialNumber,
                phoneNum: patient.phoneNum,
            });
        }

        // const response = await getMedicineDropdownOptions()

        async function initializeFormField(medicineList) {
            let tempFormFields = [];
            medicineList.map((medicineData) => {
                const tempMedicine = {
                    code: medicineData.medicineCode,
                    medicineName: medicineData.medicineName,
                    currStock: medicineWithCurrStock[medicineData.medicineCode].currStock,
                    quantity: medicineData.quantity,
                    totalPrice: medicineData.totalPrice,
                    price: medicineData.totalPrice / medicineData.quantity,
                    instruction: medicineData.instruction
                }
                tempFormFields.push(tempMedicine)
            })
            setFormFields(tempFormFields)
            console.log("formFields1:", formFields)
        }

        if (
            prescriptionData?.medicineList !== undefined &&
            prescriptionData?.medicineList.length > 0 &&
                Object.keys(medicineWithCurrStock).length > 0
        ) {
            console.log("prescriptionData:", prescriptionData)
            initializePatient(prescriptionData.patient);
            initializeFormField(prescriptionData.medicineList);
        }
    }, [prescriptionData, medicineWithCurrStock]);

    const handleUpdatePrescription = async (e) => {
        e.preventDefault();
        try {
            setHasSubmit(true);
            let data = {
                prescriptionId: -1,
                medicineList : [{
                    code: "",
                    price: 0,
                    quantity: 0,
                    instruction: ""
                }]
            }

            data.prescriptionId = parseInt(id);
            data.medicineList.pop() 
            const temp = [...formFields]
            console.log(temp)
            temp.map(item => data.medicineList.push({
                code: item.code,
                quantity: parseInt(item.quantity),
                instruction: item.instruction,
                price: item.totalPrice,
            }))

            console.log(data)

            setErrors({});
            const dataToValidate = { prescription: data };
            prescriptionSchema.parse(dataToValidate);

            const res = await updatePrescription(data);
            toast.success(res.message, {
                autoClose: 2000,
                position: "top-right",
            });
            setTimeout(() => {
                router.push(`/prescription`);
            }, 2000);
        } catch (error) {
            setHasSubmit(false)
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
                title="Ubah Resep"
                type="child"
                backpageUrl="/prescription"
            >
                <form
                    onSubmit={handleUpdatePrescription}
                    className="flex flex-col gap-6"
                >
                    <div className="flex flex-col gap-2">
                        <Input
                            type="text"
                            label="Detail Pasien"
                            disabled={true}
                            name="name"
                            placeholder="Detail Pasien"
                            value={
                                selectedPatient?.credentialNum +
                                " - " +
                                selectedPatient?.patientName
                            }
                        />
                    </div>
                    <PrescriptionForm
                        formFields={formFields}
                        setFormFields={setFormFields}
                        errors={errors}
                        setErrors={setErrors}
                        setAvailableStock={setMedicineWithCurrStock}
                    />
                    <div className="flex max-md:flex-col gap-2 my-6 pb-4 md:justify-end">
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
                                isDisabled={hasSubmit}
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
