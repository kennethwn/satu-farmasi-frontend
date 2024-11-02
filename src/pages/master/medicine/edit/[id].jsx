import Button from "@/components/Button";
import InputField from "@/components/Input";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import Select from "@/components/Select";
import { useUserContext } from "@/pages/api/context/UserContext";
import useGenericAPI from "@/pages/api/master/generic";
import useMedicineAPI from "@/pages/api/master/medicine";
import usePackagingAPI from "@/pages/api/master/packaging";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MedicineClassificationForm from "@/components/DynamicForms/MedicineClassificationForm";
import { SelectPicker } from "rsuite";
import Dropdown from "@/components/SelectPicker/Dropdown";

export default function Index() {
    const router = useRouter();
    const id = router.query.id;
    const { user } = useUserContext();
    const { isLoading, EditMedicine, SearchMedicine } = useMedicineAPI();
    const { GetPackagingDropdown } = usePackagingAPI();
    const { GetGenericDropdown } = useGenericAPI();

    const [input, setInput] = useState({});
    const [error, setError] = useState({});
    const [packagings, setPackagings] = useState([]);
    const [generics, setGenerics] = useState([]);
    const [formFields, setFormFields] = useState([{id: 0, label: '', value: ''}]);
    const unitOfMeasure = [
        {id: 1, label: 'MILLILITER', value: 'MILLILITER'},
        {id: 2, label: 'MILLIGRAM', value: 'MILLIGRAM'},
        {id: 3, label: 'GRAM', value: 'GRAM'},
        {id: 4, label: 'LITER', value: 'LITER'},
        {id: 5, label: 'GROS', value: 'GROS'},
        {id: 6, label: 'KODI', value: 'KODI'},
        {id: 7, label: 'RIM', value: 'RIM'},
        {id: 8, label: 'PCS', value: 'PCS'},
    ];

    const handleFormFields = (value) => {
        setFormFields(value); 
    }

    const handleFetchMedicineByCode = async () => {
        try {
            const res = await SearchMedicine(1, 1, id);
            console.log(res);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            }
            setInput(res?.data?.results[0]);
            
            let classificationForm = [];
            res.data.results[0].classifications.forEach((item, index) => {
                let data = {id: 0, label: '', value: ''};
                data['id'] = item.classification.id;
                data['label'] = item.classification.label;
                data['value'] = item.classification.value;
                classificationForm.push(data);
            })
            console.log(classificationForm);
            setFormFields(classificationForm);
        } catch (error) {
            console.error(error);
        }
    }

    const handleFetchPackagingDropdown = async () => {
        try {
            const res = await GetPackagingDropdown();
            console.log(res);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
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
            console.log(res);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                setGenerics([]);
                return;
            }
            setGenerics(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async () => {
        try {
            let classifications = [];
            input?.classifications?.map((item, index) => {
                let temp = {classificationId: 0, medicineId: 0};
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
                price: input.price,
                expiredDate: input.expiredDate,
                currStock: input.currStock,
                minStock: input.minStock,
                maxStock: input.maxStock,
                genericNameId: Number(input.genericName) || Number(input.genericName.id),
                packagingId: input.packaging.id,
                sideEffect: input.sideEffect,
                classificationList: classifications,
                is_active: input.is_active,
                created_at: input.created_at,
                updated_at: input.updated_at
            }

            const res = await EditMedicine(payload);
            if (res.code !== 200) {
                toast.error(res.message, { autoClose: 2000, position: "top-center" });
                return;
            }
            toast.success(res.message, { autoClose: 2000, position: "top-center" });
            router.push("/master/medicine");
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await handleFetchMedicineByCode();
            await handleFetchPackagingDropdown();
            await handleFetchGenericDropdown();
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
                                        onChange={
                                            (e) => setInput({...input, name: e.target.value})
                                        } 
                                        label="Nama Obat"
                                        placeholder="nama obat" 
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
                                        onChange={
                                            (e) => setInput({...input, merk: e.target.value})
                                        } 
                                        placeholder="merek" 
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
                                        onChange={
                                            (e) => setInput({...input, price: e.target.value})
                                        }
                                        placeholder="0" 
                                        label="Harga Jual Obat"
                                        value={input?.price}
                                        currency={true}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <div className="mt-2">
                                {isLoading ?
                                    <InputField 
                                        type="number" 
                                        id="currStock" 
                                        name="currStock"
                                        placeholder="0" 
                                        label="Stok Sekarang"
                                        value={input?.currStock}
                                        disabled={true}
                                    />
                                    :
                                    <InputField 
                                        type="number" 
                                        id="currStock" 
                                        name="currStock"
                                        placeholder="0" 
                                        label="Stok Sekarang"
                                        value={input?.currStock}
                                        onChange={(e) => setInput({...input, currStock: e.target.value})}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-2">
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
                                        value={input?.minStock}
                                        onChange={(e) => setInput({...input, minStock: e.target.value})}
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-2">
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
                                        value={input?.maxStock}
                                        onChange={(e) => setInput({...input, maxStock: e.target.value})}
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
                                        placeholder="nama generik"
                                        size='lg'
                                        disabled={true}
                                        value={input?.genericName?.id}
                                        valueKey="id"
                                        labelKey="label"
                                        data={generics}
                                        block
                                    />
                                    :
                                    <Dropdown 
                                        id="genericName"
                                        name="genericName"
                                        placeholder="nama generik"
                                        size='lg'
                                        value={input?.genericName?.id}
                                        valueKey="id"
                                        labelKey="label"
                                        onChange={(value) => setInput({...input, genericName: value})}
                                        data={generics}
                                        block
                                    />
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
                                        size='lg'
                                        value={input?.packaging?.id}
                                        labelKey="label"
                                        valueKey="id"
                                        data={packagings}
                                        block
                                    />
                                    :
                                    <Dropdown 
                                        id="packaging"
                                        name="packaging"
                                        placeholder="kemasan"
                                        value={input?.packaging?.id}
                                        labelKey="label"
                                        size='lg'
                                        valueKey="id"
                                        onChange={(value) => setInput({...input, packaging: value})}
                                        data={packagings}
                                        block
                                    />
                                }
                            </div>
                        </div>
                        <div className="sm:col-span-6 my-6">
                            {/* <MedicineClassificationForm isLoading={isLoading} formFields={formFields} setFormFields={HandleFormFields} /> */}
                            <MedicineClassificationForm isLoading={isLoading} formFields={formFields} setFormFields={handleFormFields} />
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
                                    placeholder="satuan"
                                    disabled={true}
                                    size='lg'
                                    block
                                    data={unitOfMeasure}
                                    value={input?.unitOfMeasure}
                                    valueKey="value"
                                    labelKey="label"
                                    />
                                    :
                                    <Dropdown 
                                    id="unitOfMeasure"
                                    name="unitOfMeasure"
                                    placeholder="satuan"
                                    size='lg'
                                    data={unitOfMeasure}
                                    block
                                    onChange={(value) => setInput({...input, unitOfMeasure: value})}
                                    value={input?.unitOfMeasure}
                                    valueKey="value"
                                    labelKey="label"
                                    />
                                }
                            </div>
                            {error?.unitOfMeasure && <Text type="danger">{error?.unitOfMeasure}</Text>}
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="sideEffect" className="block mt-4 text-sm font-medium leading-6 text-dark">
                                Efek Samping
                            </label>
                            <div className="mt-2">
                                {isLoading ?
                                    <InputField 
                                        type="text" 
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
                                        name="sideEffect"
                                        placeholder="efek samping" 
                                        value={input?.sideEffect}
                                        onChange={(e) => setInput({...input, sideEffect: e.target.value})}
                                    />
                                }
                            </div>
                            {error?.sideEffect && <Text type="danger">{error?.unitOfMeasure}</Text>}
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
                                isLoading={isLoading}
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