import ReceiveMedicineForm from "@/components/DynamicForms/ReceiveMedicineForm";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/pages/api/context/UserContext";
import useClassificationsAPI from "@/pages/api/master/classification";
import useGenericAPI from "@/pages/api/master/generic";
import useMedicineAPI from "@/pages/api/master/medicine";
import usePackagingAPI from "@/pages/api/master/packaging";
import useVendorAPI from "@/pages/api/master/vendor";
import useReceiveMedicineAPI from "@/pages/api/transaction/receiveMedicine";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { z, ZodError } from "zod";
import { isRequiredNumber, isRequiredString, isRequiredDate } from "@/helpers/validation";
import Button from "@/components/Button";
import { Modal } from "rsuite";
import { toast } from "react-toastify";

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
    isArrived: z.boolean(),
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
    const { GetReceiveMedicinesById, ConfirmReceiveMedicine, SaveReceiveMedicine } = useReceiveMedicineAPI();

    const [modal, setModal] = useState(false);
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
                isArrived: null,
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
            console.log(Object.entries(res.data).map(([key, item]) => ({
                ...item,
                label: item.name,
                value: parseInt(item.id),
            })));
            setMedicines(Object.entries(res.data).map(([key, item]) => ({
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

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const payload = {
                id: input.id,
                documentNumber: input.documentNumber,
                batchCode: input.batchCode,
                medicineId: parseInt(input.medicineId),
                quantity: parseInt(input.quantity),
                vendorId: parseInt(input.vendorId),
                buyingPrice: parseFloat(input.buyingPrice),
                paymentMethod: input.paymentMethod,
                deadline: input.deadline,
                is_active: false,
                isArrived: input.isArrived,
                reportId: null,
                expiredDate: new Date(input.expiredDate)
            }

            setErrors({});
            // medicineSchema.parse(payload);

            const res = await SaveReceiveMedicine(payload);
            if (res.code !== 200) {
                toast.error(res.response.data.message, { autoClose: 2000, position: "top-right" });
                setModal(false);
                return;
            }
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
            setTimeout(() => {
                router.push("/transaction/receive");
            }, 2000)
        } catch (error) {
            setIsLoading(false);
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

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            const payload = {
                id: input.id,
                documentNumber: input.documentNumber,
                batchCode: input.batchCode,
                medicineId: parseInt(input.medicineId),
                quantity: parseInt(input.quantity),
                vendorId: parseInt(input.vendorId),
                buyingPrice: parseFloat(input.buyingPrice),
                paymentMethod: input.paymentMethod,
                deadline: input.deadline,
                is_active: true,
                isArrived: input.isArrived,
                reportId: 0,
                expiredDate: new Date(input.expiredDate)
            }

            setErrors({});
            // medicineSchema.parse(payload);
            const res = await ConfirmReceiveMedicine(payload);
            if (res.code !== 200) {
                toast.error(res.response.data.message, { autoClose: 2000, position: "top-right" });
                setModal(false);
                return;
            }
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
            setTimeout(() => {
                router.push("/transaction/receive");
            }, 2000)
        } catch (error) {
            setIsLoading(false);
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

    const handleFetchReceiveMedicineById = async () => {
        try {
            const res = await GetReceiveMedicinesById(id);
            console.log("medicine by id response: ", res)
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                setInput([]);
                return;
            }

            const data = res.data;
            setInput(
                {
                    id: data.id,
                    documentNumber: data.documentNumber,
                    batchCode: data.batchCode,
                    medicineId: data.medicine.id,
                    quantity: parseInt(data.quantity),
                    vendorId: data.vendor.id,
                    buyingPrice: parseFloat(data.buyingPrice),
                    paymentMethod: data.paymentMethod,
                    deadline: new Date(data.deadline),
                    isArrived: data.isArrived,
                    expiredDate: new Date(data.medicine.expiredDate),
                    medicineRequest: {
                        code: data.medicine.code,
                        name: data.medicine.name,
                        genericNameId: data.medicine.genericName.id,
                        merk: data.medicine.merk,
                        description: data.medicine.description,
                        price: parseFloat(data.medicine.price),
                        expiredDate: new Date(data.medicine.expiredDate),
                        packagingId: data.medicine.packaging.id,
                        currStock: data.medicine.currStock,
                        minStock: data.medicine.minStock,
                        maxStock: data.medicine.maxStock,
                        unitOfMeasure: data.medicine.unitOfMeasure,
                        sideEffect: data.medicine.sideEffect,
                        classificationList: data.medicine?.classifications.map(item => item.classification)
                    }
                }
            )
            setFormFields(res.data?.medicine?.classifications.map(item => item.classification));
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await handleFetchPackagingDropdown();
            await handleFetchGenericDropdown();
            await handleFetchClassifications();
            await handleFetchMedicineDropdown();
            await handleFetchVendors();
            await handleFetchReceiveMedicineById();
        }
        if (router.isReady) {
            fetchData();
        }
    }, [id, router]);

    return (
        <Layout active="transaction-receive" user={user}>
            <ContentLayout title="Konfirmasi Penerimaan Obat" type="child" backpageUrl="/transaction/receive">
                <form id="form">
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
                        existingMedicine={true}
                        isEdit={true}
                    />

                    <div className="flex gap-2 my-6 pb-4">
                        {isLoading ?
                            <div className="flex flex-col w-full md:flex-row gap-4 md:justify-end">
                                <Button
                                    appearance="subtle"
                                    isDisabled={true}
                                    isLoading={isLoading}
                                >
                                    Simpan
                                </Button>
                                <Button
                                    appearance="primary"
                                    isDisabled={true}
                                    isLoading={isLoading}
                                >
                                    Konfirmasi
                                </Button>
                            </div>
                            :
                            <div className="flex max-md:flex-col gap-2 my-6 pb-4 md:justify-end">
                                <Button
                                    isLoading={isLoading}
                                    type="button"
                                    appearance="subtle"
                                    onClick={handleSave}
                                >
                                    Simpan
                                </Button>
                                <Button
                                    isLoading={isLoading}
                                    type="button"
                                    appearance="primary"
                                    onClick={() => {
                                        setModal(true)
                                    }}
                                >
                                    Konfirmasi
                                </Button>
                            </div>
                        }
                    </div>
                </form>
            </ContentLayout>

            <Modal open={modal} onClose={() => setModal(false)}>
                <Modal.Header className="text-2xl font-semibold">Konfirmasi Penerimaan Obat</Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col">
                        <p>Konfirmasi hanya sekali!</p> 
                        <p>Apabila ada kesalahan data maka sepenuhnya <span className="text-red-500">tanggung jawab</span> anda</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button isLoading={isLoading} appearance="primary" type="button" onClick={() => handleConfirm()}>Konfirmasi</Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    )
}
