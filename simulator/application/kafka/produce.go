package kafka

import (
	"encoding/json"
	"log"
	"os"
	"time"

	proute "github.com/adrianodrix/imersaof2fc2-simulator/application/route"
	pkafka "github.com/adrianodrix/imersaof2fc2-simulator/infra/kafka"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

// Produce is responsible to publish the positions of each request
// Example of a json request:
//{"clientId":"1","routeId":"1"}
//{"clientId":"2","routeId":"2"}
//{"clientId":"3","routeId":"3"}
func Produce(msg *ckafka.Message) {
	producer := pkafka.NewKafkaProducer()
	route := proute.NewRoute()
	json.Unmarshal(msg.Value, &route)
	route.LoadPositions()
	positions, err := route.ExportJsonPositions()
	if err != nil {
		log.Println(err.Error())
	}
	for _, p := range positions {
		pkafka.Publish(p, os.Getenv("KafkaProduceTopic"), producer)
		time.Sleep(time.Millisecond * 500)
	}
}
