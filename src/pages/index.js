import Layouts from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "./api/context/UserContext";
import DashboardView from "@/components/Dashboard/DashboardView";
import formatDate, { convertToRFC3339 } from "@/helpers/dayHelper";
import { useEffect, useState } from "react";
import usePatientAPI from "./api/patient";
import getDataCard from "@/data/dashboard";
import useMedicineAPI from "./api/master/medicine";
import { useRouter } from "next/router";
import { Button } from "rsuite";
import useTransaction from "./api/transaction/transaction";
import usePrescription from "./api/prescription";
import { formatRupiah } from "@/helpers/currency";
import getFirstAndLastDateOfMonth from "@/data/date";

export default function Home() {
  const { getTotalPatient } = usePatientAPI();
  const { GetTotalMedicine, GetTotalNeedToRestockMedicine, CheckExpirationByDate } = useMedicineAPI();
  const { getOnProgressAndWaitingPaymentTransaction, getTransactionProfitByDate, getAnnualTransactionRecap } = useTransaction();
  const { getMostSalesMedicineByPrescription } = usePrescription();
  const { user } = useUserContext();

  const [dataExp, setDataExp] = useState([]);
  const [dataTransaction, setDataTransaction] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()+1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [totalPatient, setTotalPatient] = useState(0);
  const [totalMedicine, setTotalMedicine] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalNeedToRestock, setTotalNeedToRestock] = useState(0);
  const [mostSalesMedicines, setMostSalesMedicines] = useState([]);
  const [annualReport, setAnnualReport] = useState([]);

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

  const handleFetchDailyProfit = async () => {
    try {
      const today = new Date()
      const startDate = convertToRFC3339(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0));
      const lastDate = convertToRFC3339(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));
      const payload = {
        startDate,
        lastDate,
      };
      const response = await getTransactionProfitByDate(payload);
      if (response.code != 200) return;
      setTotalProfit(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleFetchAnnualReport = async () => {
    try {
      const payload = {year: currentYear}
      const response = await getAnnualTransactionRecap(payload);
      if (response.code != 200) return;
      setTotalProfit(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (router.isReady) {
        await handleFetchDailyProfit();
        await handleFetchAnnualReport();
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

  useEffect(() => {
    handleFetchAnnualReport();
  }, [currentYear]);

  return (
    <Layouts user={user}>
      <ContentLayout title={`Welcome, ${user?.name}`}>
        <DashboardView 
          dataCard={getDataCard(totalPatient, totalMedicine, formatRupiah(totalProfit), totalNeedToRestock)}
          dataExpired={dataExp}
          dataTransaction={dataTransaction}
          dataMonthlyReport={mostSalesMedicines}
          dataAnnualReport={annualReport}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />
      </ContentLayout>
    </Layouts>
  );
}
