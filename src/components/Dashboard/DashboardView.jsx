import formatDate from "@/helpers/dayHelper";
import Card from "./Card";
import TableLayout from "./TableLayout";
import { Table } from "rsuite";
import propTypes from "prop-types";
import Chart from "./Chart";
import { month } from "@/data/date";
import { formatRupiah } from "@/helpers/currency";

export default function DashboardView(props) {
    const {Column, Cell, HeaderCell} = Table;
    const { 
        dataCard, 
        dataExpired, 
        dataTransaction, 
        dataMonthlyReport, 
        dataAnnualReport,
        setCurrentMonth, 
        setCurrentYear, 
        onChangeMonthlyReport, 
        linkTransaction,
    } = props;

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

    // bar chart
    const options = {
        chart: {
          type: "bar"
        },
        xaxis: {
          categories: month.map(item => (item.label).substring(0,3).toUpperCase())
        },
        yaxis: [
            {
                title: {
                    text: 'Sales',
                },
                min: 0,
                max: 200,
                labels: {
                    formatter: function (value) {
                        return value.toFixed(0); // Format angka biasa untuk Sales
                    },
                },
            },
            {
                opposite: true,
                title: {
                    text: 'Revenue',
                },
                min: 0,
                max: 200000000,
                labels: {
                    formatter: function (value) {
                        return formatRupiah(value);
                    },
                },
            },
        ],
        plotOptions: {
            bar: {
                dataLabels: {
                    position: 'top',
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            y: {
                formatter: function (value, { seriesIndex }) {
                    if (seriesIndex === 1) {
                        return formatRupiah(value);
                    }
                    return value.toString();
                },
            },
        },
        legend: {
            position: 'bottom',
        },
    }

    const series = [
        {
            name: 'sales',
            data: dataAnnualReport?.map(item => item?.sales)
        },
        {
            name: 'revenue',
            data: dataAnnualReport?.map(item => item?.revenue)
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
                <TableLayout title="Expiring List" link="/master/medicine">
                    <TableExpired data={dataExpired} />
                </TableLayout>
                <TableLayout title="Remaining Transaction" link="/transaction/dashboard">
                    <TableMedicineOrder data={dataTransaction}/>
                </TableLayout>
            </div>
            <div className="flex pb-6 flex-col max-lg:gap-y-4 lg:flex-row gap-x-4 w-full">
                <Chart title="Annual Report" className="w-full lg:w-3/5" options={options} series={series} yearPicker setCurrentYear={setCurrentYear} />
                <Chart title="Monthly Report" description="Top 3 Best-Selling Medicines" className="w-full lg:w-2/5" options={pieOptions} series={pieOptions.series} monthPicker setCurrentMonth={setCurrentMonth} />
            </div>
        </div>
    )
}

DashboardView.propTypes = {
    dataCard: propTypes.array,
    dataExpired: propTypes.array,
    setCurrentYear: propTypes.func,
    setCurrentMonth: propTypes.func,
    dataTransaction: propTypes.array,
    dataMonthlyReport: propTypes.array,
    dataAnnualReport: propTypes.array,
    onChangeMonthlyReport: propTypes.func,
}