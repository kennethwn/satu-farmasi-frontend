export default function getDataCard(totalPatient, totalMedicine, totalRestock) {
    const data = [
        {
            colorBackground: "purple",
            type: "person",
            icon: "person",
            link: null,
            label: "Total Pasien",
            value: totalPatient,
            status: "Aktif"
        },
        {
            colorBackground: "green",
            type: "medicine",
            icon: "medicine",
            link: "/master/medicine",
            label: "Total Obat",
            value: totalMedicine,
            status: "Aktif"
        },
        {
            colorBackground: "red",
            type: "stock",
            icon: "stock",
            link: "/master/medicine",
            label: "Butuh Restock",
            value: totalRestock,
            status: "Aktif"
        },
    ]

    return data;
}

export function getDataProfit(totalProfit) {
    return {
        colorBackground: "yellow",
        type: "profit",
        icon: "profit",
        link: null,
        label: "Total Profit",
        value: totalProfit,
        status: "Hari Ini"
    }
}