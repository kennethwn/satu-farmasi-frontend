import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";

export default function index() {
    return (
        <Layout active="master-medicine">
            <ContentLayout title="List Obat">
                Halaman Master Obat
            </ContentLayout>
        </Layout>
    )
}