import Layout from "@/components/Layouts"
import ContentLayout from "@/components/Layouts/Content"

export default function index() {
    return (
        <Layout active="report-transaction">
            <ContentLayout title="Laporan Transaksi">
                Halaman Laporan Transaksi
            </ContentLayout>
        </Layout>
    )
}