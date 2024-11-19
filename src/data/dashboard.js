export default function getDataCard(totalPatient, totalMedicine, totalProfit, totalRestock) {
    const data = [
        {
            colorBackground: "purple",
            icon: "person",
            link: "/",
            label: "Total Patient",
            value: totalPatient,
            status: "active"
        },
        {
            colorBackground: "green",
            icon: "medicine",
            link: "/master/medicine",
            label: "Total Medicine",
            value: totalMedicine,
            status: "active"
        },
        {
            colorBackground: "yellow",
            icon: "profit",
            link: "/transaction/dashboard",
            label: "Total Profit",
            value: totalProfit,
            status: "today"
        },
        {
            colorBackground: "red",
            icon: "stock",
            link: "/",
            label: "Need to Restock",
            value: totalRestock,
            status: "active"
        },
    ]

    return data;
}
