export const month = [
    {id: 1, label: 'January'},
    {id: 2, label: 'February'}, 
    {id: 3, label: 'March'},
    {id: 4, label: 'April'}, 
    {id: 5, label: 'May'},
    {id: 6, label: 'June'}, 
    {id: 7, label: 'July'},
    {id: 8, label: 'August'}, 
    {id: 9, label: 'September'},
    {id: 10, label: 'October'}, 
    {id: 11, label: 'November'},
    {id: 12, label: 'December'}, 
];

export default function getFirstAndLastDateOfMonth(monthId) {
    const year = new Date().getFullYear();
    const firstDate = new Date(year, monthId-1, 2);
    const lastDate = new Date(year, monthId, 1);

    return {
        firstDate,
        lastDate
    };
}