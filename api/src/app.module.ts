import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoutesModule } from './routes/routes.module';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RoutesModule, 
    MongooseModule.forRoot(process.env.MONGO_DSN, {
      useNewUrlParser: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
