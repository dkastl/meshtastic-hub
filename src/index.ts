import Aedes, { Client, PublishPacket } from 'aedes';
import { createServer, Server } from 'net';
import dotenv from 'dotenv';
import logger from './logger';

// Load environment variables
dotenv.config();

const PORT = process.env.MQTT_PORT ? parseInt(process.env.MQTT_PORT, 10) : 1883;
const HOST = process.env.MQTT_HOST || '0.0.0.0';

const aedes = new Aedes();
const recentMessages = new Map<string, number>(); // Stores message ID → timestamp
const MESSAGE_EXPIRY = 5000; // 5 seconds

// Create the MQTT broker server
const server: Server = createServer(aedes.handle);

server.listen(PORT, HOST, () => {
    logger.info(`Aedes MQTT broker running on ${HOST}:${PORT}`);
});

// Handle MQTT client connections
aedes.on('client', (client: Client) => {
    logger.info(`Client connected: ${client.id}`);
});

// Handle published messages with de-duplication
aedes.on('publish', (packet: PublishPacket, client: Client | null) => {
    if (!client) return;

    const messageId = `${packet.topic}-${packet.payload.toString()}`;
    const now = Date.now();

    // Check if the message was recently received
    if (recentMessages.has(messageId) && now - (recentMessages.get(messageId) ?? 0) < MESSAGE_EXPIRY) {
        logger.info(`Duplicate message ignored from ${client.id} on topic ${packet.topic}`);
        return;
    }

    // Store message timestamp
    recentMessages.set(messageId, now);

    // Remove old entries to prevent memory leak
    setTimeout(() => recentMessages.delete(messageId), MESSAGE_EXPIRY);

    logger.info(`Message from ${client.id} on topic ${packet.topic}.`);
});

// Handle client disconnections
aedes.on('clientDisconnect', (client: Client) => {
    logger.info(`Client disconnected: ${client.id}`);
});
