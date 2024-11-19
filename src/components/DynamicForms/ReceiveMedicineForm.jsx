import React, { useEffect } from "react";
import Dropdown from "../SelectPicker/Dropdown";
import InputField from "../Input";
import MedicineClassificationForm from "@/components/DynamicForms/MedicineClassificationForm";
import { DatePicker, Radio, RadioGroup } from "rsuite";
import propTypes, { object } from "prop-types";

const ReceiveMedicineForm = (props) => {
    const {
        isLoading,
        setInput,
        input,
        errors,
        setErrors,
        dataMedicines,
        dataGenerics,
        dataPackagings,
        dataClassifications,
        dataVendors,
        formFields,
        setFormFields,
        existingMedicine
    } = props;

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

    const paymentMethod = [
        { id: 1, label: 'DEBIT', value: 'DEBIT'},
        { id: 2, label: 'CREDIT', value: 'CREDIT'},
        { id: 3, label: 'QRIS', value: 'QRIS'},
        { id: 4, label: 'PAYPAL', value: 'PAYPAL'},
        { id: 5, label: 'CASH', value: 'CASH'},
    ]

    useEffect(() => {
        console.log("debug: ", (dataMedicines?.find(item => item.id == input?.medicineId)?.classifications)?.map(item => ({ id: item.classification.id, label: item.classification.label, value: item.classification.value })))
    }, [input?.medicineId]);

    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
            <div className="sm:col-span-6">
                <div className="mt-2">
                    {isLoading ?
                        <InputField
                            type="text"
                            id="document_number"
                            name="document_number"
                            disabled={true}
                            label="Nomor Dokumen"
                            placeholder="nomor dokumen"
                            value={input?.documentNumber}
                        />
                        :
                        <InputField
                            type="text"
                            id="document_number"
                            name="document_number"
                            onChange={e => {
                                setInput({ ...input, documentNumber: (e.target.value).toUpperCase() });
                                setErrors({ ...errors, "documentNumber": "" });
                            }}
                            label="Nomor Dokumen"
                            placeholder="nomor dokumen"
                            error={errors['documentNumber']}
                            value={input?.documentNumber}
                        />
                    }
                </div>
            </div>
            <div className="sm:col-span-6">
                <div className="mt-2">
                    {isLoading ?
                        <InputField
                            type="text"
                            id="batch_code"
                            name="batch_code"
                            disabled={true}
                            label="Kode Bets/Batch"
                            placeholder="kode bets"
                            value={input?.batchCode}
                        />
                        :
                        <InputField
                            type="text"
                            id="batch_code"
                            name="batch_code"
                            onChange={e => {
                                setInput({ ...input, batchCode: (e.target.value).toUpperCase() });
                                setErrors({ ...errors, "batchCode": "" });
                            }}
                            label="Kode Bets/Batch"
                            placeholder="kode bets"
                            error={errors['batchCode']}
                            value={input?.batchCode}
                        />
                    }
                </div>
            </div>
            {
                existingMedicine ?
                    <div className="sm:col-span-6">
                        <label htmlFor="medicineId" className="block text-body mt-2 font-medium leading-6 text-dark">
                            Obat
                        </label>
                        <div className="">
                            {isLoading ?
                                <Dropdown
                                    id="medicineId"
                                    name="medicineId"
                                    className="py-1.5"
                                    placeholder={<span className="text-sm">obat</span>}
                                    size='lg'
                                    disabled={true}
                                    value={input?.medicineId}
                                    valueKey="id"
                                    labelKey="label"
                                    // data={dataGenerics}
                                    block
                                />
                                :
                                <>
                                    <Dropdown
                                        id="medicineId"
                                        name="medicineId"
                                        placeholder={<span className="text-sm">obat</span>}
                                        size='lg'
                                        value={input?.medicineId}
                                        valueKey="id"
                                        className="py-1.5"
                                        labelKey="label"
                                        onChange={value => {
                                            setInput({ ...input, medicineId: value })
                                            setErrors({ ...errors, "medicineId": "" });
                                        }}
                                        data={dataMedicines}
                                        block
                                    />
                                    <div style={{ minHeight: '22px' }}>
                                        {
                                            errors['medicineId'] &&
                                            <Text type="danger">{errors['medicineId']}</Text>
                                        }
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    : null
            }
            <div className="sm:col-span-6">
                <div className="">
                    {isLoading ?
                        <InputField
                            type="text"
                            id="medicine_name"
                            name="medicine_name"
                            disabled={true}
                            label="Nama Obat"
                            placeholder="nama obat"
                            value={existingMedicine
                                ? dataMedicines?.find(item => item.id == input.medicineId)?.name
                                : input?.name || ""
                            }
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
                            value={existingMedicine 
                                ? dataMedicines?.find(item => item.id == input.medicineId)?.name
                                : input?.name || ""
                            }
                            disabled={existingMedicine}
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
                            value={existingMedicine 
                                ? dataMedicines?.find(item => item.id == input.medicineId)?.merk
                                : input?.merk || ""
                            }
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
                            value={existingMedicine 
                                ? dataMedicines?.find(item => item.id == input.medicineId)?.merk
                                : input?.merk || ""
                            }
                            disabled={existingMedicine}
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
                            value={existingMedicine
                                ? dataMedicines?.find(item => item.id == input.medicineId)?.price
                                : input?.price || 0
                            }                            
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
                            value={existingMedicine
                                ? dataMedicines?.find(item => item.id == input.medicineId)?.price
                                : input?.price || 0
                            }
                            error={errors['price']}
                            currency={true}
                            disabled={existingMedicine}
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
                            label="Stok Baru"
                            value={input?.currStock}
                            disabled={true}
                        />
                        :
                        <InputField
                            type="number"
                            id="currStock"
                            name="currStock"
                            placeholder="0"
                            label="Stok Baru"
                            value={input?.currStock}
                            error={errors['currStock']}
                            onChange={e => {
                                setInput({ ...input, currStock: parseInt(e.target.value) })
                                setErrors({ ...errors, "currStock": "" });
                            }}
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
                            value={existingMedicine
                                ? dataMedicines?.find(item => item.id == input?.medicineId)?.minStock
                                : input?.minStock || 0
                            }
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
                            value={existingMedicine
                                ? dataMedicines?.find(item => item.id == input?.medicineId)?.minStock
                                : input?.minStock || 0
                            }
                            onChange={e => {
                                setInput({ ...input, minStock: parseInt(e.target.value) })
                                setErrors({ ...errors, "minStock": "" });
                            }}
                            disabled={existingMedicine}
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
                            value={existingMedicine
                                ? dataMedicines?.find(item => item.id == input?.medicineId)?.maxStock
                                : input?.maxStock || 0
                            }
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
                            value={existingMedicine
                                ? dataMedicines?.find(item => item.id == input?.medicineId)?.maxStock
                                : input?.maxStock || 0
                            }
                            onChange={e => {
                                setInput({ ...input, maxStock: parseInt(e.target.value) })
                                setErrors({ ...errors, "maxStock": "" });
                            }}
                            disabled={existingMedicine}
                        />
                    }
                </div>
            </div>
            <div className="sm:col-span-3">
                <label htmlFor="genericNameId" className="block text-body font-medium leading-6 pt-2 text-dark">
                    Nama Generik
                </label>
                <div className="">
                    {isLoading ?
                        <Dropdown
                            id="genericNameId"
                            name="genericNameId"
                            className="py-1.5"
                            placeholder={<span className="text-sm">generik</span>}
                            size='lg'
                            disabled={true}
                            value={existingMedicine
                                ? dataMedicines?.find(item => item.id == input?.medicineId)?.genericName.id
                                : input?.genericNameId
                            }
                            valueKey="id"
                            labelKey="label"
                            data={dataGenerics}
                            block
                        />
                        :
                        <>
                            <Dropdown
                                id="genericNameId"
                                name="genericNameId"
                                placeholder={<span className="text-sm">generik</span>}
                                size='lg'
                                value={existingMedicine
                                    ? dataMedicines?.find(item => item.id == input?.medicineId)?.genericName.id
                                    : input?.genericNameId
                                }
                                valueKey="id"
                                className="py-1.5"
                                labelKey="label"
                                onChange={value => {
                                    setInput({ ...input, genericNameId: value })
                                    setErrors({ ...errors, "genericNameId": "" });
                                }}
                                data={dataGenerics}
                                disabled={existingMedicine}
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
                <label htmlFor="packagingId" className="block text-body font-medium leading-6 pt-2 text-dark">
                    Kemasan
                </label>
                <div className="">
                    {isLoading ?
                        <Dropdown
                            id="packagingId"
                            name="packagingId"
                            placeholder={<span className="text-sm">kemasan</span>}
                            disabled={true}
                            className="py-1.5"
                            size='lg'
                            value={existingMedicine
                                ? dataMedicines?.find(item => item.id == input?.medicineId)?.packaging.id
                                : input?.packagingId
                            }
                            labelKey="label"
                            valueKey="id"
                            data={dataPackagings}
                            block
                        />
                        :
                        <>
                            <Dropdown
                                id="packagingId"
                                name="packagingId"
                                placeholder={<span className="text-sm">kemasan</span>}
                                value={existingMedicine
                                    ? dataMedicines?.find(item => item.id == input?.medicineId)?.packaging.id
                                    : input?.packagingId
                                }
                                labelKey="label"
                                size='lg'
                                className="py-1.5"
                                valueKey="id"
                                onChange={value => {
                                    setInput({ ...input, packagingId: value })
                                    setErrors({ ...errors, "packagingId": "" });
                                }}
                                data={dataPackagings}
                                disabled={existingMedicine}
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
            <div className="sm:col-span-6 max-lg:mb-12 mb-8">
                {existingMedicine
                    ? <MedicineClassificationForm disabled={existingMedicine} errors={errors} setErrors={setErrors} classifications={dataClassifications} isLoading={isLoading} formFields={(dataMedicines?.find(item => item.id == input?.medicineId)?.classifications)?.map(item => ({ id: item.classification.id, label: item.classification.label, value: item.classification.value }))} setFormFields={setFormFields} />
                    : <MedicineClassificationForm disabled={existingMedicine} errors={errors} setErrors={setErrors} classifications={dataClassifications} isLoading={isLoading} formFields={formFields} setFormFields={setFormFields} />
                }
            </div>
            <div className="sm:col-span-6">
                <label htmlFor="unitOfMeasure" className="block text-body font-medium leading-6 text-dark">
                    Satuan Ukuran
                </label>
                <div className="">
                    {isLoading ?
                        <Dropdown
                            id="unitOfMeasure"
                            name="unitOfMeasure"
                            placeholder={<span className="text-sm">satuan</span>}
                            disabled={true}
                            size='lg'
                            block
                            className="py-1.5"
                            data={unitOfMeasure}
                            value={existingMedicine
                                ? dataMedicines?.find(item => item.id == input?.medicineId)?.unitOfMeasure
                                : input?.unitOfMeasure || ""
                            }
                            valueKey="value"
                            labelKey="label"
                        />
                        :
                        <>
                            <Dropdown
                                id="unitOfMeasure"
                                name="unitOfMeasure"
                                placeholder={<span className="text-sm">satuan</span>}
                                size='lg'
                                className="py-1.5"
                                data={unitOfMeasure}
                                block
                                onChange={value => {
                                    setInput({ ...input, unitOfMeasure: value })
                                    setErrors({ ...errors, "unitOfMeasure": "" });
                                }}
                                value={existingMedicine
                                    ? dataMedicines?.find(item => item.id == input?.medicineId)?.unitOfMeasure
                                    : input?.unitOfMeasure || ""
                                }
                                disabled={existingMedicine}
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
                <label htmlFor="expiredDate" className="block text-body font-medium leading-6 text-dark">
                    Tanggal Expired
                </label>
                <div className="">
                    {isLoading ?
                        <DatePicker
                            id="expiredDate"
                            name="expiredDate"
                            className="py-1.5"
                            placement="topStart"
                            cleanable={false}
                            size='lg'
                            disabled={true}
                            value={input?.expiredDate}
                            valueKey="id"
                            labelKey="label"
                            block
                        />
                        :
                        <>
                            <DatePicker
                                id="expiredDate"
                                name="expiredDate"
                                placement="topStart"
                                cleanable={false}
                                size='lg'
                                value={input?.expiredDate}
                                valueKey="id"
                                className="py-1.5"
                                labelKey="label"
                                onChange={value => {
                                    setInput({ ...input, expiredDate: value })
                                    setErrors({ ...errors, "expiredDate": "" });
                                }}
                                block
                            />
                            <div style={{ minHeight: '22px' }}>
                                {
                                    errors['expiredDate'] &&
                                    <Text type="danger">{errors['expiredDate']}</Text>
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className="sm:col-span-6">
                <div className="mb-6">
                    {isLoading ?
                        <InputField
                            type="text"
                            label="Efek Samping"
                            id="sideEffect"
                            name="sideEffect"
                            placeholder="efek samping"
                            value={existingMedicine
                                ? dataMedicines?.find(item => item.id == input?.medicineId)?.sideEffect
                                : input?.sideEffect || ""
                            }
                            disabled={true}
                        />
                        :
                        <InputField
                            type="text"
                            id="sideEffect"
                            label="Efek Samping"
                            name="sideEffect"
                            placeholder="efek samping"
                            value={existingMedicine
                                ? dataMedicines?.find(item => item.id == input?.medicineId)?.sideEffect
                                : input?.sideEffect || ""
                            }
                            error={errors['sideEffect']}
                            onChange={e => {
                                setInput({ ...input, sideEffect: e.target.value })
                                setErrors({ ...errors, "sideEffect": "" });
                            }}
                            disabled={existingMedicine}
                        />
                    }
                </div>
            </div>
            <div className="sm:col-span-6">
                <div className="mb-6">
                    {isLoading ?
                        <InputField
                            type="text"
                            label="Deskripsi"
                            id="description"
                            name="description"
                            placeholder="deskripsi"
                            value={existingMedicine
                                ? dataMedicines?.find(item => item.id == input?.medicineId)?.description
                                : input?.description || ""
                            }
                            disabled={true}
                        />
                        :
                        <InputField
                            type="text"
                            id="description"
                            label="Deskripsi"
                            name="description"
                            placeholder="deskripsi"
                            value={existingMedicine
                                ? dataMedicines?.find(item => item.id == input?.medicineId)?.description
                                : input?.description || ""
                            }
                            error={errors['description']}
                            onChange={e => {
                                setInput({ ...input, description: e.target.value })
                                setErrors({ ...errors, "description": "" });
                            }}
                            disabled={existingMedicine}
                        />
                    }
                </div>
            </div>
            <div className="sm:col-span-6">
                <label htmlFor="vendorId" className="block text-body font-medium leading-6 text-dark">
                    Vendor
                </label>
                <div className="">
                    {isLoading ?
                        <Dropdown
                            id="vendorId"
                            name="vendorId"
                            className="py-1.5"
                            placeholder={<span className="text-sm">vendor</span>}
                            size='lg'
                            disabled={true}
                            value={input?.vendorId}
                            valueKey="id"
                            labelKey="label"
                            data={dataVendors}
                            block
                        />
                        :
                        <>
                            <Dropdown
                                id="vendorId"
                                name="vendorId"
                                placeholder={<span className="text-sm">vendor</span>}
                                size='lg'
                                value={input?.vendorId}
                                valueKey="id"
                                className="py-1.5"
                                labelKey="label"
                                onChange={value => {
                                    setInput({ ...input, vendorId: value })
                                    setErrors({ ...errors, "vendorId": "" });
                                }}
                                data={dataVendors}
                                block
                            />
                            <div style={{ minHeight: '22px' }}>
                                {
                                    errors['vendorId'] &&
                                    <Text type="danger">{errors['vendorId']}</Text>
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className="sm:col-span-6">
                <div className="">
                    {isLoading ?
                        <InputField
                            type="number"
                            id="buyingPrice"
                            name="buyingPrice"
                            label="Harga Beli Obat"
                            placeholder="Rpxxx.xxx"
                            value={formatRupiah(input?.buyingPrice)}
                            disabled
                            currency="true"
                        />
                        :
                        <>
                            <InputField
                                type="number"
                                id="buyingPrice"
                                name="buyingPrice"
                                label="Harga Beli Obat"
                                placeholder="Rpxxx.xxx"
                                value={input?.buyingPrice}
                                error={errors['buyingPrice']}
                                onChange={e => {
                                    setInput({ ...input, buyingPrice: e.target.value })
                                    setErrors({ ...errors, "buyingPrice": "" });
                                }}
                                currency="true"
                            />
                            <div style={{ minHeight: '22px' }}>
                                {
                                    errors['buyingPrice'] &&
                                    <Text type="danger">{errors['buyingPrice']}</Text>
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className="sm:col-span-6">
                <label htmlFor="paymentMethod" className="block text-body font-medium leading-6 text-dark">
                    Metode Pembayaran
                </label>
                <div className="">
                    {isLoading ?
                        <Dropdown
                            id="paymentMethod"
                            name="paymentMethod"
                            className="py-1.5"
                            placeholder={<span className="text-sm">metode pembayaran</span>}
                            size='lg'
                            disabled={true}
                            value={input?.paymentMethod}
                            valueKey="value"
                            labelKey="label"
                            data={paymentMethod}
                            block
                        />
                        :
                        <>
                            <Dropdown
                                id="paymentMethod"
                                name="paymentMethod"
                                placeholder={<span className="text-sm">metode pembayaran</span>}
                                size='lg'
                                value={input?.paymentMethod}
                                valueKey="value"
                                className="py-1.5"
                                labelKey="label"
                                onChange={value => {
                                    setInput({ ...input, paymentMethod: value })
                                    setErrors({ ...errors, "paymentMethod": "" });
                                }}
                                data={paymentMethod}
                                block
                            />
                            <div style={{ minHeight: '22px' }}>
                                {
                                    errors['paymentMethod'] &&
                                    <Text type="danger">{errors['paymentMethod']}</Text>
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className="sm:col-span-6">
                <label htmlFor="deadline" className="block text-body font-medium leading-6 text-dark">
                    Tenggat Waktu Pembayaran
                </label>
                <div className="">
                    {isLoading ?
                        <DatePicker
                            id="deadline"
                            name="deadline"
                            className="py-1.5"
                            placement="topStart"
                            cleanable={false}
                            size='lg'
                            disabled={true}
                            value={input?.deadline}
                            valueKey="id"
                            labelKey="label"
                            // data={generics}
                            block
                        />
                        :
                        <>
                            <DatePicker
                                id="deadline"
                                name="deadline"
                                placement="topStart"
                                cleanable={false}
                                size='lg'
                                value={input?.deadline}
                                valueKey="id"
                                className="py-1.5"
                                labelKey="label"
                                onChange={value => {
                                    setInput({ ...input, deadline: value })
                                    setErrors({ ...errors, "deadline": "" });
                                }}
                                // data={generics}
                                block
                            />
                            <div style={{ minHeight: '22px' }}>
                                {
                                    errors['deadline'] &&
                                    <Text type="danger">{errors['deadline']}</Text>
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
            {/* isPaid Checkbox */}
            <div className="sm:col-span-6">
                <label htmlFor="isPaid" className="block text-body font-medium leading-6 text-dark">
                    Status Pembayaran
                </label>
                <div className="mt-2">
                    {isLoading ?
                        <RadioGroup
                            id="isPaid"
                            name="isPaid"
                            className="flex flex-row gap-10"
                            disabled
                        >
                            <Radio value={true}>Lunas</Radio>
                            <Radio value={false}>Belum Lunas</Radio>
                        </RadioGroup>
                        :
                        <RadioGroup
                            id="isPaid"
                            name="isPaid"
                            className="flex flex-row gap-10"
                            onChange={(value) => {
                                setInput({ ...input, isPaid: value })
                                setErrors({ ...errors, "isPaid": "" });
                            }}
                        >
                            <Radio value={true}>Lunas</Radio>
                            <Radio value={false}>Belum Lunas</Radio>
                        </RadioGroup>
                    }
                </div>
            </div>
        </div>
    )
}

export default ReceiveMedicineForm;

ReceiveMedicineForm.propTypes = {
    isLoading: propTypes.bool,
    setInput: propTypes.func,
    input: propTypes.object,
    errors: propTypes.object,
    setErrors: propTypes.func,
    dataGenerics: propTypes.array,
    dataPackagings: propTypes.array,
    dataClassifications: propTypes.array,
    dataMedicines: propTypes.array,
    dataVendors: propTypes.array,
    formFields: propTypes.arrayOf(object),
    setFormFields: propTypes.func,
    unitOfMeasure: propTypes.arrayOf(object),
    existingMedicine: propTypes.bool
}