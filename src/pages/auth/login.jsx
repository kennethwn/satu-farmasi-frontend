import Input from "@/components/Input";
import Button from "../../components/Button"
import useUser from "../api/user"
import { useState } from "react";
import  { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link'

const loginSchema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password is minimum 8 characters' }),
    isRemember: z.boolean().optional(),
})

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
            <form onSubmit={handleSubmit(LoginHandler)}  className="flex justify-center items-center flex-col gap-8 p-8 rounded bg-background-light border border-border-auth">
                <div>
                    <h3>Welcome Back</h3>
                    <p>Sign in to access your pharmacy dashboard</p>
                </div>
                <div>
                    <p>Email</p>
                <Input type='email' placeholder='johndoe@gmail.com' name="email" register={register}/>
                    {errors.email?.message && <p className="text-danger">{errors.email?.message}</p>}
                </div>
                <div>
                    <p>Password</p>
                    <Input type='password' placeholder='**********' name="password" register={register}/>
                    {errors.password?.message && <p className="text-danger">{errors.password?.message}</p>}
                </div>
                <div className="w-full">
                    <Input type="checkbox" name="isRemember" register={register}/>
                    <p>Remember Me</p>
                </div>
                {error? 
                    <ul>
                        <li className="text-danger">
                            {error}
                        </li>
                    </ul>
                    : null}
                    <div>
                        <p>Don't have an account? <Link href="/auth/register">Sign Up</Link> here</p>
                    </div>
                <button type='submit' className='w-full'>Login</button>
            </form>
        </main>
        </>
    )
}