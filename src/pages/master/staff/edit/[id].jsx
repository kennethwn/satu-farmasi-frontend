import Button from "@/components/Button";
import Input from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { convertToTimestampString } from "@/helpers/dayHelper";
import { isOptionalBoolean, isOptionalString, isRequiredEmail, isRequiredPhoneNumber, isRequiredString } from "@/helpers/validation";
import useStaffAPI from "@/pages/api/master/staff";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Loader } from "rsuite";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "@/pages/api/context/UserContext";
import { ErrorForm } from "@/helpers/errorForm";

const staffSchema = z.object({
    firstName: isRequiredString(),
    lastName: isRequiredString(),
    email: isRequiredEmail(),
    dob: isRequiredString(),
    nik: isRequiredString(),
    phoneNum: isRequiredPhoneNumber(),
    specialist: isOptionalString(),
    is_active: isOptionalBoolean(),
});

export default function Index() {
    const router = useRouter();
    const id = router.query.id;
    const { isLoading, GetStaffByNik, EditAdmin, EditDoctor, EditPharmacist } = useStaffAPI();
    const [isChecked, setIsChecked] = useState(false);
    const { user } = useUserContext();
    const formRef = useRef();
    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
    } = useForm({
        resolver: zodResolver(staffSchema), defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            dob: "",
            nik: "",
            role: "",
            oldEmail: "",
            oldNik: "",
            phoneNum: 0,
            is_active: true,
        }
    });

    const handleFetchStaffByNik = async () => {
        try {
            const res = await GetStaffByNik(id);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            }
            Object.keys(res.data).forEach((key) => {
                if (key === "phoneNum") res.data[key] = parseInt(res.data[key]);
                else if (key === "dob") res.data[key] = res.data[key].substring(0, 10);
                else if (key === "is_active") setIsChecked(res.data[key]);
                else if (key === "email") setValue("oldEmail", res.data[key]);
                else if (key === "nik") setValue("oldNik", res.data[key]);
                setValue(key, res.data[key]);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmitStaff = async (data) => {
        try {
            let res = null;
            data = {
                ...data,
                role: getValues("role"),
                dob: convertToTimestampString(data.dob),
                is_active: isChecked,
                oldEmail: getValues("oldEmail"),
                oldNik: getValues("oldNik"),
            }
            res = await handleRole(data);
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
            setTimeout(() => {
                router.push("/master/staff");
            }, 2000);
        } catch (error) {
            ErrorForm(error, setError);
        }
    };

    const handleRole = async (data) => {
        try {
            if (data.role.toLowerCase() === "admin") return await EditAdmin(data);
            else if (data.role.toLowerCase() === "doctor") return await EditDoctor(data);
            else if (data.role.toLowerCase() === "pharmacist") return await EditPharmacist(data);
            else throw new Error("Role is not valid");
        } catch (error) {
            console.log("error here: ", error);
            throw error;
        }
    }

    useEffect(() => {
        async function fetchData() {
            await handleFetchStaffByNik();
        }

        if (router.isReady) {
            fetchData();
        }
    }, [id]);

    const submitForm = () => {
        setValue("phoneNum", getValues("phoneNum").toString());
        formRef.current.requestSubmit();
    }

    useEffect(() => {
        console.log(errors);
    }, [errors])

    {/* TODO: add register, delete values */ }
    return (
        <Layout active="master-staff" user={user}>
            <ContentLayout title="Ubah Staf" type="child" backpageUrl="/master/staff">
                <form id="form" onSubmit={handleSubmit(handleSubmitStaff)} ref={formRef}>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <div className="mt-2">
                                {isLoading ?
                                    <Input
                                        label="Nama Depan"
                                        type="text"
                                        id="first_name"
                                        name="firstName"
                                        disabled={true}
                                        placeholder="John"
                                    />
                                    :
                                    <Input
                                        label="Nama Depan"
                                        type="text"
                                        id="first_name"
                                        name="firstName"
                                        placeholder="John"
                                        register={register}
                                        error={errors.firstName?.message}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <div className="mt-2">
                                {isLoading ?
                                    <Input
                                        label="Nama Belakang"
                                        type="text"
                                        id="last_name"
                                        name="lastName"
                                        disabled={true}
                                        placeholder="Doe"
                                    />
                                    :
                                    <Input
                                        label="Nama Belakang"
                                        type="text"
                                        id="last_name"
                                        name="lastName"
                                        placeholder="Doe"
                                        register={register}
                                        error={errors.lastName?.message}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <div className="mt-2">
                                <Input
                                    label="NIK"
                                    type="text"
                                    id="nik"
                                    name="nik"
                                    disabled={true}
                                    placeholder="123456789"
                                    error={errors.nik?.message}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <div className="mt-2">
                                {isLoading ?
                                    <Input
                                        label="Email"
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="john.doe@example.com"
                                        register={register}
                                        error={errors.email?.message}
                                        disabled={true}
                                    />
                                    :
                                    <Input
                                        label="Email"
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="john.doe@example.com"
                                        register={register}
                                        error={errors.email?.message}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <div className="mt-2">
                                {isLoading ?
                                    <Input
                                        label="Tanggal Lahir"
                                        type="date"
                                        id="dob"
                                        name="dob"
                                        disabled={true}
                                        register={register}
                                        error={errors.dob?.message}
                                    />
                                    :
                                    <Input
                                        label="Tanggal Lahir"
                                        type="date"
                                        id="dob"
                                        name="dob"
                                        error={errors.dob?.message}
                                        register={register}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <div className="mt-2">
                                {isLoading ?
                                    <Input
                                        label="No Handlphone"
                                        type="number"
                                        id="phone_number"
                                        name="phoneNum"
                                        placeholder="08XXXXXXXXX"
                                        disabled={true}
                                        error={errors.phoneNum?.message}
                                        register={register}
                                    />
                                    :
                                    <Input
                                        label="No Handlphone"
                                        type="number"
                                        id="phone_number"
                                        name="phoneNum"
                                        placeholder="08XXXXXXXXX"
                                        error={errors.phoneNum?.message}
                                        register={register}
                                    />
                                }
                            </div>
                        </div>
                        {
                            getValues("role").toLowerCase() === "doctor" && (
                                <div className="sm:col-span-6">
                                    <div className="mt-2">
                                        {isLoading ?
                                            <Input
                                                label="Spesialis"
                                                type="text"
                                                id="specialist"
                                                name="specialist"
                                                placeholder="specialist"
                                                error={errors.specialist?.message}
                                                register={register}
                                            />
                                            :
                                            <Input
                                                label="Spesialis"
                                                type="text"
                                                id="specialist"
                                                name="specialist"
                                                placeholder="specialist"
                                                error={errors.specialist?.message}
                                                register={register}
                                            />
                                        }
                                    </div>
                                </div>
                            )
                        }
                        <div className="flex flex-row items-center w-full gap-2">
                            <div>
                                {isLoading ?
                                    <Input
                                        label="Status Aktif"
                                        type="checkbox"
                                        id="is_active"
                                        name="is_active"
                                        disabled
                                        error={errors.is_active?.message}
                                    />
                                    :
                                    <Input
                                        label="Status Aktif"
                                        type="checkbox"
                                        id="is_active"
                                        name="is_active"
                                        checked={isChecked}
                                        onChange={() => setIsChecked(!isChecked)}
                                        error={errors.is_active?.message}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-2 my-6 lg:justify-end">
                        {isLoading ?
                            <Button
                                type="button"
                                appearance="primary"
                                isDisabled={true}
                                isLoading={isLoading}
                            >
                                Simpan
                            </Button>
                            :
                            <Button
                                type="button"
                                appearance="primary"
                                onClick={submitForm} >
                                Simpan
                            </Button>
                        }
                    </div>
                </form>
            </ContentLayout>

            <ToastContainer />
            {isLoading && <Loader />}
        </Layout>
    )
}
