import propTypes, { object } from 'prop-types';
import RequestDynamicMedicineForm from "../DynamicForms/RequestDynamicMedicineForm";
import Text from "../Text";
import Input from "../Input";
import Dropdown from "../SelectPicker/Dropdown";

export default function RequestMedicineForm(props) {
    const {
        formFields,
        setFormFields,
        errors,
        setErrors,
        type,
        input,
        setInput,
        dataVendor,
    } = props;

    return (
        <div className="w-full pb-8">
            <Text type="body">
                {type == 0 && "* Surat Pesanan Farmasi / Alat Medis / BMHP Biasa"}
                {type == 1 && "* Surat Pesanan Farmasi / Alat Medis / BMHP Narkotika"}
                {type == 2 && "* Surat Pesanan Farmasi / Alat Medis / BMHP Psikotropika"}
            </Text>
            <div className="py-4 gap-4 flex flex-col w-full">
                {/* Order Number */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor='leftNum' className='text-body'>Nomor Surat Pemesanan</label>
                    <div className='flex flex-row gap-4 justify-between w-full'>
                        <Input
                            id="leftNum"
                            name='leftNum'
                            type='number'
                            placeholder='0'
                            value={input?.leftNum}
                            onChange={e => setInput({...input, leftNum: e.target.value})} />
                        <Input
                            id="middleNum"
                            name='middleNum'
                            type='number'
                            placeholder='0'
                            value={input?.middleNum}
                            onChange={e => setInput({...input, middleNum: e.target.value})} />
                        <Input
                            id="rightNum"
                            name='rightNum'
                            type='number'
                            placeholder='0'
                            value={input?.rightNum}
                            onChange={e => setInput({...input, rightNum: e.target.value})} />
                    </div>
                </div>

                {/* Pharmacy */}
                <Input 
                    id="pharmacy" 
                    name="pharmacy" 
                    label="Nama Apotek"
                    onChange={e => setInput({...input, pharmacy: e.target.value})}
                    value={input?.pharmacy} />

                {/* SIA Number */}
                <Input 
                    id="siaNumber" 
                    name="siaNumber" 
                    label="Nomor SIA" 
                    placeholder="nomor SIA" 
                    onChange={e => setInput({...input, siaNumber: e.target.value})}
                    value={input?.siaNumber} />

                {/* Pharmacy's Address */}
                <Input 
                    id="addressPharmacy" 
                    name="addressPharmacy" 
                    label="Alamat Apotek" 
                    placeholder="alamat" 
                    onChange={e => setInput({
                        ...input, 
                        addressPharmacy: e.target.value,
                        cityPharmacy: "Jakarta" // 👈 dummy (retrieve from user context)
                    })}
                    value={input?.addressPharmacy} />

                {/* Pharmacy's City */}
                <Input 
                    id="cityPharmacy" 
                    name="cityPharmacy" 
                    label="Kota Apotek" 
                    placeholder="city"
                    disabled
                    value={input?.cityPharmacy} />

                {/* Pharmacist's Name */}
                <Input 
                    id="pharmacist" 
                    name="pharmacist" 
                    label="Nama Apoteker"
                    // disabled
                    onChange={e => setInput({...input, pharmacist: e.target.value})}
                    value={input?.pharmacist} />

                {/* SIPA Number */}
                <Input 
                    id="sipaNumber" 
                    name="sipaNumber" 
                    label="Nomor SIPA" 
                    placeholder="nomor SIPA"
                    // disabled
                    onChange={e => setInput({...input, sipaNumber: e.target.value})}
                    value={input?.sipaNumber} />
            </div>

            <RequestDynamicMedicineForm formFields={formFields} setFormFields={setFormFields} errors={errors} setErrors={setErrors} />
            
            <div className="py-4 gap-4 flex flex-col w-full">
                {/* Vendor */}
                <Dropdown
                    id="vendor"
                    name="vendor"
                    label="Nama Vendor"
                    placeholder={<span className="text-sm">vendor</span>}
                    size='lg'
                    labelKey="label"
                    valueKey="id"
                    block
                    data={dataVendor?.map(item => ({
                        ...item,
                        label: item.name,
                        value: item.id
                    }))}
                    onChange={value => 
                        setInput({
                            ...input, 
                            vendor: dataVendor?.find(item => item.id == value)?.name,
                            cityVendor: dataVendor?.find(item => item.id == value)?.city,
                            phoneVendor: dataVendor?.find(item => item.id == value)?.phoneNum,
                        })
                    }
                    cleanable={false}
                />

                {/* Vendor's City */}
                <Input 
                    id="cityVendor" 
                    name="cityVendor" 
                    label="Kota" 
                    placeholder="kota" 
                    disabled
                    value={input?.cityVendor} />

                {/* Vendor's Number Phone */}
                <Input 
                    id="phoneVendor" 
                    name="phoneVendor" 
                    label="No Telp" 
                    type="tel" 
                    placeholder="08XX-XXXX-XXXX" 
                    disabled
                    value={input?.phoneVendor} />
            </div>
        </div>
    )
}

RequestMedicineForm.propTypes = {
    setInput: propTypes.func,
    input: propTypes.object,
    type: propTypes.bool,
    errors: propTypes.object,
    setErrors: propTypes.func,
    dataVendor: propTypes.array,
    formFields: propTypes.arrayOf(object),
    setFormFields: propTypes.func,
}