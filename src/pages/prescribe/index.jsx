import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";

export default function index() {
    return (
        <Layout active="prescribe">
            <ContentLayout title="Resep">
                Halaman Prescribe
            </ContentLayout>
        </Layout>
    )
}