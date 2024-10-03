import Button from "@/components/Button";
import Input from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useRouter } from "next/router";
import { useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Loader } from "rsuite";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useExpenseMedicineAPI from "@/pages/api/transaction/expenseMedicine";
import Dropdown from "@/components/SelectPicker/Dropdown";
import { isRequiredString } from "@/helpers/validation";
import Label from "@/components/Input/Label";

const medicineSchema = z.object({
    name: isRequiredString(),
    quantity: isRequiredString(),
    reasonOfDispose: isRequiredString(),
});

const createVendorField = [
    {
        label: "Nama Obat",
        type: "text",
        name: "name",
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

export default function create() {
    const router = useRouter();
    const { isLoading, CreateMedicine } = useExpenseMedicineAPI();
    const formRef = useRef(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(medicineSchema) });

    const createHandler = async (data) => {
        try {
            const res = await CreateMedicine(data);
            if (res.code !== 200)
                return toast.error(res.message, {
                    autoClose: 2000,
                    position: "top-center",
                });
            toast.success(res.message, { autoClose: 2000, position: "top-center" });
            router.push("/transaction/expense");
        } catch (error) {
            console.error(error);
        }
    };

    const reasonOfDisposeList = ["Broken", "Lost", "Expired"].map(
        item => ({ label: item, value: item.toUpperCase() })
    );

    const submitForm = () => formRef.current.requestSubmit();

    return (
        <Layout active="master-vendor">
            <ContentLayout
                title="Tambah Pengeluaran Obat"
                type="child"
                backpageUrl="/transaction/expense"
            >
                <form id="form" onSubmit={handleSubmit(createHandler)} ref={formRef}>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        {createVendorField.map((input, index) => {
                            return (
                                <div className="sm:col-span-6">
                                    {input.name == "reasonOfDispose" ? (
                                        <Dropdown
                                            id={index}
                                            label={input.label}
                                            data={reasonOfDisposeList}
                                            searchable={false}
                                            placeholder="Select without search"
                                        />
                                    ) : (
                                        <Input
                                            label={input.label}
                                            register={register}
                                            type={input.type}
                                            name={input.name}
                                            placeholder={input.placeholder}
                                            error={errors[input.name]?.message}
                                        />
                                    )}
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
                            <Button appearance="primary" onClick={() => submitForm()}>
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
