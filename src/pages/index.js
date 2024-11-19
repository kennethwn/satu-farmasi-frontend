import Layouts from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "./api/context/UserContext";
import DashboardView from "@/components/Dashboard/DashboardView";
import formatDate from "@/helpers/dayHelper";
import { useEffect, useState } from "react";
import usePatientAPI from "./api/patient";
import getDataCard from "@/data/dashboard";
import useMedicineAPI from "./api/master/medicine";
import { useRouter } from "next/router";
import { Button } from "rsuite";

export default function Home() {
  const { getTotalPatient } = usePatientAPI();
  const { GetTotalMedicine, CheckExpirationByDate } = useMedicineAPI();
  const { user } = useUserContext();

  const [dataExp, setDataExp] = useState([]);

  const [totalPatient, setTotalPatient] = useState(0);
  const [totalMedicine, setTotalMedicine] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalOutOfStock, setTotalOfStock] = useState(0);

  const router = useRouter();

  const handleFetchTotalPatient = async () => {
    try {
      const response = await getTotalPatient();
      if (response.code != 200) return;
      setTotalPatient(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  
  const handleFetchTotalMedicine = async () => {
    try {
      const response = await GetTotalMedicine();
      if (response.code != 200) return;
      setTotalMedicine(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  const handleFetchExpiredMedicines = async () => {
    try {
      const date = new Date;
      const response = await CheckExpirationByDate({expiredDate: date.toISOString()});
      if (response.code != 200) return;
      setDataExp(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (router.isReady) {
        await handleFetchTotalPatient();
        await handleFetchTotalMedicine();
        await handleFetchExpiredMedicines();
      }
    }
    fetchData();
  }, [router]);

  return (
    <Layouts user={user}>
      <ContentLayout title={`Welcome, ${user?.name}`}>
        {/* <Button onClick={printPDF}>cek pdf</Button> */}
        <DashboardView dataCard={getDataCard(totalPatient, totalMedicine, 52, 93)} dataExpired={dataExp} />
      </ContentLayout>
    </Layouts>
  );
}
