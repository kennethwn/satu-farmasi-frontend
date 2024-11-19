import Button from "@/components/Button";
import Input from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z, ZodError } from "zod";
import useExpenseMedicineAPI from "@/pages/api/transaction/expenseMedicine";
import Dropdown from "@/components/SelectPicker/Dropdown";
import { isRequiredNumber, isRequiredString } from "@/helpers/validation";
import useMedicineDropdownOption from "@/pages/api/medicineDropdownOption";
import { useUserContext } from "@/pages/api/context/UserContext";
import { ErrorForm } from "@/helpers/errorForm";

const medicineSchema = z.object({
    medicineId: isRequiredNumber(),
    quantity: isRequiredNumber(),
    reasonOfDispose: isRequiredString(),
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

export default function index() {
    const router = useRouter();
    const { user } = useUserContext();
    const id = router.query.id;
    const { isLoading, GetMedicineById, EditMedicine, GetOuputMedicineById } = useExpenseMedicineAPI();
    const { getMedicineDropdownOptions } = useMedicineDropdownOption();
    const [medicineDropdownOptions, setMedicineDropdownOptions] = useState([])
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({
        medicineId: 0,
        quantity: 0,
        reasonOfDispose: "",
        oldMedicineId: 0,
        oldQuantity: 0,
        medicine: {
            currStock: null
        }
    });
    const [errors, setErrors] = useState({});

    const handleFetchMedicineById = async () => {
        try {
            const res = await GetOuputMedicineById(id);
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
        } catch (error) {
            console.error(error);
        }
    };

    const editHandler = async (e) => {
        e.preventDefault();
        try {
            setErrors({});
            medicineSchema.parse(formData);
            const submitedForm = {...formData, oldQuantity: formData.oldMedicineId !== formData.medicineId ? 0 : formData.oldQuantity}
            const res = await EditMedicine(submitedForm);
            if (res.code !== 200)
                return toast.error(res.message, {
                    autoClose: 2000,
                    position: "top-right",
                });
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
            setTimeout(() => {
                router.push("/transaction/expense");
            }, 2000)
        } catch (error) {
            if (error instanceof ZodError) {
                const newErrors = { ...errors };
                error.issues.forEach((issue) => {
                    if (issue.path.length > 0) {
                        const fieldName = issue.path[0];
                        newErrors[fieldName] = issue.message;
                    }
                });
                setErrors(newErrors);
            } else {
                ErrorForm(error, setErrors, false);
            }
        }
    };

    const reasonOfDisposeListData = ["Broken", "Lost", "Expired"]
        .map(item => ({ label: item, value: item.toUpperCase() }));


    useEffect(() => {
        setData(Object.entries(medicineDropdownOptions)
            .map(([key, item]) => ({ label: item.name, value: key, })))
    }, [medicineDropdownOptions])

    useEffect(() => {
        const fetchData = async () => await handleFetchMedicineById();
        if (router.isReady) fetchData();
    }, [id]);

    useEffect(() => {
        async function fetchMedicineDropdownOptionsData() {
            try {
                const response = await getMedicineDropdownOptions()
                setMedicineDropdownOptions(response)
            } catch (error) {
                console.error(error);
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
                    currStock: res.data.currStock
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

    return (
        <Layout active="master-expense-medicine" user={user}>
            <ContentLayout
                title="Ubah Pengeluaran Obat"
                type="child"
                backpageUrl="/transaction/expense"
            >
                <form id="form" onSubmit={editHandler}>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        {createExpenseMedicineField.map((input, index) => {
                            return (
                                <div className="sm:col-span-6">
                                    {
                                        input.name == "reasonOfDispose" &&
                                        <Dropdown
                                            id={index}
                                            name={input.name}
                                            label={input.label}
                                            data={reasonOfDisposeListData}
                                            value={formData.reasonOfDispose}
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
                                            data={data}
                                            value={formData.medicineId.toString()}
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

                    <div className="flex justify-center gap-2 my-6 lg:justify-end">
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
