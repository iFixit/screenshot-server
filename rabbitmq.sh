#!/bin/bash
docker run -p 127.0.0.1:5672:5672 -p 127.0.0.1:15672:15672 rabbitmq:3-management
