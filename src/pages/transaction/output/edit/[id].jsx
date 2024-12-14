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
import useMedicineDropdownOption from "@/pages/api/medicineDropdownOption";
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

export const medicineSchema = z.object({
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
    const { isLoading, GetMedicineById, EditMedicine, GetOutputMedicineById } = useOutputMedicineAPI();
    const { getPharmacyInfo } = usePharmacy();
    const [ medicineData, setMedicineData ] = useState({})
    const [formData, setFormData] = useState({
        medicineId: 0,
        quantity: 0,
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
                medicine: {
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
            console.log("witnesses: ", formField);
            setErrors({});
            // medicineSchema.parse(formData);
            let submitedForm = {...formData, oldQuantity: formData.oldMedicineId !== formData.medicineId ? 0 : formData.oldQuantity}
            submitedForm.physicalReport.data.witnesses = formField;
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
            if (error instanceof ZodError) {
                const newErrors = { ...errors };
                error.issues.forEach((issue) => {
                    console.log("error zod: ", issue);
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

    const reasonOfDisposeListData = ["Broken", "Lost", "Expired"]
        .map(item => ({ label: item, value: item.toUpperCase() }));

    useEffect(() => {
        const fetchData = async () => await handleFetchMedicineById();
        if (router.isReady) fetchData();
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

    const handleFetchCurrentMedicineStock = async () => {
        try {
            const currMedicineId = formData.medicineId;
            const res = await GetMedicineById(currMedicineId);
            if (res.code !== 200)
                return toast.error(res.message, {
                    autoClose: 2000,
                    position: "top-right",
                });
            setFormData({
                ...formData,
                medicine: {
                    currStock: res.data.currStock
                }
            })
            setMedicineData(res.data)
            if (res.data.quantity === 0) {
                const newErrors = { ...errors };
                newErrors["currStock"] = "Current Medicine Stock is empty";
                setErrors(newErrors);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (formData.medicineId !== 0) {
            handleFetchCurrentMedicineStock();
        }
    }, [formData.medicineId])

    const handleFetchPharmacyInfo = async () => {
        try {
            const res = await getPharmacyInfo();
            if (res.code !== 200)
                return toast.error(res.message, {
                    autoClose: 2000,
                    position: "top-right",
            });
            setFormData({
                ...formData,
                physicalReport: {
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

    useEffect(() => {
        async function fetchData() {
            await handleFetchPharmacyInfo();
        }
        fetchData();
    }, [router]);

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
                                            value={medicineData.name}
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
