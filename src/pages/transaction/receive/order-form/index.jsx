import Button from "@/components/Button";
import RequestMedicineForm from "@/components/Form/RequestMedicineForm";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { generateOrderBasicMedicine, generateOrderNarcoticsMedicine, generateOrderPsychotropicMedicine } from "@/data/document";
import { isRequiredNumber, isRequiredString } from "@/helpers/validation";
import { useUserContext } from "@/pages/api/context/UserContext";
import useVendorAPI from "@/pages/api/master/vendor";
import usePharmacy from "@/pages/api/pharmacy";
import { useEffect, useState } from "react";
import { Divider } from "rsuite";
import { z, ZodError } from "zod";

const medicineSchema = z.object({
    medicine: isRequiredString(),
    quantity: isRequiredNumber(),
    remark: isRequiredString(),
});

const dataSchema = z.object({
    cityVendor: isRequiredString(),
    leftNum: isRequiredString(),
    middleNum: isRequiredString(),
    rightNum: isRequiredString(),
    phoneVendor: isRequiredString(),
    vendor: isRequiredString(),
    medicines: z.array(medicineSchema)
})

export default function Index() {
    const { user } = useUserContext();
    const { GetAllActiveVendor } = useVendorAPI();
    const { getPharmacyInfo } = usePharmacy();

    const [type, setType] = useState(0);
    const [input, setInput] = useState({});
    const [vendor, setVendor] = useState([]);
    const [errors, setErrors] = useState({});
    const [pharmacy, setPharmacy] = useState({});
    const [formFields, setFormFields] = useState([{ medicine: "", quantity: 0, remark: "" }]);

    const handleFetchPharmacy = async () => {
        try {
            const res = await getPharmacyInfo();
            if (res.code != 200) {
                setPharmacy({});
                return;
            }
            setPharmacy(res.data);
            setInput({...input,
                pharmacist: user.name,
                sipaNumber: user.sipaNumber,
                pharmacy: res.data.name,
                addressPharmacy: res.data.address,
                siaNumber: res.data.pharmacyNum,
            })
        } catch (error) {
            console.error(error);
        }
    }

    const handleFetchPharmacist = async () => {
        try {
            console.log("user: ", user);
        } catch (error) {
            console.error(error);
        }
    }

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

    const handleGenerateForm = (typeState) => {
        try {
            const payload = {...input}
            payload.medicines = formFields;
            console.log("payload: ", payload);

            setErrors({});
            dataSchema.parse(payload);

            if (typeState === 0) generateOrderBasicMedicine(input, formFields);
            else if (typeState === 1) generateOrderNarcoticsMedicine(input, formFields);
            else if (typeState === 2) generateOrderPsychotropicMedicine(input, formFields);
        } catch (error) {
            if (error instanceof ZodError) {
                const newErrors = {...errors}
                error.issues.forEach((issue) => {
                    if (issue.path.length > 0) {
                        if (issue.path[0] === "medicines") {
                            newErrors[`medicines.${issue.path[1]}.${issue.path[2]}`] = issue.message;
                        } else {
                            const fieldName = issue.path[0];
                            newErrors[fieldName] = issue.message;
                        }
                    }
                })
                console.log(`new error: `, newErrors);
                setErrors(newErrors)
            }
        }
    }

    useEffect(() => {
        async function fetchData() {
            await handleFetchVendor();
            await handleFetchPharmacy();
            await handleFetchPharmacist();
        }
        fetchData();
        setInput({});
    }, [type]);

    return (
        <Layout user={user} active="transaction-receive">
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
                        errors={errors}
                        setErrors={setErrors}
                    />
                </div>
                <div className="flex w-full pb-4 justify-end">
                    {(type == 0 || type == 1 || type == 2) &&
                        <Button onClick={() => handleGenerateForm(type)}>Cetak Surat</Button>
                    }
                </div>
            </ContentLayout>
        </Layout>
    )
}