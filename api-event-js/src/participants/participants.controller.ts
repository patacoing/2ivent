import { Controller, Post, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { AddParticipantDto } from './dto/add-participant.dto';
import { EventIdParamDto } from 'src/common/dto/event-id-param.dto';
import { EventUserIdParamDto } from 'src/common/dto/event-user-id-param.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaService } from 'src/kafka/kafka.service';

@Controller('events/:eventId/participants')
export class ParticipantsController {
  constructor(
    private readonly participantsService: ParticipantsService,
    private readonly kafkaService: KafkaService,
  ) {}

  @Post()
  @HttpCode(201)
  async create(
    @Param() params: EventIdParamDto, 
    @Body() addParticipantDto: AddParticipantDto
  ) {
    const event = await this.participantsService.create(params.eventId, addParticipantDto);
    await this.kafkaService.sendMessage('java.participants.add', {
      params,
      body: addParticipantDto,
    });
    return event;
  }

  @Delete(':userId')
  @HttpCode(204)
  async remove(@Param() params: EventUserIdParamDto): Promise<void> {
    await this.participantsService.remove(params.eventId, params.userId);
    await this.kafkaService.sendMessage('java.participants.delete', params);
  }

  @MessagePattern('js.participants.add')
  async messageCreate(
    @Payload() payload: { params: EventIdParamDto; body: AddParticipantDto },
  ) {
    const { params, body } = payload;
    const event = await this.participantsService.create(params.eventId, body);
    return event;
  }

  @MessagePattern('js.participants.delete')
  async messageRemove(@Payload() params: EventUserIdParamDto): Promise<void> {
    await this.participantsService.remove(params.eventId, params.userId);
  }
}