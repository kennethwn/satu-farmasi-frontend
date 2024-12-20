import Button from "@/components/Button";
import Input from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z, ZodError } from "zod";
import useOutputMedicineAPI from "@/pages/api/transaction/outputMedicine";
import Dropdown from "@/components/SelectPicker/Dropdown";
import { isRequiredNumber, isRequiredString } from "@/helpers/validation";
import { useUserContext } from "@/pages/api/context/UserContext";
import { ErrorForm } from "@/helpers/errorForm";
import OutputMedicineWitnessForm from "@/components/DynamicForms/OuputMedicineWitnessForm";
import usePharmacy from "@/pages/api/pharmacy";

const witnessesSchema = z.object({
    name: isRequiredString(),
    nip: isRequiredString(),
    role: isRequiredString()
})

const physicalReportSchema = z.object({
    data: z.object({
        witnesses: z.array(witnessesSchema)
    }),
});

const medicineSchema = z.object({
    medicineId: isRequiredNumber(),
    quantity: isRequiredNumber(),
    reasonOfDispose: isRequiredString(),
});

const medicineSchemaWithPhysicalReport = z.object({
    medicineId: isRequiredNumber(),
    quantity: isRequiredNumber(),
    reasonOfDispose: isRequiredString(),
    physicalReport: physicalReportSchema
});

export const createExpenseMedicineField = [
    {
        label: "Nama Obat",
        type: "text",
        name: "medicineId",
        placeholder: "Nama Obat",
    },
    {
        label: "Jumlah Keluar",
        type: "number",
        name: "quantity",
        placeholder: "Jumlah Pengeluaran",
    },
    {
        label: "Alasan Pengeluaran",
        type: "text",
        name: "reasonOfDispose",
        placeholder: "Alasan Pengeluaran",
    },
];

export default function Index() {
    const router = useRouter();
    const { user } = useUserContext();
    const id = router.query.id;
    const {  EditMedicine, GetOutputMedicineById } = useOutputMedicineAPI();
    const [ isLoading, setIsloading ] = useState(false);
    const { getPharmacyInfo } = usePharmacy();
    const [pharmacyInfo, setPharmacyInfo] = useState({});
    const [formData, setFormData] = useState({
        reasonOfDispose: "",
        oldMedicineId: 0,
        oldQuantity: 0,
        medicine: {
            currStock: null
        },
        physicalReport: {
            data: {
                pharmacist: "",
                sipaNumber: "",
                pharmacy: "",
                addressPharmacy: "",
                witnesses: [{ name: "", nip: "", role: "" }],
            }
        }
    });
    const [formField, setFormField] = useState([{ name: "", nip: "", role: "" }]);
    const [errors, setErrors] = useState({
        medicineId: "",
        quantity: "",
        reasonOfDispose: "",
        oldQuantity: "",
        medicine: {
            currstock: "",
        },
        physicalReport: {
            data: {
                pharmacist: "",
                sipaNumber: "",
                pharmacy: "",
                addressPharmacy: "",
                witnesses: [{ name: "", nip: "", role: "" }],
            }
        }
    });

    const handleFetchMedicineById = async () => {
        try {
            const res = await GetOutputMedicineById(id);
            if (res.code !== 200)
                return toast.error(res.message, {
                    autoClose: 2000,
                    position: "top-right",
                });
            setFormData({
                ...res.data,
                medicineId: res.data.medicine.id,
                oldMedicineId: res.data.medicine.id,
                oldQuantity: parseInt(res.data.quantity),
                reasonOfDispose: res.data.reasonOfDispose,
                reasonOfDispose: res.data.reasonOfDispose,
                medicine: {
                    ...res.data.medicine,
                    currstock: res.data.medicine.currStock,
                },
            })
            setFormField(res.data.physicalReport.data.witnesses);
        } catch (error) {
            console.error(error);
        }
    };

    const editHandler = async (e) => {
        e.preventDefault();
        try {
            setIsloading(true)
            let submitedForm = {...formData,  ...pharmacyInfo, oldQuantity: formData.oldMedicineId !== formData.medicineId ? 0 : formData.oldQuantity}
            submitedForm.physicalReport.data.witnesses = formField;
            setErrors({});
            if (submitedForm.reasonOfDispose === "BROKEN" || submitedForm.reasonOfDispose === "EXPIRED") {
                medicineSchemaWithPhysicalReport.parse(submitedForm);
            } else {
                medicineSchema.parse(submitedForm);
            }
            const res = await EditMedicine(submitedForm);
            if (res.code !== 200)
                return toast.error(res.message, {
                    autoClose: 2000,
                    position: "top-right",
                });
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
            setTimeout(() => {
                router.push("/transaction/output");
            }, 2000)
        } catch (error) {
            setIsloading(false)
            if (error instanceof ZodError) {
                const newErrors = { ...errors };
                error.issues.forEach((issue) => {
                    if (issue.path.length > 0) {
                        if (issue.path[0] === "physicalReport") {
                            const path = issue.path.join('.')
                            newErrors[path] = issue.message
                        } else {
                            const fieldName = issue.path[0];
                            newErrors[fieldName] = issue.message;
                        }
                    }
                });
                setErrors(newErrors);
            } else {
                toast.error(error.response?.data.message, {
                    autoClose: 2000,
                    position: "top-right",
                });
                error = error.response?.data.errors
                ErrorForm(error, setErrors, false);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await handleFetchMedicineById();
            await handleFetchPharmacyInfo();
        }
        if (id) fetchData()
    }, [id]);

    const inputOnChangeHandler = (e, name) => {
        if (name === "medicineId" || name === "reasonOfDispose") {
            setFormData({ ...formData, [name]: name === "medicineId" ? parseInt(e) : e });
            setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        } else {
            setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) });
            setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
        }
    };

    const handleFetchPharmacyInfo = async () => {
        try {
            const res = await getPharmacyInfo();
            if (res.code !== 200)
                return toast.error(res.message, {
                    autoClose: 2000,
                    position: "top-right",
            });
            setPharmacyInfo({
                ...res.data,
                physicalReport: {
                    id: res.data.id,
                    data: {
                        pharmacy: res.data.name,
                        addressPharmacy: res.data.address
                    }
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Layout active="transaction-output" user={user}>
            <ContentLayout
                title="Ubah Pengeluaran Obat"
                type="child"
                backpageUrl="/transaction/output"
            >
                <form id="form" onSubmit={editHandler}>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        {createExpenseMedicineField.map((input, index) => {
                            return (
                                <div key={index} className="sm:col-span-6">
                                    {
                                        input.name == "reasonOfDispose" &&
                                        <Dropdown
                                            id={index}
                                            name={input.name}
                                            label={input.label}
                                            data={["Broken", "Lost", "Expired"]
                                                .map(item => ({ label: item, value: item.toUpperCase() }))}
                                            //value={formData.reasonOfDispose.toUpperCase()}
                                            value={formData.reasonOfDispose.toUpperCase()}
                                            onChange={e => inputOnChangeHandler(e, input.name)}
                                            searchable={false}
                                            placeholder="Select Reason of Dispose"
                                            error={errors[input.name]}
                                        />
                                    }
                                    {
                                        input.name == "medicineId" &&
                                        <Input
                                            id={index}
                                            name={input.name}
                                            label={input.label}
                                            value={formData.medicine.name}
                                            placeholder="Select Medicine Name"
                                            error={errors[input.name]}
                                            disabled="true"
                                        />
                                    }
                                    {
                                        input.name == "quantity" &&
                                        (
                                            <div class="flex gap-x-5">
                                                <Input
                                                    label={"Jumlah Obat Keluar"}
                                                    type={"number"}
                                                    name={"quantity"}
                                                    value={formData.quantity}
                                                    onChange={e => inputOnChangeHandler(e, input.name)}
                                                    placeholder={0}
                                                    error={errors["quantity"]}
                                                />
                                                <Input
                                                    label={"Stock Obat Sekarang"}
                                                    type={"number"}
                                                    name={"currStock"}
                                                    value={formData.medicine.currStock}
                                                    disabled={true}
                                                    placeholder={0}
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                            );
                        })}
                    </div>

                    {
                        (formData.reasonOfDispose == "BROKEN" || formData.reasonOfDispose == "EXPIRED") &&
                            <div className="w-full mt-6 text-lg font-semibold">
                                Data Petugas Kesehatan
                            </div>
                    }

                    <div className="w-full my-6">
                        {
                            (formData.reasonOfDispose == "BROKEN" || formData.reasonOfDispose == "EXPIRED") &&
                                <OutputMedicineWitnessForm 
                                    isLoading={isLoading}
                                    formFields={formField}
                                    setFormFields={setFormField}
                                    setErrors={setErrors}
                                    errors={errors}
                                />
                        }
                    </div>

                    <div className="flex justify-center gap-2 my-6 py-4 lg:justify-end">
                        {isLoading ? (
                            <Button
                                appearance="primary"
                                isDisabled={true}
                                isLoading={isLoading}
                            >
                                Simpan
                            </Button>
                        ) : (
                            <Button appearance="primary" type="submit">
                                Simpan
                            </Button>
                        )}
                    </div>
                </form>
            </ContentLayout>
        </Layout>
    );
}
