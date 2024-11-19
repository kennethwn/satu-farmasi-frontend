
const workingDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const getDay = (date) => {
    return workingDays[date.getDay()]
}

export default function formatDate(date){
    const d = new Date(date)
    const dtf = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "2-digit"
    })

    const [{ value: mo }, , {value: da}, ,{value: ye}] = dtf.formatToParts(d)
    return `${da} ${mo} ${ye}`
}

export function formatDateWithTime(date){
    const d = new Date(date)
    const dtf = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    })

    const [{ value: mo }, , { value: da }, , { value: ye }, , { value: hr }, , { value: min }, , { value: sec }] = dtf.formatToParts(d)
    return `${da} ${mo} ${ye}\n${hr}:${min}:${sec}`
}

export const formatCalendar = (timestamp) => {
    let date = new Date(timestamp)
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()

    month = month < 9 ? '0' + (month + 1) : month + 1
    day = day < 10 ? '0' + day : day

    return year + '-' + month + '-' + day;
}

export const formatCalendarWithSlash = (timestamp) => {
    let date = new Date(timestamp)
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()

    month = month < 9 ? '0' + (month + 1) : month + 1
    day = day < 10 ? '0' + day : day

    return day + '/' + month + '/' + year;
}

export const convertToTimestampString = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    const rfc3339Timestamp = date.toISOString();
    return rfc3339Timestamp;
}

export const getDifferenceDays = (startDate, endDate) => {
    const differenceInTime = new Date(endDate).getTime() - new Date(startDate).getTime();
    const differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
    if (differenceInDays > 1) return `${differenceInDays} days`
    return `${differenceInDays} day`
}