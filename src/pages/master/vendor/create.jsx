import Button from "@/components/Button";
import Input from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import useVendorAPI from "@/pages/api/master/vendor";
import { z } from "zod";
import { isRequiredPhoneNumber, isRequiredString } from "@/helpers/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "@/pages/api/context/UserContext";

const vendorSchema = z.object({
    name: isRequiredString(),
    phoneNum: isRequiredPhoneNumber(),
    address: isRequiredString(),
    city: isRequiredString(),
});

const createVendorField = [
    {
        label: "Nama Vendor",
        type: "text",
        name: "name",
        autofocus: true,
        placeholder: "Nama Vendor",
    },
    {
        label: "No Handphone",
        type: "number",
        name: "phoneNum",
        autofocus: false,
        placeholder: "628XXXXXXXXX",
    },
    {
        label: "Alamat",
        type: "text",
        name: "address",
        autofocus: false,
        placeholder: "Alamat",
    },
    {
        label: "Kota",
        type: "text",
        name: "city",
        autofocus: false,
        placeholder: "Kota",
    },
];

export default function create() {
    const router = useRouter();
    const { user } = useUserContext();
    const { isLoading, CreateVendor } = useVendorAPI();
    const [isSubmitted, setSubmitted] = useState(false)
    const formRef = useRef(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(vendorSchema) });

    const createHandler = async (data) => {
        try {
            const res = await CreateVendor(data);
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
            setSubmitted(true)
            setTimeout(() => {
                router.push("/master/vendor");
            }, 2000);
        } catch (error) {
            console.log(error);
            toast.error(error.message, {
                autoClose: 2000,
                position: "top-right",
            })
        }
    };

    const submitForm = () => formRef.current.requestSubmit();

    return (
        <Layout active="master-vendor" user={user}>
            <ContentLayout
                title="Tambah Vendor"
                type="child"
                backpageUrl="/master/vendor"
            >
                <form id="form" onSubmit={handleSubmit(createHandler)} ref={formRef}>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        {createVendorField.map((input) => {
                            return (
                                <div className="sm:col-span-6">
                                    <Input
                                        label={input.label}
                                        register={register}
                                        type={input.type}
                                        autofocus={input.autofocus}
                                        name={input.name}
                                        placeholder={input.placeholder}
                                        error={errors[input.name]?.message}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex max-md:flex-col gap-2 my-6 pb-4 md:justify-end">
                        {isSubmitted ? (
                            <Button
                                appearance="primary"
                                isDisabled={true}
                                isLoading={isLoading}
                            >
                                Simpan
                            </Button>
                        ) : (
                            <Button type="button" appearance="primary" isLoading={isLoading} onClick={() => submitForm()}>
                                Simpan
                            </Button>
                        )}
                    </div>
                </form>
            </ContentLayout>
        </Layout>
    );
}
