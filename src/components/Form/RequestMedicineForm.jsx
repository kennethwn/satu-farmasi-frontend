import propTypes, { object } from 'prop-types';
import RequestDynamicMedicineForm from "../DynamicForms/RequestDynamicMedicineForm";
import Text from "../Text";
import Input from "../Input";
import Dropdown from "../SelectPicker/Dropdown";
import { useEffect } from 'react';

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

    useEffect(() => {
        console.log("input from component: ", input);
    })

    return (
        <div className="w-full pb-8">
            <Text type="body">
                {type == 0 && "* Surat Pesanan Farmasi / Alat Medis / BMHP Biasa"}
                {type == 1 && "* Surat Pesanan Farmasi / Alat Medis / BMHP Narkotika"}
                {type == 2 && "* Surat Pesanan Farmasi / Alat Medis / BMHP Psikotropika"}
            </Text>
            <div className="py-4 gap-4 flex flex-col w-full">
                {/* Order Number */}
                <div className='flex flex-col gap-2 mb-4'>
                    <label htmlFor='leftNum' className='text-body'>Nomor Surat Pemesanan</label>
                    <div className='flex flex-row gap-4 justify-between w-full'>
                        <Input
                            id="leftNum"
                            name='leftNum'
                            type='number'
                            placeholder='0'
                            value={input ? input?.leftNum: ''}
                            onChange={e => {
                                setInput({...input, leftNum: e.target.value})
                                setErrors({...errors, 'leftNum': ''})
                            }}
                            error={errors['leftNum']} />
                        <div className='text-3xl font-thin text-border-box'>/</div>
                        <Input
                            id="middleNum"
                            name='middleNum'
                            type='number'
                            placeholder='0'
                            value={input ? input?.middleNum: ''}
                            onChange={e => {
                                setInput({...input, middleNum: e.target.value})
                                setErrors({...errors, 'middleNum': ''})
                            }}
                            error={errors['middleNum']} />
                        <div className='text-3xl font-thin text-border-box'>/</div>
                        <Input
                            id="rightNum"
                            name='rightNum'
                            type='number'
                            placeholder='0'
                            value={input ? input?.rightNum: ''}
                            onChange={e => {
                                setInput({...input, rightNum: e.target.value})
                                setErrors({...errors, 'rightNum': ''})
                            }}
                            error={errors['rightNum']} />
                    </div>
                </div>
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
                    value={input ? input?.id : ''}
                    block
                    data={dataVendor?.map(item => ({
                        ...item,
                        label: item.name,
                        value: item.id
                    }))}
                    onChange={value => {
                        setInput({
                            ...input, 
                            vendor: dataVendor?.find(item => item.id == value)?.name,
                            cityVendor: dataVendor?.find(item => item.id == value)?.city,
                            phoneVendor: dataVendor?.find(item => item.id == value)?.phoneNum,
                        })
                        setErrors({...errors, 
                            'vendor': '', 
                            'cityVendor': '',
                            'phoneVendor': ''
                        })
                    }}
                    error={errors['vendor']}
                />

                {/* Vendor's City */}
                <Input 
                    id="cityVendor" 
                    name="cityVendor" 
                    label="Kota" 
                    placeholder="kota" 
                    disabled
                    value={input ? input?.cityVendor: ''}
                    error={errors['cityVendor']} />

                {/* Vendor's Number Phone */}
                <Input 
                    id="phoneVendor" 
                    name="phoneVendor" 
                    label="No Telp" 
                    type="tel" 
                    placeholder="08XX-XXXX-XXXX" 
                    disabled
                    value={input ? input?.phoneVendor: ''}
                    error={errors['phoneVendor']} />
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
    dataPharmacy: propTypes.object,
    formFields: propTypes.arrayOf(object),
    setFormFields: propTypes.func,
}