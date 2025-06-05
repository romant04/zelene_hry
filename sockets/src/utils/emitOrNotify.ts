import amqp from "amqplib";
import { config } from "dotenv"
import { NotificationMessage } from "../types/notificationMessage";
config();

export async function sendNotification(routingKey: string, message: string) {
    if (!process.env.RABBITMQ_URL) {
        console.error('RABBITMQ_URL environment variable is not set.');
        return;
    }

    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    const exchange = 'appExchange';
    await channel.assertExchange(exchange, 'topic', { durable: true });

    channel.publish(exchange, routingKey, Buffer.from(message), { persistent: true });

    setTimeout(() => {
        channel.close();
        connection.close();
    }, 500);
}

export async function emitOrNotify(bindingKey: string, targetUserId: string | null, message: NotificationMessage, emitFunc: () => void) {
    if (!targetUserId) {
        await sendNotification(bindingKey, JSON.stringify(message));
        return;
    }

    emitFunc();
}