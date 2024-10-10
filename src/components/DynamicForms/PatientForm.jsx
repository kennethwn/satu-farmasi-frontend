import React, { useEffect, useState } from 'react'
import { SelectPicker } from 'rsuite'
import Input from '../Input';
import usePatientDropdownOption from '@/pages/api/patientDropdownOption';

function PatientForm(props) {
    const {
        selectedPatient,
        setSelectedPatient,
        existingPatient
    } = props

    const { getPatientDropdownOptions } = usePatientDropdownOption();
    const [patientDropdownOptions, setPatientDropdownOptions] = useState([])

    const data = Object.entries(patientDropdownOptions).map(([key, patient]) => ({
        label: patient.credentialNumber + " - " + patient.name, 
        value: parseInt(key)
    }))

    useEffect(() => {
        async function fetchPatientDropdownOptionsData(){
            try {
                const response = await getPatientDropdownOptions()
                setPatientDropdownOptions(response)
            } catch (error) {
                console.log("error #getPatientOptions")
            }
        }
        fetchPatientDropdownOptionsData()
    }, [])

    useEffect(() => {
        console.log(selectedPatient)
    }, [selectedPatient])

    const handlePatientChange = (patientId) => {
        setSelectedPatient({
            ...selectedPatient,
            patientId: patientId,
            patientName: patientDropdownOptions[patientId].name,
            credentialNum: patientDropdownOptions[patientId].credentialNumber,
            phoneNum: patientDropdownOptions[patientId].phoneNum
        })
    }

    const handleNameChange = (patientName) => {
        setSelectedPatient({
            ...selectedPatient,
            patientName: patientName,
        })
    }

    const handleCredentialNumChange = (credentialNum) => {
        setSelectedPatient({
            ...selectedPatient,
            credentialNum: credentialNum,
        })
    }
    
    const handlePhoneNumChange = (phoneNum) => {
        setSelectedPatient({
            ...selectedPatient,
            phoneNum: phoneNum,
        })
    }

    useEffect(() => {
        setSelectedPatient({
            patientId: -1,
            patientName: "",
            credentialNum: "",
            phoneNum: ""
        })
    }, [existingPatient])

  return (
    <>
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
                <p> Nama Pasien </p>
                <div className='col-span-2'>
                    {existingPatient ? 
                    <SelectPicker
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
                    : 
                    <Input type="text" id="name" name="name" onChange={(e) => handleNameChange(e.target.value)} placeholder="name" value={selectedPatient.PatientName} />
                    }
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <p> Credential Number </p>
                <Input type="text" id="name" name="name" onChange={(e) => handleCredentialNumChange(e.target.value)} placeholder="name" value={selectedPatient.credentialNum} 
                    disabled={existingPatient}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <p> No Handphone </p>
                <Input type="text" id="name" name="name" onChange={(e) => handlePhoneNumChange(e.target.value)} placeholder="name" value={selectedPatient.phoneNum}
                    disabled={existingPatient}
                />
            </div>
        </div>
    </>
  )
}

export default PatientForm