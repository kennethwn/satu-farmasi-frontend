import Button from "@/components/Button";
import InputField from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/pages/api/context/UserContext";
import useGenericAPI from "@/pages/api/master/generic";
import useMedicineAPI from "@/pages/api/master/medicine";
import usePackagingAPI from "@/pages/api/master/packaging";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MedicineClassificationForm from "@/components/DynamicForms/MedicineClassificationForm";
import { SelectPicker } from "rsuite";
import { z, ZodError } from "zod";
import { isRequiredNumber, isRequiredString } from "@/helpers/validation";
import Text from "@/components/Text";
import useClassificationsAPI from "@/pages/api/master/classification";
import Dropdown from "@/components/SelectPicker/Dropdown";

const classificationSchema = z.object({
    classificationId: isRequiredNumber(),
});

const medicineSchema = z.object({
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
    const router = useRouter();
    const id = router.query.id;
    const { user } = useUserContext();
    const { isLoading, EditMedicine, SearchMedicine } = useMedicineAPI();
    const { GetAllClassificationsDropdown } = useClassificationsAPI();
    const { GetPackagingDropdown } = usePackagingAPI();
    const { GetGenericDropdown } = useGenericAPI();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [input, setInput] = useState({});
    const [errors, setErrors] = useState({});
    const [packagings, setPackagings] = useState([]);
    const [classifications, setClassifications] = useState([]);
    const [generics, setGenerics] = useState([]);
    const [formFields, setFormFields] = useState([{ id: 0, label: '', value: '' }]);
    const unitOfMeasure = [
        { id: 1, label: 'MILLILITER', value: 'MILLILITER' },
        { id: 2, label: 'MILLIGRAM', value: 'MILLIGRAM' },
        { id: 3, label: 'GRAM', value: 'GRAM' },
        { id: 4, label: 'LITER', value: 'LITER' },
        { id: 5, label: 'GROS', value: 'GROS' },
        { id: 6, label: 'KODI', value: 'KODI' },
        { id: 7, label: 'RIM', value: 'RIM' },
        { id: 8, label: 'PCS', value: 'PCS' },
    ];

    const handleFormFields = (value) => {
        setFormFields(value);
    }

    const handleFetchMedicineByCode = async () => {
        try {
            const res = await SearchMedicine(1, 1, id);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-right" });
                return;
            }
            setInput(res?.data?.results[0]);

            let classificationForm = [];
            res.data.results[0].classifications.forEach((item, index) => {
                let data = { id: 0, label: '', value: '' };
                data['id'] = item.classification.id;
                data['label'] = item.classification.label;
                data['value'] = item.classification.value;
                classificationForm.push(data);
            })
            setFormFields(classificationForm);
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

    const handleSubmit = async () => {
        try {
            let classifications = [];
            input.classifications = [];
            formFields.forEach((item, index) => {
                input.classifications[index] = {
                    classification: {
                        id: item.id,
                    }
                }
            });

            input?.classifications?.map((item) => {
                let temp = { classificationId: 0, medicineId: 0 };
                temp['classificationId'] = item.classification.id;
                temp['medicineId'] = input.id;
                classifications.push(temp);
            })

            const payload = {
                id: input.id,
                code: input.code,
                name: input.name,
                merk: input.merk,
                description: input.description,
                unitOfMeasure: input.unitOfMeasure,
                price: parseInt(input.price),
                expiredDate: input.expiredDate,
                currStock: parseInt(input.currStock),
                minStock: parseInt(input.minStock),
                maxStock: parseInt(input.maxStock),
                genericNameId: parseInt(input.genericName) || parseInt(input.genericName.id),
                packagingId: parseInt(input.packaging.id),
                sideEffect: input.sideEffect,
                classificationList: classifications,
                is_active: input.is_active,
                created_at: input.created_at,
                updated_at: input.updated_at
            }

            setErrors({});
            medicineSchema.parse(payload);
            const res = await EditMedicine(payload);
            toast.success(res.message, { autoClose: 2000, position: "top-right" });
            setIsSubmitted(true);
            setTimeout(() => {
                router.push("/master/medicine");
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
            else {
                toast.error(error.message, { autoClose: 2000, position: "top-right" });
            }
        }
    }

    useEffect(() => {
        async function fetchData() {
            await handleFetchMedicineByCode();
            await handleFetchPackagingDropdown();
            await handleFetchGenericDropdown();
            await handleFetchClassifications();
        }
        if (router.isReady) {
            fetchData();
        }
    }, [id, router]);

    return (
        <Layout active="master-medicine" user={user}>
            <ContentLayout title="Edit Obat" type="child" backpageUrl="/master/medicine">
                <form id="form">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <div className="mt-2">
                                {isLoading ?
                                    <InputField
                                        type="text"
                                        id="medicine_name"
                                        name="medicine_name"
                                        disabled={true}
                                        label="Nama Obat"
                                        placeholder="nama obat"
                                        value={input?.name}
                                    />
                                    :
                                    <InputField
                                        type="text"
                                        id="medicine_name"
                                        name="medicine_name"
                                        onChange={e => {
                                            setInput({ ...input, name: e.target.value });
                                            setErrors({ ...errors, "name": "" });
                                        }}
                                        label="Nama Obat"
                                        placeholder="nama obat"
                                        error={errors['name']}
                                        value={input?.name}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <div className="mt-2">
                                {isLoading ?
                                    <InputField
                                        type="text"
                                        id="merk"
                                        name="merk"
                                        label="Merek"
                                        disabled={true}
                                        placeholder="merek"
                                        value={input?.merk}
                                    />
                                    :
                                    <InputField
                                        type="text"
                                        id="merk"
                                        name="merk"
                                        label="Merek"
                                        onChange={e => {
                                            setInput({ ...input, merk: e.target.value });
                                            setErrors({ ...errors, "merk": "" });
                                        }}
                                        placeholder="merek"
                                        error={errors['merk']}
                                        value={input?.merk}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <div className="mt-2">
                                {isLoading ?
                                    <InputField
                                        className="sm:leading-6 px-16"
                                        type="number"
                                        id="price"
                                        name="price"
                                        disabled={true}
                                        placeholder="0"
                                        label="Harga Jual Obat"
                                        value={input?.price}
                                        currency={true}
                                    />
                                    :
                                    <InputField
                                        className="sm:leading-6 px-16"
                                        type="number"
                                        id="price"
                                        name="price"
                                        onChange={e => {
                                            setInput({ ...input, price: parseInt(e.target.value) })
                                            setErrors({ ...errors, "price": "" });
                                        }}
                                        placeholder="0"
                                        label="Harga Jual Obat"
                                        value={input?.price}
                                        error={errors['price']}
                                        currency={true}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <div className="mt-2">
                                {isLoading ?
                                    <InputField
                                        type="number"
                                        id="minStock"
                                        name="minStock"
                                        placeholder="0"
                                        label="Stok Minimum"
                                        value={input?.minStock}
                                        disabled={true}
                                    />
                                    :
                                    <InputField
                                        type="number"
                                        id="minStock"
                                        name="minStock"
                                        placeholder="0"
                                        label="Stok Minimum"
                                        error={errors['minStock']}
                                        value={input?.minStock}
                                        onChange={e => {
                                            setInput({ ...input, minStock: parseInt(e.target.value) })
                                            setErrors({ ...errors, "minStock": "" });
                                        }}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <div className="mt-2">
                                {isLoading ?
                                    <InputField
                                        type="number"
                                        id="maxStock"
                                        name="maxStock"
                                        placeholder="0"
                                        label="Stok Maksimum"
                                        value={input?.maxStock}
                                        disabled={true}
                                    />
                                    :
                                    <InputField
                                        type="number"
                                        id="maxStock"
                                        name="maxStock"
                                        placeholder="0"
                                        label="Stok Maksimum"
                                        error={errors['maxStock']}
                                        value={input?.maxStock}
                                        onChange={e => {
                                            setInput({ ...input, maxStock: parseInt(e.target.value) })
                                            setErrors({ ...errors, "maxStock": "" });
                                        }}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="genericName" className="block text-sm font-medium leading-6 pt-2 text-dark">
                                Nama Generik
                            </label>
                            <div className="mt-2">
                                {isLoading ?
                                    <Dropdown
                                        id="genericName"
                                        name="genericName"
                                        className="py-1.5"
                                        placeholder="Nama Generik"
                                        size='lg'
                                        disabled={true}
                                        value={input?.genericName?.id}
                                        valueKey="id"
                                        labelKey="label"
                                        data={generics}
                                        block
                                        cleanable={false}
                                    />
                                    :
                                    <>
                                        <Dropdown
                                            id="genericName"
                                            name="genericName"
                                            placeholder="Nama Generik"
                                            size='lg'
                                            value={input?.genericName?.id}
                                            valueKey="id"
                                            className="py-1.5"
                                            labelKey="label"
                                            onChange={value => {
                                                setInput({ ...input, genericName: { id: value } })
                                                setErrors({ ...errors, "genericNameId": "" });
                                            }}
                                            cleanable={false}
                                            data={generics}
                                            block
                                        />
                                        <div style={{ minHeight: '22px' }}>
                                            {
                                                errors['genericNameId'] &&
                                                <Text type="danger">{errors['genericNameId']}</Text>
                                            }
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="packaging" className="block text-sm font-medium leading-6 pt-2 text-dark">
                                Kemasan
                            </label>
                            <div className="mt-2">
                                {isLoading ?
                                    <Dropdown
                                        id="packaging"
                                        name="packaging"
                                        placeholder="kemasan"
                                        disabled={true}
                                        className="py-1.5"
                                        size='lg'
                                        value={input?.packaging?.id}
                                        labelKey="label"
                                        valueKey="id"
                                        cleanable={false}
                                        data={packagings}
                                        block
                                    />
                                    :
                                    <>
                                        <Dropdown
                                            id="packaging"
                                            name="packaging"
                                            placeholder="Kemasan"
                                            value={input?.packaging?.id}
                                            labelKey="label"
                                            size='lg'
                                            className="py-1.5"
                                            valueKey="id"
                                            cleanable={false}
                                            onChange={value => {
                                                setInput({ ...input, packaging: { id: value } })
                                                setErrors({ ...errors, "packagingId": "" });
                                            }}
                                            data={packagings}
                                            block
                                        />
                                        <div style={{ minHeight: '22px' }}>
                                            {
                                                errors['packagingId'] &&
                                                <Text type="danger">{errors['packagingId']}</Text>
                                            }
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        {/* TODO: add validation for classification */}
                        <div className="sm:col-span-6 my-6">
                            {/* <MedicineClassificationForm isLoading={isLoading} formFields={formFields} setFormFields={HandleFormFields} /> */}
                            <MedicineClassificationForm errors={errors} setErrors={setErrors} classifications={classifications} isLoading={isLoading} formFields={formFields} setFormFields={handleFormFields} />
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="unitOfMeasure" className="block text-sm font-medium leading-6 text-dark">
                                Satuan Ukuran
                            </label>
                            <div className="mt-2">
                                {isLoading ?
                                    <Dropdown
                                        id="unitOfMeasure"
                                        name="unitOfMeasure"
                                        placeholder="Satuan"
                                        disabled={true}
                                        size='lg'
                                        block
                                        cleanable={false}
                                        className="py-1.5"
                                        data={unitOfMeasure}
                                        value={input?.unitOfMeasure}
                                        valueKey="value"
                                        labelKey="label"
                                    />
                                    :
                                    <>
                                        <Dropdown
                                            id="unitOfMeasure"
                                            name="unitOfMeasure"
                                            placeholder="Satuan"
                                            size='lg'
                                            cleanable={false}
                                            className="py-1.5"
                                            data={unitOfMeasure}
                                            block
                                            onChange={value => {
                                                setInput({ ...input, unitOfMeasure: value })
                                                setErrors({ ...errors, "unitOfMeasure": "" });
                                            }}
                                            value={input?.unitOfMeasure}
                                            valueKey="value"
                                            labelKey="label"
                                        />
                                        <div style={{ minHeight: '22px' }}>
                                            {
                                                errors['unitOfMeasure'] &&
                                                <Text type="danger">{errors['unitOfMeasure']}</Text>
                                            }
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <div className="mt-2">
                                {isLoading ?
                                    <InputField
                                        type="text"
                                        label="Efek Samping"
                                        id="sideEffect"
                                        name="sideEffect"
                                        placeholder="efek samping"
                                        value={input?.sideEffect}
                                        disabled={true}
                                    />
                                    :
                                    <InputField
                                        type="text"
                                        id="sideEffect"
                                        label="Efek Samping"
                                        name="sideEffect"
                                        placeholder="efek samping"
                                        value={input?.sideEffect}
                                        error={errors['sideEffect']}
                                        onChange={e => {
                                            setInput({ ...input, sideEffect: e.target.value })
                                            setErrors({ ...errors, "sideEffect": "" });
                                        }}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-2 my-6 pb-6 lg:justify-end">
                        {isSubmitted ?
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
