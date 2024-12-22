import Layout from "@/components/Layouts";
import ContentLayout from "@/components/Layouts/Content";
import TransactionDetail from "@/components/Modal/TransactionDetail";
import SearchBar from "@/components/SearchBar";
import { formatDateWithTime } from "@/helpers/dayHelper";
import prescriptionStatusMapped from "@/helpers/prescriptionStatusMap";
import { useUserContext } from "@/pages/api/context/UserContext";
import usePharmacy from "@/pages/api/pharmacy";
import useTransaction from "@/pages/api/transaction/transaction";
import { useEffect, useState } from "react";
import { PiListMagnifyingGlass } from "react-icons/pi";
import { toast } from "react-toastify";
import { Pagination, SelectPicker, Table, Tooltip, Whisper } from "rsuite";

export default function index() {
  const { user } = useUserContext();
  const { HeaderCell, Cell, Column } = Table;
  const { isLoading, getAllTransaction } = useTransaction();
  const { getPharmacyInfo } = usePharmacy();
  const prescriptionStatusMap = new Map(prescriptionStatusMapped)
  prescriptionStatusMap.delete("UNPROCESSED")
  prescriptionStatusMap.delete("CANCELED")
  const [statusUpdated, setStatusUpdated] = useState({})
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isListening, setIsListening] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState(-1);
  const [pharmacy, setPharmacy] = useState({});
  const [filterStatus, setFilterStatus] = useState("")

  const handleFetchTransactionData = async () => {
    try {
      const res = await getAllTransaction(search, limit, page, filterStatus);
      if (res.code !== 200) {
        toast.error(res.message, { autoClose: 2000, position: "top-center" });
        return;
      }
      setData(res.data.results);
      console.log(res.data.results);
      setTotalPage(res.data.total);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchPharmacyInfo = async () => {
    try {
      const res = await getPharmacyInfo();
      if (res.code !== 200) {
        setPharmacy({});
        return;
      }
      setPharmacy(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  const renderTooltip = (content) => (
    <Tooltip>
      {content}
    </Tooltip>
  )

  useEffect( () => {
    let newEvent
    if (!isListening) {
        newEvent = new EventSource(process.env.NEXT_PUBLIC_SATUFARMASI_EVENT_SOURCE_URL,  {withCredentials: true});
        console.log("subscribing")
        console.log(newEvent)

        newEvent.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event?.data);
                console.log(parsedData)// Append new data to the state
                setStatusUpdated(parsedData)
                if (parsedData.status === "WAITING_FOR_PAYMENT") {
                  toast.info(`New Transaction Created, Refresh to See New Transaction`, { autoClose: 2000, position: "top-right" });
                } else if (parsedData.status === "DONE") {
                  toast.info(`A Transaction Has Been Mark as Done, Refresh to See the Update`, { autoClose: 2000, position: "top-right" });
                }
            } catch (err) {
                console.error("Failed to parse data from SSE:", err);
            }
        };

        newEvent.onerror = (err) => {
            console.error("EventSource failed:", err);
            newEvent.close(); // Close the connection if error occurs
            setIsListening(false); // Reset to allow reconnection if necessary
        };

        setIsListening(true);
    }

    return () => {
        if (newEvent) {
            console.log("Closing connection");
            newEvent.close();
        }
    };
  }, []);

  useEffect(() => {
      console.log(openModal)
      console.log("selectedID:", selectedTransactionId)
  }, [openModal])

  useEffect(() => {
    const temp = [...data]
        console.log("statusUpdated: ", statusUpdated)
    temp.map(transaction => {
      if (transaction.prescription.id === statusUpdated.prescriptionId) {
        transaction.prescription.status = statusUpdated.status
      }
            console.log("transaction: ", transaction)
    })
    setData(temp)
  }, [statusUpdated])

  useEffect(() => {
    async function fetchData() {
        handleFetchTransactionData();
    }
    fetchData();
  }, [page, limit, search, filterStatus]);

  useEffect(() => {
    async function fetchData() {
      await handleFetchPharmacyInfo();
    }
    fetchData();
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search, limit])

  return (
    <Layout active="transaction-dashboard" user={user}>
      <ContentLayout title="Riwayat Transaksi">
        <div className="flex flex-row justify-end items-center w-full pb-6 gap-4">
        <SelectPicker
            style={{
                color: '#DDDDDD',       
                borderColor: '#DDDDDD', 
            }}
            label="Status"
            data={Array.from(prescriptionStatusMap.values()).map((status) => ({ label: status.label, value: status.value }))}
            value={filterStatus}
            onChange={(value) => {
                setFilterStatus(value);
                console.log(value);
            }}
        />   
          <SearchBar
            size="md"
            className="w-1/4"
            placeholder="Cari Nama Pasien ..."
            onChange={(value) => setSearch(value)}
          />
        </div>
        <div className="w-full h-[500px]">
          <Table
            data={data || []}
            bordered
            cellBordered
            shouldUpdateScroll={false}
            affixHorizontalScrollbar
            fillHeight={true}
            loading={isLoading}
          >
            <Column width={100} fixed="left">
              <HeaderCell className="text-center text-dark font-bold">
                No
              </HeaderCell>
              <Cell className="text-center text-dark">
                {(rowData, index) => index + 1}
              </Cell>
            </Column>

            <Column flexGrow={1}>
              <HeaderCell className="text-dark font-bold">
                ID Transaction
              </HeaderCell>
              <Cell dataKey="id" />
            </Column>

            <Column flexGrow={1} resizable>
                <HeaderCell className="text-dark font-bold">Timestamp</HeaderCell>
                <Cell className="text-dark">
                    {rowData => formatDateWithTime(rowData?.updated_at)}
                </Cell>
            </Column>

            <Column flexGrow={1}>
              <HeaderCell className="text-dark font-bold">
                Pasien
              </HeaderCell>
              <Cell dataKey="patient.name" />
            </Column>

            <Column flexGrow={1}>
              <HeaderCell className="text-dark font-bold">
                Farmasi
              </HeaderCell>
              <Cell dataKey="pharmacist.firstName" />
            </Column>

            <Column width={300}>
              <HeaderCell className="text-center text-dark font-bold">
                Status
              </HeaderCell>
              <Cell className="text-center">
                {(rowData) => {
                  return (
                    <div className="flex justify-center flex-row gap-6">
                      <p 
                        style={{ backgroundColor: prescriptionStatusMap.get(rowData.prescription.status)?.color }}
                        className="text-white font-bold rounded-lg w-3/4">
                          {prescriptionStatusMap.get(rowData.prescription.status)?.label}
                      </p>
                    </div>
                  );
                }}
              </Cell>
            </Column>

            <Column width={150} fixed="right">
              <HeaderCell className="text-center text-dark font-bold">
                Aksi
              </HeaderCell>
              <Cell className="text-center" style={{padding: '6px'}}>
                {(rowData) => {
                  return (
                    <div className="flex justify-center flex-row gap-6 items-center">
                      <Whisper speaker={renderTooltip("Lihat Detail")} placement="top" controlId="control-id-hover" trigger="hover">
                        <button className="inline-flex items-center justify-center w-8 h-8 text-center bg-transparent border-0 rounded-lg"
                          onClick={() => {
                              console.log(rowData.id);
                              setSelectedTransactionId(rowData.id);
                              setOpenModal(true);
                          }}>
                          <PiListMagnifyingGlass 
                            size='1.5em'
                          />
                        </button>
                      </Whisper>
                    </div>
                  );
                }}
              </Cell>
            </Column>
          </Table>
          <div className="pt-4">
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              maxButtons={5}
              size="xs"
              layout={["total", "-", "limit", "|", "pager"]}
              total={totalPage || 0}
              limitOptions={[3, 5, 10, 15]}
              limit={limit}
              activePage={page}
              onChangePage={(page) => setPage(page)}
              onChangeLimit={(limit) => setLimit(limit)}
            />
          </div>
        </div>
      </ContentLayout>

        <TransactionDetail
            user={user}
            pharmacy={pharmacy}
            statusUpdated={statusUpdated}
            transactionId={selectedTransactionId}
            openModal={openModal}
            setOpenModal={setOpenModal}
        />
    </Layout>
)}
