const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'invoice-faas',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'invoice-group' });

const runFaaS = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

    console.log("FaaS (Invoice Function) is waiting for Kafka events...");

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const event = JSON.parse(message.value.toString());
            
            console.log("FaaS TRIGGERED: Generating Invoice...");
            console.log(`Order ID: ${event.id}`);
            console.log("-----------------------------------------");
        },
    });
};

runFaaS().catch(console.error);