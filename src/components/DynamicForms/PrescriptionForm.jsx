import React, { useEffect } from 'react'
import Input from '../Input'
import Button from '../Button'
import Select from '../Select'

function PrescriptionForm(props) {
    const {
        formFields,
        setFormField
    } = props
    
    useEffect(() => {
        console.log(formFields)
        console.log(formFields.length)
    })

  return (
    <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-10 gap-4 text-center'>
            <div></div>
            <div className='col-span-2'>Nama Obat</div>
            <div className='col-span-2'>Jumlah</div>
            <div className='col-span-2'>Harga per Obat</div>
            <div className='col-span-2'>Total Sub Harga</div>
            <div>Action</div>
        </div>
        {formFields && formFields.map((formField, index) => (
            <div key={index} className='grid grid-cols-10 gap-4'>
                <div className='flex justify-center'>{(index == formFields.length-1) && <Button>+</Button>}</div>
                <div className='col-span-2'>
                    <Select type="select" id="name" name="name" placeholder="Nama Obat" value={formField.medicineName} />
                </div>
                <div className='col-span-2'>
                    <Input type="text" id="quantity" name="quantity" placeholder="Jumlah" />
                </div>
                <div className='col-span-2'>
                    <Input type="text" id="price" name="price" placeholder="Harga Obat" disabled/>
                </div>
                <div className='col-span-2'>
                    <Input type="text" id="subtotal" name="subtotal" placeholder="Total Harga Obat" disabled/>
                </div>
                <div className='flex justify-center'>
                    <Button type="button" id="action" name="action" placeholder="action" size='medium'>Remove</Button>
                </div>
            </div>
        ))}
    </div>
  )
}

export default PrescriptionForm