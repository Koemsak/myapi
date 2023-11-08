import pkg, { format } from 'winston';
const { createLogger, transports, transport } = pkg;

let date_ob = new Date();
let day = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = (date_ob.getHours() < 10) ? "0" + date_ob.getHours() : date_ob.getHours();
let minutes = (date_ob.getMinutes() < 10) ? "0" + date_ob.getMinutes() : date_ob.getMinutes();
let seconds = (date_ob.getSeconds() < 10) ? "0" + date_ob.getSeconds() : date_ob.getSeconds();
// date only
let date = year + "-" + month + "-" + day;

// prints date & time in YYYY-MM-DD HH:MM:SS format
let date_time_string = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

const Log = createLogger({
    format: format.printf((info) => {
        return `[${date_time_string}] ${info.level}: ${info.message}`
    }),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: `storage/logs/wingonlinepayment-${date}.log`, level: 'info'
        })
    ]
})

export default Log;