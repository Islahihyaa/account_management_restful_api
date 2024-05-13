import contactService from "../service/contact-service.js";
import { consumeContactFromRabbitMQ } from "../service/consume-messages.js";

const create = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const result = await contactService.create(user, request);
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const getContact = async  (req, res, next) => {
    try {
        const contactData = await consumeContactFromRabbitMQ();
        res.status(200).json({
            data: contactData
        })
    } catch (e) {
        next(e);
    }
}


export default {
    create,
    getContact
}