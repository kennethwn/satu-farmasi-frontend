import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/context/UserContext";

export default function index() {
    const { user } = useUserContext();
    return (
        <Layout active="report-medicine" user={user}>
            <ContentLayout title="Laporan Obat">
                Halaman Laporan Obat
            </ContentLayout>
        </Layout>
    )
}