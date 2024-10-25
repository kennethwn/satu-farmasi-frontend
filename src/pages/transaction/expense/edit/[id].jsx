import Button from "@/components/Button";
import Input from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Loader } from "rsuite";
import { z, ZodError } from "zod";
import useExpenseMedicineAPI from "@/pages/api/transaction/expenseMedicine";
import Dropdown from "@/components/SelectPicker/Dropdown";
import { isRequiredNumber, isRequiredString } from "@/helpers/validation";
import useMedicineDropdownOption from "@/pages/api/medicineDropdownOption";
import { useUserContext } from "@/pages/api/context/UserContext";

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
    const { isLoading, GetMedicineById, EditMedicine } = useExpenseMedicineAPI();
    const { getMedicineDropdownOptions } = useMedicineDropdownOption();
    const [medicineDropdownOptions, setMedicineDropdownOptions] = useState([])
    const [formData, setFormData] = useState({
        medicineId: 0,
        quantity: 0,
        reasonOfDispose: "",
        oldQuantity: 0,
    });
    const [errors, setErrors] = useState({});

    const handleFetchMedicineById = async () => {
        try {
            const res = await GetMedicineById(id);
            if (res.code !== 200)
                return toast.error(res.message, {
                    autoClose: 2000,
                    position: "top-center",
                });
            setFormData({
                ...res.data,
                medicineId: res.data.medicine.id,
                oldQuantity: Number(res.data.quantity),
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
            const res = await EditMedicine(formData);
            if (res.code !== 200)
                return toast.error(res.message, {
                    autoClose: 2000,
                    position: "top-center",
                });
            toast.success(res.message, { autoClose: 2000, position: "top-center" });
            router.push("/transaction/expense");
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
            }
        }
    };

    const reasonOfDisposeListData = ["Broken", "Lost", "Expired"].map(item => ({ label: item, value: item.toUpperCase() }));
    const data = Object.entries(medicineDropdownOptions).map(([key, item]) => ({ label: item.name, value: key, }));

    useEffect(() => {
        const fetchData = async () => await handleFetchMedicineById();
        if (router.isReady) fetchData();
    }, [id]);

    useEffect(() => {
        async function fetchMedicineDropdownOptionsData() {
            try {
                const response = await getMedicineDropdownOptions()
				console.log("response: ", response)
                setMedicineDropdownOptions(response)
            } catch (error) {
				console.error(error);
            }
        }
        fetchMedicineDropdownOptionsData()
    }, [])

    const inputOnChangeHandler = (e, name) => {
        if (name === "medicineId" || name === "reasonOfDispose") {
            setFormData({ ...formData, [name]: name === "medicineId" ? Number(e) : e });
            setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        } else {
            setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
            setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
        }
    };

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
                                        <Input
                                            label={input.label}
                                            type={input.type}
                                            name={input.name}
                                            value={formData.quantity}
                                            onChange={e => inputOnChangeHandler(e, input.name)}
                                            placeholder={input.placeholder}
                                            error={errors[input.name]}
                                        />
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

            <ToastContainer />
            {isLoading && <Loader />}
        </Layout>
    );
}
