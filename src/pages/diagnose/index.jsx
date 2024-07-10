import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";

export default function index() {
    return (
        <Layout active="diagnose">
            <ContentLayout title="Diagnosis">
                Halaman Diagnose
            </ContentLayout>
        </Layout>
    )
}