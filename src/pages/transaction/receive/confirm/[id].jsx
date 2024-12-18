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

const medicineRequestSchema = z.object({
    currStock: isRequiredNumber(),
})

const medicineSchema = z.object({
    documentNumber: isRequiredString(),
    batchCode: isRequiredString(),
    vendorId: isRequiredNumber(),
    buyingPrice: isRequiredNumber(),
    paymentMethod: isRequiredString(),
    deadline: isRequiredDate(),
    isArrived: z.boolean().nullable().refine(value => value !== null, {
        message: "Bidang ini harus diisi",
    }),
    medicineRequest: medicineRequestSchema,
    vendorId: isRequiredNumber(),
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
                quantity: input.quantity ? parseInt(input.quantity) : 0,
                vendorId: parseInt(input.vendorId),
                buyingPrice: parseFloat(input.buyingPrice),
                paymentMethod: input.paymentMethod ? input.paymentMethod : "",
                deadline: input.deadline ? new Date(input.deadline) : "",
                is_active: false,
                isArrived: input.isArrived !== null ? input.isArrived : null,
                reportId: null,
                expiredDate: new Date(input.expiredDate) || ""
            }

            setErrors({});
            console.log("payload: ", payload);
            const validatedData = {
                ...payload, 
                medicineRequest: {
                    currStock: payload.quantity
                }
            }
             medicineSchema.parse(validatedData);

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
        } finally {
            setIsLoading(false);
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
                quantity: input.quantity ? parseInt(input.quantity) : 0,
                vendorId: parseInt(input.vendorId),
                buyingPrice: parseFloat(input.buyingPrice),
                paymentMethod: input.paymentMethod ? input.paymentMethod : "",
                deadline: input.deadline ? new Date(input.deadline) : "",
                is_active: true,
                isArrived: input.isArrived !== null ? input.isArrived : null,
                reportId: 0,
                expiredDate: new Date(input.expiredDate) || ""
            }

            setErrors({});
            const validatedData = {
                ...payload, 
                medicineRequest: {
                    currStock: payload.quantity
                }
            }
            console.log("payload: ", payload);
            console.log("validatedData", validatedData);
             medicineSchema.parse(validatedData);
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
            console.log("erorr: ", error)
            setIsLoading(false);
            if (error instanceof ZodError) {
                const newErrors = { ...errors };
                error.issues.forEach((issue) => {
                    if (issue.path.length > 0) {
                        if (issue.path[0] === "medicineRequest") {
                            if (issue.path[1] === "classificationList") {
                                newErrors[`classificationList[${issue.path[2]}]`] = issue.message;
                            } else {
                                newErrors[`medicineRequest.${issue.path[1]}`] = issue.message;
                            }
                        } else {
                            const fieldName = issue.path[0];
                            newErrors[fieldName] = issue.message;
                        }
                    }
                });
                console.log("new error: ", newErrors)
                setErrors(newErrors);
            }
        } finally {
            setIsLoading(false);
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
                    isArrived: data.isArrived,
                    vendorId: data.vendor.id,
                    buyingPrice: parseFloat(data.buyingPrice),
                    paymentMethod: data.paymentMethod || "",
                    deadline: new Date(data.deadline) || "",
                    isPaid: data.isPaid,
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

    useEffect(() => {
        console.log("errors zod: ", errors);
    }, [errors])

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
                    <Button isLoading={isLoading} appearance="primary" type="button" onClick={() => {
                        handleConfirm()
                        setModal(false)
                    }}>Konfirmasi</Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    )
}
