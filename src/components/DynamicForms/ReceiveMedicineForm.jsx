import React, { useEffect } from "react";
import Dropdown from "../SelectPicker/Dropdown";
import InputField from "../Input";
import MedicineClassificationForm from "@/components/DynamicForms/MedicineClassificationForm";
import { DatePicker, Radio, RadioGroup } from "rsuite";
import propTypes, { object } from "prop-types";
import { formatCalendar } from "@/helpers/dayHelper";
import Text from "../Text";

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
        existingMedicine,
        isEdit = false,
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
                            // type="text"
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
                isEdit ? null
                : existingMedicine ?
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
                                        error={errors['medicineId']}
                                    />
                                    {/* <div style={{ minHeight: '22px' }}>
                                        {
                                            errors['medicineId'] &&
                                            <Text type="danger">{errors['medicineId']}</Text>
                                        }
                                    </div> */}
                                </>
                            }
                        </div>
                    </div>
                    : null
            }
            <div className="sm:col-span-6">
                <div className={`${isEdit ? "mt-2": null}`}>
                    {isLoading ?
                        <InputField
                            type="text"
                            id="medicine_name"
                            name="medicine_name"
                            disabled={true}
                            label="Nama Obat"
                            placeholder="nama obat"
                            value={existingMedicine
                                ? dataMedicines?.find(item => item?.id == input.medicineId)?.name || input?.medicineRequest?.name
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
                                setErrors({ ...errors, "medicineRequest.name": "" });
                            }}
                            label="Nama Obat"
                            placeholder="nama obat"
                            error={errors['medicineRequest.name']}
                            value={existingMedicine 
                                ? dataMedicines?.find(item => item?.id == input.medicineId)?.name || input?.medicineRequest?.name
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
                                ? dataMedicines?.find(item => item?.id == input.medicineId)?.merk || input?.medicineRequest?.merk
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
                                setErrors({ ...errors, "medicineRequest.merk": "" });
                            }}
                            placeholder="merek"
                            error={errors['medicineRequest.merk']}
                            value={existingMedicine 
                                ? dataMedicines?.find(item => item?.id == input.medicineId)?.merk || input?.medicineRequest?.merk
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
                                ? dataMedicines?.find(item => item?.id == input.medicineId)?.price || input?.medicineRequest?.price
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
                                setErrors({ ...errors, "medicineRequest.price": "" });
                            }}
                            placeholder="0"
                            label="Harga Jual Obat"
                            value={existingMedicine
                                ? dataMedicines?.find(item => item?.id == input.medicineId)?.price || input?.medicineRequest?.price
                                : input?.price || 0
                            }
                            error={errors['medicineRequest.price']}
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
                            value={input?.currStock || input?.quantity}
                            disabled={true}
                        />
                        :
                        <InputField
                            type="number"
                            id="currStock"
                            name="currStock"
                            placeholder="0"
                            label="Stok Baru"
                            value={input?.currStock || input?.quantity}
                            error={errors['medicineRequest.currStock']}
                            onChange={e => {
                                setInput({ ...input, currStock: parseInt(e.target.value), quantity: parseInt(e.target.value) })
                                setErrors({ ...errors, "medicineRequest.currStock": "" });
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
                                ? dataMedicines?.find(item => item?.id == input?.medicineId)?.minStock || input?.medicineRequest?.minStock
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
                            error={errors['medicineRequest.minStock']}
                            value={existingMedicine
                                ? dataMedicines?.find(item => item?.id == input?.medicineId)?.minStock || input?.medicineRequest?.minStock
                                : input?.minStock || 0
                            }
                            onChange={e => {
                                setInput({ ...input, minStock: parseInt(e.target.value) })
                                setErrors({ ...errors, "medicineRequest.minStock": "" });
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
                                ? dataMedicines?.find(item => item?.id == input?.medicineId)?.maxStock || input?.medicineRequest?.maxStock
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
                            error={errors['medicineRequest.maxStock']}
                            value={existingMedicine
                                ? dataMedicines?.find(item => item?.id == input?.medicineId)?.maxStock || input?.medicineRequest?.maxStock
                                : input?.maxStock || 0
                            }
                            onChange={e => {
                                setInput({ ...input, maxStock: parseInt(e.target.value) })
                                setErrors({ ...errors, "medicineRequest.maxStock": "" });
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
                                ? dataMedicines?.find(item => item?.id == input?.medicineId)?.genericName.id || input?.medicineRequest?.genericNameId
                                : input?.genericNameId
                            }
                            valueKey="id"
                            labelKey="label"
                            data={dataGenerics}
                            block
                        />
                        :
                        <Dropdown
                            id="genericNameId"
                            name="genericNameId"
                            placeholder={<span className="text-sm">generik</span>}
                            size='lg'
                            value={existingMedicine
                                ? dataMedicines?.find(item => item?.id == input?.medicineId)?.genericName.id || input?.medicineRequest?.genericNameId
                                : input?.genericNameId
                            }
                            valueKey="id"
                            className="py-1.5"
                            labelKey="label"
                            onChange={value => {
                                setInput({ ...input, genericNameId: value })
                                setErrors({ ...errors, "medicineRequest.genericNameId": "" });
                            }}
                            data={dataGenerics}
                            disabled={existingMedicine}
                            block
                            error={errors["medicineRequest.genericNameId"]}
                        />
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
                                ? dataMedicines?.find(item => item?.id == input?.medicineId)?.packaging.id || input?.medicineRequest?.packagingId
                                : input?.packagingId
                            }
                            labelKey="label"
                            valueKey="id"
                            data={dataPackagings}
                            block
                        />
                        :
                        <Dropdown
                            id="packagingId"
                            name="packagingId"
                            placeholder={<span className="text-sm">kemasan</span>}
                            value={existingMedicine
                                ? dataMedicines?.find(item => item?.id == input?.medicineId)?.packaging.id || input?.medicineRequest?.packagingId
                                : input?.packagingId
                            }
                            labelKey="label"
                            size='lg'
                            className="py-1.5"
                            valueKey="id"
                            onChange={value => {
                                setInput({ ...input, packagingId: value })
                                setErrors({ ...errors, "medicineRequest.packagingId": "" });
                            }}
                            error={errors["medicineRequest.packagingId"]}
                            data={dataPackagings}
                            disabled={existingMedicine}
                            block
                        />
                    }
                </div>
            </div>
            <div className="sm:col-span-6 mb-6 lg:my-4">
                {existingMedicine
                    ? <MedicineClassificationForm disabled={existingMedicine} errors={errors} setErrors={setErrors} classifications={dataClassifications} isLoading={isLoading} formFields={(dataMedicines?.find(item => item?.id == input?.medicineId)?.classifications)?.map(item => ({ id: item.id, label: item.label, value: item.value })) || formFields} setFormFields={setFormFields} />
                    : <MedicineClassificationForm disabled={existingMedicine} errors={errors} setErrors={setErrors} classifications={dataClassifications} isLoading={isLoading} formFields={formFields} setFormFields={setFormFields} />
                }
            </div>
            <div className="sm:col-span-6">
                <div className="mt-2">
                    {isLoading ?
                        <Dropdown
                            id="unitOfMeasure"
                            label="Satuan Ukuran"
                            name="unitOfMeasure"
                            placeholder={<span className="text-sm">satuan</span>}
                            disabled={true}
                            size='lg'
                            block
                            className="py-1.5"
                            data={unitOfMeasure}
                            value={existingMedicine
                                ? dataMedicines?.find(item => item?.id == input?.medicineId)?.unitOfMeasure || input?.medicineRequest?.unitOfMeasure
                                : input?.unitOfMeasure || ""
                            }
                            valueKey="value"
                            labelKey="label"
                        />
                        :
                        <Dropdown
                            id="unitOfMeasure"
                            name="unitOfMeasure"
                            label="Satuan Ukuran"
                            placeholder={<span className="text-sm">satuan</span>}
                            size='lg'
                            className="py-1.5"
                            data={unitOfMeasure}
                            block
                            onChange={value => {
                                setInput({ ...input, unitOfMeasure: value })
                                setErrors({ ...errors, "medicineRequest.unitOfMeasure": "" });
                            }}
                            value={existingMedicine
                                ? dataMedicines?.find(item => item?.id == input?.medicineId)?.unitOfMeasure || input?.medicineRequest?.unitOfMeasure
                                : input?.unitOfMeasure || ""
                            }
                            disabled={existingMedicine}
                            valueKey="value"
                            labelKey="label"
                            error={errors["medicineRequest.unitOfMeasure"]}
                        />
                    }
                </div>
            </div>
            <div className="sm:col-span-6">
                <label htmlFor="expiredDate" className="block text-body font-medium leading-6 text-dark mt-2">
                    Tanggal Expired
                </label>
                <div className="py-2">
                    {isLoading ?
                        <DatePicker
                            id="expiredDate"
                            name="expiredDate"
                            className="py-1.5"
                            placement="topStart"
                            cleanable={false}
                            size='lg'
                            disabled={true}
                            value={input?.expiredDate || input?.medicineRequest?.expiredDate}
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
                                className={"py-1.5" + errors['medicineRequest.expiredDate'] ? "error-field" : ""}
                                size='lg'
                                value={input?.expiredDate || input?.medicineRequest?.expiredDate}
                                valueKey="id"
                                labelKey="label"
                                onChange={value => {
                                    setInput({ ...input, expiredDate: value })
                                    setErrors({ ...errors, "medicineRequest.expiredDate": "" });
                                }}
                                block
                            />
                            {
                                errors['medicineRequest.expiredDate'] &&
                                    <div style={{ marginTop: '8px', minHeight: '22px' }}>
                                        <Text type="danger">{errors['medicineRequest.expiredDate']}</Text>
                                    </div>
                            }
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
                            value={existingMedicine
                                ? dataMedicines?.find(item => item?.id == input?.medicineId)?.sideEffect || input?.medicineRequest?.sideEffect
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
                                ? dataMedicines?.find(item => item?.id == input?.medicineId)?.sideEffect || input?.medicineRequest?.sideEffect
                                : input?.sideEffect || ""
                            }
                            error={errors['medicineRequest.sideEffect']}
                            onChange={e => {
                                setInput({ ...input, sideEffect: e.target.value })
                                setErrors({ ...errors, "medicineRequest.sideEffect": "" });
                            }}
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
                            label="Deskripsi"
                            id="description"
                            name="description"
                            placeholder="deskripsi"
                            value={existingMedicine
                                ? dataMedicines?.find(item => item?.id == input?.medicineId)?.description || input?.medicineRequest?.description
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
                                ? dataMedicines?.find(item => item?.id == input?.medicineId)?.description || input?.medicineRequest?.description
                                : input?.description || ""
                            }
                            error={errors['medicineRequest.description']}
                            onChange={e => {
                                setInput({ ...input, description: e.target.value })
                                setErrors({ ...errors, "medicineRequest.description": "" });
                            }}
                            disabled={existingMedicine}
                        />
                    }
                </div>
            </div>
            <div className="sm:col-span-6">
                <div className="mt-2">
                    {isLoading ?
                        <Dropdown
                            id="vendorId"
                            name="vendorId"
                            label="Vendor"
                            className="py-1.5"
                            placeholder={<span className="text-sm">vendor</span>}
                            size='lg'
                            disabled={true}
                            value={input?.vendorId || input?.medicineRequest?.vendorId}
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
                                label="Vendor"
                                placeholder={<span className="text-sm">vendor</span>}
                                size='lg'
                                value={input?.vendorId || input?.medicineRequest?.vendorId}
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
                            {
                                errors['vendorId'] &&
                                    <div style={{ minHeight: '22px' }}>
                                        <Text type="danger">{errors['vendorId']}</Text>
                                    </div>
                            }
                        </>
                    }
                </div>
            </div>
            <div className="sm:col-span-6">
                <div className="mt-2">
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
                    }
                </div>
            </div>
            <div className="sm:col-span-6">
                {/* <label htmlFor="paymentMethod" className="block text-body font-medium leading-6 text-dark">
                    Metode Pembayaran
                </label> */}
                <div className="mt-2">
                    {isLoading ?
                        <Dropdown
                            id="paymentMethod"
                            name="paymentMethod"
                            label="Metode Pembayaran"
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
                                label="Metode Pembayaran"
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
                                error={errors["paymentMethod"]}
                            />
                            {/* <div style={{ minHeight: '22px' }}>
                                {
                                    errors['paymentMethod'] &&
                                    <Text type="danger">{errors['paymentMethod']}</Text>
                                }
                            </div> */}
                        </>
                    }
                </div>
            </div>
            <div className="sm:col-span-6">
                <label htmlFor="deadline" className="block text-body font-medium leading-6 text-dark mt-2">
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
                            value={isEdit ? new Date(input?.deadline) : input?.deadline}
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
                                value={isEdit ? new Date(input?.deadline) : input?.deadline}
                                className="py-1.5"
                                onChange={value => {
                                    setInput({ ...input, deadline: value })
                                    setErrors({ ...errors, "deadline": "" });
                                }}
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
                            value={input?.isPaid}
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
                            value={input?.isPaid}
                        >
                            <Radio value={true}>Lunas</Radio>
                            <Radio value={false}>Belum Lunas</Radio>
                        </RadioGroup>
                    }
                    <div style={{ minHeight: '22px' }}>
                    {
                        errors['isPaid'] &&
                        <Text type="danger">{errors['isPaid']}</Text>
                    }
                    </div>
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
    existingMedicine: propTypes.bool,
    isEdit: propTypes.bool,
}
