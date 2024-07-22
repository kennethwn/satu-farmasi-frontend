import Layout from "@/components/Layouts"
import ContentLayout from "@/components/Layouts/Content"
import { useUserContext } from "@/pages/api/context/UserContext";

export default function index() {
    const { user } = useUserContext();
    return (
        <Layout active="report-transaction" user={user}>
            <ContentLayout title="Laporan Transaksi">
                Halaman Laporan Transaksi
            </ContentLayout>
        </Layout>
    )
}