const express = require('express');
const amqp = require('amqplib');
const { Kafka } = require('kafkajs');
const cors = require('cors');

// Init some things, including, of course, CORS! Our best friend!
const app = express();
app.use(express.json());
app.use(cors());

let channel;
const kafka = new Kafka({ clientId: 'order-service', brokers: ['localhost:9092'] });
const producer = kafka.producer();

async function init() {
    // RabbitMQ Setup
    const conn = await amqp.connect('amqp://localhost');
    channel = await conn.createChannel();
    await channel.assertQueue('ORDER_PLACED');
    
    // Kafka Setup
    await producer.connect();
    console.log("Order Service connected to RabbitMQ & Kafka");
}

app.post('/orders', async (req, res) => {
    const { item, price, userId } = req.body;
    const order = { 
        id: Math.floor(Math.random() * 1000), 
        item, 
        price, 
        userId, 
        timestamp: new Date() 
    };

    // 1. Send message to RabbitMQ
    channel.sendToQueue('ORDER_PLACED', Buffer.from(JSON.stringify(order)));
    
    // 2. Stream Event to Kafka
    await producer.send({
        topic: 'order-events',
        messages: [{ value: JSON.stringify(order) }],
    });

    console.log(`Order ${order.id} created for User ${userId}`);
    res.status(201).json(order);
});

init();
app.listen(4002, () => console.log('Order Service on port 4002'));