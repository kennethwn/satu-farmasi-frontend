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
  const { GetTotalMedicine, GetTotalNeedToRestockMedicine, CheckExpirationByDate } = useMedicineAPI();
  const { getOnProgressAndWaitingPaymentTransaction } = useTransaction();
  const { getMostSalesMedicineByPrescription } = usePrescription();
  const { user } = useUserContext();

  const [dataExp, setDataExp] = useState([]);
  const [dataTransaction, setDataTransaction] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(0);

  const [totalPatient, setTotalPatient] = useState(0);
  const [totalMedicine, setTotalMedicine] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalNeedToRestock, setTotalNeedToRestock] = useState(0);
  const [mostSalesMedicines, setMostSalesMedicines] = useState([]);

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

  const handleFetchRemainingTransaction = async () => {
    try {
      const response = await getOnProgressAndWaitingPaymentTransaction();
      if (response.code != 200) return;
      setDataTransaction(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleFetchTotalNeedToRestockMedicine = async () => {
    try {
      const response = await GetTotalNeedToRestockMedicine();
      if (response.code != 200) return;
      setTotalNeedToRestock(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleFetchMostSalesMedicinesByPrescription = async () => {
    try {
      const {firstDate, lastDate} = getFirstAndLastDateOfMonth(currentMonth);
      const payload = {startDate: firstDate, lastDate: lastDate};
      const response = await getMostSalesMedicineByPrescription(payload);
      if (response.code != 200) return;
      setMostSalesMedicines(response.data);
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
        await handleFetchRemainingTransaction();
        await handleFetchTotalNeedToRestockMedicine();
        await handleFetchMostSalesMedicinesByPrescription();
      }
    }
    fetchData();
  }, [router]);

  useEffect(() => {
    handleFetchMostSalesMedicinesByPrescription();
  }, [currentMonth]);

  return (
    <Layouts user={user}>
      <ContentLayout title={`Welcome, ${user?.name}`}>
        <DashboardView 
          dataCard={getDataCard(totalPatient, totalMedicine, formatRupiah(52000), totalNeedToRestock)}
          dataExpired={dataExp}
          dataTransaction={dataTransaction}
          dataMonthlyReport={mostSalesMedicines}
          setCurrentMonth={setCurrentMonth}
        />
      </ContentLayout>
    </Layouts>
  );
}
