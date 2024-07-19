import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/context/UserContext";

export default function index() {
    const { user } = useUserContext();
    return (
        <Layout active="master-classification" user={user}>
            <ContentLayout title="List Klasifikasi">
                Halaman Master Klasifikasi
            </ContentLayout>
        </Layout>
    )
}