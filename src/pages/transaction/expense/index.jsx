import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/context/UserContext";

export default function index() {
    const { user } = useUserContext();
    return (
        <Layout active="transaction-expense" user={user}>
            <ContentLayout title="Pengeluaran Obat">
                Halaman Pengeluaran Obat
            </ContentLayout>
        </Layout>
    )
}