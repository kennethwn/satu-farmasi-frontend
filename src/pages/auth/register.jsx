import Input from "@/components/Input";
import useDoctor from "../api/doctor";
import usePharmacist from "../api/pharmacist";
import { useEffect, useRef, useState } from "react";
import propTypes from 'prop-types'
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import Link from 'next/link'
import { isOptionalString, isPassword, isRequiredBoolean, isRequiredEmail, isRequiredString } from "@/helpers/validation";
import Text from "@/components/Text";
import Button from "@/components/Button";
import ArrowLeftIcon from '@rsuite/icons/ArrowLeft';
import { RadioGroup } from 'rsuite';

const registerSchema = z.object({
    email: isRequiredEmail(),
    password: isPassword(),
    confirmPassword: isPassword(),
    nik: isRequiredString(),
    firstName: isRequiredString(),
    lastName: isRequiredString(),
    phoneNum: isRequiredString(),
    role: isRequiredString(),
    specialist: isOptionalString(),
    dob: isRequiredString(),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            message: "Passwords does not match",
            path: ['confirmPassword']
        });
    }
});

export default function Login() {
    const { router, isLoading:doctorLoading, addDoctor } = useDoctor();
    const { isLoading:pharmacistLoading, addPharmacist } = usePharmacist();
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState(null);
    const credentialsRef = useRef(null);
    const formRef = useRef(null);
    const biodataRef = useRef(null);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        setIsLoading(doctorLoading || pharmacistLoading)
    }, [doctorLoading, pharmacistLoading])

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) })

    useEffect(() => {
        credentialsRef.current.style.display = "block";
        biodataRef.current.style.display = "none";
    }, [])

    useEffect(() => {
        if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
            if (errors.email || errors.password || errors.confirmPassword) {
                credentialsRef.current.style.display = "block";
                biodataRef.current.style.display = "none";
                return;
            }
            credentialsRef.current.style.display = "none";
            biodataRef.current.style.display = "block";
        }
    }, [errors])

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
            let status = 0, message = "";
            if (data.role === "pharmacist") ({ status, message } = await addPharmacist(data));
            else ({ status, message } = await addDoctor(data));
            status === 200 ? router.push("/auth/login") : setError(message);
        } catch (error) {
            console.log("error: ", error);
        }
    }

    const credentialInputField = [
        { label: "Email", type: "email", name: "email", placeholder: "johndoe@gmail.com", autofocus: true },
        { label: "Password", type: "password", name: "password", placeholder: "**********" },
        { label: "Confirm Password", type: "password", name: "confirmPassword", placeholder: "**********" },
    ]

    const biodataInputField = [
        { label: "NIK", type: "text", name: "nik", placeholder: "12345678" },
        { name: "fullName" },
        { label: "Phone Number", type: "number", name: "phoneNum", placeholder: "+628xxxxxx" },
        { label: "Date of Birth", type: "date", name: "dob", placeholder: "01/01/2000" },
        { name: "role" },
    ]


    const submitForm = () => formRef.current.requestSubmit();

    return (
        <form onSubmit={handleSubmit(RegisterHandler)} className="flex justify-center items-center flex-col h-screen" ref={formRef}>
            <section ref={credentialsRef}>
                <div className="flex justify-center items-center flex-col gap-3 p-8 rounded bg-background-light border border-border-auth">
                    <div className="text-center mb-4">
                        <Text type="heading_3">Create Your Account</Text>
                        <Text type="body">Create new account to access the pharmacy dashboard</Text>
                    </div>
                    {
                        credentialInputField.map((input) => {
                            return (
                                <Input key={input.name} type={input.type} placeholder={input.placeholder} name={input.name} register={register} label={input.label} error={errors[input.name]?.message} autofocus={input.autofocus} />
                            )
                        })
                    }
                    <Button type='primary' onClick={nextDataHandler} className='w-full'>Next</Button>
                    <Text type="body">Don't have an account? <Link href="/auth/login">Sign in</Link> here</Text>
                </div>
            </section>
            <section ref={biodataRef}>
                <div className="flex justify-center items-center flex-col gap-3 p-8 rounded bg-background-light border border-border-auth">
                    <div className="text-center mb-4">
                        <Text type="heading_3">You are almost done</Text>
                        <Text type="body">Please fill the data bellow</Text>
                    </div>
                    {biodataInputField.map((input) => {
                        if (input.name === "fullName") {
                            return (
                                <div key={input.name} className="flex justify-center items-center gap-x-5">
                                    <Input type="text" placeholder="John" name="firstName" register={register} label="First Name" error={errors.firstName?.message} />
                                    <Input type="text" placeholder="Doe" name="lastName" register={register} label="Last Name" error={errors.lastName?.message} />
                                </div>
                            )
                        }
                        if (input.name === "role") {
                            return (
                                <>
                                    <Text type="body" className="w-full text-start">Role</Text>
                                    <RadioGroup name="role-group" inline className="flex flex-row jusitfy-start items-start gap-x-3 w-full">
                                        <Input type="radio" name="role" register={register} value="doctor" onChange={setSelectedOption} label="Doctor" id="doctor" />
                                        <Input type="radio" name="role" register={register} value="pharmacist" onChange={setSelectedOption} label="Pharmacist" id="pharmacist" />
                                    </RadioGroup>
                                    <Text type="danger" className="w-full text-start">{errors.role?.message}</Text>
                                </>
                            )
                        }
                        return (
                            <Input key={input.name} type={input.type} placeholder={input.placeholder} name={input.name} register={register} label={input.label} error={errors[input.name]?.message} />
                        )
                    })}
                    {selectedOption === 'doctor' && <RenderSpecialistInput register={register} errors={errors} />}
                    { error ? <Text type="danger">{error}</Text> : null }
                    <div className="flex gap-x-5 w-full">
                        <Button type='primary' onClick={prevDataHandler} className='w-5 flex-none'>
                            <ArrowLeftIcon className="text-2xl"/>
                        </Button>
                        <Button type='primary' isLoading={isLoading} onClick={submitForm} className='w-full shrink'>{isLoading ? '' : 'Register'}</Button>
                    </div>
                </div>
            </section>
        </form>
    )
}

const RenderSpecialistInput = ({ register, errors }) =>
    <Input type="text" placeholder="Heart" name="specialist" register={register} label="Specialist" error={errors.specialist?.message} />

RenderSpecialistInput.propTypes = {
    register: propTypes.func.isRequired,
    errors: propTypes.object.isRequired
};
