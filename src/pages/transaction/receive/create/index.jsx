import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import Dropdown from "@/components/SelectPicker/Dropdown";
import Text from "@/components/Text";
import { useUserContext } from "@/pages/api/context/UserContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Button from "@/components/Button";
import useGenericAPI from "@/pages/api/master/generic";
import useMedicineAPI from "@/pages/api/master/medicine";
import usePackagingAPI from "@/pages/api/master/packaging";
import { toast } from "react-toastify";
import { DatePicker, SelectPicker, Toggle } from "rsuite";
import { z, ZodError } from "zod";
import { isRequiredNumber, isRequiredString, isRequiredDate } from "@/helpers/validation";
import useClassificationsAPI from "@/pages/api/master/classification";
import ReceiveMedicineForm from "@/components/DynamicForms/ReceiveMedicineForm";
import useVendorAPI from "@/pages/api/master/vendor";
import useReceiveMedicineAPI from "@/pages/api/transaction/receiveMedicine";

const classificationSchema = z.object({
    classificationId: isRequiredNumber(),
});

const paymentMethodSchema = z.object({
    paymentMethod: isRequiredString(),
})

const medicineSchema = z.object({
    documentNumber: isRequiredString(),
    batchNumber: isRequiredString(),
    medicineId: isRequiredNumber(),
    name: isRequiredString(),
    merk: isRequiredString(),
    price: isRequiredNumber(),
    currStock: isRequiredNumber(),
    minStock: isRequiredNumber(),
    maxStock: isRequiredNumber(),
    genericNameId: isRequiredNumber(),
    packagingId: isRequiredNumber(),
    unitOfMeasure: isRequiredString().nullable().refine(value => value !== null, {
        message: "This field is required",
    }),
    classificationList: z.array(classificationSchema),
    sideEffect: isRequiredString(),
    expiredDate: isRequiredDate(),
    description: isRequiredString(),
    vendorId: isRequiredNumber(),
    buyingPrice: isRequiredNumber(),
    paymentMethod: z.array(paymentMethodSchema),
    isPaid: z.boolean(),
}).refine(data => data.minStock < data.maxStock, {
    message: "Minimum stock must be less than maximum stock",
    path: ["minStock"],
}).refine(data => data.maxStock > data.minStock, {
    message: "Maximum stock must be greater than minimum stock",
    path: ["maxStock"],
}).refine(data => data.currStock <= data.maxStock, {
    message: "Current stock cannot be greater than maximum stock",
    path: ["currStock"],
})

export default function Index() {
    const { user } = useUserContext();

    const router = useRouter();
    const id = router.query.id;
    const [isLoading, setIsLoading] = useState(false);
    const { GetAllClassificationsDropdown } = useClassificationsAPI();
    const { GetPackagingDropdown } = usePackagingAPI();
    const { GetGenericDropdown } = useGenericAPI();
    const { GetMedicineDropdownList } = useMedicineAPI();
    const { GetAllActiveVendor } = useVendorAPI();
    const { CreateReceiveMedicine } = useReceiveMedicineAPI();

    const [existingMedicine, setExistingMedicine] = useState(true);
    const [input, setInput] = useState({});
    const [errors, setErrors] = useState({});
    const [medicines, setMedicines] = useState([]);
    const [packagings, setPackagings] = useState([]);
    const [classifications, setClassifications] = useState([]);
    const [generics, setGenerics] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [formFields, setFormFields] = useState([{ id: 0, label: '', value: '' }]);

    const handleFormFields = (value) => {
        setFormFields(value);
    }

    const handleClearInput = () => {
        setInput(
            {
                documentNumber: "",
                batchCode: "",
                medicineId: 0,
                quantity: 0,
                vendorId: 0,
                buyingPrice: 0,
                paymentMethod: "",
                deadline: "",
                isPaid: null,
                medicineRequest: {
                    code: "",
                    name: "",
                    genericNameId: 0,
                    merk: "",
                    description: "",
                    price: 0.0,
                    expiredDate: "",
                    packagingId: 0,
                    currStock: 0,
                    minStock: 0,
                    maxStock: 0,
                    unitOfMeasure: "",
                    sideEffect: "",
                    classificationList: [
                        {
                            classificationId: 0,
                            medicineId: 0
                        }
                    ]
                }
            }
        )
    }

    const handleFetchMedicineDropdown = async () => {
        try {
            const res = await GetMedicineDropdownList();
            setMedicines(Object.entries(res).map(([key, item]) => ({
                ...item,
                label: item.name,
                value: parseInt(item.id),
            })));
        } catch (error) {
            console.error(error);
        }
    }

    const handleFetchPackagingDropdown = async () => {
        try {
            const res = await GetPackagingDropdown();
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                setPackagings([]);
                return;
            }
            setPackagings(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleFetchGenericDropdown = async () => {
        try {
            const res = await GetGenericDropdown();
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                setGenerics([]);
                return;
            }
            setGenerics(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleFetchClassifications = async () => {
        try {
            const res = await GetAllClassificationsDropdown();
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                setGenerics([]);
                return;
            }
            setClassifications(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleFetchVendors = async () => {
        try {
            const res = await GetAllActiveVendor();
            console.log("vendor: ", res);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                setVendors([]);
                return;
            }
            setVendors(res.data?.map(item => ({
                ...item,
                label: item.name,
                value: item.id
            })));
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async () => {
        try {
            let classifications = [];
            input.classifications = [];
            console.log("medicine has classification: ", formFields)
            formFields.forEach((item, index) => {
                input.classifications[index] = {
                    classification: {
                        id: item.id,
                    }
                }
            });
            
            input?.classifications?.forEach((item) => {
                let temp = { classificationId: 0, medicineId: 0 };
                temp['classificationId'] = item.classification.id;
                temp['medicineId'] = input.id;
                classifications.push(temp);
            })
            
            console.log("masuk 2: ",);
            const medicineRequest = {
                code: input.code || medicines?.find(item => item.id == input.medicineId)?.code || "",
                name: input.name || medicines?.find(item => item.id == input.medicineId)?.name,
                genericNameId: parseInt(input.genericNameId) || parseInt(medicines?.find(item => item.id == input.medicineId)?.genericName.id),
                merk: input.merk || medicines?.find(item => item.id == input.medicineId)?.merk,
                description: input.description || medicines?.find(item => item.id == input.medicineId)?.description || "",
                unitOfMeasure: input.unitOfMeasure || medicines?.find(item => item.id == input.medicineId)?.unitOfMeasure,
                price: parseFloat(input.price) || parseFloat(medicines?.find(item => item.id == input.medicineId)?.price),
                expiredDate: new Date(input.expiredDate || medicines?.find(item => item.id == input.medicineId)?.expiredDate),
                currStock: parseInt(input.currStock) || medicines?.find(item => item.id == input.medicineId)?.currStock,
                minStock: parseInt(input.minStock) || medicines?.find(item => item.id == input.medicineId)?.minStock,
                maxStock: parseInt(input.maxStock) || medicines?.find(item => item.id == input.medicineId)?.maxStock,
                packagingId: parseInt(input.packagingId) || medicines?.find(item => item.id == input.medicineId)?.packaging.id,
                sideEffect: input.sideEffect || medicines?.find(item => item.id == input.medicineId)?.sideEffect,
                classificationList: !existingMedicine ? classifications :  (medicines?.find(item => item.id == input?.medicineId)?.classifications?.map(item => ({ medicineId: input.medicineId, classificationId: item.classification.id }))),
            }

            const payload = {
                documentNumber: input.documentNumber,
                batchCode: input.batchCode,
                medicineId: parseInt(input.medicineId) || 0,
                quantity: parseInt(input.quantity) || parseInt(input.currStock),
                vendorId: parseInt(input.vendorId),
                buyingPrice: parseFloat(input.buyingPrice),
                paymentMethod: input.paymentMethod,
                deadline: input.deadline,
                isPaid: input.isPaid,
                medicineRequest: medicineRequest
            }

            // setErrors({});
            // medicineSchema.parse(payload);
            const res = await CreateReceiveMedicine(payload);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            }
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
            setTimeout(() => {
                router.push("/transaction/receive");
            }, 2000)
        } catch (error) {
            if (error instanceof ZodError) {
                const newErrors = { ...errors };
                error.issues.forEach((issue) => {
                    if (issue.path.length > 0) {
                        if (issue.path[0] === "classificationList") {
                            newErrors[`classificationList[${issue.path[1]}]`] = issue.message;
                        }
                        else {
                            const fieldName = issue.path[0];
                            newErrors[fieldName] = issue.message;
                        }
                    }
                });
                setErrors(newErrors);
            }
        }
    }

    useEffect(() => {
        async function fetchData() {
            await handleFetchPackagingDropdown();
            await handleFetchGenericDropdown();
            await handleFetchClassifications();
            await handleFetchMedicineDropdown();
            await handleFetchVendors();
        }
        if (router.isReady) {
            fetchData();
        }
    }, [id, router]);

    return (
        <Layout active="transaction-receive" user={user}>
            <ContentLayout title="Tambah Penerimaan Obat" type="child" backpageUrl="/transaction/receive">
                <form id="form">
                    <div className="my-2">
                        <Toggle 
                        size="lg" 
                        checkedChildren="Existing Medicine" 
                        unCheckedChildren="New Medicine" 
                        defaultChecked onChange={e => {
                            handleClearInput();
                            setExistingMedicine(e)
                        }} />
                    </div>
                    
                    <ReceiveMedicineForm
                        isLoading={isLoading}
                        errors={errors}
                        input={input}
                        setInput={setInput}
                        setErrors={setErrors}
                        dataMedicines={medicines}
                        dataGenerics={generics}
                        dataPackagings={packagings}
                        dataClassifications={classifications}
                        dataVendors={vendors}
                        formFields={formFields}
                        setFormFields={handleFormFields}
                        existingMedicine={existingMedicine}
                    />

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
                                isLoading={isLoading}
                                type="button"
                                appearance="primary"
                                onClick={() => {
                                    console.log("input: ", input);
                                    console.log("formFields: ", formFields);
                                    handleSubmit();
                                }}
                            >
                                Simpan
                            </Button>
                        }
                    </div>
                </form>
            </ContentLayout>
        </Layout>
    )
}