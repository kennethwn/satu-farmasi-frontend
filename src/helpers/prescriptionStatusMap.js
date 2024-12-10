const prescriptionStatusMap = new Map([
    ["UNPROCESSED", { label: "Unprocessed", value: "UNPROCESSED", color: "#B0BEC5" }],
    ["WAITING_FOR_PAYMENT", { label: "Waiting For Payment", value: "WAITING_FOR_PAYMENT", color: "#FFA726" }],
    ["ON_PROGRESS", { label: "On Progress", value: "ON_PROGRESS", color: "#42A5F5" }],
    ["DONE", { label: "Done", value: "DONE", color: "#66BB6A" }],
    ["CANCELED", { label: "Canceled", value: "CANCELED", color: "#ef4444" }]
]);

export default prescriptionStatusMap
