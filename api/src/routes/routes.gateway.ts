import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Socket, Server } from 'socket.io'

@WebSocketGateway()
export class RoutesGateway {
  private kafkaProducer: Producer;

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject('KAFKA_SERVICE')    
    private kafkaClient: ClientKafka
  ) {}

   async onModuleInit() {
    this.kafkaProducer = await this.kafkaClient.connect()
  }

  @SubscribeMessage('new-direction')
  handleMessage(client: Socket, payload: { routeId: string }) {
    this.kafkaProducer.send({
      topic: 'route.new-direction',
      messages: [
        {
          key: "route.new-direction",
          value: JSON.stringify({ routeId: payload.routeId, clientId: client.id })          
        }
      ]
    })
    console.log(payload)
  }

  sendPosition(data: { 
    clientId: string; 
    routeId: string;
    finished: boolean
  }) {
    const { clientId, ...rest } = data;
    const clients = this.server.sockets.connected;
    if(!(clientId in clients)) {
      console.error('Client not exists, refresh React Application and resend new direction again');
      return;
    }
    clients[clientId].emit('new-position', rest);
  }
}
