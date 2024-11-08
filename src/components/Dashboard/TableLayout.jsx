import { Panel } from "rsuite";
import { FaArrowRightLong } from "react-icons/fa6";
import propTypes from 'prop-types'

export default function TableLayout(props) {
    const {
        title = "List",
        children = <span>loading</span>,
        onClick
    } = props


    return (
        <Panel {...props} className="w-full" bordered shaded>
            <div className="flex flex-col w-full gap-y-6">
                <div className="flex flex-row w-full hover:cursor-pointer justify-between">
                    <span className="font-bold text-2xl">{title}</span>
                    <div className="flex flex-row gap-x-2 items-center justify-between" onClick={onClick}>
                        <span className="text-purple hover:underline font-bold">See All</span>
                        <FaArrowRightLong size={24} />
                    </div>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </Panel>
    )
}

TableLayout.propTypes = {
    title: propTypes.string,
    children: propTypes.node,
    onClick: propTypes.func,
}