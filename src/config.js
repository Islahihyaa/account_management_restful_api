export const rabbitMQ = {
    url: "amqp://guest:guest@localhost:5672/",
    queueName: 'contactQueue',
    exchangeName: 'contactExchange',
    routingKey: 'contact'
};