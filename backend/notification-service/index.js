const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const amqp = require('amqplib');

const app = express();
const server = http.createServer(app);

// Setup WebSockets AND cors
const io = new Server(server, {
    cors: { origin: "*" }
});

io.on('connection', (socket) => {
    console.log('A user connected to notifications:', socket.id);
});

// Basic RabbitMQ message handling
async function consumeMessages() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue('ORDER_NOTIFICATIONS');

        console.log("Waiting for messages in RabbitMQ...");

        channel.consume('ORDER_PLACED', (msg) => {
            const order = JSON.parse(msg.content.toString());
            console.log("Received order from RabbitMQ:", order);

            // Send notifications to frontend
            io.emit('notification', {
                message: `New order placed: #${order.id}`,
                details: order
            });
            
            channel.ack(msg);
        });
    } catch (err) {
        console.log("RabbitMQ not detected. Check the backend bro -_-");
    }
}

consumeMessages();

server.listen(4003, () => console.log("Notification Service on port 4003"));