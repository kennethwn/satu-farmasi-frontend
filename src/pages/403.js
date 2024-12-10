import Button from "@/components/Button";
import { useRouter } from "next/router";

export default function Custom403() {
    const router = useRouter();
    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col gap-y-1">
            <h1 className="font-bold">403 - Access Denied</h1>
            <div className="flex justify-center items-center flex-col gap-y-5">
                <p>You do not have permission to access this page.</p>
                <Button
                    type="button"
                    appearance="primary"
                    className="hover:cursor-pointer"
                    onClick={() => router.back()}
                >
                    Go Back
                </Button>
            </div>
        </div>
    );
}
