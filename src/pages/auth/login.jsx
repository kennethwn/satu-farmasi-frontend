import Input from "@/components/Input";
import Button from "../../components/Button";
import useUser from "../api/user";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
    isOptionalBoolean,
    isRequiredEmail,
    isRequiredString,
} from "@/helpers/validation";
import Text from "@/components/Text";
import { toast } from "react-toastify";
import { Loader } from "rsuite";

const loginSchema = z.object({
    email: isRequiredEmail(),
    password: isRequiredString(),
    isRemember: isOptionalBoolean(),
});

const credentialInputField = [
    {
        label: "Email",
        type: "email",
        name: "email",
        placeholder: "johndoe@gmail.com",
        autofocus: true,
    },
    {
        label: "Password",
        type: "password",
        name: "password",
        placeholder: "**********",
    },
    { label: "Keep Me Logged In", name: "isRemember", type: "checkbox" },
];

export default function Login() {
    const { router, getUser } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const LoginHandler = async (data) => {
        try {
            setIsLoading(true);
            const response = await getUser(data);
            if (response.code !== 200) {
                toast.error(response.message, { autoClose: 2000, position: 'top-right' });
                return;
            }
            toast.success("Login successful!", { autoClose: 2000, position: 'top-right' });
            setTimeout(() => {
                router.push("/");
            }, 2000)
        } catch (error) {
            // TODO: Handle if the user is not active anymore
            console.log("error: ", error.message);
        } finally {
            setIsLoading(false);

        }
    };

    const submitForm = () => formRef.current.requestSubmit();

    return (
        <main className="flex justify-center items-center flex-col h-screen">
            {
                isLoading === false ?
                    <form
                        onSubmit={handleSubmit(LoginHandler)}
                        className="flex justify-center items-center flex-col gap-3 p-8 rounded 
            bg-background-light border border-border-auth"
                        ref={formRef}
                    >
                        <div className="text-center mb-4">
                            <Text type="heading_3">Welcome Back</Text>
                            <Text type="body">Sign in to access your pharmacy dashboard</Text>
                        </div>
                        {credentialInputField.map((input) => {
                            return (
                                <Input
                                    key={input.name}
                                    label={input.label}
                                    type={input.type}
                                    placeholder={input.placeholder}
                                    name={input.name}
                                    register={register}
                                    error={errors[input.name]?.message}
                                    autofocus={input.autofocus}
                                />
                            );
                        })}
                        {
                            isLoading ?
                                <Button type="primary" isDisabled={true} isLoading={isLoading} className="w-full">
                                    Login
                                </Button>
                                :
                                <Button type="primary" onClick={submitForm} isLoading={isLoading} className="w-full">
                                    Login
                                </Button>
                        }
                        <div className="mt-4">
                            <Text type="body">
                                Already have an account? <Link href="/auth/register">Sign up</Link>{" "}
                                here
                            </Text>
                        </div>
                    </form>
                    :
                    <div className="w-full h-full flex bg-blue-300 flex-row justify-center items-center">
                        <Loader
                            size="lg"
                            speed="slow"
                            content="checking your credential..."
                            inverse={true}
                            vertical={true}
                        />
                    </div>
            }
        </main>
    );
}

