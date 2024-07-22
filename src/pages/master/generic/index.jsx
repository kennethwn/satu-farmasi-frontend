import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "@/context/UserContext";

export default function index() {
  const { user } = useUserContext();
    return (
        <Layout active="master-generic" user={user}>
            <ContentLayout title="List Generik">
                Halaman Generik
            </ContentLayout>
        </Layout>
    )
}