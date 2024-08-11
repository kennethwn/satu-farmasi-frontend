import Button from "@/components/Button";
import Input from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { convertToTimestampString, formatCalendar } from "@/helpers/dayHelper";
import useStaffAPI from "@/pages/api/master/staff";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Checkbox, Loader } from "rsuite";

const message = (props) => {
    return (
        <Notification 
            type={props.type} 
            header={<span className={`text-lg ${props.type === 'success' ? 'text-success' : 'text-danger'}`}>{props.title}</span>} 
            closable
        >
            <p>{props.body}</p>
        </Notification>
    );
};

export default function Index() {
    const router = useRouter();
    const id = router.query.id;

    const { isLoading, GetStaffByNik, EditStaff } = useStaffAPI();

    const [input, setInput] = useState({});

    const handleFetchStaffByNik = async () => {
        try {
            const res = await GetStaffByNik(id);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            }
            console.log(res.data);
            setInput(res.data);
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleSubmit = async () => {
        try {
            const res = await EditStaff(input);
            console.log(res)
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            }
            toast.success(res.message, { autoClose: 2000, position: "top-center" });
            router.push("/master/staff");
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            await handleFetchStaffByNik();
        }

        if (router.isReady) {
            fetchData();
        }
    }, [id]);

    return (
        <Layout active="master-staff">
            <ContentLayout title="Ubah Staf" type="child" backpageUrl="/master/staff">
                <form id="form">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-dark">
                                Nama Depan
                            </label>
                            <div className="mt-2">
                                {isLoading ?
                                    <Input 
                                        type="text" 
                                        id="first_name" 
                                        name="first_name" 
                                        disabled={true}
                                        placeholder="John" 
                                        value={input?.firstName}
                                    />
                                    :
                                    <Input 
                                        type="text" 
                                        id="first_name" 
                                        name="first_name" 
                                        onChange={
                                            (e) => setInput({...input, firstName: e.target.value})
                                        } 
                                        placeholder="John" 
                                        value={input?.firstName}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-dark">
                                Nama Belakang
                            </label>
                            <div className="mt-2">
                                {isLoading ?
                                    <Input 
                                        type="text" 
                                        id="last_name" 
                                        name="last_name" 
                                        disabled={true}
                                        placeholder="Doe" 
                                        value={input?.lastName}
                                    />
                                    :
                                    <Input 
                                        type="text" 
                                        id="last_name" 
                                        name="last_name" 
                                        onChange={
                                            (e) => setInput({...input, lastName: e.target.value})
                                        } 
                                        placeholder="Doe" 
                                        value={input?.lastName}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="nik" className="block text-sm font-medium leading-6 text-dark">
                                NIK
                            </label>
                            <div className="mt-2">
                                <Input 
                                    type="text" 
                                    id="nik" 
                                    name="nik" 
                                    disabled={true}
                                    placeholder="123456789" 
                                    value={input?.nik}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-dark">
                                Email
                            </label>
                            <div className="mt-2">
                                {isLoading ?
                                    <Input 
                                        type="email" 
                                        id="email" 
                                        name="email"
                                        placeholder="john.doe@example.com" 
                                        value={input?.email}
                                        disabled={true}
                                    />
                                    :
                                    <Input 
                                        type="email" 
                                        id="email" 
                                        name="email"
                                        placeholder="john.doe@example.com" 
                                        value={input?.email}
                                        onChange={(e) => setInput({...input, email: e.target.value})}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="dob" className="block text-sm font-medium leading-6 text-dark">
                                Tanggal Lahir
                            </label>
                            <div className="mt-2">
                                {isLoading ?
                                    <Input 
                                        type="date" 
                                        id="dob" 
                                        name="dob"
                                        value={formatCalendar(input?.dob)}
                                        disabled={true}
                                    />
                                    :
                                    <Input 
                                        type="date" 
                                        id="dob" 
                                        name="dob"
                                        value={formatCalendar(input?.dob)}
                                        onChange={(e) => setInput({...input, dob: convertToTimestampString(e.target.value)})}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="phone_number" className="block text-sm font-medium leading-6 text-dark">
                                No Handphone
                            </label>
                            <div className="mt-2">
                                {isLoading ?
                                    <Input 
                                        type="text" 
                                        id="phone_number" 
                                        name="phone_number"
                                        placeholder="08XXXXXXXXX" 
                                        value={input?.phoneNum}
                                        disabled={true}
                                    />
                                    :
                                    <Input 
                                        type="text" 
                                        id="phone_number" 
                                        name="phone_number"
                                        placeholder="08XXXXXXXXX" 
                                        value={input?.phoneNum}
                                        onChange={(e) => setInput({...input, phoneNum: e.target.value})}
                                    />
                                }
                            </div>
                        </div>
                        <div className="flex flex-row items-center w-full gap-2">
                            <label htmlFor="is_active" className="block text-sm font-medium leading-6 text-dark">
                                Status aktif
                            </label>
                            <div>
                                {isLoading ?
                                    <Checkbox
                                        id="is_active"
                                        name="is_active"
                                        checked={input?.isActive}
                                        disabled
                                    />
                                    :
                                    <Checkbox
                                        id="is_active"
                                        name="is_active"
                                        checked={input?.isActive}
                                        onChange={() => {
                                            setInput({
                                                ...input, 
                                                isActive: !input?.isActive
                                            });
                                        }}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-2 my-6 lg:justify-end">
                        {isLoading ?
                            <Button
                                appearance="primary"
                                isDisabled={true}
                                isLoading={isLoading}
                            >
                                Simpan
                            </Button>
                            :
                            <Button
                                appearance="primary"
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
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