export default function getDataCard(totalPatient, totalMedicine, totalProfit, totalRestock) {
    const data = [
        {
            colorBackground: "purple",
            icon: "person",
            link: "/",
            label: "Total Pasien",
            value: totalPatient,
            status: "Aktif"
        },
        {
            colorBackground: "green",
            icon: "medicine",
            link: "/master/medicine",
            label: "Total Obat",
            value: totalMedicine,
            status: "Aktif"
        },
        {
            colorBackground: "yellow",
            icon: "profit",
            link: "/transaction/dashboard",
            label: "Total Profit",
            value: totalProfit,
            status: "Hari Ini"
        },
        {
            colorBackground: "red",
            icon: "stock",
            link: "/",
            label: "Butuh Restock",
            value: totalRestock,
            status: "Aktif"
        },
    ]

    return data;
}
