


import { Kafka } from "kafkajs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

class KafkaConfig {
    constructor() {
        this.kafka = new Kafka({
            clientId: process.env.CLIENT_ID, 
            brokers: [process.env.KAFKA_BROKER], 
            ssl: {
                ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
            },
            sasl: {
                username: process.env.KAFKA_USERNAME, 
                password: process.env.KAFKA_PASSWORD, 
                mechanism: "plain",
            },
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID }); 
    }

    async produce(topic, messages) {
        try {
            await this.producer.connect();
            console.log("Kafka connected...");
            await this.producer.send({
                topic: topic,
                messages: messages,
            });
        } catch (error) {
            console.log("Error producing message:", error);
        } finally {
            await this.producer.disconnect();
        }
    }

    async consume(topic, callback) {
        try {
            await this.consumer.connect();
            await this.consumer.subscribe({ topic: topic, fromBeginning: true });
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    const value = message.value.toString();
                    callback(value);
                },
            });
        } catch (error) {
            console.log("Error consuming message:", error);
        }
    }
}

export default KafkaConfig;
