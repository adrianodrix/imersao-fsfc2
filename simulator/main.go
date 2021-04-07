package main

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"

	akafka "github.com/adrianodrix/imersaof2fc2-simulator/application/kafka"
	pkafka "github.com/adrianodrix/imersaof2fc2-simulator/infra/kafka"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading .env file")
	}
}

func main() {
	msgChan := make(chan *ckafka.Message)
	consumer := pkafka.NewKafkaConsumer(msgChan)
	go consumer.Consume()
	for msg := range msgChan {
		fmt.Println(string(msg.Value))
		go akafka.Produce(msg)
	}
}
