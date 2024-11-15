import formatDate from "@/helpers/dayHelper";
import Card from "./Card";
import TableLayout from "./TableLayout";
import { Table } from "rsuite";
import propTypes from "prop-types";
import Chart from "./Chart";
import { month } from "@/data/date";

export default function DashboardView(props) {
    const {Column, Cell, HeaderCell} = Table;
    const { dataCard, dataExpired, dataTransaction, dataMonthlyReport, setCurrentMonth, onChangeMonthlyReport, linkTransaction } = props;

    const TableExpired = (props) => (
        <Table {...props}>
            <Column flexGrow={1}>
                <HeaderCell className="text-dark">Medicine</HeaderCell>
                <Cell dataKey="name"/>
            </Column>
            <Column flexGrow={1}>
                <HeaderCell className="text-dark">Batch Id</HeaderCell>
                <Cell dataKey="code"/>
            </Column>
            <Column flexGrow={1}>
                <HeaderCell className="text-dark">Expire Date</HeaderCell>
                <Cell dataKey="expiredDate">
                    {rowData => formatDate(rowData?.expiredDate)}
                </Cell>
            </Column>
            <Column flexGrow={1}>
                <HeaderCell className="text-dark">Quantity</HeaderCell>
                <Cell dataKey="currStock"/>
            </Column>
        </Table>
    )

    const TableMedicineOrder = (props) => (
        <Table {...props}>
            <Column width={75}>
                <HeaderCell>Id</HeaderCell>
                <Cell dataKey="id"/>
            </Column>
            <Column flexGrow={1}>
                <HeaderCell>Patient</HeaderCell>
                <Cell dataKey="patient.name"/>
            </Column>
            <Column flexGrow={1}>
                <HeaderCell>Pharmacist</HeaderCell>
                <Cell dataKey="pharmacist.firstName"/>
            </Column>
            <Column flexGrow={1} resizable>
                <HeaderCell>Status</HeaderCell>
                <Cell dataKey="prescription.status">
                    {rowData => rowData?.prescription.status.replace(/_/g, " ")}
                </Cell>
            </Column>
        </Table>
    )

    // dummy bar chart
    const options = {
        chart: {
          type: "bar"
        },
        xaxis: {
          categories: month.map(item => (item.label).substring(0,3).toUpperCase())
        }
    }

    const series = [
        {
            name: 'sales',
            data: [30,40,35,50,49,60,70,91,125,93,89,63]
        },
        {
            name: 'revenue',
            data: [100, 150, 75, 66, 50, 51, 75, 97, 99, 93, 89, 63]
        },
    ]
    
    // dummy pie chart
    const pieOptions = {
        chart: {
            type: "donut"
        },
        series: dataMonthlyReport?.map(item => item?.quantity),
        labels: dataMonthlyReport?.map(item => item?.medicineName)
    }

    return (
        <div className="flex flex-col gap-y-8">
            {/* Card */}
            <div className="flex flex-col max-lg:gap-y-4 lg:flex-row gap-x-4 justify-between w-full">
                {dataCard?.map(item => {
                    return (
                        <Card
                            key={item.label}
                            colorbackground={item.colorBackground}
                            label={item.label}
                            value={item.value}
                            icon={item.icon}
                            link={item.link}
                            status={item.status}
                        />
                    )
                })}
            </div>
            <div className="flex flex-col max-lg:gap-y-4 lg:flex-row gap-x-4 w-full">
                <TableLayout title="Expiring List">
                    <TableExpired data={dataExpired} link="/master/medicine" />
                </TableLayout>
                <TableLayout title="Remaining Transaction" link="/transaction/dashboard">
                    <TableMedicineOrder data={dataTransaction}/>
                </TableLayout>
            </div>
            <div className="flex flex-col max-lg:gap-y-4 lg:flex-row gap-x-4 w-full">
                <Chart title="Annual Report" className="w-full lg:w-3/5" options={options} series={series} />
                <Chart title="Monthly Report" className="w-full lg:w-2/5" options={pieOptions} series={pieOptions.series} monthPicker setCurrentMonth={setCurrentMonth} />
            </div>
        </div>
    )
}

DashboardView.propTypes = {
    dataCard: propTypes.array,
    dataExpired: propTypes.array,
    setCurrentMonth: propTypes.func,
    dataTransaction: propTypes.array,
    dataMonthlyReport: propTypes.array,
    onChangeMonthlyReport: propTypes.func,
}