import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/context/UserContext";

export default function index() {
  const { user } = useUserContext();
    return (
        <Layout active="diagnose" user={user}>
            <ContentLayout title="Diagnosis">
                Halaman Diagnose
            </ContentLayout>
        </Layout>
    )
}