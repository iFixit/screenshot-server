# Screenshot Server
This is a NodeJS microservice which is designed to allow web interfaces to easily request screenshots of pages. It uses [RabbitMQ](https://www.rabbitmq.com/) to handle queueing of screenshot requests and writes the screenshots to disk with predictable names, in order to allow them to be retrieved afterwards.
