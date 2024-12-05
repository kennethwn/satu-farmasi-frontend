const prescriptionStatusMap = new Map([
    ["UNPROCESSED", { label: "UNPROCESSED", value: "UNPROCESSED", color: "#B0BEC5" }],
    ["WAITING_FOR_PAYMENT", { label: "WAITING FOR PAYMENT", value: "WAITING_FOR_PAYMENT", color: "#FFA726" }],
    ["ON_PROGRESS", { label: "ON PROGRESS", value: "ON_PROGRESS", color: "#42A5F5" }],
    ["DONE", { label: "DONE", value: "DONE", color: "#66BB6A" }],
    ["CANCELED", { label: "CANCELED", value: "CANCELED", color: "#BE0100" }]
]);

export default prescriptionStatusMap
