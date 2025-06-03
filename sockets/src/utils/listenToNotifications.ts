import amqp from "amqplib";
import { config } from "dotenv"
import { NotificationMessage } from "../types/notificationMessage";
config();


export async function listenToNotifications(bindingKey: string, queueName: string, processingFunction: (message: NotificationMessage) => void) {
    if (!process.env.RABBITMQ_URL) {
        console.error('RABBITMQ_URL environment variable is not set.');
        return;
    }

    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    const exchange = 'appExchange';
    await channel.assertExchange(exchange, 'topic', { durable: true });
    const queue = await channel.assertQueue(queueName, { durable: true });

    await channel.bindQueue(queue.queue, exchange, bindingKey);

    await channel.consume(queue.queue, (msg) => {
        if (msg) {
            const messageContent: NotificationMessage = JSON.parse(msg.content.toString());
            processingFunction(messageContent);
            channel.ack(msg);
        }
    }, { noAck: false });
}