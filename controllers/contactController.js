const { contacts } = require('../dbconfig/config');
const {generateResult,duplicateData} = require("../utils");
async function fetchContactDetails(req, res) {
    try {
        let { phone, email } = req.body;
        
        //Throw error for request error
        if (!phone && !email) return res.status(400).send("Bad Request");
        let resultObj;
        let contactsByPhone = phone ? await contacts.findOne({ where: { phoneNumber: phone, linkPrecedence: "primary", linkedId: null } }) ?? {} : {};
        let contactsByemail = email ? await contacts.findOne({ where: { email, linkPrecedence: "primary", linkedId: null } }) ?? {} : {};

        //when both mail and phonenumber is already there in db
        if (Object.keys(contactsByPhone).length > 0 && Object.keys(contactsByemail).length > 0) {
            let primaryId, secondaryId;
            contactsByPhone.id < contactsByemail.id ? (
                primaryId = contactsByPhone.id, secondaryId = contactsByemail.id) : (primaryId = contactsByemail.id, secondaryId = contactsByPhone.id);
            await contacts.update({ linkPrecedence: 'secondary', linkedId: primaryId }, { where: { id: secondaryId } });
            resultObj = await generateResult(primaryId);
            return res.status(200).send(resultObj);
        }
        let data = contactsByPhone ? contactsByPhone : contactsByemail ?? {};

        //Handling primary and secondary records
        if (Object.keys(data).length == 0 && Object.keys(await duplicateData(phone, email)).length == 0) {
            let newContact = await contacts.create({
                phoneNumber: phone || null,
                email: email || null,
                linkedId: null,
                linkPrecedence: "primary",
            });
            resultObj = {
                contact: {
                    primaryContatctId: newContact.id,
                    emails: [newContact.email],
                    phoneNumbers: [newContact.phoneNumber],
                    secondaryContactIds: []
                }
            }
            return res.status(200).send(resultObj);
        } else {
            let duplicates = await duplicateData(phone, email);
            if (Object.keys(duplicates).length == 0) {
                await contacts.create({
                    phoneNumber: phone || null,
                    email: email || null,
                    linkedId: data.id,
                    linkPrecedence: "secondary"
                })
                resultObj = await generateResult(data.id);
                return res.status(200).send(resultObj);
            } else {
                resultObj = await generateResult(duplicates.linkedId ?? duplicates.id);
                return res.status(200).send(resultObj);
            }
        }
    } catch (err) {
        console.error("errr", err);
        return res.status(500).send(err.message);
    }
}


module.exports = { fetchContactDetails };