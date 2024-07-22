import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/context/UserContext";

export default function index() {
    const { user } = useUserContext();
    return (
        <Layout active="master-packaging" user={user}>
            <ContentLayout title="List Kemasan">
                Halaman Packaging
            </ContentLayout>
        </Layout>
    )
}