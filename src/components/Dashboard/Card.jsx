import { FaArrowRight, FaBox, FaSyringe, FaUser, FaWallet } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { Button, Panel } from "rsuite";
import propTypes from 'prop-types'
import { useRouter } from "next/router";

export default function Card(props) {
    const {
        colorbackground,
        icon,
        link,
        label,
        value,
        status
    } = props;

    const route = useRouter();

    const handleRoute = (page) => {
        route.push(page);
    }

    const getColorBackground = () => {
        switch (colorbackground) {
            case 'red':
                return 'bg-danger';
            case 'green':
                return 'bg-success';
            case 'yellow':
                return 'bg-warning';
            case 'purple':
                return 'bg-purple';
            default:
                return null;
        }
    }

    const resolveIcon = () => {
        switch (icon) {
            case 'person':
                return <FaUser color="white" size={24} />
            case 'medicine':
                return <FaSyringe color="white" size={24} />
            case 'profit':
                return <FaWallet color="white" size={24} />
            case 'stock':
                return <FaBox color="white" size={24} />
            default:
                return <IoMdPeople color="white" size={36} />
        }
    }

    return (
        <Panel {...props} shaded className="w-full" bordered>
            <div className="w-full gap-y-8 max-lg:min-h-28 flex flex-col items-start justify-between">
                <div className="flex flex-row w-full gap-x-4 items-center">
                    <div className={`border p-1 rounded-full`}>
                        <div className={`${getColorBackground()} p-3 rounded-full`}>
                            {resolveIcon()}
                        </div>
                    </div>
                    <div className="flex flex-col w-full justify-start items-start">
                        <span className="font-bold text-dark text-lg">{label}</span>
                        { status && <span className="text-green-500">{status}</span> }
                        <span className="font-extrabold text-dark text-3xl">{value}</span>
                    </div>
                </div>
                <Button onClick={() => handleRoute(link)} style={{padding: 0}} appearance="link" color="green" className="max-lg:hidden items-start">See Details</Button>
                <div className="lg:hidden flex w-full justify-end">
                    <FaArrowRight size={24} />
                </div>
            </div>
        </Panel>
    )
}

Card.propTypes = {
    colorbackground: propTypes.string,
    icon: propTypes.string,
    link: propTypes.string,
    label: propTypes.string,
    value: propTypes.number,
    status: propTypes.string
}