import React, { useEffect, useState } from 'react'
import InputField from '../Input';
import usPatientAPI from '@/pages/api/patient';
import Dropdown from '../SelectPicker/Dropdown';
import usePatientAPI from '@/pages/api/patient';

function PatientForm(props) {
    const {
        selectedPatient,
        setSelectedPatient,
        existingPatient,
        errors,
        setErrors,
    } = props

    const { getPatientDropdownOptions } = usePatientAPI();
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
            credentialNum: credentialNum?.replace(/[^0-9]/g, ''),
        })
    }
    
    const handlePhoneNumChange = (phoneNum) => {
        setSelectedPatient({
            ...selectedPatient,
            phoneNum: phoneNum?.replace(/[^0-9]/g, ''),
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
                    <Dropdown
                        id='name'
                        size='lg'
                        name='name'
                        data={data} 
                        onChange={(value) => {
                            handlePatientChange(value)
                            setErrors({ ...errors, "prescription.patient.patientId": "" })
                        }}
                        value={selectedPatient.patientId}
                        block
                        cleanable={false}
                        error={errors["prescription.patient.patientId"]}
                    />
                    : 
                    <InputField 
                        type="text" 
                        id="name" name="name" 
                        onChange={(e) => {
                            handleNameChange(e.target.value)
                        setErrors({ ...errors, "prescription.patient.patientName": "" })
                        }} 
                        placeholder="name" 
                        error={errors["prescription.patient.patientName"]}
                        value={selectedPatient.PatientName} 
                    />
                    }
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <p> Credential Number </p>
                <InputField 
                    type="text" 
                    id="name" name="name" 
                    onChange={(e) => {
                        handleCredentialNumChange(e.target.value)
                        setErrors({ ...errors, "prescription.patient.credentialNum": "" })
                    }} 
                    placeholder="credential number" 
                    value={selectedPatient.credentialNum} 
                    error={errors["prescription.patient.credentialNum"]}
                    disabled={existingPatient}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <p> No Handphone </p>
                <InputField 
                    type="text" 
                    id="name" 
                    name="name" 
                    onChange={(e) => {
                        handlePhoneNumChange(e.target.value)
                        setErrors({ ...errors, "prescription.patient.phoneNum": "" })
                    }} 
                    placeholder="no handphone" 
                    error={errors["prescription.patient.phoneNum"]}
                    value={selectedPatient.phoneNum}
                    disabled={existingPatient}
                />
            </div>
        </div>
    </>
  )
}

export default PatientForm