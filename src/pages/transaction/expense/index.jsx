import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";

export default function index() {
    return (
        <Layout active="transaction-expense">
            <ContentLayout title="Pengeluaran Obat">
                Halaman Pengeluaran Obat
            </ContentLayout>
        </Layout>
    )
}