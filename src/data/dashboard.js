export default function getDataCard(totalPatient, totalMedicine, totalProfit, totalRestock) {
    const data = [
        {
            colorBackground: "purple",
            icon: "person",
            link: "/",
            label: "Total Patient",
            value: totalPatient
        },
        {
            colorBackground: "green",
            icon: "medicine",
            link: "/master/medicine",
            label: "Total Medicine",
            value: totalMedicine
        },
        {
            colorBackground: "yellow",
            icon: "profit",
            link: "/transaction/dashboard",
            label: "Total Profit",
            value: totalProfit
        },
        {
            colorBackground: "red",
            icon: "stock",
            link: "/",
            label: "Need to Retock",
            value: totalRestock
        },
    ]

    return data;
}
