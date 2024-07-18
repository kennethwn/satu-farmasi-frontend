import React, { useEffect } from 'react'
import Input from '../Input'
import Button from '../Button'
import { SelectPicker } from 'rsuite';

function PrescriptionForm(props) {
    const {
        formFields,
        setFormFields,
        medicineDropdownOptions
    } = props

    const data = medicineDropdownOptions.map(item => ({label: item.name, value: item.id-1}))
    
    const handleMedicineChange = (formFieldId, medicineId) => {
        console.log(medicineId)
        let updatedData = {
            medicineId: medicineId,
            medicineName: medicineDropdownOptions[medicineId].name,
            quantity: 0,
            price: medicineDropdownOptions[medicineId].price,
            totalPrice: 0
        }
        let temp = [...formFields]

        temp.forEach((item, index) => {
            if (index === formFieldId) {
                item.medicineId = updatedData.medicineId
                item.medicineName = updatedData.medicineName
                item.quantity = 0
                item.price = updatedData.price
                item.totalPrice = 0
            }
        })

        setFormFields(temp)
        console.log(formFields)
    }

    const handleAddFormFieldRow = () => {
        const newFormField = {
            medicineId: 0,
            medicineName: "",
            quantity: 0,
            price: 0,
            totalPrice: 0
        }
        setFormFields([...formFields, newFormField])
        console.log(formFields)
    }

    const handleMedicineQuantity = (formFieldId, quantity) => {
        const medicineId = formFields[formFieldId].medicineId
        let updatedData = {
            id: formFieldId,
            medicineId: medicineId,
            medicineName: medicineDropdownOptions[medicineId].name,
            quantity: quantity,
            price: medicineDropdownOptions[medicineId].price,
            totalPrice: medicineDropdownOptions[medicineId].price * quantity
        }
        let temp = [...formFields]

        temp.forEach((item, index) => {
            if (index === formFieldId) {
                item.medicineId = updatedData.medicineId
                item.medicineName = updatedData.medicineName
                item.quantity = updatedData.quantity
                item.price = updatedData.price
                item.totalPrice = updatedData.totalPrice
            }
        })

        setFormFields(temp)
        console.log(formFields)
    }

    const handleRemoveFormFieldRow = (formFieldId) => {
        if (formFields.length > 1){
            setFormFields(formFields => formFields.filter((formField, index) => index !== formFieldId))
        }
    }

    useEffect(() => {
        console.log("formField:", formFields)
    }, [formFields])

  return (
    <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-10 gap-4 text-center font-bold'>
            <div> </div>
            <div className='col-span-2'>Nama Obat</div>
            <div className='col-span-2'>Jumlah</div>
            <div className='col-span-2'>Harga per Obat</div>
            <div className='col-span-2'>Total Sub Harga</div>
            <div> Action </div>
        </div>
        {formFields && formFields.map((formField, index) => (
            <div key={index} className='grid grid-cols-10 gap-4'>
                <div className='flex justify-center'>{(index == formFields.length-1) && <Button onClick={(e) => handleAddFormFieldRow()}>+</Button>}</div>
                <div className='col-span-2'>
                    <SelectPicker
                        className='block w-full rounded-full px-4 border py-1.5 text-dark border-dark placeholder:text-gray-400 sm:text-base sm:leading-6'
                        id='name' 
                        appearance='subtle'
                        size='small'
                        name='name'
                        data={data} 
                        onSelect={(number, e) => handleMedicineChange(index, e.value)} 
                        block
                        cleanable={false}
                    />
                </div>
                <div className='col-span-2'>
                    <Input 
                        type="text" 
                        id="quantity" 
                        name="quantity" 
                        placeholder="Jumlah" 
                        value={formField.quantity}
                        onChange={(e) => handleMedicineQuantity(index, e.target.value)}
                    />
                </div>
                <div className='col-span-2'>
                    <Input type="text" id="price" name="price" placeholder="Harga Obat" value={formField.price} disabled/>
                </div>
                <div className='col-span-2'>
                    <Input type="text" id="subtotal" name="subtotal" placeholder="Total Harga Obat" value={formField.totalPrice} disabled/>
                </div>
                <div className='flex justify-center'>
                    <Button type="button" id="action" name="action" placeholder="action" size='medium' onClick={(e) => handleRemoveFormFieldRow(index)}/>
                </div>
            </div>
        ))}
    </div>
  )
}

export default PrescriptionForm