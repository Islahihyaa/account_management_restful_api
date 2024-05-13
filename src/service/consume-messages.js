import amqp from "amqplib";
import { rabbitMQ } from "../config.js";

async function consumeContactFromRabbitMQ() {
  try {
    const connection = await amqp.connect(rabbitMQ.url);
    const channel = await connection.createChannel();

    const existingQueueConfig = {
      durable: true,
      arguments: {
        "x-queue-type": "quorum",
      },
    };

    await channel.assertQueue(rabbitMQ.queueName, existingQueueConfig);

    return new Promise((resolve, reject) => {

      channel.consume(rabbitMQ.queueName, (message) => {
        const contactData = JSON.parse(message.content);
        console.log("Received contact data:", contactData);
        resolve(contactData);
        channel.ack(message);
      });

      channel.on("close", () => {
        console.log("RabbitMQ channel closed");
        connection.close();
      });
    });
  } catch (e) {
    next(e);
  }
}

export { consumeContactFromRabbitMQ };
