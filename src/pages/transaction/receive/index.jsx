import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/pages/api/context/UserContext";

export default function index() {
    const { user } = useUserContext();
    return (
        <Layout active="transaction-receive" user={user}>
            <ContentLayout title="Penerimaan Obat">
                Halaman Penerimaan Obat
            </ContentLayout>
        </Layout>
    )
}