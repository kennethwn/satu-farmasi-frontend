import React from 'react'
import { SelectPicker } from 'rsuite'
import Input from '../Input';

function PatientForm(props) {
    const {
        selectedPatient,
        setSelectedPatient,
        patientDropdownOptions
    } = props

    const styles = {
        display: 'block',
        width: '100%',
        borderRadius: '9999px',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        borderWidth: '1px',
        paddingTop: '0.375rem',
        paddingBottom: '0.375rem',
        color: 'var(--color-dark)',
        borderColor: 'var(--color-dark)',
        '::placeholder': {
            color: 'var(--color-gray-400)',
        },
        fontSize: '1rem',
        lineHeight: '1.5rem',
    };

    const data = patientDropdownOptions.map(item => ({label: item.credentialNumber + " - " + item.name, value: item.id}))

    const handlePatientChange = (patientId) => {
        setSelectedPatient({
            ...selectedPatient,
            patientId: patientId,
            patientName: patientDropdownOptions[patientId-1].name,
            credentialNum: patientDropdownOptions[patientId-1].credentialNumber,
            phoneNum: patientDropdownOptions[patientId-1].phoneNum
        })
    }

  return (
    <>
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
                <p> Nama Pasien </p>
                <div className='col-span-2'>
                    <SelectPicker
                        style={styles}
                        id='name' 
                        appearance='subtle'
                        size='small'
                        name='name'
                        data={data} 
                        onChange={(value) => handlePatientChange(value)}
                        value={selectedPatient.patientId}
                        block
                        cleanable={false}
                    />
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <p> Credential Number </p>
                <Input type="text" id="name" name="name" onChange={(e) => setInput(e.target.value)} placeholder="name" value={selectedPatient.credentialNum} 
                    disabled={selectedPatient.patientId !== -1}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <p> No Handphone </p>
                <Input type="text" id="name" name="name" onChange={(e) => setInput(e.target.value)} placeholder="name" value={selectedPatient.phoneNum}
                    disabled={selectedPatient.patientId !== -1}
                />
            </div>
        </div>
    </>
  )
}

export default PatientForm