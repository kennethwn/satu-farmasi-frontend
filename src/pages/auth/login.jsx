import Input from "@/components/Input";
import Button from "../../components/Button"
import useUser from "../api/user"
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link'
import { isOptionalBoolean, isRequiredEmail, isRequiredString } from "@/helpers/validation";

const loginSchema = z.object({
    email: isRequiredEmail(),
    password: isRequiredString(),
    isRemember: isOptionalBoolean(),
})

const credentialInputField = [
    { label: "Email", type: "email", name: "email", placeholder: "johndoe@gmail.com" },
    { label: "Password", type: "password", name: "password", placeholder: "**********" },
    { name: "isRemember" }
]

export default function Login() {
    const { router, getUser } = useUser();
    const [error, setError] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) })

    const LoginHandler = async (data) => {
        try {
            const response = await getUser(data)
            typeof response === "string" ? router.push("/") : setError(response.message)
        } catch (error) {
            console.log("error: ", error);
        }
    }

    // TODO: create a standard compoentn
    return (
        <>
            <main className="container flex justify-center items-center flex-col h-screen">
                <form onSubmit={handleSubmit(LoginHandler)} className="flex justify-center items-center flex-col gap-8 p-8 rounded bg-background-light border border-border-auth">
                    <div>
                        <h3>Welcome Back</h3>
                        <p>Sign in to access your pharmacy dashboard</p>
                    </div>
                    {
                        credentialInputField.map((input, index) => {
                            if (input.name === "isRemember") {
                                return (
                                    <div key={index} className="w-full">
                                        <Input type="checkbox" name={input.name} register={register} />
                                        <p>Remember Me</p>
                                    </div>
                                )
                            }
                            return (
                                <div key={index}>
                                    <p>{input.label}</p>
                                    <Input type={input.type} placeholder={input.placeholder} name={input.name} register={register} />
                                    <div style={{ minHeight: '20px' }}>
                                        <p className="text-danger">{errors[input.name]?.message}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        error
                            ? <ul>
                                <li className="text-danger">
                                    {error}
                                </li>
                            </ul>
                            : null
                    }
                    <button type='submit' className='w-full'>Login</button>
                </form>
            </main>
        </>
    )
}