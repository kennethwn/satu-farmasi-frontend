import Button from "@/components/Button";
import RequestMedicineForm from "@/components/Form/RequestMedicineForm";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { generateOrderBasicMedicine, generateOrderNarcoticsMedicine, generateOrderPsychotropicMedicine } from "@/data/document";
import { useUserContext } from "@/pages/api/context/UserContext";
import useVendorAPI from "@/pages/api/master/vendor";
import { useEffect, useState } from "react";
import { Divider } from "rsuite";

export default function Index() {
    const { user } = useUserContext();
    const { GetAllActiveVendor } = useVendorAPI();

    const [type, setType] = useState(0);
    const [input, setInput] = useState({});
    const [vendor, setVendor] = useState([]);
    const [formFields, setFormFields] = useState([{ medicine: "", quantity: 0, remark: "" }]);

    const handleSwitchForm = (typeState) => {
        switch (typeState) {
            case 0:
                setType(0);
                break;
            case 1:
                setType(1);
                break;
            case 2:
                setType(2);
                break;
            default:
                setType(0);
                break;
        }
        setInput({});
        setFormFields([{ medicine: "", quantity: 0, remark: "" }]);
    }

    const handleFetchVendor = async () => {
        try {
            const result = await GetAllActiveVendor();
            if (result.code != 200) {
                setVendor([]);
                return;
            }
            setVendor(result.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await handleFetchVendor();
        }
        fetchData();
    }, []);

    return (
        <Layout user={user}>
            <ContentLayout type="child" title="Surat Pemesanan Obat" backpageUrl="/transaction/receive">
                <div className="w-full">
                    <div className="flex flex-col w-full md:flex-row gap-4">
                        <Button size="small" appearance={`${type == 0 ? 'primary' : 'subtle'}`} onClick={() => handleSwitchForm(0)}>Biasa</Button>
                        <Button size="small" appearance={`${type == 1 ? 'primary' : 'subtle'}`} onClick={() => handleSwitchForm(1)}>Narkotika</Button>
                        <Button size="small" appearance={`${type == 2 ? 'primary' : 'subtle'}`} onClick={() => handleSwitchForm(2)}>Psikotropika</Button>
                    </div>
                    <Divider />
                    <RequestMedicineForm 
                        formFields={formFields} 
                        setFormFields={setFormFields} 
                        type={type}
                        input={input}
                        dataVendor={vendor}
                        setInput={setInput}
                    />
                </div>
                <div className="flex w-full justify-end">
                    {type == 0 && <Button onClick={() => generateOrderBasicMedicine(input, formFields)}>Cetak Surat</Button>}
                    {type == 1 && <Button onClick={() => generateOrderNarcoticsMedicine(input, formFields)}>Cetak Surat</Button>}
                    {type == 2 && <Button onClick={() => generateOrderPsychotropicMedicine(input, formFields)}>Cetak Surat</Button>}
                </div>
            </ContentLayout>
        </Layout>
    )
}