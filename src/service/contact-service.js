import { prismaClient } from "../app/database.js";
import { rabbitMQ } from "../config.js";
import { createContactValidation } from "../validation/contact-validation.js"
import { validate } from "../validation/validation.js"
import amqp from 'amqplib';

const create = async (user, request) => {
    const contact = validate(createContactValidation, request);
    contact.username = user.username;

    const createdContact = await prismaClient.contact.create({
        data: contact,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });

    await sendContactToRabbitMQ(createdContact);

    return createdContact;
}

async function sendContactToRabbitMQ(contact) {

    try {
        const connection = await amqp.connect(rabbitMQ.url);
        const channel = await connection.createChannel();

        const existingQueueConfig = {
            durable: true,
            arguments: {
                'x-queue-type': 'quorum'
            }
        };

        await channel.assertQueue(rabbitMQ.queueName, existingQueueConfig);

        await channel.assertExchange(rabbitMQ.exchangeName, 'direct', { durable: true });

        await channel.bindQueue(rabbitMQ.queueName, rabbitMQ.exchangeName, rabbitMQ.routingKey);

        channel.publish(rabbitMQ.exchangeName, rabbitMQ.routingKey, Buffer.from(JSON.stringify(contact)));
        console.log('Contact data sent to RabbitMQ:', contact);

        await channel.close();
        await connection.close();

    } catch (e) {
        next(e);
    }
}


export default {
    create,
}