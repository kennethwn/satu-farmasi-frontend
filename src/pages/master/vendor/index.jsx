import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/pages/api/context/UserContext";

export default function index() {
    const { user } = useUserContext();
    return (
        <Layout active="master-vendor" user={user}>
            <ContentLayout title="List Vendor">
                Halaman Vendor
            </ContentLayout>
        </Layout>
    )
}