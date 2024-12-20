import InputField from "@/components/Input";
import useDoctor from "../api/doctor";
import usePharmacist from "../api/pharmacist";
import { useEffect, useRef, useState } from "react";
import propTypes from 'prop-types'
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import Link from 'next/link'
import { isOptionalString, isPassword, isRequiredOptions, isRequiredEmail, isRequiredString, isRequiredPhoneNumber } from "@/helpers/validation";
import Text from "@/components/Text";
import { ErrorForm } from "@/helpers/errorForm";
import Button from "@/components/Button";
import ArrowLeftIcon from '@rsuite/icons/ArrowLeft';
import { RadioGroup } from 'rsuite';
import { toast } from "react-toastify";

const registerSchema = z.object({
    email: isRequiredEmail(),
    password: isPassword(),
    confirmPassword: isPassword(),
    nik: isRequiredString().min(16, { message: "Panjang NIK minimal 16 karakter" }),
    firstName: isRequiredString(),
    lastName: isRequiredString(),
    phoneNum: isRequiredPhoneNumber(),
    role: isRequiredOptions(),
    specialist: isOptionalString(),
    dob: isRequiredString(),
    sipaNum: isOptionalString(),
}).superRefine(({ role, specialist, sipaNum, password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            message: "Password tidak sesuai",
            path: ['confirmPassword']
        });
    }
    if (role === 'doctor' && !specialist) {
        ctx.addIssue({
            path: ['specialist'],
            message: "Bidang ini harus diisi",
        });
    }

    if (role === 'pharmacist' && !sipaNum) {
        ctx.addIssue({
            path: ['sipaNum'],
            message: "Bidang ini harus diisi",
        });
    }
});

export default function Login() {
    const { router, isLoading: doctorLoading, addDoctor } = useDoctor();
    const { isLoading: pharmacistLoading, addPharmacist } = usePharmacist();
    const [isLoading, setIsLoading] = useState(false);

    const credentialsRef = useRef(null);
    const formRef = useRef(null);
    const biodataRef = useRef(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [triggerErr, setTriggerErr] = useState(false);
    const roleRef = useRef(null);

    const { register, handleSubmit, formState: { errors }, setError } = useForm({ resolver: zodResolver(registerSchema) })

    const nextDataHandler = () => {
        biodataRef.current.style.display = "block";
        credentialsRef.current.style.display = "none";
    }

    const prevDataHandler = () => {
        credentialsRef.current.style.display = "block";
        biodataRef.current.style.display = "none";
    }

    const RegisterHandler = async (data) => {
        try {
            const submitedData = {...data, phoneNum: data.phoneNum.toString()}
            if (data.role === "pharmacist") await addPharmacist(submitedData);
            else await addDoctor(submitedData);
            toast.success("Pengguna Berhasil Ditambahkan", { autoClose: 2000, position: 'top-right' });
            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (error) {
            ErrorForm(error, setError);
            setTriggerErr(!triggerErr);
        }
    }

    const credentialInputField = [
        { label: "Email", type: "email", name: "email", placeholder: "johndoe@gmail.com", autofocus: true },
        { label: "Password", type: "password", name: "password", placeholder: "**********" },
        { label: "Konfirmasi Password", type: "password", name: "confirmPassword", placeholder: "**********" },
    ]

    const biodataInputField = [
        { label: "NIK", type: "number", name: "nik", placeholder: "12345678" },
        { name: "fullName" },
        { label: "No Handphone", type: "number", name: "phoneNum", placeholder: "628xxxxxx" },
        { label: "Tanggal Lahir", type: "date", name: "dob", placeholder: "01/01/2000" },
        { name: "role" },
    ]

    const selectHandler = (e) => {
        setSelectedOption(e);
        roleRef.current.style.display = "none";
    }

    const submitForm = () => formRef.current.requestSubmit();

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            if (errors.email || errors.password || errors.confirmPassword) {
                credentialsRef.current.style.display = "block";
                biodataRef.current.style.display = "none";
            } else {
                credentialsRef.current.style.display = "none";
                biodataRef.current.style.display = "block";
            }
        }
    }, [errors, triggerErr])

    useEffect(() => {
        setIsLoading(doctorLoading || pharmacistLoading)
    }, [doctorLoading, pharmacistLoading])

    useEffect(() => {
        credentialsRef.current.style.display = "block";
        biodataRef.current.style.display = "none";
    }, [])

    return (
        <form onSubmit={handleSubmit(RegisterHandler)} className="h-screen flex justify-center items-center flex-col py-16" ref={formRef}>
            <section ref={credentialsRef}>
                <div className="flex justify-center items-center flex-col gap-3 p-8 rounded bg-background-light border border-border-auth w-[400px]">
                    <div className="text-center mb-4">
                        <Text type="heading_4">Buat Akun Anda</Text>
                    </div>
                    {
                        credentialInputField.map((input) => {
                            return (
                                <InputField key={input.name} type={input.type} placeholder={input.placeholder} name={input.name} register={register} label={input.label} error={errors[input.name]?.message} autofocus={input.autofocus} />
                            )
                        })
                    }
                    <Button type="button" onClick={nextDataHandler} className='w-full'>Selanjutnya</Button>
                    <Text type="body">Sudah punya akun? <Link className="font-semibold" href="/auth/login">Masuk</Link> di sini</Text>
                </div>
            </section>
            <section ref={biodataRef}>
                <div className="flex justify-center items-center flex-col gap-3 p-8 rounded bg-background-light border border-border-auth">
                    <div className="text-center mb-4">
                        <Text type="heading_4">Hampir Selesai</Text>
                    </div>
                    {biodataInputField.map((input) => {
                        if (input.name === "fullName") {
                            return (
                                <div key={input.name} className="flex justify-center items-center gap-x-5">
                                    <InputField type="text" placeholder="John" name="firstName" register={register} label="Nama Depan" error={errors.firstName?.message} />
                                    <InputField type="text" placeholder="Doe" name="lastName" register={register} label="Nama Belakang" error={errors.lastName?.message} />
                                </div>
                            )
                        }
                        if (input.name === "role") {
                            return (
                                <>
                                    <Text type="body" className="w-full text-start">Role</Text>
                                    <RadioGroup name="role-group" inline className="flex flex-row jusitfy-start items-start gap-x-3 w-full">
                                        <InputField type="radio" name="role" register={register} value="doctor" onChange={selectHandler} label="Dokter" id="doctor" />
                                        <InputField type="radio" name="role" register={register} value="pharmacist" onChange={selectHandler} label="Farmasi" id="pharmacist" />
                                    </RadioGroup>
                                    <div className='px-4 w-full' ref={roleRef}>
                                        {
                                            errors.role &&
                                            <Text type="danger">{errors.role?.message}</Text>
                                        }
                                    </div>
                                </>
                            )
                        }
                        return (
                            <InputField key={input.name} type={input.type} placeholder={input.placeholder} name={input.name} register={register} label={input.label} error={errors[input.name]?.message} />
                        )
                    })}
                    {selectedOption === 'doctor' && <RenderSpecialistInput register={register} errors={errors} />}
                    {selectedOption === 'pharmacist' && <RenderSipaInput register={register} errors={errors} />}
                    <div className="flex gap-x-5 w-full">
                        <Button type='button' onClick={prevDataHandler} className='w-5 flex-none'>
                            <ArrowLeftIcon className="text-2xl" />
                        </Button>
                        <Button type='button' isLoading={isLoading} onClick={submitForm} className='w-full shrink'>{isLoading ? '' : 'Daftar'}</Button>
                    </div>
                </div>
            </section>
        </form>
    )
}

const RenderSpecialistInput = ({ register, errors }) =>
    <InputField type="text" placeholder="Heart" name="specialist" register={register} label="Spesialis" error={errors.specialist?.message} />

const RenderSipaInput = ({ register, errors }) =>
    <InputField type="text" placeholder="SIPA" name="sipaNum" register={register} label="Surat Izin Praktik Apoteker (SIPA)" error={errors.sipaNum?.message} />

RenderSpecialistInput.propTypes = {
    register: propTypes.func.isRequired,
    errors: propTypes.object.isRequired
};

RenderSipaInput.propTypes = {
    register: propTypes.func.isRequired,
    errors: propTypes.object.isRequired
};
