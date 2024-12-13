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
import { Checkbox, Loader } from "rsuite";
import Label from "@/components/Input/Label";

const loginSchema = z.object({
    email: isRequiredEmail(),
    password: isRequiredString(),
    isRemember: isOptionalBoolean(),
});

export default function Login() {
    const { router, getUser } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        resolver: zodResolver(loginSchema), defaultValues: {
            isRemember: false
        }
    });

    const LoginHandler = async (data) => {
        try {
            setIsLoading(true);
            await getUser(data);
            toast.success("Berhasil Masuk!", { autoClose: 2000, position: 'top-right' });
            // setTimeout(() => {
                router.push("/");
            // }, 2000)
        } catch (error) {
            toast.error(error.message, { autoClose: 2000, position: 'top-right' });
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
                        className="flex justify-center items-center flex-col gap-3 p-8 rounded bg-background-light border border-border-auth"
                        ref={formRef}
                    >
                        <div className="text-center mb-4">
                            <Text type="heading_4">Selamat Datang</Text>
                        </div>
                        <Input
                            label={"Email"}
                            id={"email"}
                            type={"email"}
                            placeholder={"Input your email"}
                            name={"email"}
                            register={register}
                            error={errors["email"]?.message}
                            autofocus={true}
                        />
                        <Input
                            label={"Password"}
                            id={"password"}
                            type={"password"}
                            placeholder={"Input your password"}
                            name={"password"}
                            register={register}
                            error={errors["password"]?.message}
                            autofocus={true}
                        />
                        <div className='flex justify-start items-center w-full'>
                            <Checkbox id="isRemember" name="isRemember" onChange={() => setValue("isRemember", !getValues("isRemember"))}/>
                            <Label name={"isRemember"} label={"Ingat Saya"} />
                        </div>
                        {
                            isLoading ?
                                <Button type="button" isDisabled={true} isLoading={isLoading} className="w-full">
                                    Masuk
                                </Button>
                                :
                                <Button type="button" onClick={submitForm} isLoading={isLoading} className="w-full">
                                    Masuk
                                </Button>
                        }
                        <div className="mt-4">
                            <Text type="body">
                                Sudah punya akun? <Link href="/auth/register">Registrasi</Link>{" "}
                                di sini
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

