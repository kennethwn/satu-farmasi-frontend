import Input from "@/components/Input";
import Button from "../../components/Button"
import useUser from "../api/user"
import { useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link'
import { isOptionalBoolean, isRequiredEmail, isRequiredString } from "@/helpers/validation";
import Text from "@/components/Text";

const loginSchema = z.object({
    email: isRequiredEmail(),
    password: isRequiredString(),
    isRemember: isOptionalBoolean(),
})

const credentialInputField = [
    { label: "Email", type: "email", name: "email", placeholder: "johndoe@gmail.com", autofocus: true },
    { label: "Password", type: "password", name: "password", placeholder: "**********" },
    { label: "Kepp Me Logged In", name: "isRemember", type: "checkbox" }
]

export default function Login() {
    const { router, getUser } = useUser();
    const [error, setError] = useState(null);
    const formRef = useRef(null);

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) })

    const LoginHandler = async (data) => {
        try {
            const response = await getUser(data)
            typeof response === "string" ? router.push("/") : setError(response.message)
        } catch (error) {
            console.log("error: ", error);
        }
    }

    const submitForm = () => formRef.current.requestSubmit();

    return (
        <main className="flex justify-center items-center flex-col h-screen">
            <form onSubmit={handleSubmit(LoginHandler)} className="flex justify-center items-center flex-col gap-3 p-8 rounded bg-background-light border border-border-auth" ref={formRef}>
                <div className="text-center mb-4">
                    <Text type="heading_3">Welcome Back</Text>
                    <Text type="body">Sign in to access your pharmacy dashboard</Text>
                </div>
                {
                    credentialInputField.map((input) => {
                        return (
                            <Input key={input.name} label={input.label} type={input.type} placeholder={input.placeholder} name={input.name} register={register} error={errors[input.name]?.message} autofocus={input.autofocus} />
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
                <Button type='primary' onClick={submitForm} className='w-full'>Login</Button>
                <div className="mt-4">
                <Text type="body">Already have an account? <Link href="/auth/register">Sign up</Link> here</Text>
                </div>
            </form>
        </main>
    )
}