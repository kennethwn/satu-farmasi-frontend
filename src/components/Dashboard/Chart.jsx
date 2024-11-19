import { Panel } from "rsuite";
import { month } from "@/data/date";
import { useEffect, useState } from "react";
import propTypes from 'prop-types'
import Dropdown from "../SelectPicker/Dropdown";

import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Chart({
    title = "Chart",
    options = {},
    series = [],
    monthPicker = false,
    className = "",
    report,
    setCurrentMonth,
    ...props
}) {

    const [curMonth, setCurMonth] = useState(0);

    const getCurrentMonth = () => {
        const date = new Date();
        const month = date.getMonth()+1;
        setCurMonth(month);
    }

    useEffect(() => {
        getCurrentMonth();
    }, [month]);

    return (
        <Panel {...props} className={`overflow-auto ${className}`} bordered shaded>
            <div className="w-full gap-y-8 max-lg:min-h-28 flex flex-col">
                <div className="flex flex-row w-full justify-between items-start">
                    <span className="font-bold w-full text-2xl">{title}</span>
                    {monthPicker && 
                        <Dropdown 
                            value={curMonth}
                            data={month?.map(item => ({label: item.label, value: item.id}))}
                            onChange={value => {
                                setCurMonth(value);
                                console.log("monthid: ", value)
                                setCurrentMonth(value);
                            }}
                        />
                    }
                </div>
                <div className="w-full justify-center items-center h-full">
                    {series.length > 0 ? 
                        <ApexChart type={options?.chart?.type} options={options} series={series} height={300} width="100%" />
                        : <div className="text-center">no data</div>
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
    options: propTypes.object,
    series: propTypes.array,
    className: propTypes.string,
    report: propTypes.node,
    setCurrentMonth: propTypes.func,
}