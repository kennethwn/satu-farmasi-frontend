import React, { useState } from 'react';
import { Container, Sidebar, Sidenav, Content, Nav } from 'rsuite';
import { MdDashboard as DashboardIcon } from "react-icons/md";
import { LuHistory as TransactionIcon } from "react-icons/lu";
import { RiLineChartLine as ReportIcon } from "react-icons/ri";
import GroupIcon from '@rsuite/icons/legacy/Group';
import NavToggle from './NavToggle';
import Button from '../Button';
import PrescribeIcon from '../Icons/PrescribeIcon';
import propTypes from 'prop-types';
import { useRouter } from 'next/router';
import useUser from '@/pages/api/user';
import Toaster from "@/components/Modal/Toaster";
import Image from 'next/image';

export default function Layout(props) {
    const {
        user,
        active = 'dashboard',
    } = props;

    const { deleteUser } = useUser()
    const router = useRouter();
    const [activeKey, setActiveKey] = useState(active);
    const [expand, setExpand] = useState(true);
    const [error, setError] = useState(null);
    const userRole = user?.role?.toLowerCase();
    const [askForLogout, setAskForLogout] = useState(false);


    const logoutHandler = async () => {
        try {
            const response = await deleteUser();
            typeof response === "string" ? router.push("/auth/login") : setError(response.message);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    const iconStyle = {
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "midle",
        marginRight: "20px",
        top: "15px",
        left: "20px",
        position: "absolute",
    };

    const renderIcon = (icon, isActive) => {
        const color = isActive ? '#659BB0' : '#333333';
        let firstIconName = typeof icon === "string" ? icon.split("-")[0] : null;
        switch (firstIconName) {
            case "dashboard":
                return <DashboardIcon size="1.2em" style={{ ...iconStyle, color: color }} />;
            case "diagnose":
                return <PrescribeIcon stroke={color} style={{ ...iconStyle, color: color }} />;
            case "prescription":
                return <PrescribeIcon stroke={color} style={{ ...iconStyle, color: color }} />;
            case "transaction":
                return <TransactionIcon size="1.2em" style={{ ...iconStyle, color: color }} />;
            case "report":
                return <ReportIcon size="1.2em" style={{ ...iconStyle, color: color }} />;
            case "master":
                return <GroupIcon size="1.2em" style={{ ...iconStyle, color: color }} />;
            default:
                return null;
        }
    };

    const renderTitle = (title, type, isActive) => {
        let color = ""
        if (isActive) {
            color = '#659BB0';
        } else if (expand || type === 'child') {
            color = '#333333';
        }
        return <span style={{ color: color, paddingLeft: `${type === 'child' && '12px'}` }}>{title}</span>;
    }

    return (
        <Container className='fixed top-0 left-0 w-screen h-screen'>
            <Sidebar
                className="h-screen z-30 bg-background-sidebar shadow-md flex flex-col"
                width={expand ? 240 : 56}
                collapsible
            >
                <Sidenav.Header>
                    <div className='p-[18px] overflow-hidden h-14 whitespace-nowrap'>
                        {expand
                            ? <img src="/satufarmasi-logo.svg" alt="logo" className="h-full" />
                            : <span className='text-2xl font-extrabold text-dark'>SF</span>
                        }
                    </div>
                </Sidenav.Header>
                <Sidenav 
                    className={`flex-grow ${expand && "overflow-auto"} bg-background-sidebar`}
                    expanded={expand} 
                    appearance="subtle"
                >
                    <Sidenav.Body>
                        <Nav defaultActiveKey="dashboard">
                            <Nav.Item
                                eventKey="dashboard"
                                icon={renderIcon("dashboard", activeKey === "dashboard")}
                                onClick={() => {
                                    router.push("/", undefined, { shallow: true });
                                    setActiveKey("dashboard");
                                }}
                            >
                                {renderTitle("Dashboard", "parent",  activeKey === "dashboard")}
                            </Nav.Item>
                            {userRole === 'doctor' &&
                                <Nav.Item
                                    eventKey="diagnosis"
                                    icon={<GroupIcon />}
                                    onClick={() => {
                                        router.push("/diagnose", undefined, { shallow: true });
                                        setActiveKey("diagnose");
                                    }}
                                >{renderTitle("Diagnosis", "parent", activeKey === "diagnose")}</Nav.Item>
                            }
                            {(userRole === 'pharmacist' ) &&
                                <Nav.Item
                                    eventKey="prescription"
                                    icon={renderIcon("prescription", activeKey === "prescription")}
                                    onClick={() => {
                                        router.push("/prescription", undefined, { shallow: true });
                                        setActiveKey("prescription");
                                    }}
                                >{renderTitle("Resep", "parent", activeKey === "prescription")}</Nav.Item>
                            }
                            {userRole === 'pharmacist' &&
                                <Nav.Menu
                                    eventKey="report"
                                    trigger="hover"
                                    title="Laporan"
                                    icon={renderIcon("report", activeKey === "report-dashboard"
                                        || activeKey === "report-receive" 
                                        || activeKey === "report-expense")}
                                    placement="rightStart"
                                >
                                    <Nav.Item
                                        onClick={() => {
                                            router.push("/report/medicine", undefined, { shallow: true });
                                            setActiveKey("report-dashboard");
                                        }}
                                        eventKey="report-dashboard"
                                    >{renderTitle("Laporan Obat", activeKey === "report-dashboard")}</Nav.Item>
                                </Nav.Menu>
                            }
                            {userRole === 'pharmacist' &&
                                <Nav.Menu
                                    eventKey="transaction"
                                    trigger="hover"
                                    title="Transaksi"
                                    icon={renderIcon("transaction", activeKey === "transaction-dashboard"
                                        || activeKey === "transaction-receive" 
                                        || activeKey === "transaction-expense")}
                                    placement="rightStart"
                                >
                                    <Nav.Item
                                        onClick={() => {
                                            router.push("/transaction/dashboard", undefined, { shallow: true });
                                            setActiveKey("transaction-dashboard");
                                        }}
                                        eventKey="transaction-dashboard"
                                    >{renderTitle("Riwayat Transaksi", "child", activeKey === "transaction-dashboard")}</Nav.Item>
                                    <Nav.Item
                                        onClick={() => {
                                            router.push("/transaction/receive", undefined, { shallow: true });
                                            setActiveKey("transaction-receive");
                                        }}
                                        eventKey="transaction-receive"
                                    >{renderTitle("Penerimaan Obat", "child", activeKey === "transaction-receive")}</Nav.Item>
                                    <Nav.Item
                                        onClick={() => {
                                            router.push("/transaction/expense", undefined, { shallow: true });
                                            setActiveKey("transaction-expense");
                                        }}
                                        eventKey="transaction-expense"
                                    >{renderTitle("Pengeluaran Obat", "child", activeKey === "transaction-expense")}</Nav.Item>
                                </Nav.Menu>
                            }
                            {(userRole === 'pharmacist' || userRole === 'admin') &&
                                <Nav.Menu
                                    eventKey="master"
                                    trigger="hover"
                                    title="Master Data"
                                    icon={renderIcon(
                                        "master",
                                        activeKey === "master-staff"
                                        || activeKey === "master-medicine"
                                        || activeKey === "master-vendor"
                                        || activeKey === "master-packaging"
                                        || activeKey === "master-generic"
                                        || activeKey === "master-classification"
                                    )}
                                    placement="rightStart"
                                >
                                    {userRole === 'admin'
                                        ? <Nav.Item onClick={() => { setActiveKey("master-staff"); router.push("/master/staff", undefined, { shallow: true }) }} eventKey="master-staff">{renderTitle("Staf", "parent", activeKey === "master-staff")}</Nav.Item>
                                        :
                                        <>
                                            <Nav.Item onClick={() => { setActiveKey("master-medicine"); router.push("/master/medicine", undefined, { shallow: true }) }} eventKey="master-medicine">{renderTitle("Obat", "child", activeKey === "master-medicine")}</Nav.Item>
                                            <Nav.Item onClick={() => { setActiveKey("master-vendor"); router.push("/master/vendor", undefined, { shallow: true }) }} eventKey="master-vendor">{renderTitle("Vendor", "child", activeKey === "master-vendor")}</Nav.Item>
                                            <Nav.Item onClick={() => { setActiveKey("master-packaging"); router.push("/master/packaging", undefined, { shallow: true }) }} eventKey="master-packaging">{renderTitle("Kemasan", "child", activeKey === "master-packaging")}</Nav.Item>
                                            <Nav.Item onClick={() => { setActiveKey("master-generic"); router.push("/master/generic", undefined, { shallow: true }) }} eventKey="master-generic">{renderTitle("Generik Obat", "child", activeKey === "master-generic")}</Nav.Item>
                                            <Nav.Item onClick={() => { setActiveKey("master-classification"); router.push("/master/classification", undefined, { shallow: true }) }} eventKey="master-classification">{renderTitle("Klasifikasi Obat", "child", activeKey === "master-classification")}</Nav.Item>
                                        </>
                                    }
                                </Nav.Menu>
                            }
                        </Nav>
                    </Sidenav.Body>
                </Sidenav>
                <div className='flex-grow' />
                <div className='flex flex-col items-center justify-between py-2'>
                    {expand ?
                        <React.Fragment>
                            <div className='flex flex-row items-center justify-between gap-2 py-2'>
                                <Image width={7} height={7} src={user?.icon || "https://i.pravatar.cc/300"} alt="Profile" className='rounded-full w-7 h-7' />
                                <span className='text-sm font-semibold text-dark'>{user?.name || "Kenneth William N"}</span>
                            </div>
                            <div className='px-[18px] overflow-hidden w-full whitespace-nowrap'>
                                <Button appearance='danger' className='w-full' onClick={() => setAskForLogout(true)}>Logout</Button>
                            </div>
                        </React.Fragment>
                        :
                        <Image src="https://i.pravatar.cc/300" alt="Profile" className='rounded-full w-7 h-7' width={7} height={7} />
                    }
                </div>
                <div className='bg-background-sidebar'>
                    <NavToggle expand={expand} onClick={() => setExpand(!expand)} />
                </div>
            </Sidebar>
            <Content className='p-4 overflow-auto'>{props.children}</Content>

            <Toaster
              type="warning"
              open={askForLogout}
              onClose={() => setAskForLogout(false)}
              body={ <> Apakah Anda yakin ingin logout? </> }
              btnText="Logout"
              onClick={() => logoutHandler()}
            />
        </Container>
    );
};

Layout.propTypes = {
    children: propTypes.node,
    user: propTypes.object,
    active: propTypes.string
}
