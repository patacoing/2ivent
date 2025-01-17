import { Module } from '@nestjs/common';
import { OrganizersService } from './organizers.service';
import { OrganizersController } from './organizers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from 'src/events/entities/event.entity';
import { Address } from 'src/events/entities/address.embedded';
import { EventsModule } from 'src/events/events.module';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports : [
    TypeOrmModule.forFeature([EventEntity, Address]),
    KafkaModule,
    EventsModule,
  ],
  controllers: [OrganizersController],
  providers: [OrganizersService],
})
export class OrganizersModule {}
