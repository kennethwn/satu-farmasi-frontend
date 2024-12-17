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
import { isRequiredNumber, isRequiredString, isRequiredStringOptional} from "@/helpers/validation";
import useMedicineDropdownOption from "@/pages/api/medicineDropdownOption";
import { useUserContext } from "@/pages/api/context/UserContext";
import { ErrorForm } from "@/helpers/errorForm";
import OutputMedicineWitnessForm from "@/components/DynamicForms/OuputMedicineWitnessForm";
import usePharmacy from "@/pages/api/pharmacy";

const witnessesSchema = z.object({
    name: isRequiredStringOptional(),
    nip: isRequiredStringOptional(),
    role: isRequiredStringOptional()
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

const createExpenseMedicineField = [
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
    const { isLoading, CreateMedicine, GetMedicineById } = useOutputMedicineAPI();
    const { getMedicineDropdownOptionsById } = useMedicineDropdownOption();
    const { getPharmacyInfo } = usePharmacy();
    const [medicineDropdownOptions, setMedicineDropdownOptions] = useState([])
    const [currStockMedicine, setCurrStockMedicine] = useState(0);
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({
        medicineId: 0,
        quantity: 0,
        reasonOfDispose: "",
        oldQuantity: 0,
        medicine: {
            currstock: null,
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
    const [errors, setErrors] = useState({});

    const createHandler = async (e) => {
        e.preventDefault();
        try {
            // binding payload
            formData.physicalReport.data.pharmacist = user.name;
            formData.physicalReport.data.sipaNumber = user.sipaNumber;
            formData.physicalReport.data.witnesses = formField;

            setErrors({});
            console.log("form data: ", formData);
            if (formData.reasonOfDispose === "BROKEN" || formField.reasonOfDispose === "EXPIRED") {
                medicineSchemaWithPhysicalReport.parse(formData);
            } else {
                medicineSchema.parse(formData);
            }

            const res = await CreateMedicine(formData);
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
            console.log("error: ", error);
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

    useEffect(() => {
        console.log("error zod useeffect: ", JSON.stringify(errors));
    }, [errors]);

    const reasonOfDisposeListData = ["Broken", "Lost", "Expired"].map(item => ({ label: item, value: item.toUpperCase() }));

    useEffect(() => {
        setData(Object.entries(medicineDropdownOptions)
            .map(([key, item]) => ({ label: item.name, value: key, })));
    }, [medicineDropdownOptions])

    useEffect(() => {
        async function fetchMedicineDropdownOptionsData() {
            try {
                const response = await getMedicineDropdownOptionsById()
                setMedicineDropdownOptions(response.data)
            } catch (error) {
                console.log("error #getMedicineOptions")
            }
        }
        fetchMedicineDropdownOptionsData()
    }, [])

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
                    currstock: res.data.currStock
                }
            })
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
                title="Tambah Pengeluaran Obat"
                type="child"
                backpageUrl="/transaction/output"
            >
                <form id="form" onSubmit={createHandler}>
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
                                            data={["Broken", "Lost", "Expired"].map(item => ({ label: item, value: item.toUpperCase() }))}
                                            onChange={e => inputOnChangeHandler(e, input.name)}
                                            searchable={false}
                                            placeholder="Select Reason of Dispose"
                                            error={errors[input.name]}
                                        />
                                    }
                                    {
                                        input.name == "medicineId" &&
                                        <Dropdown
                                            id={index}
                                            name={input.name}
                                            label={input.label}
                                            data={Object.entries(medicineDropdownOptions).map(([key, item]) => ({ label: item.name + " #" + item.id, value: key, }))}
                                            onChange={e => inputOnChangeHandler(e, input.name)}
                                            placeholder="Select Medicine Name"
                                            error={errors[input.name]}
                                        />
                                    }
                                    {
                                        input.name == "quantity" &&
                                        (
                                            <div class="flex gap-x-5">
                                                <Input
                                                    label={"Jumlah Obat keluar"}
                                                    type={"number"}
                                                    name={"quantity"}
                                                    onChange={e => inputOnChangeHandler(e, input.name)}
                                                    placeholder={0}
                                                    error={errors["quantity"]}
                                                />
                                                <Input
                                                    label={"Stock Obat Sekarang"}
                                                    type={"number"}
                                                    name={"currstock"}
                                                    value={formData.medicine.currstock}
                                                    error={errors["currStock"]}
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

                    <div className="flex justify-center gap-2 mb-6 mt-12 py-4 lg:justify-end">
                        <Button
                            appearance="primary"
                            type="submit"
                            isDisabled={isLoading}
                            isLoading={isLoading}
                        >
                            Simpan
                        </Button>
                    </div>
                </form>
            </ContentLayout>
        </Layout>
    );
}
