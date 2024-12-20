import Layouts from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "./api/context/UserContext";
import DashboardView from "@/components/Dashboard/DashboardView";
import formatDate, { convertToRFC3339 } from "@/helpers/dayHelper";
import { useEffect, useState } from "react";
import usePatientAPI from "./api/patient";
import getDataCard, { getDataProfit } from "@/data/dashboard";
import useMedicineAPI from "./api/master/medicine";
import { useRouter } from "next/router";
import { Button } from "rsuite";
import useTransaction from "./api/transaction/transaction";
import usePrescription from "./api/prescription";
import { formatRupiah } from "@/helpers/currency";
import getFirstAndLastDateOfMonth from "@/data/date";
import usePharmacy from "./api/pharmacy";

export default function Home() {
  const { getTotalPatient } = usePatientAPI();
  const { isLoading: medicineLoading, GetTotalMedicine, GetTotalNeedToRestockMedicine, CheckExpirationByDate } = useMedicineAPI();
  const { isLoading: transactionLoading, getOnProgressAndWaitingPaymentTransaction, getTransactionProfitByDate, getAnnualTransactionRecap } = useTransaction();
  const { isLoading: prescriptionLoading, getMostSalesMedicineByPrescription } = usePrescription();
  const { getPharmacyInfo } = usePharmacy();
  const { user } = useUserContext();

  const [dataExp, setDataExp] = useState([]);
  const [dataTransaction, setDataTransaction] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()+1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [dataPharmacy, setDataPharmacy] = useState({});
  const [totalPatient, setTotalPatient] = useState(0);
  const [totalMedicine, setTotalMedicine] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalNeedToRestock, setTotalNeedToRestock] = useState(0);
  const [mostSalesMedicines, setMostSalesMedicines] = useState([]);
  const [annualReport, setAnnualReport] = useState([]);

  const [loading, setLoading] = useState({
    totalPatient: false,
    totalMedicine: false,
    expiredMedicine: false,
    remainingTransaction: false,
    needToRestock: false,
    mostSalesMedicines: false,
    dailyProfit: false,
    annualReport: false,
  })

  const router = useRouter();

  const handleFetchTotalPatient = async () => {
    try {
      setLoading({...loading, totalPatient: true});
      const response = await getTotalPatient();
      if (response.code != 200) return;
      setTotalPatient(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading({...loading, totalPatient: true});
    }
  }
  
  const handleFetchTotalMedicine = async () => {
    try {
      setLoading({...loading, totalMedicine: true});
      const response = await GetTotalMedicine();
      if (response.code != 200) return;
      setTotalMedicine(response.data)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading({...loading, totalMedicine: false});
    }
  }

  const handleFetchExpiredMedicines = async () => {
    try {
      setLoading({...loading, expiredMedicine: true});
      const date = new Date;
      const response = await CheckExpirationByDate({expiredDate: date.toISOString()});
      if (response.code != 200) return;
        console.log("expired", response.data);
      setDataExp(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading({...loading, expiredMedicine: false});
    }
  }

  const handleFetchRemainingTransaction = async () => {
    try {
      setLoading({...loading, remainingTransaction: true});
      const response = await getOnProgressAndWaitingPaymentTransaction();
      if (response.code != 200) return;
      setDataTransaction(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading({...loading, remainingTransaction: false});
    }
  }

  const handleFetchTotalNeedToRestockMedicine = async () => {
    try {
      setLoading({...loading, needToRestock: true});
      const response = await GetTotalNeedToRestockMedicine();
      if (response.code != 200) return;
      setTotalNeedToRestock(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading({...loading, needToRestock: false});
    }
  }

  const handleFetchMostSalesMedicinesByPrescription = async () => {
    try {
      setLoading({...loading, mostSalesMedicines: true});
      const {firstDate, lastDate} = getFirstAndLastDateOfMonth(currentMonth);
      const payload = {startDate: firstDate, lastDate: lastDate};
      const response = await getMostSalesMedicineByPrescription(payload);
      if (response.code != 200) return;
      setMostSalesMedicines(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading({...loading, mostSalesMedicines: false});
    }
  }

  const handleFetchDailyProfit = async () => {
    try {
      setLoading({...loading, dailyProfit: true});
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
    } finally {
      setLoading({...loading, dailyProfit: false});
    }
  }

  const handleFetchAnnualReport = async () => {
    try {
      setLoading({...loading, annualReport: true});
      const payload = {year: currentYear}
      const response = await getAnnualTransactionRecap(payload);
      if (response.code != 200) return;
      setAnnualReport(response.data?.map(item => ({
        month: parseInt(item.month),
        sales: item.sales,
        revenue: item.revenue
      })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading({...loading, annualReport: false});
    }
  }

  const handleFetchPharmacy = async () => {
    try {
      const response = await getPharmacyInfo();
      if (response.code != 200) return;
      setDataPharmacy(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (router.isReady) {
        await handleFetchPharmacy();
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
      <ContentLayout title={`Selamat Datang, ${user?.name}`}>
        <DashboardView 
          loading={loading}
          dataPharmacy={dataPharmacy}
          dataCard={getDataCard(totalPatient, totalMedicine, totalNeedToRestock)}
          dataProfit={getDataProfit(formatRupiah(totalProfit))}
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
