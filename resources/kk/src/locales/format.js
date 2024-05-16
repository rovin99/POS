import moment from 'moment-timezone';



export const timeAgoInPKT = (date) => {
    // Assuming 'date' is already in PKT and formatted correctly
    const dateInPKT = moment.tz(date, 'Asia/Karachi'); // Convert the date to PKT timezone
    const nowInPKT = moment().tz('Asia/Karachi'); // Get the current time in PKT
    return dateInPKT.from(nowInPKT); // Calculate "time ago" relative to PKT
};


// formatCurrency.js
export const formatCurrency = (number) => {
    return new Intl.NumberFormat('ur-PK', {
        style: 'currency',
        currency: 'PKR',
        maximumFractionDigits: 0, // Ingen decimaler
    }).format(number);
};
// formatNumber.js

export const formatToUrduNumeric = (number) => {
    const absValue = Math.abs(number); // Få den absolutte værdi af tallet
    return new Intl.NumberFormat('ur-PK', {
        maximumFractionDigits: 0, // Ingen decimaler
    }).format(absValue); // Formatér den absolutte værdi
};



export const getCurrentTimeInPK = () => {
    // Få det nuværende universelle tidspunkt
    const now = new Date();
    // Konverter til PKT (Pakistan Standard Time, UTC+5)
    const PKTOffset = 5 * 60; // Offset i minutter
    const PKTTime = new Date(now.getTime() + (PKTOffset - now.getTimezoneOffset()) * 60000);
    return PKTTime.toISOString(); // Returnerer en ISO-strengrepræsentation
};

export const getCurrentTimeInPKFormat = () => {
    const offset = 5; // Pakistan Standard Time (PKT) er UTC+5
    let now = new Date(new Date().getTime() + offset * 3600 * 1000);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Juster for lokal tidszone
    return now.toISOString().slice(0, 16); // Format til 'YYYY-MM-DDTHH:MM'
};
// Pakistan Standard Time (PKT) is UTC+5 for MOMENT
export const convertToPKTime = (date) => {
    const offset = 5; // Pakistan Standard Time (PKT) is UTC+5
    let pkTime = new Date(date.getTime() + offset * 3600 * 1000);
    pkTime.setMinutes(pkTime.getMinutes() - pkTime.getTimezoneOffset()); // Adjust for local timezone offset
    return pkTime.toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:MM'
};


export const formatDatePK = (dateString) => {
    const date = new Date(dateString);
    // Tjekker om 'date' er en gyldig dato
    if (isNaN(date.getTime())) {
        // Hvis datoen ikke er gyldig, returner en fejlmeddelelse eller en standardværdi
        return 'Invalid date';
    } else {
        // Sørger for at dag og måned altid er i formatet 'dd' og 'mm'
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
};
