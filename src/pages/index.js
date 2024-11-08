import { Inter } from "next/font/google";
import Layouts from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import { useUserContext } from "./api/context/UserContext";
import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts";
import DashboardView from "@/components/Dashboard/DashboardView";
import formatDate from "@/helpers/dayHelper";
import { useEffect, useState } from "react";
import usePatientAPI from "./api/patient";
import getDataCard from "@/data/dashboard";
import useMedicineAPI from "./api/master/medicine";
import { useRouter } from "next/router";
import useTransaction from "./api/transaction/transaction";
import { formatRupiah } from "@/helpers/currency";
import usePrescription from "./api/prescription";
import getFirstAndLastDateOfMonth from "@/data/date";

const inter = Inter({ subsets: ["latin"] });
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  function printPDF() {
    var docDefinition = {
      info: {
        title: 'awesome Document',
        author: 'john doe',
        subject: 'subject of document',
        keywords: 'keywords for document',
      },
      content: [
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '*', 'auto', 100, '*' ],
    
            body: [
              [ 'First', 'Second', 'Third', 'The last one' ],
              [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
              [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
            ]
          }
        }
      ]
    };

    pdfMake.createPdf(docDefinition).open();
  }

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
