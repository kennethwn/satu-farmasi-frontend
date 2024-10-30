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
            <div className="w-full gap-y-8 max-lg:min-h-28 flex flex-col items-start justify-between">
                <div className="flex flex-row w-full justify-between">
                    <span className="font-bold w-full text-2xl">{title}</span>
                    {monthPicker && 
                        <Dropdown 
                            value={curMonth}
                            data={month?.map(item => ({label: item.label, value: item.id}))}
                            onChange={value => setCurMonth(value)}
                        />
                    }
                </div>
                <div className="w-full">
                    <ApexChart type={options?.chart?.type} options={options} series={series} height={300} width="100%" />
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
}