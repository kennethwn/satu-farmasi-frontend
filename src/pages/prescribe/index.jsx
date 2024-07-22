import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/context/UserContext";

export default function index() {
  const { user } = useUserContext();
    return (
        <Layout active="prescribe" user={user}>
            <ContentLayout title="Resep">
                Halaman Prescribe
            </ContentLayout>
        </Layout>
    )
}