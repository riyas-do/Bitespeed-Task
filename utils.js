const { contacts } = require('./dbconfig/config');

async function generateResult(primaryId) {
    let secondaryData = await contacts.findAll({ where: { linkedId: primaryId } });
    let primaryData = await contacts.findOne({ where: { id: primaryId } });
    let emails = [], secondaryContactIds = [], phoneNumbers = [];
    if (secondaryData.length > 0) {
        secondaryData.reduce((acc, val) => {
            emails.push(val.email);
            secondaryContactIds.push(val.id);
            phoneNumbers.push(val.phoneNumber);
        });
    }
    emails.push(primaryData.email);
    phoneNumbers.push(primaryData.phoneNumber)
    emails = removeDuplicateItems(emails)
    phoneNumbers = removeDuplicateItems(phoneNumbers)
    secondaryContactIds = removeDuplicateItems(secondaryContactIds);
    return {
        contact: {
            primaryContatctId: primaryId,
            emails,
            phoneNumbers,
            secondaryContactIds
        }
    }
}

function removeDuplicateItems(arr) {
    if (arr.length == 0) return arr;
    return arr.filter((val, index) => arr.indexOf(val) == index);
}

async function duplicateData(phone, mail) {
    let data;
    if (phone && mail) data = await contacts.findOne({ where: { phoneNumber: phone, email: mail } })
    else if (phone) data = await contacts.findOne({ where: { phoneNumber: phone } })
    else data = await contacts.findOne({ where: { email: mail } })
    return data ?? {};
}

module.exports = {generateResult,duplicateData}