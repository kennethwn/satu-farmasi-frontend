import Button from "@/components/Button";
import Input from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Loader } from "rsuite";
import useVendorAPI from "@/pages/api/master/vendor";
import { z } from "zod";
import { isRequiredNumber, isRequiredString } from "@/helpers/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "@/pages/api/context/UserContext";

const vendorSchema = z.object({
    name: isRequiredString(),
    phoneNum: isRequiredString(),
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

export default function index() {
    const router = useRouter();
    const id = router.query.id;
    const { isLoading, GetVendorById, EditVendor } = useVendorAPI();
    const [isSubmitted, setSubmitted] = useState(false)
    const { user } = useUserContext();
    const formRef = useRef(null);
    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(vendorSchema), defaultValues: {
            id: id,
            address: "",
            city: "",
            name: "",
            phoneNum: 0,
        }
    });

    const handleFetchVendorById = async () => {
        try {
            const res = await GetVendorById(id);
            if (res.code !== 200)
                return toast.error(res.message, {
                    autoClose: 2000,
                    position: "top-right",
                });
            Object.keys(res.data).forEach((key) => {
                if (key === "phoneNum") res.data[key] = parseInt(res.data[key]);
                setValue(key, res.data[key]);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const editHandler = async (data) => {
        try {
            data = { ...data, id: id, phoneNum: data.phoneNum.toString(), is_active: true };
            const res = await EditVendor(data);
            if (res.code !== 200)
                return toast.error(res.message, {
                    autoClose: 2000,
                    position: "top-right",
                });
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
            setSubmitted(true)
            setTimeout(() => {
                router.push("/master/vendor");
            }, 2000)
        } catch (error) {
            console.error(error);
        }
    };

    const submitForm = () => {
        setValue("phoneNum", getValues("phoneNum").toString());
        formRef.current.requestSubmit();
    }

    useEffect(() => {
        const fetchData = async () => await handleFetchVendorById();
        if (router.isReady) fetchData();
    }, [id, router.isReady]);

    return (
        <Layout active="master-vendor" user={user}>
            <ContentLayout
                title="Ubah Vendor"
                type="child"
                backpageUrl="/master/vendor"
            >
                <form id="form" onSubmit={handleSubmit(editHandler)} ref={formRef}>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        {createVendorField.map((input) => {
                            return (
                                <div className="sm:col-span-6">
                                    <Input
                                        label={input.label}
                                        register={register}
                                        type={input.type}
                                        name={input.name}
                                        autofocus={input.autofocus}
                                        placeholder={input.placeholder}
                                        error={errors[input.name]?.message}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-center gap-2 my-6 lg:justify-end">
                        {isSubmitted ? (
                            <Button
                                appearance="primary"
                                isDisabled={true}
                                isLoading={isLoading}
                            >
                                Simpan
                            </Button>
                        ) : (
                            <Button appearance="primary" isLoading={isLoading} onClick={() => submitForm()}>
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
