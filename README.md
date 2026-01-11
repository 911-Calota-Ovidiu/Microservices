Generic Gaming Laptop Order Placer

This project is a microservices-based system featuring a micro-frontend architecture, event streaming with Kafka, message brokering with RabbitMQ, and scalable notifications via Redis and WebSockets.

Architecture Overview
The system consists of the following components:
Shell App: React host application for micro-frontends.
Order MFE: Independent React micro-frontend for order placement.
API Gateway: Entry point for all services with JWT authentication.
Order Service: Processes transactions and publishes messages to brokers.
Notification Service: Pushes real-time updates to the UI using Redis-backed WebSockets.
User Service: Manages user profile information.
Invoice FaaS: Consumes Kafka events to generate invoices.

Prerequisites
Docker installed on the host machine.
Docker Compose installed.


Installation and Startup
Follow these steps to launch the entire environment:

Clone the repository

git clone <repository-url>
cd Generic-Gaming-Laptop-Order-Placer
Start all services Run the following command from the root directory to build and start all containers in detached mode:
docker-compose up -d --build

Access the applications
Main Shell UI: http://localhost:5173
Order MFE: http://localhost:5174
API Gateway: http://localhost:3000
RabbitMQ Management: http://localhost:15672 (Credentials: guest / guest)

Shutdown
To stop and remove all containers and networks created by the application:
docker-compose down
