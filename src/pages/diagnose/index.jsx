import PrescriptionForm from "@/components/DynamicForms/PrescriptionForm";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useEffect, useState } from "react";
import useMedicineDropdownOption from "../api/medicineDropdownOption";

export default function index() {
    const [formFields, setFormFields] = useState([
        {   
            medicineId: 0,
            medicineName: "",
            quantity: 0,
            price: 0,
            totalPrice: 0
        }
    ])
    const { getMedicineDropdownOptions } = useMedicineDropdownOption();
    const [medicineDropdownOptions, setMedicineDropdownOptions] = useState([])

    useEffect(() => {
        async function fetchMedicineDropdownOptionsData(){
            try {
                const response = await getMedicineDropdownOptions()
                setMedicineDropdownOptions(response.data)
            } catch (error) {
                console.log("error #getMedicineOptions")
            }
        }
        fetchMedicineDropdownOptionsData()
    }, [])

    return (
        <Layout active="diagnose">
            <ContentLayout title="Diagnosis">
                <PrescriptionForm 
                    medicineDropdownOptions={medicineDropdownOptions} 
                    formFields={formFields} 
                    setFormFields={setFormFields}
                    // handleAddFormFieldRow={handleAddFormFieldRow}
                    // handleMedicineChange={handleMedicineChange}
                    // handleRemoveFormFieldRow={handleRemoveFormFieldRow}
                />
            </ContentLayout>
        </Layout>
    )
}