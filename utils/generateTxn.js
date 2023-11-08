
export function generateTxnId(prefix) {
    const format = 'YYYYMMDDHHmmssSSS';
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const milliseconds = String(new Date().getMilliseconds()).padStart(3, '0');
    const logKey = prefix + timestamp + milliseconds + generateRandomString(20);
    return logKey;
}

function generateRandomString(length = 20) {
    const characters = '0123456789abcdef';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    return randomString;
}