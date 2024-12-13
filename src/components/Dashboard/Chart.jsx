import { Panel } from "rsuite";
import { month } from "@/data/date";
import { useEffect, useState } from "react";
import propTypes from 'prop-types'
import Dropdown from "../SelectPicker/Dropdown";

import dynamic from 'next/dynamic';
import { generateYearList } from "@/helpers/dayHelper";
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Chart({
    title = "Chart",
    options = {},
    series = [],
    monthPicker = false,
    yearPicker = false,
    className = "",
    report,
    setCurrentMonth,
    setCurrentYear,
    description,
    ...props
}) {

    const [curMonth, setCurMonth] = useState(new Date().getMonth()+1);
    const [curYear, setCurYear] = useState(new Date().getFullYear());
    const [yearList, setYearList] = useState([]);

    const getCurrentDate = () => {
        const date = new Date();
        const month = date.getMonth()+1;
        const year = date.getFullYear();
        setCurMonth(month);
        setCurYear(year);
    }

    const getYearList = () => {
        const list = generateYearList(2000, new Date().getFullYear());
        console.log(list);
        setYearList(list);
    }

    useEffect(() => {
        getCurrentDate();
    }, []);
    
    useEffect(() => {
        getYearList();
    }, []);

    return (
        <Panel {...props} className={`overflow-auto ${className}`} bordered shaded>
            <div className="w-full gap-y-8 max-lg:min-h-28 flex flex-col">
                <div className="flex flex-row w-full justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <span className="font-bold text-2xl">{title}</span>
                        <span className="font-extralight text-gray-500 text-md">{description}</span>
                    </div>
                    {yearPicker && 
                        <Dropdown 
                            value={curYear}
                            className="w-[10rem]"
                            placement="topEnd"
                            data={yearList}
                            onChange={value => {
                                setCurYear(value);
                                setCurrentYear(value);
                            }}
                            cleanable={false}
                        />
                    }
                    {monthPicker && 
                        <Dropdown 
                            value={curMonth}
                            className="w-[10rem]"
                            placement="topEnd"
                            data={month?.map(item => ({label: item.label, value: item.id}))}
                            onChange={value => {
                                setCurMonth(value);
                                setCurrentMonth(value);
                            }}
                            cleanable={false}
                        />
                    }
                </div>
                <div className="w-full justify-center items-center h-full">
                    {series.length > 0 ? 
                        <ApexChart type={options?.chart?.type} options={options} series={series} height={300} width="100%" />
                        : <div className="text-center">No data found</div>
                    }
                </div>
            </div>
        </Panel>
    )
}

Chart.propTypes = {
    title: propTypes.string,
    type: propTypes.string,
    monthPicker: propTypes.bool,
    yearPicker: propTypes.bool,
    options: propTypes.object,
    series: propTypes.array,
    className: propTypes.string,
    report: propTypes.node,
    setCurrentMonth: propTypes.func,
    setCurrentYear: propTypes.func,
    description: propTypes.string,
}
