import { FaArrowRight, FaBox, FaSyringe, FaUser, FaWallet } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { Button, Loader, Panel } from "rsuite";
import propTypes from 'prop-types'
import { useRouter } from "next/router";

export default function Card(props) {
    const {
        loading,
        type,
        valueObj,
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
                return null
        }
    }

    return (
        <Panel {...props} shaded bordered>
            <div className="w-full gap-y-8 max-lg:min-h-28 flex flex-col items-start justify-between">
                <div className="flex flex-row w-full gap-x-4 items-center">
                    {icon &&
                        <div className={`border p-1 rounded-full`}>
                            <div className={`${getColorBackground()} p-3 rounded-full`}>
                                {resolveIcon()}
                            </div>
                        </div>
                    }
                    <div className="flex flex-col w-full justify-start truncate items-start">
                        <span className="font-bold text-dark text-lg">{label}</span>
                        { status && <span className="text-green-500">{status}</span> }
                        {
                            !valueObj
                                ? <p className="font-extrabold text-dark truncate text-3xl">{value}</p>
                                :
                                    <div className="grid grid-cols-2 justify-evenly w-full">
                                        <div className="font-extrabold pt-2 text-md">
                                            <p>Nama</p>
                                            <p>Nomor SIA</p>
                                            <p>Alamat</p>
                                            <p>No. Telp</p>
                                            <p>Email</p>
                                        </div>
                                        <div className="">
                                            <p>: {valueObj?.name}</p>
                                            <p>: {valueObj?.pharmacyNum}</p>
                                            <p>: {valueObj?.address}</p>
                                            <p>: {valueObj?.phoneNum}</p>
                                            <p>: {valueObj?.email}</p>
                                        </div>
                                    </div>
                        }
                    </div>
                </div>
                {
                    link &&
                        <Button onClick={() => handleRoute(link)} style={{padding: 0}} appearance="link" color="green" className="max-lg:hidden items-start">Lihat Detail</Button>
                }
                <div className="lg:hidden flex w-full justify-end">
                    <FaArrowRight size={24} />
                </div>
            </div>
        </Panel>
    )
}

Card.propTypes = {
    loading: propTypes.bool,
    type: propTypes.string,
    colorbackground: propTypes.string,
    icon: propTypes.string,
    link: propTypes.string,
    label: propTypes.string,
    value: propTypes.number,
    status: propTypes.string,
    valueObj: propTypes.object,
}
