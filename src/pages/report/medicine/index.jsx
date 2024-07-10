import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";

export default function index() {
    return (
        <Layout active="report-medicine">
            <ContentLayout title="Laporan Obat">
                Halaman Laporan Obat
            </ContentLayout>
        </Layout>
    )
}