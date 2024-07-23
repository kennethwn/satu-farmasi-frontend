import Input from "@/components/Input";
import useDoctor from "../api/doctor";
import usePharmacist from "../api/pharmacist";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import  { z } from "zod";
import Link from 'next/link'
import { isOptionalString, isPassword, isRequiredEmail, isRequiredString } from "@/helpers/validation";

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
    const { router, addDoctor } = useDoctor();
    const { addPharmacist } = usePharmacist();
    const [error, setError] = useState(null);
    const credentialsRef = useRef(null);
    const biodataRef = useRef(null);
    const [selectedOption, setSelectedOption] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) })

    useEffect(() => {
        credentialsRef.current.style.display = "block";
        biodataRef.current.style.display = "none";
    }, [])

    useEffect(() => {
        if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
            if (errors. email || errors.password || errors.confirmPassword) {
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
            if (data.role === "pharmacist") {
                const response = await addPharmacist(data)
                // TODO: need to check the status response
                typeof response === 'object' ? router.push("/auth/login") : setError(response)
            } else {
                const response = await addDoctor(data)
                typeof response === 'object' ? router.push("/auth/login") : setError(response.message)
            }
        } catch (error) {
            console.log("error: ", error);
        }
    }

    const credentialInputField = [
        { label: "Email", type: "email", name: "email" , placeholder: "johndoe@gmail.com"},
        { label: "Password", type: "password", name: "password" , placeholder: "**********"},
        { label: "Confirm Password", type: "password", name: "confirmPassword" , placeholder: "**********"},
    ]

    const biodataInputField = [
        { label: "NIK", type: "text", name: "nik" , placeholder: "12345678"},
        { name: "fullName" },
        { label: "Phone Number", type: "number", name: "phoneNum" , placeholder: "+628xxxxxx"},
        { label: "Date of Birth", type: "date", name: "dob" , placeholder: "01/01/2000"},
        { name: "role" },
    ]

    const RenderSpecialistInput = () => {
        return (
            <div>
                <p>Specialist</p>
                <Input type="text" placeholder="Heart" name="specialist" register={register}/>
                {errors.specialist?.message && <p className="text-danger">{errors.specialist?.message}</p>}
            </div>
        )
    }

            
    return (
        <>
            <form onSubmit={handleSubmit(RegisterHandler)}  className="container flex justify-center items-center flex-col h-screen">
                <section ref={credentialsRef}>
                    <div className="flex justify-center items-center flex-col gap-8 p-8 rounded bg-background-light border border-border-auth">
                        <div>
                            <h3>Create Your Account</h3>
                            <p>Create new account to access the pharmacy dashboard</p>
                        </div>
                        {
                            credentialInputField.map((input, index) => {
                                return (
                                    <div key={index}>
                                        <p>{input.label}</p>
                                        <Input type={input.type} placeholder={input.placeholder} name={input.name} register={register}/>
                                        {errors[input.name]?.message && <p className="text-danger">{errors[input.name]?.message}</p>}
                                    </div>
                                )
                            })
                        }
                    <button type='button' onClick={nextDataHandler} className='w-full'>Next</button>
                    <div>
                        <p>Don't have an account? <Link href="/auth/login">Sign in</Link> here</p>
                    </div>
                    </div>
                </section>
                <section ref={biodataRef}>
                    <div className="flex justify-center items-center flex-col gap-8 p-8 rounded bg-background-light border border-border-auth">
                        <div>
                            <h3>You are almost done</h3>
                            <p>Please fill the data bellow</p>
                        </div>
                            {biodataInputField.map((input, index) => {
                                    if (input.name === "fullName") {
                                        return (
                                            <div key={index} className="flex justify-center items-center gap-x-5">
                                                <div>
                                                    <p>First Name</p>
                                                    <Input type="text" placeholder="John" name="firstName" register={register}/>
                                                    {errors.firstName?.message && <p className="text-danger">{errors.firstName?.message}</p>}
                                                </div>
                                                <div>
                                                    <p>Last Name</p>
                                                    <Input type="text" placeholder="DOe" name="lastName" register={register}/>
                                                    {errors.lastName?.message && <p className="text-danger">{errors.lastName?.message}</p>}
                                                </div>
                                            </div>
                                        )
                                    }
                                    if (input.name === "role") {
                                        return (
                                            <div key={index}>
                                                <p>Role</p>
                                                <input type="radio"  name="role" {...register("role")} value="doctor" onChange={e => setSelectedOption(e.target.value)}/>
                                                <label htmlFor="">Doctor</label>
                                                <input type="radio"  name="role" {...register("role")} value="pharmacist" onChange={e => setSelectedOption(e.target.value)}/>
                                                <label htmlFor="">Pharmacist</label>
                                                {errors[input.name]?.message && <p className="text-danger">{errors[input.name]?.message}</p>}
                                            </div>
                                        )
                                    }
                                    return (
                                        <div key={index}>
                                            <p>{input.label}</p>
                                            <Input type={input.type} placeholder={input.placeholder} name={input.name} register={register}/>
                                            {errors[input.name]?.message && <p className="text-danger">{errors[input.name]?.message}</p>}
                                        </div>
                                    )
                            })}
                            {selectedOption === 'doctor' && <RenderSpecialistInput />}
                        <button type='button' onClick={prevDataHandler} className='w-full'>Back</button>
                        <button type='submit' className='w-full'>register</button>
                    </div>
                </section>
            </form>
        </>
    )
}
