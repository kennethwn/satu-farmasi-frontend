import PrescriptionForm from "@/components/DynamicForms/PrescriptionForm";
import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useEffect, useState } from "react";

export default function index() {
    const [formFields, setFormFields] = useState([
        {
            medicineName: "",
            quantity: 0,
            price: 0,
            totalPrice: 0
        },
        {
            medicineName: "",
            quantity: 0,
            price: 0,
            totalPrice: 0
        },
    ])

    return (
        <Layout active="diagnose">
            <ContentLayout title="Diagnosis">
                <PrescriptionForm formFields={formFields} setFormField={setFormFields}></PrescriptionForm>
            </ContentLayout>
        </Layout>
    )
}